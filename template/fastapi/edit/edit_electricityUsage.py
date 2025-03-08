from fastapi import APIRouter, HTTPException, UploadFile, File, Form, status
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path
from decimal import Decimal
import os
import shutil

uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

edit_ElectricityUsage = APIRouter()

@edit_ElectricityUsage.post("/edit_ElectricityUsage")
async def edit_electricity_usage(
    usage_id: int = Form(...),
    user_id: int = Form(...),
    date: str = Form(...),
    number: str = Form(...),
    start: str = Form(...),
    end: str = Form(...),
    electricity_type: int = Form(...),
    usage: Decimal = Form(...),
    amount: Decimal = Form(...),
    carbon_emission: Decimal = Form(...),
    remark: str = Form(...),
    image: UploadFile = File(None),
    existing_image: str = Form(None)
):
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
    
    cursor = conn.cursor()
    
    try:
        # First get the current record to check if we need to update the image
        current_query = "SELECT img_path FROM Electricity_Usage WHERE usage_id = ?"
        cursor.execute(current_query, (usage_id,))
        current_record = cursor.fetchone()
        
        if not current_record:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Electricity usage record not found.")
        
        # Determine image path
        img_path = current_record[0]  # Default to current path
        
        # If a new image is provided, save it and update the path
        if image and image.filename:
            try:
                # Create a unique filename to avoid conflicts
                timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
                safe_filename = f"{timestamp}_{image.filename}"
                image_path = uploads_dir / safe_filename
                
                # Save the new image
                with open(image_path, "wb") as file:
                    file.write(await image.read())
                
                # Update img_path to the new file
                img_path = str(image_path)
                
                # If there was a previous image, consider deleting it to save space
                if current_record[0] and os.path.exists(current_record[0]):
                    try:
                        os.remove(current_record[0])
                    except Exception as e:
                        print(f"Warning: Could not delete old image file: {e}")
            except Exception as e:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Could not save image file: {e}")
        
        # Update the electricity usage record
        update_query = """
            UPDATE Electricity_Usage
            SET 
                user_id = ?,
                Doc_date = ?,
                Doc_number = ?,
                period_start = ?,
                period_end = ?,
                electricity_type = ?,
                usage = ?,
                amount = ?,
                carbon_emission = ?,
                remark = ?,
                img_path = ?,
                edit_time = ?
            WHERE usage_id = ?
        """
        
        # Get current timestamp for edit_time
        edit_time = datetime.now()
        
        # Execute update query
        cursor.execute(update_query, (
            user_id, date, number, start, end, electricity_type,
            usage, amount, carbon_emission, remark, img_path, edit_time, usage_id
        ))
        
        conn.commit()
        return {"status": "success", "message": "Electricity usage record updated successfully"}
    
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating electricity usage: {str(e)}")
    
    finally:
        cursor.close()
        conn.close()