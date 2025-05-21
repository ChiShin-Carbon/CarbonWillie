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

def preprocess_image(pil_img):
    """
    Apply optimized preprocessing techniques for faster OCR processing
    
    Args:
        pil_img: PIL Image object
        
    Returns:
        PIL Image: Optimized image for OCR with better speed
    """
    try:
        # Convert PIL to OpenCV format
        img = np.array(pil_img)
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
        
        # 1. Resize the image to a reasonable fixed size for faster processing
        # Using a more moderate size to balance accuracy and speed
        target_width = 800
        h, w = img.shape[:2]
        scale = target_width / w
        new_height = int(h * scale)
        img = cv2.resize(img, (target_width, new_height), interpolation=cv2.INTER_AREA)
        
        # 2. Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # 3. Apply adaptive thresholding with larger block size for speed
        binary = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 15, 2
        )
        
        # 4. Convert back to PIL format
        enhanced_img = Image.fromarray(binary)
        
        # 5. Sharpen the image (keeping only the most effective enhancement)
        enhanced_img = enhanced_img.filter(ImageFilter.SHARPEN)
        
        return enhanced_img
    except Exception as e:
        print(f"Error in image preprocessing: {str(e)}")
        # Return original image if preprocessing fails
        return pil_img

def create_processing_variants(pil_img):
    """
    Create a reduced set of image variants for faster OCR processing
    
    Args:
        pil_img: PIL Image object
        
    Returns:
        list: List of preprocessed PIL Image objects (reduced for speed)
    """
    try:
        variants = []
        
        # Original image
        variants.append(pil_img)
        
        # Standard preprocessing (most effective variant)
        try:
            variants.append(preprocess_image(pil_img))
        except Exception as e:
            print(f"Error creating preprocessed variant: {str(e)}")
        
        # Grayscale with increased contrast (combines two previous variants)
        try:
            gray_img = pil_img.convert('L')
            contrast_enhancer = ImageEnhance.Contrast(gray_img)
            high_contrast_img = contrast_enhancer.enhance(2.0)
            variants.append(high_contrast_img)
        except Exception as e:
            print(f"Error creating high contrast variant: {str(e)}")
        
        # Add a fourth variant with higher threshold
        try:
            img = np.array(pil_img)
            img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Use a higher threshold for better text extraction on light backgrounds
            _, binary_high = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
            enhanced_img_high = Image.fromarray(binary_high)
            variants.append(enhanced_img_high)
        except Exception as e:
            print(f"Error creating high threshold variant: {str(e)}")
        
        return variants
    except Exception as e:
        print(f"Error in creating image variants: {str(e)}")
        # Return only original image if processing fails
        return [pil_img]

