from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image, ImageEnhance
from transformers import DonutProcessor, VisionEncoderDecoderModel
import io
from fastapi.concurrency import run_in_threadpool
import openai
from dotenv import load_dotenv
import os
import torch
import re
import logging
import warnings
from transformers import logging as transformers_logging
import json
import pytesseract
import asyncio


# Set logging level to ERROR to suppress warnings and info messages
logging.getLogger().setLevel(logging.ERROR)
transformers_logging.set_verbosity_error()
warnings.filterwarnings("ignore")

# Load environment variables
load_dotenv()
os.environ["TRANSFORMERS_VERBOSITY"] = "error"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

ocrapi_elec = APIRouter()

# Load Donut model
MODEL_NAME = "naver-clova-ix/donut-base-finetuned-cord-v2"

try:
    processor = DonutProcessor.from_pretrained(
        MODEL_NAME,
        token=os.getenv("HUGGINGFACE_TOKEN")
    )
    model = VisionEncoderDecoderModel.from_pretrained(
        MODEL_NAME,
        token=os.getenv("HUGGINGFACE_TOKEN")
    )
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    
    print(f"Donut model loaded successfully on {device}!")
except Exception as e:
    print(f"Error loading Donut model: {e}")
    processor = None
    model = None

def perform_fast_ocr(pil_img):
    """
    Ultra-fast OCR with minimal preprocessing
    """
    try:
        # Fastest OCR config - English + Chinese traditional only
        config = r'--oem 3 --psm 6 -l chi_tra+eng'
        return pytesseract.image_to_string(pil_img, config=config).strip()
    except Exception as e:
        print(f"OCR error: {str(e)}")
        return ""

def quick_extract(text):
    """
    Lightning-fast pattern extraction using optimized regex
    """
    results = {
        'payment_date': None,
        'receipt_number': None, 
        'customer_number': None
    }
    
    # Clean text once
    cleaned = re.sub(r'\s+', ' ', text.replace('\n', ' ').replace('\r', ' '))
    print(f"Quick analysis: {cleaned[:150]}...")
    
    # 1. PAYMENT DATE - Multiple fast patterns for ROC dates
    date_patterns = [
        r'\b(1\d{2})\s*[/\-]\s*(\d{1,2})\s*[/\-]\s*(\d{1,2})\b',  # 114/05/23 or 114 05 23
        r'\b(1\d{4})\s*[/\-]\s*(\d{1,2})\b',  # 11405/23 condensed format
        r'(\d{6})',  # 114052 condensed date
    ]
    
    for pattern in date_patterns:
        matches = re.findall(pattern, cleaned)
        for match in matches:
            if isinstance(match, tuple):
                if len(match) == 3:  # YYY/MM/DD format
                    try:
                        year, month, day = int(match[0]), int(match[1]), int(match[2])
                        if 100 <= year <= 120 and 1 <= month <= 12 and 1 <= day <= 31:
                            gregorian_year = year + 1911
                            results['payment_date'] = f"{gregorian_year}-{month:02d}-{day:02d}"
                            print(f"Found payment date: {match} -> {results['payment_date']}")
                            break
                    except ValueError:
                        continue
                elif len(match) == 2:  # YYYMM/DD format
                    try:
                        year_month, day = match[0], int(match[1])
                        if len(year_month) == 5:  # 11405
                            year = int(year_month[:3])  # 114
                            month = int(year_month[3:])  # 05
                            if 100 <= year <= 120 and 1 <= month <= 12 and 1 <= day <= 31:
                                gregorian_year = year + 1911
                                results['payment_date'] = f"{gregorian_year}-{month:02d}-{day:02d}"
                                print(f"Found condensed date: {year_month}/{day} -> {results['payment_date']}")
                                break
                    except ValueError:
                        continue
            else:  # Single match - 6 digit date
                if len(match) == 6:  # 114052
                    try:
                        year = int(match[:3])  # 114
                        month = int(match[3:5])  # 05
                        day = int(match[5:])  # 2 (assuming single digit)
                        if 100 <= year <= 120 and 1 <= month <= 12 and 1 <= day <= 31:
                            gregorian_year = year + 1911
                            results['payment_date'] = f"{gregorian_year}-{month:02d}-{day:02d}"
                            print(f"Found 6-digit date: {match} -> {results['payment_date']}")
                            break
                    except ValueError:
                        continue
        
        if results['payment_date']:
            break
    
    # 2. RECEIPT NUMBER - Fast pattern
    receipt_patterns = [
        r'M0(\d{12,15})',  # M0 + 12-15 digits
        r'\bM(\d{13,17})\b',  # M + 13-17 digits
    ]
    
    for pattern in receipt_patterns:
        match = re.search(pattern, cleaned)
        if match:
            if pattern.startswith(r'M0'):
                results['receipt_number'] = f"M0{match.group(1)}"
            else:
                results['receipt_number'] = f"M{match.group(1)}"
            print(f"Found receipt: {results['receipt_number']}")
            break
    
    # 3. CUSTOMER NUMBER - Taiwan Power format
    customer_match = re.search(r'\b(\d{2}-\d{2}-\d{4}-\d{2}-\d{1,2})\b', cleaned)
    if customer_match:
        results['customer_number'] = customer_match.group(1)
        print(f"Found customer: {results['customer_number']}")
    
    return results

