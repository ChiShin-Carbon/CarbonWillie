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
    Apply multiple preprocessing techniques to improve OCR accuracy
    
    Args:
        pil_img: PIL Image object
        
    Returns:
        PIL Image: Preprocessed image optimized for OCR
    """
    # Convert PIL to OpenCV format for advanced processing
    img = np.array(pil_img)
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    
    # 1. Resize the image if it's too small (helps with small text)
    height, width = img.shape[:2]
    min_size = 1000
    scale_factor = max(min_size / width, min_size / height)
    
    if scale_factor > 1:
        new_width = int(width * scale_factor)
        new_height = int(height * scale_factor)
        img = cv2.resize(img, (new_width, new_height), interpolation=cv2.INTER_CUBIC)
    
    # 2. Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 3. Apply adaptive thresholding
    # This works better than global thresholding for documents with varying lighting
    binary = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    
    # 4. Optional: Apply morphological operations to remove noise
    kernel = np.ones((1, 1), np.uint8)
    opening = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)
    
    # 5. Optional: Apply denoising for better results
    denoised = cv2.fastNlMeansDenoising(opening, None, 10, 7, 21)
    
    # 6. Convert back to PIL format
    enhanced_img = Image.fromarray(denoised)
    
    # 7. Enhance contrast using PIL
    enhancer = ImageEnhance.Contrast(enhanced_img)
    enhanced_img = enhancer.enhance(2.0)  # Increase contrast
    
    # 8. Sharpen the image
    enhanced_img = enhanced_img.filter(ImageFilter.SHARPEN)
    
    return enhanced_img

def create_processing_variants(pil_img):
    """
    Create multiple processed variants of the same image to increase chance of successful OCR
    
    Args:
        pil_img: PIL Image object
        
    Returns:
        list: List of preprocessed PIL Image objects
    """
    variants = []
    
    # Original image
    variants.append(pil_img)
    
    # Standard preprocessing
    variants.append(preprocess_image(pil_img))
    
    # Grayscale variant
    gray_img = pil_img.convert('L')
    variants.append(gray_img)
    
    # High contrast binary variant
    binary_img = gray_img.point(lambda x: 0 if x < 128 else 255, '1')
    variants.append(binary_img)
    
    # Sharpened variant
    sharp_img = pil_img.filter(ImageFilter.SHARPEN)
    variants.append(sharp_img)
    
    # Increased contrast variant
    contrast_enhancer = ImageEnhance.Contrast(pil_img)
    high_contrast_img = contrast_enhancer.enhance(2.5)
    variants.append(high_contrast_img)
    
    # Edge enhanced variant (helps with text boundaries)
    edge_img = pil_img.filter(ImageFilter.EDGE_ENHANCE_MORE)
    variants.append(edge_img)
    
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
async def ocr_image(image: UploadFile = File(...)):
    try:
        # Read the uploaded image
        img_bytes = await image.read()
        original_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        
        # Create multiple processed variants of the image
        image_variants = create_processing_variants(original_img)
        
        best_result = None
        best_count = 0
        best_text = ""
        best_source = ""
        
        # Try OCR on each variant to find the best result
        for i, img_variant in enumerate(image_variants):
            variant_name = f"variant_{i}"
            
            # Try with Tesseract OCR first
            tesseract_results, tesseract_text = ocr_with_tesseract(img_variant)
            
            # If Tesseract successfully extracted both date and ID, consider this a good result
            if tesseract_results and len(tesseract_results) >= 2:
                # Count how many items we found (more is better)
                if len(tesseract_results) > best_count:
                    best_count = len(tesseract_results)
                    best_result = tesseract_results
                    best_text = tesseract_text
                    best_source = f"tesseract_{variant_name}"
                    
                    # If we found 3 or more items, consider it very good and stop processing
                    if best_count >= 3:
                        break
        
        # If we found a good result from any variant, return it
        if best_result and len(best_result) >= 2:
            print(f"Best result from {best_source}: {best_result}")
            return {"response_content": best_result, "raw_ocr_text": best_text, "source": best_source}
        
        # If no variant gave good results, proceed with the standard preprocessed image for Donut
        standard_processed_img = image_variants[1]  # This is the main preprocessed variant
        
        # Check if model was loaded successfully
        if 'processor' not in globals() or 'model' not in globals():
            raise HTTPException(
                status_code=500, 
                detail="Donut model failed to load. Check your HUGGINGFACE_TOKEN and model availability."
            )

        # Define a task-specific prompt for Chinese document understanding
        task_prompt = "<s_cord-v2>"
        
        # Process the image with the task-specific prompt
        pixel_values = processor(standard_processed_img, return_tensors="pt").pixel_values.to(device)
        decoder_input_ids = processor.tokenizer(task_prompt, add_special_tokens=False, return_tensors="pt").input_ids.to(device)
        
        # Generate text from image with improved parameters for Chinese text
        generated_ids = model.generate(
            pixel_values,
            decoder_input_ids=decoder_input_ids,
            max_length=512,
            early_stopping=True,
            num_beams=5,
            do_sample=True,
            num_return_sequences=1,
            temperature=0.7,
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
        
        # If Tesseract found partial results, try to combine with Donut
        if best_result and donut_extracted:
            # Combine unique results
            combined_results = list(set(best_result + donut_extracted))
            if len(combined_results) >= 2:
                return {"response_content": combined_results, "raw_ocr_text": f"Tesseract: {best_text}\nDonut: {donut_output}", "source": "combined"}
        
        # Use GPT-4o with specific instructions for Chinese text processing
        # Include all the OCR text we've gathered for more context
        all_texts = []
        if best_text:
            all_texts.append(f"Tesseract: {best_text}")
        if donut_output:
            all_texts.append(f"Donut: {donut_output}")
        
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