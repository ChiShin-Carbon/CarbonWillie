from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image, ImageEnhance, ImageFilter
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
import numpy as np
import cv2
import json
import pytesseract


# Set logging level to ERROR to suppress warnings and info messages
logging.getLogger().setLevel(logging.ERROR)
transformers_logging.set_verbosity_error()
warnings.filterwarnings("ignore")

# Load environment variables from a .env file
load_dotenv()
os.environ["TRANSFORMERS_VERBOSITY"] = "error"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

ocrapi = APIRouter()

# Load a multilingual model that supports Chinese
MODEL_NAME = "naver-clova-ix/donut-base-finetuned-cord-v2"

try:
    # Initialize the processor and model with multilingual support
    processor = DonutProcessor.from_pretrained(
        MODEL_NAME,
        token=os.getenv("HUGGINGFACE_TOKEN")
    )
    model = VisionEncoderDecoderModel.from_pretrained(
        MODEL_NAME,
        token=os.getenv("HUGGINGFACE_TOKEN")
    )
    
    # Move to GPU if available
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    
    print(f"Donut model loaded successfully on {device}!")
except Exception as e:
    print(f"Error loading Donut model: {e}")

def preprocess_image_for_ocr(pil_img):
    """
    Apply optimized preprocessing techniques specifically for OCR processing
    
    Args:
        pil_img: PIL Image object
        
    Returns:
        PIL Image: Optimized image for OCR
    """
    try:
        # Convert PIL to OpenCV format
        img = np.array(pil_img)
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
        
        # 1. Resize image to improve OCR accuracy
        h, w = img.shape[:2]
        if w < 1000:
            scale = 1000 / w
            new_height = int(h * scale)
            img = cv2.resize(img, (1000, new_height), interpolation=cv2.INTER_CUBIC)
        elif w > 2000:
            scale = 2000 / w
            new_height = int(h * scale)
            img = cv2.resize(img, (2000, new_height), interpolation=cv2.INTER_AREA)
        
        # 2. Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # 3. Apply noise reduction
        denoised = cv2.medianBlur(gray, 3)
        
        # 4. Apply adaptive thresholding for better text contrast
        binary = cv2.adaptiveThreshold(
            denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        
        # 5. Morphological operations to clean up the image
        kernel = np.ones((1, 1), np.uint8)
        cleaned = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
        
        # 6. Convert back to PIL format
        enhanced_img = Image.fromarray(cleaned)
        
        return enhanced_img
        
    except Exception as e:
        print(f"Error in image preprocessing: {str(e)}")
        return pil_img

def create_ocr_variants(pil_img):
    """
    Create multiple image variants optimized for OCR processing
    """
    try:
        variants = []
        
        # Original image
        variants.append(pil_img)
        
        # Standard preprocessing for OCR
        try:
            variants.append(preprocess_image_for_ocr(pil_img))
        except Exception as e:
            print(f"Error creating preprocessed variant: {str(e)}")
        
        # High contrast grayscale version
        try:
            gray_img = pil_img.convert('L')
            contrast_enhancer = ImageEnhance.Contrast(gray_img)
            high_contrast_img = contrast_enhancer.enhance(2.5)
            variants.append(high_contrast_img)
        except Exception as e:
            print(f"Error creating high contrast variant: {str(e)}")
        
        # Binary threshold version
        try:
            img = np.array(pil_img)
            img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            _, binary_otsu = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            enhanced_img_otsu = Image.fromarray(binary_otsu)
            variants.append(enhanced_img_otsu)
        except Exception as e:
            print(f"Error creating Otsu threshold variant: {str(e)}")
        
        # Sharpened version
        try:
            sharpened = pil_img.filter(ImageFilter.SHARPEN)
            variants.append(sharpened)
        except Exception as e:
            print(f"Error creating sharpened variant: {str(e)}")
        
        return variants
        
    except Exception as e:
        print(f"Error in creating image variants: {str(e)}")
        return [pil_img]

def perform_pytesseract_ocr(pil_img):
    """
    Perform OCR using pytesseract with Chinese language support
    """
    try:
        custom_config = r'--oem 3 --psm 6 -l chi_tra+chi_sim+eng'
        text = pytesseract.image_to_string(pil_img, config=custom_config)
        return text.strip()
        
    except Exception as e:
        print(f"Error in pytesseract OCR: {str(e)}")
        return ""

def extract_date_and_id(text):
    """
    FIXED VERSION: Extract date and ID patterns correctly.
    
    Returns a dictionary with separate 'dates' and 'ids' lists to avoid confusion.
    """
    results = {'dates': [], 'ids': []}
    
    # Clean the text first
    cleaned_text = re.sub(r'[|\\\n\r\t]', ' ', text)
    print(f"Analyzing text: {cleaned_text}")
    
    # 1. DATE EXTRACTION
    # ROC calendar pattern (YYY-MM-DD where YYY is ROC year, typically 3 digits)
    roc_date_pattern = r'(\d{3}[-/\.]\d{1,2}[-/\.]\d{1,2})'
    
    # Standard Gregorian date pattern (YYYY-MM-DD)
    gregorian_date_pattern = r'(\d{4}[-/\.年]\d{1,2}[-/\.月]\d{1,2}日?)'
    
    # Find ROC dates (3-digit year)
    roc_dates = re.findall(roc_date_pattern, cleaned_text)
    for date in roc_dates:
        date_parts = re.split(r'[-/\.]', date)
        if len(date_parts) == 3:
            try:
                roc_year = int(date_parts[0])
                month = date_parts[1].zfill(2)
                day = date_parts[2].zfill(2)
                
                # Convert ROC year to Gregorian year (ROC year + 1911)
                gregorian_year = roc_year + 1911
                standardized = f"{gregorian_year}-{month}-{day}"
                results['dates'].append(standardized)
                print(f"Converted ROC date {date} to {standardized}")
            except ValueError:
                continue
    
    # Find Gregorian dates (4-digit year)
    gregorian_dates = re.findall(gregorian_date_pattern, cleaned_text)
    for date in gregorian_dates:
        # Convert Chinese format dates if present
        if '年' in date or '月' in date or '日' in date:
            date = date.replace('年', '-').replace('月', '-').replace('日', '')
        
        date_parts = re.split(r'[-/\.]', date)
        
        if len(date_parts) == 3:
            try:
                year = date_parts[0]
                month = date_parts[1].zfill(2)
                day = date_parts[2].zfill(2)
                
                # Ensure year is 4 digits
                if len(year) == 2:
                    year = '20' + year if int(year) < 50 else '19' + year
                elif len(year) == 4:
                    # This is already a 4-digit year, keep as is
                    pass
                else:
                    continue  # Skip invalid year formats
                    
                standardized = f"{year}-{month}-{day}"
                results['dates'].append(standardized)
                print(f"Found Gregorian date: {standardized}")
            except ValueError:
                continue
    
    # 2. ID EXTRACTION
    # Look for exactly 2 letters followed by optional hyphen and exactly 8 digits
    # Use word boundaries to avoid matching parts of longer strings
    id_pattern = r'\b([A-Za-z]{2})[-]?(\d{8})\b'
    
    # Find all ID pattern matches
    ids = re.findall(id_pattern, cleaned_text)
    
    for id_match in ids:
        letters = id_match[0].upper()
        digits = id_match[1]
        
        # Skip obvious telephone/fax number prefixes
        telephone_prefixes = ["TE", "FA", "PH", "MO", "CA", "FX"]
        
        # Additional check: if the letters are followed by "L" it might be "TEL"
        if letters not in telephone_prefixes:
            formatted_id = f"{letters}-{digits}"
            results['ids'].append(formatted_id)
            print(f"Found ID: {formatted_id}")
        else:
            print(f"Skipped telephone number: {letters}-{digits}")
    
    return results

def has_required_patterns(text):
    """
    FIXED VERSION: Check if the text contains at least one date and one ID
    """
    extracted = extract_date_and_id(text)
    
    if not extracted['dates'] and not extracted['ids']:
        print("No patterns extracted from text")
        return False
    
    has_date = len(extracted['dates']) > 0
    has_id = len(extracted['ids']) > 0
    
    print(f"Extracted dates: {extracted['dates']}")
    print(f"Extracted IDs: {extracted['ids']}")
    
    result = has_date and has_id
    print(f"Has required patterns: {result} (dates: {has_date}, ids: {has_id})")
    return result

async def verify_with_openai(extracted_info, raw_text=""):
    """
    FIXED VERSION: Use OpenAI to verify and properly categorize dates vs IDs
    """
    try:
        # If extracted_info is a dict, convert it to a list for backward compatibility
        if isinstance(extracted_info, dict):
            items_list = extracted_info['dates'] + extracted_info['ids']
        else:
            items_list = extracted_info
        
        items_str = ", ".join([f"'{item}'" for item in items_list]) if items_list else "None"
        
        completion = await run_in_threadpool(
            lambda: openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": """
                    You are a data validator for OCR text extracted from Chinese documents. Your task is to:
                    
                    1. Identify DATES in YYYY-MM-DD format
                    2. Identify ID codes in XX-12345678 format (exactly 2 letters + 8 digits)
                    
                    IMPORTANT RULES:
                    - ROC calendar conversion: ROC year + 1911 = Gregorian year
                      Example: 114-05-09 becomes 2025-05-09 (114 + 1911 = 2025)
                    - Valid IDs: Exactly 2 letters followed by 8 digits (AB-12345678, NR-69959816)
                    - Invalid IDs: Telephone numbers (TEL-12345678, FAX-12345678)
                    
                    CRITICAL: Dates should be actual calendar dates, NOT ID numbers that happen to look like dates.
                    
                    Return a JSON object with two arrays:
                    {
                        "dates": ["YYYY-MM-DD", ...],
                        "ids": ["XX-12345678", ...]
                    }
                    
                    Only include properly formatted and valid items.
                    """},
                    {"role": "user", "content": f"Analyze these extracted items: {items_str}\n\nRaw OCR text:\n{raw_text}\n\nSeparate into dates (YYYY-MM-DD format) and IDs (XX-12345678 format). Remember: dates are calendar dates, IDs are identification codes."}
                ]
            )
        )

        verified_response = completion.choices[0].message.content.strip()
        print(f"OpenAI verification response: {verified_response}")
        
        # Extract the JSON object from the response
        json_match = re.search(r'\{.*?\}', verified_response, re.DOTALL)
        if json_match:
            try:
                verified_data = json.loads(json_match.group())
                
                # Ensure we have the expected structure
                if 'dates' in verified_data and 'ids' in verified_data:
                    has_dates = len(verified_data['dates']) > 0
                    has_ids = len(verified_data['ids']) > 0
                    is_valid = has_dates and has_ids
                    
                    # Convert to flat list for backward compatibility
                    flat_list = verified_data['dates'] + verified_data['ids']
                    return is_valid, flat_list
                    
            except json.JSONDecodeError:
                print("Failed to parse JSON from OpenAI response")
        
        return False, []
        
    except Exception as e:
        print(f"Error in OpenAI verification: {str(e)}")
        return False, []

async def perform_donut_ocr(pil_img):
    """
    Perform OCR using Donut model
    """
    try:
        if 'processor' not in globals() or 'model' not in globals():
            raise Exception("Donut model not loaded correctly")
        
        if pil_img.mode != 'RGB':
            pil_img = pil_img.convert('RGB')
        
        task_prompt = "<s_cord-v2>"
        
        pixel_values = processor(pil_img, return_tensors="pt").pixel_values.to(device)
        decoder_input_ids = processor.tokenizer(task_prompt, add_special_tokens=False, return_tensors="pt").input_ids.to(device)
        
        generated_ids = model.generate(
            pixel_values,
            decoder_input_ids=decoder_input_ids,
            max_length=256,
            early_stopping=True,
            num_beams=3,
            do_sample=False,
            num_return_sequences=1,
            length_penalty=1.0,
            use_cache=True
        )
        
        donut_output = processor.batch_decode(
            generated_ids, 
            skip_special_tokens=True
        )[0]
        
        # Clean up Donut output
        cleaned_output = re.sub(r'<[^>]+>', ' ', donut_output)
        cleaned_output = re.sub(r'\s+', ' ', cleaned_output).strip()
        
        return cleaned_output
        
    except Exception as e:
        print(f"Error in Donut OCR: {str(e)}")
        return ""

@ocrapi.post("/ocrapi")
async def ocr_image(image: UploadFile = File(...)):
    try:
        # Read the uploaded image
        img_bytes = await image.read()
        original_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        
        # Step 1: Preprocess image
        print("Step 1: Preprocessing image for OCR...")
        image_variants = create_ocr_variants(original_img)
        
        # Step 2: Try pytesseract OCR on each variant
        print("Step 2: Attempting pytesseract OCR...")
        for i, img_variant in enumerate(image_variants):
            pytesseract_output = perform_pytesseract_ocr(img_variant)
            
            if pytesseract_output:
                print(f"Pytesseract OCR output for variant {i}: {pytesseract_output}")
                
                # Step 3: Analyze for required patterns
                print("Step 3: Analyzing for required patterns...")
                if has_required_patterns(pytesseract_output):
                    extracted = extract_date_and_id(pytesseract_output)
                    
                    # Verify with OpenAI
                    is_valid, verified_data = await verify_with_openai(extracted, pytesseract_output)
                    
                    if is_valid:
                        return {
                            "response_content": verified_data, 
                            "raw_ocr_text": pytesseract_output, 
                            "source": f"pytesseract_variant_{i}_verified"
                        }
        
        # Step 4: If pytesseract failed, use Donut
        print("Step 4: Pytesseract failed, falling back to Donut...")
        for i, img_variant in enumerate(image_variants):
            donut_output = await perform_donut_ocr(img_variant)
            
            if donut_output:
                print(f"Donut OCR output for variant {i}: {donut_output}")
                
                if has_required_patterns(donut_output):
                    extracted = extract_date_and_id(donut_output)
                    
                    # Verify with OpenAI
                    is_valid, verified_data = await verify_with_openai(extracted, donut_output)
                    
                    if is_valid:
                        return {
                            "response_content": verified_data, 
                            "raw_ocr_text": donut_output, 
                            "source": f"donut_variant_{i}_verified"
                        }
        
        # Last resort: Use OpenAI for direct extraction
        print("Last resort: Using OpenAI for direct extraction...")
        
        all_outputs = []
        
        # Collect all OCR outputs
        for i, img_variant in enumerate(image_variants):
            pytesseract_output = perform_pytesseract_ocr(img_variant)
            if pytesseract_output:
                all_outputs.append(f"Pytesseract variant {i}: {pytesseract_output}")
        
        for i, img_variant in enumerate(image_variants):
            donut_output = await perform_donut_ocr(img_variant)
            if donut_output:
                all_outputs.append(f"Donut variant {i}: {donut_output}")
        
        combined_text = "\n".join(all_outputs)
        
        completion = await run_in_threadpool(
            lambda: openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": """
                    You are a specialized OCR post-processor for Chinese documents.
                    
                    Extract and categorize:
                    1. DATES in YYYY-MM-DD format (including ROC calendar conversion)
                    2. ID codes in XX-12345678 format (exactly 2 letters + 8 digits)
                    
                    CRITICAL RULES:
                    - ROC calendar: Add 1911 to ROC year (114-05-09 → 2025-05-09)
                    - Dates are calendar dates, NOT ID numbers
                    - Valid IDs: 2 letters + 8 digits (NR-69959816, AT-12345678)
                    - Invalid: Telephone numbers (TEL-12345678, FAX-12345678)
                    
                    Return JSON:
                    {
                        "dates": ["YYYY-MM-DD"],
                        "ids": ["XX-12345678"]
                    }
                    
                    If no valid items found, return empty arrays.
                    """},
                    {"role": "user", "content": f"Extract dates and IDs from this Chinese document OCR text. Convert ROC dates (add 1911 to year). Distinguish between calendar dates and ID codes:\n\n{combined_text}"}
                ]
            )
        )

        gpt_response = completion.choices[0].message.content.strip()
        print(f"Final GPT response: {gpt_response}")

        # Extract JSON from response
        json_match = re.search(r'\{.*?\}', gpt_response, re.DOTALL)
        if json_match:
            try:
                response_data = json.loads(json_match.group())
                if 'dates' in response_data and 'ids' in response_data:
                    # Convert to flat list and check if we have both types
                    dates = response_data['dates']
                    ids = response_data['ids']
                    
                    if len(dates) > 0 and len(ids) > 0:
                        combined_results = dates + ids
                        return {
                            "response_content": combined_results, 
                            "raw_ocr_text": combined_text, 
                            "source": "gpt_final_extraction"
                        }
            except json.JSONDecodeError:
                print("Failed to parse JSON from GPT response")
        
        # Return empty results if nothing found
        return {
            "response_content": [], 
            "raw_ocr_text": combined_text, 
            "source": "no_verified_results"
        }
        
    except Exception as e:
        print(f"Error in OCR processing: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))