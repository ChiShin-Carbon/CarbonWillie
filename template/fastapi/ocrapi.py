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


# Set logging level to ERROR to suppress warnings and info messages
logging.getLogger().setLevel(logging.ERROR)
transformers_logging.set_verbosity_error()
warnings.filterwarnings("ignore")

# Load environment variables
load_dotenv()
os.environ["TRANSFORMERS_VERBOSITY"] = "error"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

ocrapi = APIRouter()

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

def fast_pytesseract_ocr(pil_img):
    """
    Fast OCR with minimal preprocessing
    """
    try:
        # Fastest OCR config
        config = r'--oem 3 --psm 6 -l chi_tra+eng'
        text = pytesseract.image_to_string(pil_img, config=config)
        return text.strip()
    except Exception as e:
        print(f"Pytesseract error: {str(e)}")
        return ""

async def fast_donut_ocr(pil_img):
    """
    Ultra-fast Donut OCR
    """
    try:
        if not processor or not model:
            return ""
        
        if pil_img.mode != 'RGB':
            pil_img = pil_img.convert('RGB')
        
        task_prompt = "<s_cord-v2>"
        
        pixel_values = processor(pil_img, return_tensors="pt").pixel_values.to(device)
        decoder_input_ids = processor.tokenizer(task_prompt, add_special_tokens=False, return_tensors="pt").input_ids.to(device)
        
        # Ultra-fast settings
        generated_ids = model.generate(
            pixel_values,
            decoder_input_ids=decoder_input_ids,
            max_length=80,   # Very short
            early_stopping=True,
            num_beams=1,     # No beam search
            do_sample=False,
            use_cache=True
        )
        
        donut_output = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        cleaned = re.sub(r'<[^>]+>', ' ', donut_output)
        return re.sub(r'\s+', ' ', cleaned).strip()
        
    except Exception as e:
        print(f"Donut error: {str(e)}")
        return ""

def extract_date_and_id_fast(text):
    """
    Lightning-fast extraction of exact patterns: YYYY-MM-DD dates and XX-12345678 IDs
    """
    results = {'dates': [], 'ids': []}
    
    # Clean text once
    cleaned = re.sub(r'[|\\\n\r\t]', ' ', text)
    cleaned = re.sub(r'\s+', ' ', cleaned)
    print(f"Fast analysis: {cleaned[:100]}...")
    
    # 1. FAST DATE EXTRACTION - ROC dates only
    # Look for 3-digit year patterns: 114/05/23, 114-05-23
    roc_pattern = r'\b(1\d{2})[-/](\d{1,2})[-/](\d{1,2})\b'
    
    roc_matches = re.findall(roc_pattern, cleaned)
    for match in roc_matches:
        try:
            year, month, day = int(match[0]), int(match[1]), int(match[2])
            
            # Quick validation
            if 100 <= year <= 120 and 1 <= month <= 12 and 1 <= day <= 31:
                gregorian_year = year + 1911
                standardized = f"{gregorian_year}-{month:02d}-{day:02d}"
                results['dates'].append(standardized)
                print(f"Found ROC date: {match[0]}/{match[1]}/{match[2]} -> {standardized}")
                break  # Take first valid date only
        except ValueError:
            continue
    
    # 2. FAST ID EXTRACTION - Exact pattern XX-12345678
    # Look for exactly 2 letters + 8 digits
    id_pattern = r'\b([A-Za-z]{2})[-]?(\d{8})\b'
    
    id_matches = re.findall(id_pattern, cleaned)
    for match in id_matches:
        letters = match[0].upper()
        digits = match[1]
        
        # Skip telephone prefixes
        if letters not in ["TE", "FA", "PH", "MO", "CA", "FX"]:
            formatted_id = f"{letters}-{digits}"
            results['ids'].append(formatted_id)
            print(f"Found ID: {formatted_id}")
            break  # Take first valid ID only
    
    return results

def has_both_patterns(results):
    """
    Fast check: must have exactly 1 date and 1 ID
    """
    has_date = len(results['dates']) > 0
    has_id = len(results['ids']) > 0
    
    print(f"Pattern check: Date={has_date}, ID={has_id}")
    print(f"  Dates: {results['dates']}")
    print(f"  IDs: {results['ids']}")
    
    return has_date and has_id

