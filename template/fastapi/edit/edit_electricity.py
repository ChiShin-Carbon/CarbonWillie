from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path

uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

edit_electricity = APIRouter()

@edit_electricity.post("/edit_electricity")
async def update_electricity_record(
    record_id: int = Form(...),
    user_id: int = Form(...),
    date: str = Form(...),
    number: str = Form(...),
    start: str = Form(...),
    end: str = Form(...),
    usage: float = Form(...),
    amount: float = Form(...),
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
            # Update query
            update_query = """
                UPDATE Electricity_Usage
                SET user_id = ?, Doc_date = ?, Doc_number = ?, period_start = ?, period_end = ?, 
                    usage = ?, amount = ?, remark = ?, img_path = ?, edit_time = ?
                WHERE record_id = ?
            """
            values = (
                user_id,
                date,
                number,
                start,
                end,
                usage,
                amount,
                remark,
                str(image_path) if image_path else None,
                datetime.now(),
                record_id,
            )
            print("Executing query:", update_query)  # Debug print
            print("With values:", values)           # Debug print

            cursor.execute(update_query, values)
            conn.commit()
            return {"status": "success", "updated_record_id": record_id}
        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database update error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")
