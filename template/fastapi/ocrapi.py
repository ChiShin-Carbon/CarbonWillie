from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import pytesseract
import io
from fastapi.concurrency import run_in_threadpool
import openai
import json

ocrapi = APIRouter()

@ocrapi.post("/ocrapi")
async def ocr_image(image: UploadFile = File(...)):
    try:
        # Read and open the uploaded image
        img = Image.open(io.BytesIO(await image.read()))
        
        # Extract text using pytesseract
        text = pytesseract.image_to_string(img, lang='chi_tra+eng')

        # Request a summary of the receipt in array format
        completion = await run_in_threadpool(
            openai.ChatCompletion.create,
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"Extract a date data 'yyyy-mm' and and a string in 'XX-12345678' format. Only output this without extra text. and use space to split two data {text}"}
            ]
        )

        response_content = completion.choices[0].message.content.split(" ")

        # Return the response as a structured array
        return {"response_content": response_content}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
