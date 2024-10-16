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
        
        # Convert image to NumPy array
        img_np = np.array(img)

        # Remove alpha channel if present (RGBA to RGB)
        if img_np.shape[-1] == 4:
            img_np = img_np[:, :, :3]

        # Convert to grayscale for better OCR accuracy
        img_gray = cv2.cvtColor(img_np, cv2.COLOR_BGR2GRAY)

        # Extract text using pytesseract
        text = pytesseract.image_to_string(img_gray, lang='chi_tra+eng')

        return {"recognized_text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