def has_minimum_data(results):
    """
    Quick validation - need at least payment date + one identifier
    """
    has_date = bool(results.get('payment_date'))
    has_id = bool(results.get('receipt_number') or results.get('customer_number'))
    
    print(f"Validation: Date={has_date}, ID={has_id}")
    return has_date and has_id

async def fast_donut_ocr(pil_img):
    """
    Fast Donut OCR with optimized parameters
    """
    try:
        if not processor or not model:
            return ""
        
        if pil_img.mode != 'RGB':
            pil_img = pil_img.convert('RGB')
        
        task_prompt = "<s_cord-v2>"
        
        pixel_values = processor(pil_img, return_tensors="pt").pixel_values.to(device)
        decoder_input_ids = processor.tokenizer(task_prompt, add_special_tokens=False, return_tensors="pt").input_ids.to(device)
        
        # Ultra-fast generation parameters
        generated_ids = model.generate(
            pixel_values,
            decoder_input_ids=decoder_input_ids,
            max_length=100,  # Very short for speed
            early_stopping=True,
            num_beams=1,     # Fastest - no beam search
            do_sample=False,
            num_return_sequences=1,
            use_cache=True
        )
        
        donut_output = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        cleaned = re.sub(r'<[^>]+>', ' ', donut_output)
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        
        return cleaned
        
    except Exception as e:
        print(f"Donut OCR error: {str(e)}")
        return ""

async def fast_ai_extraction(text):
    """
    Streamlined AI extraction for missing fields only
    """
    try:
        # Quick AI call with focused prompt
        completion = await run_in_threadpool(
            lambda: openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Extract from Taiwan Power receipt. Return only JSON: {\"payment_date\": \"YYYY-MM-DD\", \"receipt_number\": \"M0...\", \"customer_number\": \"XX-XX-XXXX-XX-X\"}. ROC year + 1911 = Gregorian year. Set null if not found."},
                    {"role": "user", "content": f"Extract 繳費日期, 單據號碼, 電號 from: {text[:300]}"}
                ],
                max_tokens=150,  # Limit response length
                temperature=0    # Deterministic output
            )
        )

        response = completion.choices[0].message.content.strip()
        json_match = re.search(r'\{.*?\}', response, re.DOTALL)
        
        if json_match:
            data = json.loads(json_match.group())
            # Return list of non-null values
            return [v for v in [data.get('payment_date'), data.get('receipt_number'), data.get('customer_number')] if v]
        
        return []
        
    except Exception as e:
        print(f"AI extraction error: {str(e)}")
        return []

@ocrapi_elec.post("/ocrapi_elec")
async def ocr_image(image: UploadFile = File(...)):
    try:
        # Read image
        img_bytes = await image.read()
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        
        print("🚀 Fast OCR processing...")
        
        # Step 1: Try Pytesseract first (fastest)
        ocr_text = perform_fast_ocr(img)
        print(f"Pytesseract result: {ocr_text[:100]}...")
        
        if ocr_text:
            extracted = quick_extract(ocr_text)
            if has_minimum_data(extracted):
                result = [v for v in [extracted['payment_date'], extracted['receipt_number'], extracted['customer_number']] if v]
                return {
                    "response_content": result,
                    "raw_ocr_text": ocr_text,
                    "source": "pytesseract_fast",
                    "extracted_fields": extracted
                }
        
        # Step 2: Try Donut if Pytesseract insufficient
        if processor and model:
            print("📄 Trying Donut OCR...")
            donut_text = await fast_donut_ocr(img)
            print(f"Donut result: {donut_text}")
            
            if donut_text:
                donut_extracted = quick_extract(donut_text)
                if has_minimum_data(donut_extracted):
                    result = [v for v in [donut_extracted['payment_date'], donut_extracted['receipt_number'], donut_extracted['customer_number']] if v]
                    return {
                        "response_content": result,
                        "raw_ocr_text": donut_text,
                        "source": "donut_fast",
                        "extracted_fields": donut_extracted
                    }
                
                # Combine both OCR outputs for better AI processing
                combined_text = f"Pytesseract: {ocr_text}\nDonut: {donut_text}"
            else:
                combined_text = ocr_text
        else:
            combined_text = ocr_text
        
        # Step 3: Use AI for missing fields
        if combined_text:
            print("📡 Using AI for extraction...")
            ai_result = await fast_ai_extraction(combined_text)
            
            if len(ai_result) >= 2:  # At least 2 fields found
                return {
                    "response_content": ai_result,
                    "raw_ocr_text": combined_text,
                    "source": "ai_extraction"
                }
        
        # Fallback: Return best partial result
        best_extracted = extracted if ocr_text else {}
        if processor and model and donut_text:
            donut_extracted = quick_extract(donut_text)
            if len([v for v in donut_extracted.values() if v]) > len([v for v in best_extracted.values() if v]):
                best_extracted = donut_extracted
        
        partial_result = [v for v in [best_extracted.get('payment_date'), best_extracted.get('receipt_number'), best_extracted.get('customer_number')] if v]
        return {
            "response_content": partial_result,
            "raw_ocr_text": combined_text or ocr_text,
            "source": "partial_extraction",
            "extracted_fields": best_extracted
        }
        
    except Exception as e:
        print(f"❌ Processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@ocrapi_elec.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Ultra-fast OCR API ready"}