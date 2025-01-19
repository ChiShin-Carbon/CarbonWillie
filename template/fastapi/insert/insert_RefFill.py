from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path

# Directory to save uploaded images
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

insert_RefFill = APIRouter()

@insert_RefFill.post("/insert_RefFill")
async def insert_refill_record(
    user_id: int = Form(...),
    refrigerant_id: int = Form(...),
    Doc_date: str = Form(...),
    Doc_number: str = Form(...),
    usage: str = Form(...),
    escape_rate: float = Form(...),
    remark: str = Form(...),
    image: UploadFile = File(...)
):
    # Save the uploaded image
    image_path = uploads_dir / image.filename
    try:
        with open(image_path, "wb") as file:
            file.write(await image.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving image: {e}")

    # Database interaction
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # Construct the SQL query with VALUES and RETURNING/OUTPUT
            Ref_query = """
                INSERT INTO Refrigerant_FillRec (
                    refrigerant_id, user_id, Doc_date, Doc_number, 
                    usage, escape_rate, remark, img_path, edit_time
                ) 
                OUTPUT INSERTED.refrigerant_id 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            Ref_values = (
                refrigerant_id,
                user_id,
                Doc_date,
                Doc_number,
                usage,
                escape_rate,
                remark,
                str(image_path),
                datetime.now(),
            )
            
            # Execute the query and fetch the inserted ID
            cursor.execute(Ref_query, Ref_values)
            inserted_id = cursor.fetchone()[0]  # Assuming OUTPUT INSERTED returns the ID
            
            # Commit the transaction
            conn.commit()
            
            # Return success response with inserted ID and image path
            return {"status": "success", "refrigerant_id": inserted_id, "image_path": str(image_path)}
        except Exception as e:
            # Rollback on error
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Database insert error: {e}")
        finally:
            # Always close the connection
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection failed")
