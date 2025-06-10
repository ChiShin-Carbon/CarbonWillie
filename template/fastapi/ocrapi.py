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
from typing import Dict, List, Tuple, Union


# Configure logging and warnings
logging.getLogger().setLevel(logging.ERROR)
transformers_logging.set_verbosity_error()
warnings.filterwarnings("ignore")

# Load environment variables
load_dotenv()
os.environ["TRANSFORMERS_VERBOSITY"] = "error"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

# Initialize router
ocrapi = APIRouter()

# Global variables for model
processor = None
model = None
device = None

# Model configuration
MODEL_NAME = "naver-clova-ix/donut-base-finetuned-cord-v2"

def initialize_models():
    """Initialize Donut model with proper error handling"""
    global processor, model, device
    
    try:
        # Check if HuggingFace token is available
        hf_token = os.getenv("HUGGINGFACE_TOKEN")
        if not hf_token:
            print("Warning: HUGGINGFACE_TOKEN not found in environment variables")
        
        processor = DonutProcessor.from_pretrained(
            MODEL_NAME,
            token=hf_token
        )
        model = VisionEncoderDecoderModel.from_pretrained(
            MODEL_NAME,
            token=hf_token
        )
        
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model.to(device)
        
        print(f"✅ Donut model loaded successfully on {device}!")
        return True
        
    except Exception as e:
        print(f"❌ Error loading Donut model: {e}")
        processor = None
        model = None
        device = None
        return False

def fast_pytesseract_ocr(pil_img: Image.Image) -> str:
    """
    Fast OCR with minimal preprocessing using Tesseract
    """
    try:
        # Ensure image is in RGB mode
        if pil_img.mode != 'RGB':
            pil_img = pil_img.convert('RGB')
        
        # Fastest OCR config for Chinese Traditional + English
        config = r'--oem 3 --psm 6 -l chi_tra+eng'
        text = pytesseract.image_to_string(pil_img, config=config)
        return text.strip()
        
    except Exception as e:
        print(f"Pytesseract error: {str(e)}")
        return ""

