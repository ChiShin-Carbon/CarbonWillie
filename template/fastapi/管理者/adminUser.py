from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from fastapi.middleware.cors import CORSMiddleware

adminUser = APIRouter(tags=["admin"])
@adminUser.get("/adminUser/{business_id}")
def read_users_by_business_id(business_id: str):
    conn = connectDB()  # 使用您的 connectDB 函數建立資料庫連線
    if conn:
        cursor = conn.cursor()
        try:
            # SQL 查詢語句，改用 '?' 作為佔位符
            query = """
                SELECT 
                    address, username, email, telephone, phone, department, position
                FROM users
                WHERE business_id = ? AND role = 2
            """
            cursor.execute(query, (business_id,))
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                # 將結果轉換為字典格式
                results = []
                for record in user_records:
                    results.append({
                        "address": record[0],
                        "username": record[1],
                        "email": record[2],
                        "telephone": record[3],
                        "phone": record[4],
                        "department": record[5],
                        "position": record[6]
                    })
                return {"users": results}
            else:
                # 若無匹配資料，返回 404 錯誤
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No user data found for the given business_id")

        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user data: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
