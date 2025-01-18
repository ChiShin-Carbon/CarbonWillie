from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

# Directory for uploads
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

insert_extinguisher_fill = APIRouter()
@insert_extinguisher_fill.post("/insert_extinguisher_fill")
async def read_user_credentials(
    user_id: int = Form(...),
    extinguisher_id: int = Form(...),
    Doc_date: str = Form(...),
    Doc_number: str = Form(...),
    usage: str = Form(...),
    remark: str = Form(...),
    image: UploadFile = File(...),
):
    # Validate and save the uploaded image
    try:
        allowed_extensions = {".jpg", ".jpeg", ".png"}
        if Path(image.filename).suffix.lower() not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        image_path = uploads_dir / image.filename
        with open(image_path, "wb") as file:
            file.write(await image.read())
    except Exception as e:
        logging.error(f"Error saving image: {e}")
        raise HTTPException(status_code=500, detail="Could not save image file")

    # Validate Doc_date format
    try:
        formatted_doc_date = datetime.strptime(Doc_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Doc_date format. Use YYYY-MM-DD.")

    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = """
                INSERT INTO Extinguisher_FillRec (
                    extinguisher_id, user_id, Doc_date, Doc_number, usage, remark, img_path, edit_time
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """
            values = (
                extinguisher_id, user_id,
                formatted_doc_date, Doc_number, usage, remark,
                str(image_path), datetime.now()
            )

            logging.info("Executing query: %s", query)
            logging.info("With values: %s", values)

            cursor.execute(query, values)
            conn.commit()
            return {"status": "success", "image_path": str(image_path)}
        except Exception as e:
            logging.error(f"Database error: {e}")
            raise HTTPException(status_code=500, detail=f"Database insert error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        logging.error("Database connection error")
        raise HTTPException(status_code=500, detail="Database connection error")