def extract_date_and_id_optimized(text: str) -> Dict[str, List[str]]:
    """
    OPTIMIZED extraction with better date prioritization and faster processing
    """
    results = {'dates': [], 'ids': []}
    
    if not text:
        return results
    
    # Clean text more thoroughly
    cleaned = re.sub(r'[|\\\n\r\t]', ' ', text)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    print(f"Analyzing text: {cleaned}")
    
    # =============== DATE EXTRACTION - PRIORITIZE ACCURACY ===============
    
    # Priority 1: Look for Gregorian dates (including those with timestamps)
    # Extract date part even if followed by time
    gregorian_pattern = r'\b(20\d{2})[-/](\d{1,2})[-/](\d{1,2})\b'
    gregorian_matches = re.findall(gregorian_pattern, cleaned)
    
    # Find all valid Gregorian dates and prioritize based on context
    gregorian_candidates = []
    
    for match in gregorian_matches:
        try:
            year, month, day = int(match[0]), int(match[1]), int(match[2])
            
            if 2020 <= year <= 2030 and 1 <= month <= 12 and 1 <= day <= 31:
                match_str = f"{match[0]}-{match[1]}-{match[2]}"
                standardized = f"{year}-{month:02d}-{day:02d}"
                
                # Find context around this date
                match_pos = cleaned.find(match_str.replace('-', '/')) if match_str.replace('-', '/') in cleaned else cleaned.find(match_str)
                if match_pos == -1:
                    # Try different separators
                    for sep in ['-', '/']:
                        test_str = f"{match[0]}{sep}{match[1]}{sep}{match[2]}"
                        match_pos = cleaned.find(test_str)
                        if match_pos != -1:
                            break
                
                priority_score = 0
                context_info = ""
                
                if match_pos > -1:
                    context = cleaned[max(0, match_pos-30):match_pos+50].lower()
                    context_info = context
                    
                    # LOWER priority for dates that are clearly expiry/validity dates
                    if any(skip in context for skip in ['前', '換', '到期', '有效', '回站', '期限']):
                        priority_score = -10
                        print(f"Found expiry date: {match_str} -> {standardized} (low priority)")
                    
                    # HIGHER priority for dates that appear to be document dates
                    elif any(doc_indicator in context for doc_indicator in ['發票', '票據', '收據', '單據']):
                        priority_score = 100
                        print(f"Found DOCUMENT date: {match_str} -> {standardized} (high priority)")
                    
                    # MEDIUM priority for standalone dates (likely document dates)
                    else:
                        priority_score = 50
                        print(f"Found standalone date: {match_str} -> {standardized}")
                else:
                    priority_score = 50
                    print(f"Found date: {match_str} -> {standardized}")
                
                gregorian_candidates.append((standardized, priority_score, context_info))
                
        except (ValueError, IndexError):
            continue
    
    # Sort by priority score and take the highest priority date
    if gregorian_candidates:
        gregorian_candidates.sort(key=lambda x: x[1], reverse=True)
        best_date = gregorian_candidates[0][0]
        results['dates'].append(best_date)
        print(f"Selected BEST Gregorian date: {best_date} (priority: {gregorian_candidates[0][1]})")
    
    # Priority 2: ROC dates (only if no Gregorian date found)
    if not results['dates']:
        roc_patterns = [
            r'\b(1\d{2})\s*年\s*(\d{1,2})[-/](\d{1,2})\s*月?\b',  # 114 年 05-06 月
            r'\b(1\d{2})[-/](\d{1,2})[-/](\d{1,2})\b'  # 114/05/06
        ]
        
        for pattern in roc_patterns:
            matches = re.findall(pattern, cleaned)
            for match in matches:
                try:
                    year, month, day = int(match[0]), int(match[1]), int(match[2])
                    
                    # Validate ROC date components
                    if 100 <= year <= 120 and 1 <= month <= 12 and 1 <= day <= 31:
                        # Check context to avoid expiry dates
                        match_str = f"{match[0]}/{match[1]}/{match[2]}"
                        match_pos = cleaned.find(str(match[0]))
                        if match_pos > -1:
                            context = cleaned[max(0, match_pos-30):match_pos+50].lower()
                            # Skip if it looks like expiry/validity date
                            if any(skip in context for skip in ['前', '換', '到期', '有效', '回站', '期限']):
                                print(f"Skipping ROC expiry date: {match_str}")
                                continue
                        
                        gregorian_year = year + 1911
                        standardized = f"{gregorian_year}-{month:02d}-{day:02d}"
                        results['dates'].append(standardized)
                        print(f"Found ROC date: {match[0]}/{match[1]}/{match[2]} -> {standardized}")
                        break
                        
                except (ValueError, IndexError):
                    continue
    
    # =============== ID EXTRACTION ===============
    # Clean text specifically for ID extraction - handle OCR artifacts
    id_text = cleaned.upper()
    # Fix common OCR misreads
    id_text = re.sub(r'[O0]', '0', id_text)  # Normalize O/0
    id_text = re.sub(r'[I1l|]', '1', id_text)  # Normalize I/1/l
    id_text = re.sub(r'[S5$]', '5', id_text)  # Normalize S/5
    
    print(f"ID extraction from: {id_text}")
    
    # More flexible pattern to catch IDs with various separators or OCR artifacts
    # This pattern handles: NA-36934069, NA36934069, NA 36934069, etc.
    flexible_id_patterns = [
        r'\b(NT)[-\s]*([0-9]{8})\b',           # NT-XXXXXXXX
        r'\b(MT)[-\s]*([0-9]{8})\b',           # MT-XXXXXXXX  
        r'\b(NA)[-\s]*([0-9]{8})\b',           # NA-XXXXXXXX
        r'\b([A-Z]{2})[-\s]*([0-9]{8})\b',     # Any XX-XXXXXXXX
    ]
    
    excluded_prefixes = {"TE", "FA", "PH", "MO", "CA", "FX", "TX", "RX", "ID", "NO", "RS", "H$"}
    
    for pattern in flexible_id_patterns:
        matches = re.findall(pattern, id_text)
        
        for match in matches:
            letters, digits = match[0], match[1]
            
            # Skip excluded prefixes
            if letters in excluded_prefixes:
                continue
            
            # Validate 8-digit number
            if len(digits) == 8 and digits.isdigit():
                # Additional context check to avoid phone numbers
                context_check = cleaned.lower()
                if not any(phone_word in context_check for phone_word in ['電話', 'tel', 'phone', '聯絡']):
                    formatted_id = f"{letters}-{digits}"
                    results['ids'].append(formatted_id)
                    print(f"Found ID: {formatted_id} (pattern: {letters})")
                    
                    # Prioritize NT, MT, NA prefixes by breaking early
                    if letters in ['NT', 'MT', 'NA']:
                        break
        
        # If we found an ID with priority prefix, stop searching
        if results['ids'] and any(id_str.startswith(('NT-', 'MT-', 'NA-')) for id_str in results['ids']):
            break
    
    # If still no IDs found, try a more aggressive pattern for OCR artifacts
    if not results['ids']:
        print("Trying aggressive ID pattern matching...")
        # Look for any 2-letter + 8-digit combination, even with OCR artifacts
        aggressive_pattern = r'\b([A-Z]{2})[^0-9]{0,2}([0-9]{8})\b'
        aggressive_matches = re.findall(aggressive_pattern, id_text)
        
        for match in aggressive_matches:
            letters, digits = match[0], match[1]
            
            if letters not in excluded_prefixes and len(digits) == 8 and digits.isdigit():
                formatted_id = f"{letters}-{digits}"
                results['ids'].append(formatted_id)
                print(f"Found ID (aggressive): {formatted_id}")
                break
    
    return results

