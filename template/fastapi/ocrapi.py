from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image, ImageEnhance, ImageFilter
from transformers import DonutProcessor, VisionEncoderDecoderModel
import io
from fastapi.concurrency import run_in_threadpool
import openai
from dotenv import load_dotenv
import os
import torch
import pytesseract
import re
import logging
import warnings
from transformers import logging as transformers_logging
import numpy as np
import cv2


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
    
    # Skip the morphological operations to save time
    
    # Skip the expensive denoising step
    
    # 4. Convert back to PIL format
    enhanced_img = Image.fromarray(binary)
    
    # 5. Sharpen the image (keeping only the most effective enhancement)
    enhanced_img = enhanced_img.filter(ImageFilter.SHARPEN)
    
    return enhanced_img

def create_processing_variants(pil_img):
    """
    Create a reduced set of image variants for faster OCR processing
    
    Args:
        pil_img: PIL Image object
        
    Returns:
        list: List of preprocessed PIL Image objects (reduced for speed)
    """
    variants = []
    
    # Original image
    variants.append(pil_img)
    
    # Standard preprocessing (most effective variant)
    variants.append(preprocess_image(pil_img))
    
    # Grayscale with increased contrast (combines two previous variants)
    gray_img = pil_img.convert('L')
    contrast_enhancer = ImageEnhance.Contrast(gray_img)
    high_contrast_img = contrast_enhancer.enhance(2.0)
    variants.append(high_contrast_img)
    
    return variants

def extract_date_and_id(text):
    """
    Extract date (YYYY-MM-DD or similar formats) and ID numbers (XX-12345678 pattern) from text.
    Returns a list with the found items or None if nothing is found.
    Date is always converted to strict YYYY-MM-DD format with leading zeros.
    """
    results = []
    
    # Date patterns (handles various formats like YYYY-MM-DD, YYYY/MM/DD, etc.)
    date_pattern = r'(\d{4}[-/\.年]\d{1,2}[-/\.月]\d{1,2}日?)'
    dates = re.findall(date_pattern, text)
    
    # ID pattern (format like XX-12345678)
    id_pattern = r'([A-Za-z]{2}-\d{8})'
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
    
    # Add found IDs
    for id_str in ids:
        results.append(id_str)
    
    return results if results else None

def ocr_with_tesseract(img):
    """
    Process image with Tesseract OCR using English, Traditional Chinese, and Simplified Chinese
    """
    try:
        # Ensure img is in the right format for pytesseract
        if not isinstance(img, Image.Image):
            img = Image.open(io.BytesIO(img))
        
        # Run OCR with multiple languages
        text = pytesseract.image_to_string(img, lang='eng+chi_tra+chi_sim')
        print(f"Tesseract OCR output: {text}")
        
        # Extract date and ID information
        extracted_info = extract_date_and_id(text)
        return extracted_info, text
    except Exception as e:
        print(f"Tesseract OCR error: {e}")
        return None, ""
