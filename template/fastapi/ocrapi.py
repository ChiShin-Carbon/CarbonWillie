from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
from transformers import DonutProcessor, VisionEncoderDecoderModel
import io
from fastapi.concurrency import run_in_threadpool
import openai
from dotenv import load_dotenv
import os
import torch

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

@ocrapi.post("/ocrapi")
async def ocr_image(image: UploadFile = File(...)):
    try:
        # Check if model was loaded successfully
        if 'processor' not in globals() or 'model' not in globals():
            raise HTTPException(
                status_code=500, 
                detail="Donut model failed to load. Check your HUGGINGFACE_TOKEN and model availability."
            )

        # Read and process the uploaded image
        img_bytes = await image.read()
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        
        # Define a task-specific prompt for Chinese document understanding
        # This prompt can be adjusted based on the specific document type
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
        output = processor.batch_decode(
            generated_ids, 
            skip_special_tokens=True
        )[0]
        
        print(f"Raw OCR output: {output}")
        
        # Use GPT-4o with specific instructions for Chinese text processing
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
                    {"role": "user", "content": f"Process this OCR text from a Chinese document: {output}"}
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
        return {"response_content": response_content, "raw_ocr_text": output}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
#@inproceedings{kim2022donut,
#  title     = {OCR-Free Document Understanding Transformer},
#  author    = {Kim, Geewook and Hong, Teakgyu and Yim, Moonbin and Nam, JeongYeon and Park, Jinyoung and Yim, Jinyeong and Hwang, Wonseok and Yun, Sangdoo and Han, Dongyoon and Park, Seunghyun},
#  booktitle = {European Conference on Computer Vision (ECCV)},
#  year      = {2022}
#}
