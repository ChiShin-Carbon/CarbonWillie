from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path

uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

insert_ref = APIRouter()

@insert_ref.post("/insert_ref")
async def read_user_credentials(
    user_id: int = Form(...),
    date: str = Form(...),
    number: str = Form(...),
    device_type: int = Form(...),
    device_location: str = Form(...),
    refrigerant_type: int = Form(...),
    filling: float = Form(...),
    quantity: float = Form(...),
    leakage_rate: float = Form(...),
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
            # Ref_query using OUTPUT INSERTED.refrigerant_id
            Ref_query = """
                INSERT INTO Refrigerant (user_id, device_type, device_location, refrigerant_type, remark, img_path, edit_time)
                OUTPUT INSERTED.refrigerant_id
                VALUES (?, ?, ?, ?, ?, ?, ?);
            """
            Ref_values = (user_id, device_type, device_location, refrigerant_type, remark, str(image_path), datetime.now())
            
            # Execute the insert query and fetch the inserted ID
            cursor.execute(Ref_query, Ref_values)
            refrigerant_id = cursor.fetchone()[0]  # Fetch the ID directly from OUTPUT
            print("Retrieved refrigerant_id:", refrigerant_id)
            
            conn.commit()  # Commit the transaction if necessary


            Ref_Filling_query = """
            INSERT INTO Refrigerant_FillRec (refrigerant_id, user_id, Doc_date, Doc_number, usage, escape_rate, remark, img_path, edit_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            Ref_Filling_values = (refrigerant_id, user_id, date, number, filling, leakage_rate, remark, str(image_path), datetime.now())




            print("Executing second query:", Ref_Filling_query)
            print("With values:", Ref_Filling_values)
            cursor.execute(Ref_Filling_query, Ref_Filling_values)
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