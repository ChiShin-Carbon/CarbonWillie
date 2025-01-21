from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path

uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

edit_Ref = APIRouter()

@edit_Ref.post("/edit_Ref")
async def update_emergency_record(
    refrigerant_id: int = Form(...),
    user_id: int = Form(...),
    device_type: int = Form(...),
    device_location: str = Form(...),
    refrigerant_type: str = Form(...),
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
                UPDATE Refrigerant 
                SET user_id = ?, device_type = ?, device_location = ?, refrigerant_type = ?, remark = ?, 
                    img_path = ?, edit_time = ?
                WHERE refrigerant_id = ?
            """
            values = (
                user_id,
                device_type,
                device_location,
                refrigerant_type,
                remark,
                str(image_path) if image_path else None,
                datetime.now(),
                refrigerant_id,
            )

            print("Executing query:", update_query)  # Debug print
            print("With values:", values)           # Debug print

            cursor.execute(update_query, values)
            conn.commit()
            return {"status": "success", "updated_refrigerant_id": refrigerant_id}
        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database update error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")
