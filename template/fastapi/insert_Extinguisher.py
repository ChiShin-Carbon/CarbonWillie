from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path

uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

insert_Extinguisher = APIRouter()

@insert_Extinguisher.post("/insert_Extinguisher")
async def read_user_credentials(
    user_id: int = Form(...),
    name: str = Form(...),
    element: int = Form(...),
    weight: float = Form(...),
    explain: str = Form(...),
    image: UploadFile = File(...),
):
    # Save the image file to the server
    image_path = uploads_dir / image.filename
    try:
        with open(image_path, "wb") as file:
            file.write(await image.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not save image file")

    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to insert data into the 'vehicle' table
            query = """
                INSERT INTO Extinguisher (user_id, item_name, ingredient, specification, remark, img_path, edit_time)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """
            values = (user_id, name, element, weight, explain, str(image_path), datetime.now())

            # Debug: Log the query and values
            print("Executing query:", query)
            print("With values:", values)

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
