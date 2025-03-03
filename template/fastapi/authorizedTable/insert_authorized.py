from typing import List
from fastapi import APIRouter, HTTPException, Form
from connect.connect import connectDB
from datetime import datetime

insert_authorized = APIRouter()

@insert_authorized.post("/insert_authorized")
async def insert_authorized_user(
    user_ids: List[int] = Form(...),
    table_names: List[str] = Form(...),
    is_done_list: List[int] = Form(0),  # 預設值為 0
    completed_at_list: List[datetime] = None , # 預設值為 None
):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = """
                INSERT INTO Authorized_Table (user_id, table_name, is_done, completed_at,review)
                VALUES (?, ?, ?, ?,1)
            """
            for i in range(len(user_ids)):
                values = (
                    user_ids[i],
                    table_names[i],
                    is_done_list[i] if is_done_list else 0,
                    completed_at_list[i] if completed_at_list else None,
                )
                cursor.execute(query, values)
            conn.commit()
            return {"status": "success", "message": "Records inserted successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database insert error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")




@insert_authorized.delete("/delete_authorized/{table_name}")
async def delete_authorized_table_name(table_name: str):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = "DELETE FROM Authorized_Table WHERE table_name = ?"
            cursor.execute(query, (table_name,))
            conn.commit()
            return {"status": "success", "message": f"Records with table_name '{table_name}' deleted successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database delete error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")


