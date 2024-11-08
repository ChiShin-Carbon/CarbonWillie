from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path

insert_Nonemployee = APIRouter()
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

@insert_Nonemployee.post("/insert_Nonemployee")
async def insert_nonemployee_data(
    user_id: int = Form(...),
    month: str = Form(...),
    nonemployee_number: int = Form(...),
    total_hours: int = Form(...),
    total_days: int = Form(...),
    explain: str = Form(None),
    image: UploadFile = File(...)
):
    # Save image file
    image_path = uploads_dir / image.filename
    try:
        with open(image_path, "wb") as file:
            file.write(await image.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not save image file")

    # Convert month to datetime if needed
    try:
        period_date = datetime.strptime(month, "%Y-%m")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM.")

    # Database insertion
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = """
                INSERT INTO NonEmployee (user_id, period_date, nonemployee_number, total_hours, total_days, remark, img_path, edit_time)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """
            values = (
                user_id,
                period_date,
                nonemployee_number,
                total_hours,
                total_days,
                explain,
                str(image_path),
                datetime.now()
            )

            cursor.execute(query, values)
            conn.commit()
            return {"status": "success", "image_path": str(image_path)}
        except Exception as e:
            print("Database error:", e)
            raise HTTPException(status_code=500, detail=f"Database insert error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")
