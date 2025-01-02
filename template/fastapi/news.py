from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
news = APIRouter()

# 定義請求體結構
class DateInput(BaseModel):
    today_news_date: str  # 接受日期，格式應為 'YYYY-MM-DD'

# POST請求資料結構，接受新增新聞所需的所有欄位
class NewsData(BaseModel):
    news_title: str
    news_url: str
    news_summary: str
    news_date: str  

@news.get("/news")
def get_news():
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # 使用 SELECT * 查詢所有資料
            query = "SELECT * FROM news"
            cursor.execute(query)  # 這樣就不需要傳入 today_news_date
            news_records = cursor.fetchall()
            conn.close()

            if news_records:
                # 將結果轉換為字典
                result = [
                    {  # 這裡可以直接使用結果中的欄位，這是根據 SELECT * 返回的所有欄位
                        "news_id": record[0],
                        "news_title": record[1],
                        "news_url": record[2],
                        "news_summary": record[3],
                        "news_date": record[4],
                        "today_news_date": record[5],
                        # 若有更多欄位，請繼續添加
                    }
                    for record in news_records
                ]
                return {"news": result}
            else:
                return {"news": [], "message": "No news available."}

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
            # Ensure proper date format and debug info
            print(f"Received news data: {news_data}")
            check_query = """
                SELECT COUNT(*) FROM news WHERE today_news_date = ?
            """
            cursor.execute(check_query, (news_data.news_date,))
            count = cursor.fetchone()[0]

            if count > 0:
                return {"message": "News for today already exists."}

            # Adjust for database compatibility (e.g., CURRENT_TIMESTAMP for SQLite)
            insert_query = """
                INSERT INTO news (news_title, news_url, news_summary, news_date, today_news_date)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            """
            cursor.execute(insert_query, (
                news_data.news_title,
                news_data.news_url,
                news_data.news_summary,
                news_data.news_date
            ))
            conn.commit()
            print(f"News saved: {news_data.news_title}")  # Log the saved news title
            
            return {"message": "News added successfully."}

        except Exception as e:
            conn.rollback()
            print(f"Error occurred: {str(e)}")  # Log the full error
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
            # 確保傳入的日期格式正確
            try:
                input_date = datetime.strptime(today_news_date, "%Y-%m-%d")
            except ValueError:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid date format. Please use YYYY-MM-DD.")
            
            # 取得今天的日期
            today_date = datetime.now().strftime("%Y-%m-%d")

            # 檢查是否是今天的新聞
            if today_news_date == today_date:
                # 如果是今天，檢查資料庫是否有資料
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
                    return {"news": [], "message": "No news found for today. Please generate and save news."}
            else:
                # 如果請求的是不是今天的日期
                return {"news": [], "message": f"News data for {today_news_date} is not available. Please select today's date."}
            
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error processing news: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
