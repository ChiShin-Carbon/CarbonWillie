from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path
from pydantic import BaseModel

uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

class machineRequest(BaseModel):
    machine_id: int
    user_id: int
    date: str
    number: str
    location: int
    type: float
    remark: str
    image: str

edit_machine = APIRouter()

@edit_machine.post("/edit_machine")
async def read_user_credentials(
    user_id: int = Form(...),
    machine_id: int = Form(...),
    date: str = Form(...),
    number: str = Form(...),
    location: str = Form(...),
    type: int = Form(...),
    usage: float = Form(...),
    remark: str = Form(...),
    image: UploadFile = File(...)
):
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
            # Adjust placeholder syntax based on the database library you're using
            query = """
                UPDATE Machinery SET user_id = ?, Doc_date = ?, Doc_number = ?, machinery_location = ?, energy_type = ?, usage=?, remark = ?, img_path = ?, edit_time = ?
                WHERE machinery_id = ?
            """
            values = (
                user_id,
                date,
                number,
                location,
                type,
                usage,
                remark,
                str(image_path),
                datetime.now(),
                machine_id
            )
            print("Executing query:", query)  # Debug print
            print("With values:", values)     # Debug print

            cursor.execute(query, values)
            conn.commit()
            return {"status": "success", "image_path": str(image_path)}
        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database insert error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")