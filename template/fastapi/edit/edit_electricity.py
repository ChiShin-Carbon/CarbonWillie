from fastapi import APIRouter, HTTPException, Form
from connect.connect import connectDB
from datetime import datetime

edit_electricity = APIRouter()

@edit_electricity.post("/edit_electricity")
async def update_electricity_record(
    electricity_id: int = Form(...),
    user_id: int = Form(...),
    customer_number: str = Form(...),
    remark: str = Form(...),
):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # Update query - corrected to match the actual parameters
            update_query = """
                UPDATE Electricity
                SET user_id = ?, customer_number = ?, remark = ?, edit_time = ?
                WHERE electricity_id = ?
            """
            values = (
                user_id,
                customer_number,
                remark,
                datetime.now(),
                electricity_id,
            )
            print("Executing query:", update_query)  # Debug print
            print("With values:", values)           # Debug print

            cursor.execute(update_query, values)
            conn.commit()
            return {"status": "success", "updated_record_id": electricity_id}
        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database update error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")