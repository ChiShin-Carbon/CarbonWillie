from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from datetime import datetime

latest_baseline_router = APIRouter(tags=["Inventory API"])

class BaselineYearResponse(BaseModel):
    baseline_id: int
    year: int
    cfv_start_date: str

@latest_baseline_router.get("/latest_baseline_year", response_model=BaselineYearResponse)
async def get_latest_baseline_year():
    """
    取得最新的 Baseline 記錄並提取該記錄的 cfv_start_date 中的年份
    """
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        # 查詢 baseline_id 最大的記錄
        cursor.execute("""
            SELECT TOP 1 baseline_id, cfv_start_date 
            FROM Baseline 
            ORDER BY baseline_id DESC
        """)
        
        result = cursor.fetchone()
        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="找不到任何 Baseline 記錄")
        
        baseline_id, cfv_start_date = result
        
        # 從日期字串中提取年份
        try:
            # 將 cfv_start_date 轉換為字符串以防它是 datetime 對象
            date_str = str(cfv_start_date)
            
            # 使用簡單的方法從日期字符串中提取年份
            # 假設格式為 YYYY-MM-DD 或者包含年份的其他格式
            if '-' in date_str:
                year = int(date_str.split('-')[0])
            elif '/' in date_str:
                year = int(date_str.split('/')[0])
            else:
                # 嘗試提取前4個字符作為年份
                year = int(date_str[:4])
                
            # 驗證提取的年份是否合理 (例如 1900-2100)
            if not (1900 <= year <= 2100):
                raise ValueError(f"提取的年份 {year} 不在合理範圍內")
                
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"無法從日期格式 '{cfv_start_date}' 中提取年份: {str(e)}"
            )
        
        return BaselineYearResponse(
            baseline_id=baseline_id,
            year=year,
            cfv_start_date=str(cfv_start_date)
        )
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        conn.close()