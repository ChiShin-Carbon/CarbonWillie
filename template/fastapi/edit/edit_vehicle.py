from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path
from pydantic import BaseModel

edit_dir = Path("uploads")
edit_dir.mkdir(exist_ok=True)

class vehicleRequest(BaseModel):
    VehicleRequest_id: int
    user_id: int
    date: str
    number: str
    oil_species: int
    liters: float
    remark: str
    image: str

edit_vehicle = APIRouter()

@edit_vehicle.post("/edit_vehicle")
async def update_vehicle_record(
    vehicle_id: int,
    user_id: int = Form(...),
    date: str = Form(...),
    number: str = Form(...),
    oil_species: int = Form(...),
    liters: float = Form(...),
    remark: str = Form(...),
    image: UploadFile = None
):
    image_path = None
    if image:
        image_path = edit_dir / image.filename
        try:
            with open(image_path, "wb") as file:
                file.write(await image.read())
        except Exception as e:
            raise HTTPException(status_code=500, detail="Could not save image file")

    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # Update the Vehicle record
            update_query = """
                UPDATE vehicle
                SET user_id = ?, Doc_date = ?, Doc_number = ?, oil_species = ?, liters = ?, remark = ?, img_path = ?, edit_time = ?
                WHERE vehicle_id = ?
            """
            values = (
                user_id, date, number, oil_species, liters, remark, str(image_path) if image_path else None, datetime.now(), vehicle_id
            )

            cursor.execute(update_query, values)
            conn.commit()

            

            return {"status": "success", "updated_vehicle_id": vehicle_id}
        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database update error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")