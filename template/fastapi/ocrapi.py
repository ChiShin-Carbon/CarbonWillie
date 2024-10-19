from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import pytesseract
import io
import cv2
import numpy as np

ocrapi = APIRouter()

@ocrapi.post("/ocrapi")
async def ocr_image(image: UploadFile = File(...)):
    try:
        # Read and open the uploaded image
        img = Image.open(io.BytesIO(await image.read()))
        
        # Extract text using pytesseract
        text = pytesseract.image_to_string(img, lang='chi_tra+eng')

        return {"recognized_text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