async def verify_with_openai_fast(extracted_info, raw_text=""):
    """
    Fast AI verification - only if we have partial data
    """
    try:
        # Convert to flat list
        if isinstance(extracted_info, dict):
            items_list = extracted_info['dates'] + extracted_info['ids']
        else:
            items_list = extracted_info
        
        if not items_list:
            return False, []
        
        items_str = ", ".join([f"'{item}'" for item in items_list])
        
        completion = await run_in_threadpool(
            lambda: openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": """
                    Extract from Chinese documents. Return JSON:
                    {
                        "dates": ["YYYY-MM-DD"],
                        "ids": ["XX-12345678"]
                    }
                    
                    Rules:
                    - ROC date conversion: Add 1911 to year (114/05/23 → 2025-05-23)
                    - IDs: Exactly 2 letters + 8 digits
                    - Skip telephone numbers (TEL, FAX, etc.)
                    - Must have both date AND ID to be valid
                    """},
                    {"role": "user", "content": f"Extract dates (YYYY-MM-DD) and IDs (XX-12345678) from: {raw_text[:200]}"}
                ],
                max_tokens=100,
                temperature=0
            )
        )

        response = completion.choices[0].message.content.strip()
        json_match = re.search(r'\{.*?\}', response, re.DOTALL)
        
        if json_match:
            try:
                verified_data = json.loads(json_match.group())
                
                if 'dates' in verified_data and 'ids' in verified_data:
                    dates = verified_data['dates']
                    ids = verified_data['ids']
                    
                    # Must have both
                    if len(dates) > 0 and len(ids) > 0:
                        return True, dates + ids
                        
            except json.JSONDecodeError:
                pass
        
        return False, []
        
    except Exception as e:
        print(f"AI verification error: {str(e)}")
        return False, []

@ocrapi.post("/ocrapi")
async def ocr_image(image: UploadFile = File(...)):
    try:
        # Read image
        img_bytes = await image.read()
        original_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        
        print("🚀 Step 1: Fast Pytesseract OCR...")
        
        # Try Pytesseract first (fastest)
        pytesseract_text = fast_pytesseract_ocr(original_img)
        
        if pytesseract_text:
            print(f"Pytesseract result: {pytesseract_text[:100]}...")
            
            # Quick pattern extraction
            extracted = extract_date_and_id_fast(pytesseract_text)
            
            # Check if we have both required patterns
            if has_both_patterns(extracted):
                # Success! Return immediately
                result_list = extracted['dates'] + extracted['ids']
                return {
                    "response_content": result_list,
                    "raw_ocr_text": pytesseract_text,
                    "source": "pytesseract_success"
                }
            
            # If partial results, try AI verification
            if extracted['dates'] or extracted['ids']:
                print("📡 Partial data found, trying AI verification...")
                is_valid, verified_data = await verify_with_openai_fast(extracted, pytesseract_text)
                
                if is_valid:
                    return {
                        "response_content": verified_data,
                        "raw_ocr_text": pytesseract_text,
                        "source": "pytesseract_ai_verified"
                    }
        
        print("🤖 Step 2: Fast Donut OCR...")
        
        # Try Donut only if Pytesseract failed
        if processor and model:
            donut_text = await fast_donut_ocr(original_img)
            
            if donut_text:
                print(f"Donut result: {donut_text}")
                
                # Quick pattern extraction
                extracted = extract_date_and_id_fast(donut_text)
                
                # Check if we have both required patterns
                if has_both_patterns(extracted):
                    # Success! Return immediately
                    result_list = extracted['dates'] + extracted['ids']
                    return {
                        "response_content": result_list,
                        "raw_ocr_text": donut_text,
                        "source": "donut_success"
                    }
                
                # If partial results, try AI verification
                if extracted['dates'] or extracted['ids']:
                    print("📡 Partial Donut data, trying AI verification...")
                    
                    # Combine both OCR outputs for better AI analysis
                    combined_text = f"Pytesseract: {pytesseract_text}\nDonut: {donut_text}"
                    
                    is_valid, verified_data = await verify_with_openai_fast(extracted, combined_text)
                    
                    if is_valid:
                        return {
                            "response_content": verified_data,
                            "raw_ocr_text": combined_text,
                            "source": "donut_ai_verified"
                        }
        
        # Both methods failed - return empty result immediately
        print("❌ Both OCR methods failed to find required patterns")
        final_text = pytesseract_text if pytesseract_text else ""
        
        return {
            "response_content": [],
            "raw_ocr_text": final_text,
            "source": "both_failed"
        }
        
    except Exception as e:
        print(f"❌ Processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@ocrapi.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Fast OCR API ready"}