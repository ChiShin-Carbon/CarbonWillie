from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path
from pydantic import BaseModel


edit_employee = APIRouter()
edit_dir = Path("uploads")
edit_dir.mkdir(exist_ok=True)
class EmployeeRequest(BaseModel):
    employee_id: int
    user_id: int
    month: str
    employee: int
    daily_hours: int
    workday: int
    overtime: float
    sick: float
    personal: float
    business: float
    funeral: float
    special: float
    explain: str
    image: str

@edit_employee.post("/edit_employee")
async def update_employee_record(
    employee_id: int = Form(...),
    user_id: int = Form(...),
    month: str = Form(...),
    employee: int = Form(...),
    daily_hours: int = Form(...),
    workday: int = Form(...),
    overtime: float = Form(...),
    sick: float = Form(...),
    personal: float = Form(...),
    business: float = Form(...),
    funeral: float = Form(...),
    special: float = Form(...),
    explain: str = Form(None),
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

    # Database update
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # Update query
            update_query = """
                UPDATE Employee
                SET user_id = ?, period_date = ?, employee_number = ?, daily_hours = ?, workday = ?, 
                    overtime = ?, sick_leave = ?, personal_leave = ?, business_trip = ?, 
                    wedding_and_funeral = ?, special_leave = ?, remark = ?, img_path = ?, edit_time = ?
                WHERE employee_id = ?
            """
            values = (
                user_id,
                month,
                employee,
                daily_hours,
                workday,
                overtime,
                sick,
                personal,
                business,
                funeral,
                special,
                explain,
                str(image_path) if image_path else None,
                datetime.now(),
                employee_id,
            )

            cursor.execute(update_query, values)
            conn.commit()
            return {"status": "success", "updated_employee_id": employee_id}
        except Exception as e:
            print("Database error:", e)
            raise HTTPException(status_code=500, detail=f"Database update error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")
