from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path

edit_dir = Path("uploads")
edit_dir.mkdir(exist_ok=True)

edit_commute = APIRouter()

@edit_commute.post("/edit_commute")
async def update_emergency_record(
    commute_id: int = Form(...),
    user_id: int = Form(...),
    transportation: int = Form(...),
    oil_species: int = Form(...),
    kilometers: float = Form(...),
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
                UPDATE Commute
                SET user_id = ?, transportation = ?, oil_species = ?, kilometers = ?, remark = ?, 
                    img_path = ?, edit_time = ?
                WHERE commute_id = ?
            """
            values = (
                user_id,
                transportation,
                oil_species,
                kilometers,
                remark,
                str(image_path) if image_path else None,
                datetime.now(),
                commute_id,
            )

            print("Executing query:", update_query)  # Debug print
            print("With values:", values)           # Debug print

            cursor.execute(update_query, values)
            conn.commit()
            return {"status": "success", "updated_commute_id": commute_id}
        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database update error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")
