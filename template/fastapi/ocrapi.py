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
MODEL_NAME = "naver-clova-ix/donut-base-finetuned-cord-v2"  # This is a starting point, but a Chinese-specific model would be better

try:
    # Initialize the processor and model with multilingual support
    processor = DonutProcessor.from_pretrained(
        MODEL_NAME,
        token=os.getenv("HUGGINGFACE_TOKEN")  # Instead of use_auth_token
    )
    model = VisionEncoderDecoderModel.from_pretrained(
        MODEL_NAME,
        token=os.getenv("HUGGINGFACE_TOKEN")  # Instead of use_auth_token
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
        # Scale up if image is too small, scale down if too large
        h, w = img.shape[:2]
        if w < 1000:
            # Scale up small images
            scale = 1000 / w
            new_height = int(h * scale)
            img = cv2.resize(img, (1000, new_height), interpolation=cv2.INTER_CUBIC)
        elif w > 2000:
            # Scale down very large images
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
        # Return original image if preprocessing fails
        return pil_img

def create_ocr_variants(pil_img):
    """
    Create multiple image variants optimized for OCR processing
    
    Args:
        pil_img: PIL Image object
        
    Returns:
        list: List of preprocessed PIL Image objects for OCR
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
            
            # Use Otsu's method for automatic threshold selection
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
        # Return only original image if processing fails
        return [pil_img]

def perform_pytesseract_ocr(pil_img):
    """
    Perform OCR using pytesseract with Chinese language support
    
    Args:
        pil_img: PIL Image object
        
    Returns:
        str: Extracted text from the image
    """
    try:
        # Configure pytesseract for Chinese and English text
        # You may need to adjust the language codes based on your tesseract installation
        custom_config = r'--oem 3 --psm 6 -l chi_tra+chi_sim+eng'
        
        # Extract text using pytesseract
        text = pytesseract.image_to_string(pil_img, config=custom_config)
        
        return text.strip()
        
    except Exception as e:
        print(f"Error in pytesseract OCR: {str(e)}")
        return ""

def extract_date_and_id(text):
    """
    Extract date (YYYY-MM-DD or similar formats) and ID numbers (XX-12345678 pattern) from text.
    Returns a list with the found items or None if nothing is found.
    Date is always converted to strict YYYY-MM-DD format with leading zeros.
    
    This function handles ROC calendar dates (e.g., 114-05-20 -> 2025-05-20) and
    recognizes IDs like AB-12345678 even with trailing characters.
    """
    results = []
    
    # Clean the text first - remove trailing characters like |, \n, etc.
    cleaned_text = re.sub(r'[|\\\n\r\t]', ' ', text)
    
    # Date patterns - include ROC calendar format (YYY-MM-DD where YYY is ROC year)
    # ROC calendar: ROC year + 1911 = Gregorian year
    roc_date_pattern = r'(\d{3}[-/\.]\d{1,2}[-/\.]\d{1,2})'
    gregorian_date_pattern = r'(\d{4}[-/\.年]\d{1,2}[-/\.月]\d{1,2}日?)'
    
    # Find ROC dates
    roc_dates = re.findall(roc_date_pattern, cleaned_text)
    for date in roc_dates:
        date_parts = re.split(r'[-/\.]', date)
        if len(date_parts) == 3:
            roc_year = int(date_parts[0])
            month = date_parts[1].zfill(2)
            day = date_parts[2].zfill(2)
            
            # Convert ROC year to Gregorian year
            gregorian_year = roc_year + 1911
            standardized = f"{gregorian_year}-{month}-{day}"
            results.append(standardized)
            print(f"Converted ROC date {date} to {standardized}")
    
    # Find Gregorian dates
    gregorian_dates = re.findall(gregorian_date_pattern, cleaned_text)
    for date in gregorian_dates:
        # Convert Chinese format dates if present
        if '年' in date or '月' in date or '日' in date:
            date = date.replace('年', '-').replace('月', '-').replace('日', '')
        
        # Replace slashes and dots with hyphens for standardization
        date_parts = re.split(r'[-/\.]', date)
        
        if len(date_parts) == 3:
            year = date_parts[0]
            month = date_parts[1].zfill(2)  # Add leading zero if needed
            day = date_parts[2].zfill(2)    # Add leading zero if needed
            
            # Ensure year is 4 digits
            if len(year) == 2:
                year = '20' + year if int(year) < 50 else '19' + year
                
            standardized = f"{year}-{month}-{day}"
            results.append(standardized)
    
    # ID pattern - More flexible to handle various formats
    # Look for two letters followed by optional hyphen and 8 digits
    id_pattern = r'(?<!\w)([A-Za-z]{2})[-]?(\d{8})(?=\W|$)'
    
    # Find all ID pattern matches
    ids = re.findall(id_pattern, cleaned_text)
    
    # Add found IDs with standard format (2 letters, hyphen, 8 digits)
    for id_match in ids:
        letters = id_match[0].upper()
        digits = id_match[1]
        
        # Skip obvious telephone number prefixes
        if letters not in ["TE", "FA", "PH", "MO"]:  # Allow common ID prefixes but exclude tel/fax
            formatted_id = f"{letters}-{digits}"
            results.append(formatted_id)
            print(f"Found ID: {formatted_id}")
    
    return results if results else None

def has_required_patterns(text):
    """
    Check if the text contains the required patterns: YYYY-MM-DD date and AB-12345678 ID
    
    Args:
        text: String to check
        
    Returns:
        bool: True if both patterns are found, False otherwise
    """
    extracted = extract_date_and_id(text)
    if not extracted:
        print("No patterns extracted from text")
        return False
    
    has_date = False
    has_id = False
    
    print(f"Extracted items: {extracted}")
    
    for item in extracted:
        # Check for date pattern (YYYY-MM-DD)
        if re.match(r'\d{4}-\d{2}-\d{2}', item):
            has_date = True
            print(f"Found valid date: {item}")
        # Check for ID pattern (AB-12345678)
        elif re.match(r'[A-Z]{2}-\d{8}', item):
            has_id = True
            print(f"Found valid ID: {item}")
    
    result = has_date and has_id
    print(f"Has required patterns: {result} (date: {has_date}, id: {has_id})")
    return result

async def verify_with_openai(extracted_info, raw_text=""):
    """
    Use OpenAI to verify that dates are in YYYY-MM-DD format and IDs match XX-12345678 pattern
    
    Args:
        extracted_info: List of extracted strings
        raw_text: Optional raw OCR text to help with extraction
        
    Returns:
        tuple: (is_valid, verified_data)
    """
    try:
        # Prepare a better prompt with both extracted items and raw text
        items_str = ", ".join([f"'{item}'" for item in extracted_info]) if extracted_info else "None"
        
        completion = await run_in_threadpool(
            lambda: openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": """
                    You are a data validator for OCR text extracted from Chinese documents. Your task is to:
                    
                    1. Find dates in YYYY-MM-DD format (e.g., 2025-05-20)
                    2. Find ID codes in XX-12345678 format (e.g., AB-12345678, TE-57897732, AT-09134760)
                    
                    Look for patterns like:
                    - Dates might appear as YYYY-MM-DD, YYYY/MM/DD, YYYY年MM月DD日, or ROC calendar (YYY-MM-DD)
                    - ROC calendar conversion: ROC year + 1911 = Gregorian year (e.g., 114-05-20 = 2025-05-20)
                    - IDs might appear with or without dashes, e.g., AT09134760 or AT-09134760
                    
                    IMPORTANT DISTINCTION:
                    - Valid IDs: Two letters followed by 8 digits (e.g., AB-12345678, TE-57897732, AT-09134760)
                    - NOT Valid: Telephone numbers like TEL02-87913478, FAX-12345678, TEL03-12345678, PHONE-12345678
                    
                    How to tell the difference:
                    - Valid IDs have EXACTLY 2 letters followed by 8 digits
                    - Telephone numbers often have 3+ letters (TEL, FAX, PHONE) or context indicating they are telephone numbers
                    - Context clues like "偵測號碼:" (Detection Number:) indicate valid IDs
                    
                    Convert and fix formatting to:
                    - Strict YYYY-MM-DD format for dates (convert ROC dates by adding 1911)
                    - XX-12345678 format for IDs (exactly 2 letters, followed by hyphen, followed by 8 digits)
                    
                    Return a JSON array containing ONLY properly formatted items.
                    Example: ["2023-05-21", "TE-57897732"]
                    
                    If you can't find properly formatted items, return an empty array [].
                    """},
                    {"role": "user", "content": f"I extracted these items: {items_str}\n\nHere's the raw OCR text for additional context:\n\n{raw_text}\n\nExtract valid dates (YYYY-MM-DD, including ROC calendar conversion) and IDs (XX-12345678). Remember that IDs like AB-12345678 are valid but telephone numbers should be excluded."}
                ]
            )
        )

        verified_response = completion.choices[0].message.content.strip()
        print(f"OpenAI verification response: {verified_response}")
        
        # Extract the JSON array from the response
        json_match = re.search(r'\[.*?\]', verified_response, re.DOTALL)
        if json_match:
            try:
                verified_data = json.loads(json_match.group())
                is_valid = len(verified_data) >= 2
                return is_valid, verified_data
            except json.JSONDecodeError:
                print("Failed to parse JSON from OpenAI response")
        
        # If we can't find valid JSON, try to extract dates and IDs directly from the response
        date_pattern = r'(\d{4}-\d{2}-\d{2})'
        id_pattern = r'([A-Z]{2}-\d{8})'
        
        dates = re.findall(date_pattern, verified_response)
        ids = re.findall(id_pattern, verified_response)
        
        extracted = dates + ids
        if len(extracted) >= 2:
            return True, extracted
        
        # If we still don't have enough, try a more permissive approach with the raw_text
        date_pattern = r'(\d{4}[-/\.年]\d{1,2}[-/\.月]\d{1,2}日?)'
        id_pattern = r'(?<!\w)([A-Za-z]{2})[-]?(\d{8})(?!\w)'
        
        dates = re.findall(date_pattern, raw_text)
        id_matches = re.findall(id_pattern, raw_text)
        
        # Process dates to standard format
        processed_dates = []
        for date in dates:
            # Convert Chinese format dates if present
            if '年' in date or '月' in date or '日' in date:
                date = date.replace('年', '-').replace('月', '-').replace('日', '')
            
            # Replace slashes and dots with hyphens
            date_parts = re.split(r'[-/\.]', date)
            
            if len(date_parts) == 3:
                year = date_parts[0]
                month = date_parts[1].zfill(2)  # Add leading zero if needed
                day = date_parts[2].zfill(2)    # Add leading zero if needed
                
                # Ensure year is 4 digits
                if len(year) == 2:
                    year = '20' + year if int(year) < 50 else '19' + year
                    
                standardized = f"{year}-{month}-{day}"
                processed_dates.append(standardized)
        
        # Process IDs to standard format - fixed to respect the two-letter requirement
        processed_ids = []
        for id_match in id_matches:
            # Now id_match is a tuple with (letters, digits)
            letters = id_match[0].upper()
            digits = id_match[1]
            
            # Skip telephone number prefixes
            if len(letters) == 2 and letters not in ["PH", "MO", "FA"]:  # Abbreviated telephone prefixes
                formatted_id = f"{letters}-{digits}"
                processed_ids.append(formatted_id)
        
        combined = processed_dates + processed_ids
        if len(combined) >= 2:
            return True, combined
            
        return False, []
        
    except Exception as e:
        print(f"Error in OpenAI verification: {str(e)}")
        return False, []

async def perform_donut_ocr(pil_img):
    """
    Perform OCR using Donut model
    
    Args:
        pil_img: PIL Image object
        
    Returns:
        str: Extracted text from the image
    """
    try:
        # Check if model was loaded successfully
        if 'processor' not in globals() or 'model' not in globals():
            raise Exception("Donut model not loaded correctly")
        
        # Ensure image is in RGB format (3 dimensions)
        if pil_img.mode != 'RGB':
            pil_img = pil_img.convert('RGB')
        
        # Define a task-specific prompt for Chinese document understanding
        task_prompt = "<s_cord-v2>"
        
        # Process the image with the task-specific prompt
        pixel_values = processor(pil_img, return_tensors="pt").pixel_values.to(device)
        decoder_input_ids = processor.tokenizer(task_prompt, add_special_tokens=False, return_tensors="pt").input_ids.to(device)
        
        # Generate text from image with optimized parameters
        generated_ids = model.generate(
            pixel_values,
            decoder_input_ids=decoder_input_ids,
            max_length=256,  # Reduced for speed
            early_stopping=True,
            num_beams=3,     # Reduced for speed
            do_sample=False, # Turn off sampling for speed
            num_return_sequences=1,
            length_penalty=1.0,
            use_cache=True
        )
        
        # Decode the generated text
        donut_output = processor.batch_decode(
            generated_ids, 
            skip_special_tokens=True
        )[0]
        
        # Clean up Donut output - remove XML-like tags
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
        
        # Step 1: Preprocess image (suitable for OCR)
        print("Step 1: Preprocessing image for OCR...")
        image_variants = create_ocr_variants(original_img)
        
        # Step 2: Try pytesseract OCR on each variant
        print("Step 2: Attempting pytesseract OCR...")
        for i, img_variant in enumerate(image_variants):
            pytesseract_output = perform_pytesseract_ocr(img_variant)
            
            if pytesseract_output:
                print(f"Pytesseract OCR output for variant {i}: {pytesseract_output}")
                
                # Step 3: Analyze whether the string contains required patterns
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
                
                # Analyze Donut output
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
        
        # Last resort: Use OpenAI for direct extraction from all OCR outputs
        print("Last resort: Using OpenAI for direct extraction...")
        
        # Collect all OCR outputs
        all_outputs = []
        
        # Add pytesseract outputs
        for i, img_variant in enumerate(image_variants):
            pytesseract_output = perform_pytesseract_ocr(img_variant)
            if pytesseract_output:
                all_outputs.append(f"Pytesseract variant {i}: {pytesseract_output}")
        
        # Add donut outputs
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
                    You are a specialized OCR post-processor focused on Chinese documents.
                    Identify and extract:
                    1. Any date in format YYYY-MM-DD (or convert Chinese/ROC dates to this format)
                    2. Any ID strings in format XX-12345678 (exactly 2 letters followed by hyphen and exactly 8 digits)
                    
                    IMPORTANT CONVERSIONS:
                    - ROC calendar dates: 114-05-20 means ROC year 114 = 2025 AD (add 1911)
                    - Chinese dates: Convert YYYY年MM月DD日 to YYYY-MM-DD
                    
                    IMPORTANT DISTINCTION:
                    - Valid IDs: Two letters followed by 8 digits (e.g., AB-12345678, TE-57897732, AT-09134760)
                    - NOT Valid: Telephone numbers like TEL02-87913478, FAX-12345678
                    
                    How to tell the difference:
                    - Valid IDs have EXACTLY 2 letters followed by 8 digits
                    - Telephone numbers often have 3+ letters (TEL, FAX, PHONE)
                    - Context clues like "偵測號碼:" (Detection Number:) indicate valid IDs
                    
                    Only return these items as a JSON array with strictly formatted values.
                    Dates must be in YYYY-MM-DD format with 4-digit year and 2-digit month/day.
                    IDs must be 2 uppercase letters, hyphen, and 8 digits.
                    
                    Example: ["2023-05-21", "TE-57897732"]
                    
                    If you can't find properly formatted items, return an empty array [].
                    """},
                    {"role": "user", "content": f"Process this OCR text from a Chinese document. Look for dates (including ROC calendar like 114-05-20) and IDs in XX-12345678 format. Note that 114-05-20 should be converted to 2025-05-20 (ROC year 114 + 1911 = 2025).\n\n{combined_text}"}
                ]
            )
        )

        gpt_response = completion.choices[0].message.content.strip()
        print(f"Raw GPT response: {gpt_response}")

        # Extract the JSON array from the response
        json_match = re.search(r'\[.*?\]', gpt_response, re.DOTALL)
        if json_match:
            try:
                response_content = json.loads(json_match.group())
                # Perform final verification on the GPT response
                if len(response_content) >= 2:
                    return {"response_content": response_content, "raw_ocr_text": combined_text, "source": "gpt_final_extraction"}
            except json.JSONDecodeError:
                print("Failed to parse JSON from GPT response")
        
        # If we still have no valid results, return empty
        return {"response_content": [], "raw_ocr_text": combined_text, "source": "no_verified_results"}
        
    except Exception as e:
        print(f"Error in OCR processing: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))