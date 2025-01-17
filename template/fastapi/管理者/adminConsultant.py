from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB

adminConsultant = APIRouter(tags=["admin"])

@adminConsultant.get("/adminConsultant")
def read_users_with_company_info():
    conn = connectDB()  # 使用 connectDB 函數建立資料庫連線
    if conn:
        cursor = conn.cursor()
        try:
            # SQL 查詢語句，使用 JOIN 連結資料表
            query = """
                SELECT 
                    u.user_id, 
                    u.address, 
                    u.username, 
                    u.email, 
                    u.phone, 
                    u.password, 
                    cc.business_id, 
                    cc.assigned_date, 
                    ci.org_name
                FROM users u
                LEFT JOIN CompanyConsultant cc ON u.user_id = cc.user_id
                LEFT JOIN Company_Info ci ON cc.business_id = ci.business_id
                WHERE u.role = 1
            """
            cursor.execute(query)
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                # 將結果轉換為字典格式
                results = []
                for record in user_records:
                    results.append({
                        "user_id": record[0],
                        "address": record[1],
                        "username": record[2],
                        "email": record[3],
                        "phone": record[4],
                        "password": record[5],
                        "business_id": record[6],
                        "assigned_date": record[7],
                        "org_name": record[8],
                    })
                return {"users": results}
            else:
                # 若無匹配資料，返回 404 錯誤
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No user data found for role = 1")

        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user data: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
