from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path

uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

insert_BusinessTrip = APIRouter()

@insert_BusinessTrip.post("/insert_BusinessTrip")
async def read_user_credentials(
    user_id: int = Form(...),
    transportation: int = Form(...),
    oil_species: int = Form(...),
    kilometers: float = Form(...),
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
                INSERT INTO Business_Trip (user_id, transportation, oil_species, kilometers, remark, img_path, edit_time)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """
            values = (user_id, transportation, oil_species, kilometers, remark, str(image_path), datetime.now())

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