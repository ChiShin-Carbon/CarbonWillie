from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path

edit_dir = Path("uploads")
edit_dir.mkdir(exist_ok=True)
edit_Ref = APIRouter()

@edit_Ref.post("/edit_Ref")
async def update_emergency_record(
    refrigerant_id: int = Form(...),
    user_id: int = Form(...),
    device_type: int = Form(...),
    device_location: str = Form(...),
    refrigerant_type: str = Form(...),
    remark: str = Form(...),
    image: UploadFile = File(None),  # For new image uploads
    existing_image: str = Form(None)  # Add this parameter for existing images)
    ):
    
    image_path = None
    # Handle new image upload
    if image:
        image_path = edit_dir / image.filename
        try:
            with open(image_path, "wb") as file:
                file.write(await image.read())
        except Exception as e:
            raise HTTPException(status_code=500, detail="Could not save image file")
    # Use existing image if no new image uploaded
    elif existing_image:
        image_path = existing_image

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