def has_both_patterns(results: Dict[str, List[str]]) -> bool:
    """
    Check if we have both required patterns (at least 1 date and 1 ID)
    """
    has_date = len(results.get('dates', [])) > 0
    has_id = len(results.get('ids', [])) > 0
    
    print(f"Pattern check: Date={has_date}, ID={has_id}")
    print(f"  Dates: {results.get('dates', [])}")
    print(f"  IDs: {results.get('ids', [])}")
    
    return has_date and has_id

async def fast_donut_ocr(pil_img: Image.Image) -> str:
    """
    Ultra-fast Donut OCR with proper async handling - only used as fallback
    """
    try:
        if not processor or not model or not device:
            print("Donut model not available")
            return ""
        
        # Ensure image is in RGB mode
        if pil_img.mode != 'RGB':
            pil_img = pil_img.convert('RGB')
        
        # Run model inference in thread pool to avoid blocking
        def _run_donut():
            task_prompt = "<s_cord-v2>"
            
            pixel_values = processor(pil_img, return_tensors="pt").pixel_values.to(device)
            decoder_input_ids = processor.tokenizer(
                task_prompt, 
                add_special_tokens=False, 
                return_tensors="pt"
            ).input_ids.to(device)
            
            # Ultra-fast generation settings
            with torch.no_grad():
                generated_ids = model.generate(
                    pixel_values,
                    decoder_input_ids=decoder_input_ids,
                    max_length=50,  # Reduced for speed
                    early_stopping=True,
                    num_beams=1,
                    do_sample=False,
                    use_cache=True,
                    pad_token_id=processor.tokenizer.pad_token_id,
                    eos_token_id=processor.tokenizer.eos_token_id
                )
            
            donut_output = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
            # Clean up the output
            cleaned = re.sub(r'<[^>]+>', ' ', donut_output)
            return re.sub(r'\s+', ' ', cleaned).strip()
        
        # Run in thread pool to prevent blocking
        result = await run_in_threadpool(_run_donut)
        return result
        
    except Exception as e:
        print(f"Donut error: {str(e)}")
        return ""

@ocrapi.post("/ocrapi")
async def ocr_image(image: UploadFile = File(...)):
    """
    OPTIMIZED OCR endpoint - prioritizes speed and accuracy
    """
    try:
        # Validate file type
        if not image.content_type or not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process image
        img_bytes = await image.read()
        if len(img_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty image file")
        
        try:
            original_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")
        
        print("🚀 Step 1: Pytesseract OCR with optimized extraction...")
        
        # Try Pytesseract first (fastest and most accurate for text)
        pytesseract_text = fast_pytesseract_ocr(original_img)
        
        if pytesseract_text:
            print(f"Pytesseract result: {pytesseract_text[:200]}...")
            
            # Use optimized extraction
            extracted = extract_date_and_id_optimized(pytesseract_text)
            
            # Check if we have both required patterns
            if has_both_patterns(extracted):
                result_list = extracted['dates'] + extracted['ids']
                return {
                    "response_content": result_list,
                    "raw_ocr_text": pytesseract_text,
                    "source": "pytesseract_optimized"
                }
        
        # Only use Donut as fallback if Pytesseract failed completely
        print("🤖 Step 2: Donut OCR fallback...")
        
        if processor and model:
            donut_text = await fast_donut_ocr(original_img)
            
            if donut_text:
                print(f"Donut result: {donut_text}")
                
                # Combine both OCR results for better accuracy
                combined_text = f"{pytesseract_text} {donut_text}"
                combined_extracted = extract_date_and_id_optimized(combined_text)
                
                if has_both_patterns(combined_extracted):
                    result_list = combined_extracted['dates'] + combined_extracted['ids']
                    return {
                        "response_content": result_list,
                        "raw_ocr_text": combined_text,
                        "source": "combined_optimized"
                    }
        
        # Return partial results if available
        final_extracted = extract_date_and_id_optimized(pytesseract_text)
        partial_results = final_extracted.get('dates', []) + final_extracted.get('ids', [])
        
        return {
            "response_content": partial_results,
            "raw_ocr_text": pytesseract_text,
            "source": "partial_results"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@ocrapi.get("/health")
async def health_check():
    """Health check endpoint"""
    model_status = "loaded" if (processor and model) else "not_loaded"
    return {
        "status": "healthy", 
        "message": "Optimized OCR API ready",
        "donut_model": model_status,
        "device": str(device) if device else "not_available"
    }

@ocrapi.on_event("startup")
async def startup_event():
    """Initialize models on startup"""
    print("🚀 Initializing OCR models...")
    success = initialize_models()
    if success:
        print("✅ Optimized OCR API ready!")
    else:
        print("⚠️ OCR API started but Donut model failed to load")

# Initialize models immediately when module is imported
initialize_models()