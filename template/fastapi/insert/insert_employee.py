



from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path

insert_employee = APIRouter()
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

@insert_employee.post("/insert_employee")
async def read_user_credentials(
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
    image: UploadFile = File(...)
):
    # Save image file
    image_path = uploads_dir / image.filename
    try:
        with open(image_path, "wb") as file:
            file.write(await image.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not save image file")

    # Database insertion
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = """
                INSERT INTO Employee (user_id, period_date, employee_number, daily_hours, workday, overtime,
                                      sick_leave, personal_leave, business_trip, wedding_and_funeral, special_leave,
                                      remark, img_path, edit_time)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

