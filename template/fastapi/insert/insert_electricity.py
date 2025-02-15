from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path
from decimal import Decimal

uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

insert_electricity = APIRouter()

@insert_electricity.post("/insert_electricity")
async def read_user_credentials(
    user_id: int = Form(...),
    customer_number: str = Form(...),
    remark: str = Form(...)
):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # Adjust placeholder syntax based on the database library you're using
            query = """
                INSERT INTO Electricity (user_id, customer_number, remark, edit_time)
                VALUES (?, ?, ?, ?)"""
            values = (user_id, customer_number, remark, datetime.now())

            print("Executing query:", query)  # Debug print
            print("With values:", values)     # Debug print

            cursor.execute(query, values)
            conn.commit()
        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database insert error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")