from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
from transformers import DonutProcessor, VisionEncoderDecoderModel
import io
from fastapi.concurrency import run_in_threadpool
import openai
from dotenv import load_dotenv
import os
import torch
import pytesseract
import re

# Load environment variables from a .env file
load_dotenv()
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
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        
        # First try with Tesseract OCR
        tesseract_results, tesseract_text = ocr_with_tesseract(img)
        
        # If Tesseract successfully extracted both date and ID, return the result
        if tesseract_results and len(tesseract_results) >= 2:
            print(f"Tesseract successfully extracted: {tesseract_results}")
            return {"response_content": tesseract_results, "raw_ocr_text": tesseract_text, "source": "tesseract"}
        
        # If Tesseract didn't find what we need, proceed with Donut model
        print("Tesseract results insufficient, falling back to Donut model...")
        
        # Check if model was loaded successfully
        if 'processor' not in globals() or 'model' not in globals():
            raise HTTPException(
                status_code=500, 
                detail="Donut model failed to load. Check your HUGGINGFACE_TOKEN and model availability."
            )

        # Define a task-specific prompt for Chinese document understanding
        task_prompt = "<s_cord-v2>"
        
        # Process the image with the task-specific prompt
        pixel_values = processor(img, return_tensors="pt").pixel_values.to(device)
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
            temperature=0.7,  # Slightly increase diversity for complex characters
            length_penalty=1.0,  # Balanced length penalty
            use_cache=True
        )
        
        # Decode the generated text
        donut_output = processor.batch_decode(
            generated_ids, 
            skip_special_tokens=True
        )[0]
        
        print(f"Raw Donut OCR output: {donut_output}")
        
        # If Tesseract found partial results, try to complete them from Donut output
        if tesseract_results:
            # Extract from Donut output to supplement Tesseract
            donut_extracted = extract_date_and_id(donut_output)
            if donut_extracted:
                # Combine unique results
                combined_results = list(set(tesseract_results + donut_extracted))
                if len(combined_results) >= 2:
                    return {"response_content": combined_results, "raw_ocr_text": f"Tesseract: {tesseract_text}\nDonut: {donut_output}", "source": "combined"}
        
        # Use GPT-4o with specific instructions for Chinese text processing
        # This is used when neither Tesseract nor direct extraction from Donut was sufficient
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
                    {"role": "user", "content": f"Process this OCR text from a Chinese document. Tesseract: {tesseract_text}\nDonut: {donut_output}"}
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
        return {"response_content": response_content, "raw_ocr_text": f"Tesseract: {tesseract_text}\nDonut: {donut_output}", "source": "gpt"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))