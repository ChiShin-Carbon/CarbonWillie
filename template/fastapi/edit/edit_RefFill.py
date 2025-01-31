from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path

uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

edit_RefFill = APIRouter()

@edit_RefFill.post("/edit_RefFill")
async def update_emergency_record(
    user_id: int = Form(...),
    fillrec_id: int = Form(...),
    Doc_date: str = Form(...),
    Doc_number: str = Form(...),
    usage: int = Form(...),
    remark: str = Form(...),
    image: UploadFile = None
):
    
    # Handle image upload
    image_path = None
    if image:
        image_path = uploads_dir / image.filename
        try:
            with open(image_path, "wb") as file:
                file.write(await image.read())
        except Exception as e:
            raise HTTPException(status_code=500, detail="Could not save image file")

    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # Update the Emergency_Generator record
            update_query = """
                UPDATE Refrigerant_FillRec 
                SET user_id = ?, Doc_date = ?, Doc_number = ?, usage = ?, remark = ?, 
                    img_path = ?, edit_time = ?
                WHERE fillrec_id = ?
            """
            values = (
                user_id,
                Doc_date,
                Doc_number,
                usage,
                remark,
                str(image_path) if image_path else None,
                datetime.now(),
                fillrec_id,
            )

            print("Executing query:", update_query)  # Debug print
            print("With values:", values)           # Debug print

            cursor.execute(update_query, values)
            conn.commit()
            return {"status": "success", "updated_fillrec_id": fillrec_id}
        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database update error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")
