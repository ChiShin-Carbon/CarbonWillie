from typing import List
from fastapi import APIRouter, HTTPException, Form
from connect.connect import connectDB
from datetime import datetime

edit_authorized = APIRouter()

@edit_authorized.delete("/editDelete_authorized/{table_name}")
async def editDelete_authorized_user(
    table_name: str,
    user_id: str
):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # 查詢最大 baseline_id
            cursor.execute("SELECT MAX(baseline_id) FROM Baseline")
            max_baseline_id = cursor.fetchone()[0]

            if max_baseline_id is None:
                raise HTTPException(status_code=404, detail="No baseline records found")

            # 針對該 baseline_id 執行刪除
            query = """
                DELETE FROM Authorized_Table 
                WHERE table_name = ? AND user_id = ? AND baseline_id = ?
            """
            cursor.execute(query, (table_name, user_id, max_baseline_id))
            conn.commit()

            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="No matching record found to delete")

            return {
                "status": "success",
                "message": f"Record for user_id {user_id} in table '{table_name}' (baseline_id={max_baseline_id}) deleted successfully"
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database delete error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")


    
@edit_authorized.put("/editUpdate_authorized/{table_name}")
async def editUpdate_authorized_user(
    table_name: str,
    body: dict
):
    old_user_id = body.get('old_user_id')
    new_user_id = body.get('new_user_id')

    if old_user_id is None or new_user_id is None:
        raise HTTPException(status_code=400, detail="Missing required fields")

    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # 查詢最大 baseline_id
            cursor.execute("SELECT MAX(baseline_id) FROM Baseline")
            max_baseline_id = cursor.fetchone()[0]

            if max_baseline_id is None:
                raise HTTPException(status_code=404, detail="No baseline records found")

            query = """
                UPDATE Authorized_Table
                SET user_id = ?
                WHERE table_name = ? AND user_id = ? AND baseline_id = ?
            """
            cursor.execute(query, (new_user_id, table_name, old_user_id, max_baseline_id))
            conn.commit()

            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="No matching record found to update")

            return {
                "status": "success",
                "message": f"User updated successfully in table '{table_name}' (baseline_id={max_baseline_id})"
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database update error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")



@edit_authorized.post("/editInsert_authorized/{table_name}")
async def editInsert_authorized_user(
    table_name: str,
    body: dict  # 接收 JSON 請求的 body
):
    user_id = body.get('user_id')
    is_done = body.get('is_done', 0)  # 預設為 0，若有傳入則覆蓋
    completed_at = body.get('completed_at') or None  # 預設為 None，若有傳入則覆蓋

    if user_id is None:
        raise HTTPException(status_code=400, detail="Missing required user_id field")

    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # 先查詢 Baseline 資料表中最大的 baseline_id
            cursor.execute("SELECT MAX(baseline_id) FROM Baseline")
            result = cursor.fetchone()
            max_baseline_id = result[0] if result[0] is not None else 0

            insert_query = """
                    INSERT INTO Authorized_Table (table_name, user_id, is_done, completed_at, review, baseline_id)
                    VALUES (?, ?, ?, ?, 1, ?)
                """
            cursor.execute(insert_query, (table_name, user_id, is_done, completed_at, max_baseline_id))
            conn.commit()
            return {
                "status": "success", 
                "message": f"Record inserted successfully for user_id {user_id} in table '{table_name}'",
                "baseline_id": max_baseline_id
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database insert error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")