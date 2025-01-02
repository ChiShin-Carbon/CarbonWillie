from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path

uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

edit_Selling_waste = APIRouter()

@edit_Selling_waste.put("/edit_Selling_waste")
async def update_Selling_waste_record(
    selling_waste_id: int = Form(...),
    waste_item: str = Form(None),
    remark: str = Form(None),
    image: UploadFile = File(None)
):
    # Save the uploaded image if provided
    image_path = None
    if image:
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
            # Create dynamic SQL query for updating fields
            update_fields = []
            values = []

            if waste_item is not None:
                update_fields.append("waste_item = ?")
                values.append(waste_item)

            if remark is not None:
                update_fields.append("remark = ?")
                values.append(remark)

            if image_path:
                update_fields.append("img_path = ?")
                values.append(str(image_path))

            # Always update the edit_time
            update_fields.append("edit_time = ?")
            values.append(datetime.now())

            if not update_fields:
                raise HTTPException(status_code=400, detail="No fields to update")

            # Add the condition for selling_waste_id
            values.append(selling_waste_id)
            query = f"""
                UPDATE Selling_Waste
                SET {', '.join(update_fields)}
                WHERE id = ?
            """

            print("Executing query:", query)  # Debug print
            print("With values:", values)     # Debug print

            cursor.execute(query, values)
            conn.commit()

            # Check if any row was updated
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Selling waste record not found")

            return {"status": "success", "message": "Selling waste record updated successfully"}

        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database update error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")