def extract_date_and_id(text):
    """
    Extract date (YYYY-MM-DD or similar formats) and ID numbers (XX-12345678 pattern) from text.
    Returns a list with the found items or None if nothing is found.
    Date is always converted to strict YYYY-MM-DD format with leading zeros.
    
    This function DOES recognize IDs like TE-57897732 as valid IDs if they follow the
    XX-12345678 pattern, but does not recognize telephone numbers like TEL02-87913478.
    """
    results = []
    
    # Date patterns (handles various formats like YYYY-MM-DD, YYYY/MM/DD, etc.)
    date_pattern = r'(\d{4}[-/\.年]\d{1,2}[-/\.月]\d{1,2}日?)'
    dates = re.findall(date_pattern, text)
    
    # ID pattern - Modified to better match the expected format
    # Look for two letter codes followed by a hyphen (optional) and 8 digits
    # Also look for IDs with context (e.g., "偵測號碼: AT-09134760")
    id_pattern = r'(?:偵測號碼[:：]?\s*)?(?<!\w)([A-Za-z]{2})[-]?(\d{8})(?!\w)'
    
    # Find all ID pattern matches
    ids = re.findall(id_pattern, text)
    
    # Add found dates (convert to standard format if needed)
    for date in dates:
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
        else:
            # If we can't parse it properly, skip this date
            print(f"Skipping unparseable date: {date}")
    
    # Add found IDs with standard format (2 letters, hyphen, 8 digits)
    for id_match in ids:
        # Now id_match is a tuple with (letters, digits)
        letters = id_match[0].upper()
        digits = id_match[1]
        
        # Ensure the ID follows the correct pattern: 2 letters, hyphen, 8 digits
        # This will accept codes like TE-57897732 but will filter telephone numbers by context
        # We're no longer filtering out "TE" as it can be a valid ID prefix
        formatted_id = f"{letters}-{digits}"
        
        # Check if this looks like a telephone number by examining surrounding context
        # We already filtered out by pattern, so we trust this is a proper ID
        results.append(formatted_id)
    
    return results if results else None

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
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": """
                    You are a data validator for OCR text extracted from Chinese documents. Your task is to:
                    
                    1. Find dates in YYYY-MM-DD format (e.g., 2025-05-20)
                    2. Find ID codes in XX-12345678 format (e.g., TE-57897732, AT-09134760)
                    
                    Look for patterns like:
                    - Dates might appear as YYYY-MM-DD, YYYY/MM/DD, or YYYY年MM月DD日
                    - IDs might appear with or without dashes, e.g., AT09134760 or AT-09134760
                    
                    IMPORTANT DISTINCTION:
                    - Valid IDs: Two letters followed by 8 digits (e.g., TE-57897732, AT-09134760)
                    - NOT Valid: Telephone numbers like TEL02-87913478, FAX-12345678, TEL03-12345678, PHONE-12345678
                    
                    How to tell the difference:
                    - Valid IDs have EXACTLY 2 letters followed by 8 digits
                    - Telephone numbers often have 3+ letters (TEL, FAX, PHONE) or context indicating they are telephone numbers
                    - Context clues like "偵測號碼:" (Detection Number:) indicate valid IDs
                    
                    Convert and fix formatting to:
                    - Strict YYYY-MM-DD format for dates
                    - XX-12345678 format for IDs (exactly 2 letters, followed by hyphen, followed by 8 digits)
                    
                    Return a JSON array containing ONLY properly formatted items.
                    Example: ["2025-05-20", "TE-57897732", "AT-09134760"]
                    
                    If you find candidates that don't perfectly match but are close, fix them and include them.
                    """},
                    {"role": "user", "content": f"I extracted these items: {items_str}\n\nHere's the raw OCR text for additional context:\n\n{raw_text}\n\nExtract valid dates (YYYY-MM-DD) and IDs (XX-12345678). Remember that IDs like TE-57897732 and AT-09134760 are valid but telephone numbers should be excluded."}
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

@ocrapi.post("/ocrapi")
async def ocr_image(image: UploadFile = File(...)):
    try:
        # Read the uploaded image
        img_bytes = await image.read()
        original_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        
        # Create processed variants of the image
        image_variants = create_processing_variants(original_img)
        
        # Try with each image variant using Donut model
        for i, img_variant in enumerate(image_variants):
            # Check if model was loaded successfully
            if 'processor' not in globals() or 'model' not in globals():
                raise HTTPException(status_code=500, detail="Donut model not loaded correctly")
            
            # Define a task-specific prompt for Chinese document understanding
            task_prompt = "<s_cord-v2>"
            
            # Process the image with the task-specific prompt
            pixel_values = processor(img_variant, return_tensors="pt").pixel_values.to(device)
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
            
            print(f"Donut OCR output for variant {i}: {donut_output}")
            
            # Try to extract from Donut output
            donut_extracted = extract_date_and_id(donut_output)
            
            # If Donut found something, verify with OpenAI
            if donut_extracted and len(donut_extracted) > 0:
                is_valid, verified_data = await verify_with_openai(donut_extracted, donut_output)
                
                if is_valid:
                    return {
                        "response_content": verified_data, 
                        "raw_ocr_text": donut_output, 
                        "source": f"donut_variant_{i}_verified"
                    }
        
        # If no variant yielded valid results, try direct GPT-4o extraction
        # Use the raw text from the original image variant
        original_output = processor.batch_decode(
            model.generate(
                processor(image_variants[0], return_tensors="pt").pixel_values.to(device),
                decoder_input_ids=processor.tokenizer("<s_cord-v2>", add_special_tokens=False, return_tensors="pt").input_ids.to(device),
                max_length=256,
                early_stopping=True,
                num_beams=3,
                do_sample=False,
                num_return_sequences=1,
            ), 
            skip_special_tokens=True
        )[0]
        
        # Try direct extraction with OpenAI as a last resort
        dummy_list = ["placeholder"]
        is_valid, verified_data = await verify_with_openai(dummy_list, original_output)
        
        if is_valid:
            return {
                "response_content": verified_data, 
                "raw_ocr_text": original_output, 
                "source": "gpt4o_direct_extraction"
            }
        
        # Final fallback: use GPT-4o with all collected donut outputs
        all_outputs = []
        for i, img_variant in enumerate(image_variants):
            try:
                output = processor.batch_decode(
                    model.generate(
                        processor(img_variant, return_tensors="pt").pixel_values.to(device),
                        decoder_input_ids=processor.tokenizer("<s_cord-v2>", add_special_tokens=False, return_tensors="pt").input_ids.to(device),
                        max_length=256,
                        early_stopping=True,
                        num_beams=3,
                        do_sample=False,
                        num_return_sequences=1,
                    ), 
                    skip_special_tokens=True
                )[0]
                all_outputs.append(f"Variant {i}: {output}")
            except Exception as e:
                print(f"Error processing variant {i}: {e}")
        
        combined_text = "\n".join(all_outputs)
        
        completion = await run_in_threadpool(
            lambda: openai.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": """
                    You are a specialized OCR post-processor focused on Chinese documents.
                    Identify and extract:
                    1. Any date in format YYYY-MM-DD (or convert Chinese dates to this format)
                    2. Any ID strings in format XX-12345678 (exactly 2 letters followed by hyphen and exactly 8 digits)
                    
                    IMPORTANT DISTINCTION:
                    - Valid IDs: Two letters followed by 8 digits (e.g., TE-57897732, AT-09134760)
                    - NOT Valid: Telephone numbers like TEL02-87913478, FAX-12345678
                    
                    How to tell the difference:
                    - Valid IDs have EXACTLY 2 letters followed by 8 digits
                    - Telephone numbers often have 3+ letters (TEL, FAX, PHONE)
                    - Context clues like "偵測號碼:" (Detection Number:) indicate valid IDs
                    
                    Only return these items as a JSON array with strictly formatted values.
                    Dates must be in YYYY-MM-DD format with 4-digit year and 2-digit month/day.
                    IDs must be 2 uppercase letters, hyphen, and 8 digits.
                    
                    Example: ["2023-05-21", "TE-57897732", "AT-09134760"]
                    
                    If you can't find properly formatted items, return an empty array [].
                    """},
                    {"role": "user", "content": f"Process this OCR text from a Chinese document. Look for dates in YYYY-MM-DD format and IDs in XX-12345678 format. Remember that IDs like TE-57897732 and AT-09134760 are valid but telephone numbers should be excluded.\n\n{combined_text}"}
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
                    return {"response_content": response_content, "raw_ocr_text": combined_text, "source": "gpt_verified"}
            except json.JSONDecodeError:
                print("Failed to parse JSON from GPT response")
        
        # If we still have no valid results, return empty
        return {"response_content": [], "raw_ocr_text": combined_text, "source": "no_verified_results"}
        
    except Exception as e:
        print(f"Error in OCR processing: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))