from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

authorizedTable = APIRouter()

class AuthorizedRecord(BaseModel):
    authorized_record_id: int
    user_id: int
    table_name: str
    is_done: bool
    completed_at: Optional[datetime]
    review: int
    username: str
    department: int

@authorizedTable.get("/authorizedTable", response_model=List[AuthorizedRecord])
def get_authorized_records():
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # 1. 先取得 Baseline 表中最大的 baseline_id
            cursor.execute("SELECT MAX(baseline_id) FROM Baseline")
            result = cursor.fetchone()
            max_baseline_id = result[0] if result and result[0] is not None else None

            if max_baseline_id is None:
                # 若沒有找到基準年，回傳空列表而非拋出錯誤
                return []

            # 2. 使用該 baseline_id 查詢對應的 Authorized_Table 與 users 表資料
            query = """
                SELECT 
                    a.authorized_record_id,
                    a.user_id,
                    a.table_name,
                    a.is_done,
                    a.completed_at,
                    a.review,
                    u.username,
                    u.department
                FROM Authorized_Table a
                JOIN users u ON a.user_id = u.user_id
                WHERE a.baseline_id = ?
            """
            cursor.execute(query, (max_baseline_id,))
            records = cursor.fetchall()

            conn.close()

            if records:
                results = [
                    AuthorizedRecord(
                        authorized_record_id=record[0],
                        user_id=record[1],
                        table_name=record[2],
                        is_done=record[3],
                        completed_at=record[4].strftime("%Y-%m-%d %H:%M:%S") if isinstance(record[4], datetime) else record[4],
                        review=record[5],
                        username=record[6],
                        department=record[7]
                    )
                    for record in records
                ]
                return results
            else:
                # 若沒有找到記錄，回傳空列表而非拋出錯誤
                return []

        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error retrieving authorized records: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")