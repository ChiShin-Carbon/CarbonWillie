from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path
from pydantic import BaseModel

edit_nonemployee = APIRouter()
edit_dir = Path("uploads")
edit_dir.mkdir(exist_ok=True)

class NonEmployeeRequest(BaseModel):
    nonemployee_id: int
    user_id: int
    month: str
    nonemployee: int
    total_hours: int
    total_day: int
    explain: str
    image: str

@edit_nonemployee.post("/edit_nonemployee")
async def update_nonemployee_record(
    nonemployee_id: int = Form(...),
    user_id: int = Form(...),
    month: str = Form(...),
    nonemployee: int = Form(...),
    total_hours: int = Form(...),
    total_day: int = Form(...),
    explain: str = Form(None),
    image: UploadFile = File(None),  # For new image uploads
    existing_image: str = Form(None)  # Add this parameter for existing images)
):
    # Handle image upload
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

    # Database update
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # Update query
            update_query = """
                UPDATE NonEmployee
                SET user_id = ?, period_date = ?, nonemployee_number = ?, total_hours = ?, total_days = ?,
                    remark = ?, img_path = ?, edit_time = ?
                WHERE nonemployee_id = ?
            """
            values = (
                user_id,
                month,
                nonemployee,
                total_hours,
                total_day,
                explain,
                str(image_path) if image_path else None,
                datetime.now(),
                nonemployee_id,
            )

            cursor.execute(update_query, values)
            conn.commit()
            return {"status": "success", "updated_nonemployee_id": nonemployee_id}
        except Exception as e:
            print("Database error:", e)
            raise HTTPException(status_code=500, detail=f"Database update error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")
