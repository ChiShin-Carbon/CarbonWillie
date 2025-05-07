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
            # 先查詢 Baseline 資料表中最大的 baseline_id
            cursor.execute("SELECT MAX(baseline_id) FROM Baseline")
            result = cursor.fetchone()
            max_baseline_id = result[0] if result[0] is not None else 0
            
            query = """
                INSERT INTO Authorized_Table (user_id, table_name, is_done, completed_at, review, baseline_id)
                VALUES (?, ?, ?, ?, 1, ?)
            """
            for i in range(len(user_ids)):
                values = (
                    user_ids[i],
                    table_names[i],
                    is_done_list[i] if is_done_list else 0,
                    completed_at_list[i] if completed_at_list else None,
                    max_baseline_id,  # 添加最新的 baseline_id
                )
                cursor.execute(query, values)
            conn.commit()
            return {"status": "success", "message": "Records inserted successfully", "baseline_id": max_baseline_id}
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
            # 查詢最大 baseline_id
            cursor.execute("SELECT MAX(baseline_id) FROM Baseline")
            max_baseline_id = cursor.fetchone()[0]

            if max_baseline_id is None:
                raise HTTPException(status_code=404, detail="No baseline records found")

            # 刪除該 baseline_id 對應 table_name 的資料
            query = "DELETE FROM Authorized_Table WHERE table_name = ? AND baseline_id = ?"
            cursor.execute(query, (table_name, max_baseline_id))
            conn.commit()

            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail=f"No matching records found in table '{table_name}' with baseline_id {max_baseline_id}")

            return {
                "status": "success",
                "message": f"Records with table_name '{table_name}' and baseline_id {max_baseline_id} deleted successfully"
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database delete error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")

