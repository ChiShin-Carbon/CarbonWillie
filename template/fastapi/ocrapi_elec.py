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
    Enhanced pattern extraction with field label context awareness
    """
    results = {
        'payment_date': None,
        'receipt_number': None, 
        'customer_number': None
    }
    
    # Clean text but preserve line structure for context
    lines = text.split('\n')
    cleaned = re.sub(r'\s+', ' ', text.replace('\n', ' ').replace('\r', ' '))
    print(f"Quick analysis: {cleaned[:150]}...")
    
    # 1. CONTEXT-AWARE PAYMENT DATE EXTRACTION
    # Look for Payment Date field label context
    payment_date_found = False
    
    # Pattern 1: Look for "Payment Date" or "繳費日期" followed by date
    payment_context_patterns = [
        r'(?:Payment\s+Date|繳費日期)[^\d]*(\d{3}[/\-]\d{1,2}[/\-]\d{1,2})',
        r'(?:payment\s+Date|Payment\s+date)[^\d]*(\d{3}[/\-]\d{1,2}[/\-]\d{1,2})',
    ]
    
    for pattern in payment_context_patterns:
        match = re.search(pattern, cleaned, re.IGNORECASE)
        if match:
            date_str = match.group(1)
            converted_date = convert_roc_date(date_str)
            if converted_date:
                results['payment_date'] = converted_date
                payment_date_found = True
                print(f"Found payment date with context: {date_str} -> {converted_date}")
                break
    
    # Pattern 2: Look in structured receipt areas (between specific field labels)
    if not payment_date_found:
        for line in lines:
            # Check if line contains payment date context
            if re.search(r'(?:payment|繳費|Date|日期)', line, re.IGNORECASE):
                # Extract ROC date from this line
                date_match = re.search(r'(\d{3}[/\-]\d{1,2}[/\-]\d{1,2})', line)
                if date_match:
                    converted_date = convert_roc_date(date_match.group(1))
                    if converted_date:
                        results['payment_date'] = converted_date
                        payment_date_found = True
                        print(f"Found payment date in context line: {date_match.group(1)} -> {converted_date}")
                        break
    
    # Pattern 3: Look for standalone ROC dates (fallback)
    if not payment_date_found:
        # Find all ROC dates and pick the most likely one
        roc_dates = re.findall(r'\b(1\d{2}[/\-]\d{1,2}[/\-]\d{1,2})\b', cleaned)
        for date_str in roc_dates:
            # Skip dates that are part of other numbers (like customer numbers)
            if not re.search(rf'\d+-\d+-\d+-{re.escape(date_str)}', cleaned):
                converted_date = convert_roc_date(date_str)
                if converted_date:
                    results['payment_date'] = converted_date
                    print(f"Found standalone ROC date: {date_str} -> {converted_date}")
                    break
    
    # 2. CONTEXT-AWARE RECEIPT NUMBER EXTRACTION
    # Look for "單據號碼" context
    receipt_context_patterns = [
        r'(?:單據號碼|Receipt.*Number)[^\w]*([A-Za-z]\d{10,20})',
        r'(?:收據|receipt)[^\w]*([A-Za-z]\d{10,20})',
        # Look for M followed by long number in receipt context
        r'\b(M\d{13,20})\b',
        r'\b(M0\d{12,19})\b',
    ]
    
    for pattern in receipt_context_patterns:
        match = re.search(pattern, cleaned, re.IGNORECASE)
        if match:
            results['receipt_number'] = match.group(1)
            print(f"Found receipt number: {results['receipt_number']}")
            break
    
    # 3. CUSTOMER NUMBER - Taiwan Power format
    customer_patterns = [
        r'(?:電號|Customer\s+Number)[^\d]*(\d{2}-\d{2}-\d{4}-\d{2}-\d{1,2})',
        r'\b(\d{2}-\d{2}-\d{4}-\d{2}-\d{1,2})\b',
    ]
    
    for pattern in customer_patterns:
        match = re.search(pattern, cleaned, re.IGNORECASE)
        if match:
            results['customer_number'] = match.group(1)
            print(f"Found customer number: {results['customer_number']}")
            break
    
    return results

def convert_roc_date(date_str):
    """
    Convert ROC date string to Gregorian format with validation
    """
    try:
        # Extract year, month, day from date string
        parts = re.split(r'[/\-]', date_str)
        if len(parts) == 3:
            year = int(parts[0])
            month = int(parts[1])
            day = int(parts[2])
            
            # Validate ROC year range (100-120 = 2011-2031)
            if 100 <= year <= 120 and 1 <= month <= 12 and 1 <= day <= 31:
                gregorian_year = year + 1911
                return f"{gregorian_year}-{month:02d}-{day:02d}"
    except (ValueError, IndexError):
        pass
    return None

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
    Enhanced AI extraction with specific field targeting
    """
    try:
        completion = await run_in_threadpool(
            lambda: openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": """
                    You are an expert at extracting data from Taiwan Power Company receipts.
                    
                    CRITICAL TASKS:
                    1. Find 繳費日期 (Payment Date) - Look for "Payment Date" label and nearby ROC date like 114/05/23
                    2. Find 單據號碼 (Receipt Number) - Look for "M" followed by long digits like M0114052316318
                    3. Find 電號 (Customer Number) - Format XX-XX-XXXX-XX-X like 16-46-3302-10-5
                    
                    ROC DATE CONVERSION: ROC year + 1911 = Gregorian year
                    Example: 114/05/23 becomes 2025-05-23 (114 + 1911 = 2025)
                    
                    Return ONLY this JSON format:
                    {
                        "payment_date": "YYYY-MM-DD",
                        "receipt_number": "M0XXXXXXXXXXXXX", 
                        "customer_number": "XX-XX-XXXX-XX-X"
                    }
                    
                    Set fields to null if not found. Be very careful with ROC date conversion.
                    """},
                    {"role": "user", "content": f"""
                    Extract from this Taiwan Power Company receipt OCR text:
                    
                    {text[:500]}
                    
                    Look specifically for:
                    - Payment Date (繳費日期) field and its value
                    - Receipt Number (單據號碼) - usually starts with M
                    - Customer Number (電號) with dashes
                    """}
                ],
                max_tokens=200,
                temperature=0
            )
        )

        response = completion.choices[0].message.content.strip()
        print(f"AI response: {response}")
        
        json_match = re.search(r'\{.*?\}', response, re.DOTALL)
        
        if json_match:
            data = json.loads(json_match.group())
            # Return list of non-null values in priority order
            result = []
            if data.get('payment_date'):
                result.append(data['payment_date'])
            if data.get('receipt_number'):
                result.append(data['receipt_number'])
            if data.get('customer_number'):
                result.append(data['customer_number'])
            return result
        
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