@ocrapi.post("/ocrapi")
async def ocr_image(image: UploadFile = File(...), fast_mode: bool = True):
    try:
        # Read the uploaded image
        img_bytes = await image.read()
        original_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        
        # Create processed variants of the image (reduced number for speed)
        image_variants = create_processing_variants(original_img)
        
        # Fast path: Try only with the optimized preprocessing variant first
        if fast_mode:
            # Use the optimized preprocessed image (second in the list)
            optimized_img = image_variants[1]
            tesseract_results, tesseract_text = ocr_with_tesseract(optimized_img)
            
            # If we got good results immediately, return them
            if tesseract_results and len(tesseract_results) >= 2:
                print(f"Fast mode success with optimized variant: {tesseract_results}")
                return {"response_content": tesseract_results, "raw_ocr_text": tesseract_text, "source": "tesseract_fast"}
        
        # If fast mode failed or is disabled, try with all variants
        best_result = None
        best_count = 0
        best_text = ""
        best_source = ""
        
        for i, img_variant in enumerate(image_variants):
            variant_name = f"variant_{i}"
            
            # Skip the optimized variant if we already tried it in fast mode
            if fast_mode and i == 1:
                continue
                
            tesseract_results, tesseract_text = ocr_with_tesseract(img_variant)
            
            if tesseract_results and len(tesseract_results) >= 2:
                if len(tesseract_results) > best_count:
                    best_count = len(tesseract_results)
                    best_result = tesseract_results
                    best_text = tesseract_text
                    best_source = f"tesseract_{variant_name}"
                    
                    # Early exit if we found good results
                    if best_count >= 2:
                        break
        
        # If we found a good result from any variant, return it
        if best_result and len(best_result) >= 2:
            print(f"Best result from {best_source}: {best_result}")
            return {"response_content": best_result, "raw_ocr_text": best_text, "source": best_source}
        
        # If no variant gave good results, try with Donut model but only if we have no results yet
        if not best_result:
            # Check if model was loaded successfully
            if 'processor' not in globals() or 'model' not in globals():
                raise HTTPException(
                    status_code=500, 
                    detail="Donut model failed to load. Check your HUGGINGFACE_TOKEN and model availability."
                )
    
            # Use the optimized image for Donut
            standard_processed_img = image_variants[1]
            
            # Define a task-specific prompt for Chinese document understanding
            task_prompt = "<s_cord-v2>"
            
            # Process the image with the task-specific prompt
            pixel_values = processor(standard_processed_img, return_tensors="pt").pixel_values.to(device)
            decoder_input_ids = processor.tokenizer(task_prompt, add_special_tokens=False, return_tensors="pt").input_ids.to(device)
            
            # Generate text from image with optimized parameters for speed
            generated_ids = model.generate(
                pixel_values,
                decoder_input_ids=decoder_input_ids,
                max_length=256,  # Reduced from 512
                early_stopping=True,
                num_beams=3,     # Reduced from 5
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
            
            print(f"Raw Donut OCR output: {donut_output}")
            
            # Try to extract from Donut output
            donut_extracted = extract_date_and_id(donut_output)
            
            # If Donut found something useful, use it
            if donut_extracted and len(donut_extracted) >= 2:
                return {"response_content": donut_extracted, "raw_ocr_text": donut_output, "source": "donut_fast"}
            
            # If Tesseract found partial results, try to combine with Donut
            if best_result and donut_extracted:
                # Combine unique results
                combined_results = list(set(best_result + donut_extracted))
                if len(combined_results) >= 2:
                    return {"response_content": combined_results, "raw_ocr_text": f"Tesseract: {best_text}\nDonut: {donut_output}", "source": "combined_fast"}
        
        # Only use GPT-4o as a last resort when all else fails
        all_texts = []
        if best_text:
            all_texts.append(f"Tesseract: {best_text}")
        elif 'donut_output' in locals():
            all_texts.append(f"Donut: {donut_output}")
        
        # Skip GPT-4o if we don't have any useful text
        if not all_texts:
            return {"response_content": [], "raw_ocr_text": "", "source": "no_results"}
            
        combined_text = "\n".join(all_texts)
        
        completion = await run_in_threadpool(
            lambda: openai.chat.completions.create(
                model="gpt-4o",  # Using the full model for better Chinese processing
                messages=[
                    {"role": "system", "content": """
                    You are a specialized OCR post-processor focused on Chinese documents.
                    Identify and extract:
                    1. Any date in format YYYY-MM-DD (or convert Chinese dates to this format)
                    2. Any ID strings in format XX-12345678
                    Only return these two items separated by a space, nothing else.
                    If you can't find both items, extract whatever you can find.
                    e.g.: ['2025/02/28', 'AB-12345678']
                    """},
                    {"role": "user", "content": f"Process this OCR text from a Chinese document. {combined_text}"}
                ]
            )
        )

        gpt_response = completion.choices[0].message.content.strip()
        print(f"Raw GPT response: {gpt_response}")

        # Check if it contains brackets as shown in example
        if gpt_response.startswith('[') and gpt_response.endswith(']'):
            # Remove brackets and split by comma
            cleaned_response = gpt_response[1:-1]  # Remove [ and ]
            items = [item.strip().strip("'\"") for item in cleaned_response.split(',')]
            response_content = items
        else:
            # Fall back to space splitting if not in expected format
            response_content = gpt_response.split()

        # Return the response as a structured array
        print(f"Processed response: {response_content}")
        return {"response_content": response_content, "raw_ocr_text": combined_text, "source": "gpt"}
        
    except Exception as e:
        print(f"Error in OCR processing: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))