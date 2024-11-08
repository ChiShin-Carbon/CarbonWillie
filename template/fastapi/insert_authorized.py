from fastapi import APIRouter, HTTPException, Form
from connect.connect import connectDB
from datetime import datetime

insert_authorized = APIRouter()

@insert_authorized.post("/insert_authorized")
async def insert_authorized_user(
    user_id: int = Form(...),
    table_name: str = Form(...),
    is_done: int = Form(0),  # Default value for is_done is 0
    completed_at: datetime = None  # Default value for complete_at is None (which will be stored as NULL in the database)
):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = """
                INSERT INTO Authorized_Table (user_id, table_name, is_done, completed_at)
                VALUES (?, ?, ?, ?)
            """
            values = (user_id, table_name, is_done, completed_at)
            cursor.execute(query, values)
            conn.commit()
            return {"status": "success", "message": "Record inserted successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database insert error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")

