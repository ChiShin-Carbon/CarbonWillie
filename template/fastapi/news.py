from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

news = APIRouter()

# 定義請求體結構
class DateInput(BaseModel):
    today_news_date: str  # 接受日期，格式應為 'YYYY-MM-DD'

# POST請求資料結構，接受新增新聞所需的所有欄位
class NewsData(BaseModel):
    news_title: str
    news_url: str
    news_summary: str
    news_date: str  # 接收今天的日期

@news.get("/news")
def get_news_by_date(today_news_date: str):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # 安全的 SQL 查詢，避免 SQL 注入
            query = "SELECT news_id, news_title, news_url, news_summary, news_date, today_news_date FROM news WHERE today_news_date = ?"
            cursor.execute(query, (today_news_date,))  # 使用傳入的 today_news_date 查詢
            news_records = cursor.fetchall()
            conn.close()

            if news_records:
                # 將結果轉換為字典
                result = [
                    {"news_id": record[0],
                     "news_title": record[1],
                     "news_url": record[2],
                     "news_summary": record[3],
                     "news_date": record[4],
                     "today_news_date": record[5],
                    }
                    for record in news_records
                ]
                return {"news": result}
            else:
                # 若沒有新聞，返回空結果並提示
                return {"news": [], "message": "No news found for today."}
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")

@news.post("/news")
def post_news(news_data: NewsData):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # 檢查今天是否已有新聞
            check_query = """
                SELECT COUNT(*) FROM news WHERE today_news_date = ?
            """
            cursor.execute(check_query, (news_data.news_date,))
            count = cursor.fetchone()[0]

            if count > 0:
                return {"message": "News for today already exists."}

            # 若今天沒有新聞，插入新新聞
            insert_query = """
                INSERT INTO news (news_title, news_url, news_summary, news_date, today_news_date)
                VALUES (?, ?, ?, ?, GETDATE())
            """
            cursor.execute(insert_query, (
                news_data.news_title,
                news_data.news_url,
                news_data.news_summary,
                news_data.news_date
            ))
            conn.commit()
            print(f"News saved: {news_data['news_title']}")  # 日誌記錄
            
            return {"message": "News added successfully."}

        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error adding news: {e}")
        finally:
            conn.close()
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
@news.delete("/news")
def delete_news(today_news_date: str):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # 查詢是否存在要刪除的新聞
            check_query = "SELECT COUNT(*) FROM news WHERE today_news_date = ?"
            cursor.execute(check_query, (today_news_date,))
            count = cursor.fetchone()[0]

            if count == 0:
                return {"message": "No news found for the specified date."}

            # 刪除指定日期的新聞
            delete_query = "DELETE FROM news WHERE today_news_date = ?"
            cursor.execute(delete_query, (today_news_date,))
            conn.commit()
            conn.close()
            return {"message": "News deleted successfully."}

        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error deleting news: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")

#新加的
@news.get("/filtered-news")
def get_or_generate_today_news(today_news_date: str):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # 檢查今天是否已有新聞
            check_query = "SELECT COUNT(*) FROM news WHERE today_news_date = ?"
            cursor.execute(check_query, (today_news_date,))
            count = cursor.fetchone()[0]

            if count > 0:
                # 如果有資料，返回資料庫中的新聞
                query = "SELECT news_id, news_title, news_url, news_summary, news_date, today_news_date FROM news WHERE today_news_date = ?"
                cursor.execute(query, (today_news_date,))
                news_records = cursor.fetchall()
                conn.close()

                result = [
                    {"news_id": record[0],
                     "news_title": record[1],
                     "news_url": record[2],
                     "news_summary": record[3],
                     "news_date": record[4],
                     "today_news_date": record[5],
                    }
                    for record in news_records
                ]
                return {"news": result, "message": "Fetched news from the database."}
            else:
                # 如果沒有資料，生成新的新聞，並存入資料庫
                # 調用前端模擬的生成新聞方法
                return {"news": [], "message": "No news found for today. Please generate and save news."}

        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error processing news: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
