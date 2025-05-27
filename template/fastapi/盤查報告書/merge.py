from .chapter1 import create_chapter1
from .chapter2 import create_chapter2
from .chapter3 import create_chapter3
from .chapter4_1 import create_chapter4_1
from .chapter4_2 import create_chapter4_2
from .chapter4_3 import create_chapter4_3
from .chapter5 import create_chapter5
from .chapter6 import create_chapter6
from .title import create_title

from docx import Document
from docx2pdf import convert  # 新增導入
from fastapi import FastAPI, APIRouter, HTTPException, status
import os
from fastapi.responses import FileResponse
from fastapi import BackgroundTasks
from connect.connect import connectDB

# 建立 APIRouter 實例
get_word = APIRouter(tags=["word專用"])

# 設定檔案保存路徑
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "..", "..", "public", "original_report")

def get_latest_baseline_year():
    """
    取得最新的 Baseline 記錄並提取年份
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
                
            return year
                
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"無法從日期格式 '{cfv_start_date}' 中提取年份: {str(e)}"
            )
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        conn.close()

def merge_documents_and_convert_to_pdf(user_id, word_file_path, pdf_file_path):
    """
    合併所有章節的文件並轉換為PDF
    """
    try:
        doc1 = create_chapter1(user_id)
        doc2 = create_chapter2(user_id)
        doc3 = create_chapter3(user_id)
        doc4_1 = create_chapter4_1(user_id)
        doc4_2 = create_chapter4_2(user_id)
        doc4_3 = create_chapter4_3(user_id)
        doc5 = create_chapter5(user_id)
        doc6 = create_chapter6(user_id)
        title = create_title(user_id)

        combined_doc = Document()

        # 合併標題
        for element in title.element.body:
            combined_doc.element.body.append(element)
        
        # 合併 chapter1 的內容
        for element in doc1.element.body:
            combined_doc.element.body.append(element)

        # 合併 chapter2 的內容
        for element in doc2.element.body:
            combined_doc.element.body.append(element)

        # 合併 chapter3 的內容
        for element in doc3.element.body:
            combined_doc.element.body.append(element)

        # 合併 chapter4 的內容
        for element in doc4_1.element.body:
            combined_doc.element.body.append(element)
        
        for element in doc4_2.element.body:
            combined_doc.element.body.append(element)

        for element in doc4_3.element.body:
            combined_doc.element.body.append(element)

        # 合併 chapter5 的內容
        for element in doc5.element.body:
            combined_doc.element.body.append(element)

        # 合併 chapter6 的內容
        for element in doc6.element.body:
            combined_doc.element.body.append(element)

        # 確保目錄存在
        os.makedirs(os.path.dirname(word_file_path), exist_ok=True)
        
        # 保存合併後的Word文件
        combined_doc.save(word_file_path)
        print(f"Word文件合併完成，生成 {word_file_path}")
        
        # 將Word文件轉換為PDF
        try:
            convert(word_file_path, pdf_file_path)
            print(f"PDF轉換完成，生成 {pdf_file_path}")
        except Exception as pdf_error:
            print(f"PDF轉換過程中發生錯誤: {pdf_error}")
            # 即使PDF轉換失敗，Word文件已經成功生成，不需要拋出異常
            # 但可以記錄錯誤日誌
            
    except Exception as e:
        print(f"文件合併過程中發生錯誤: {e}")
        raise

@get_word.get("/generate_word/{user_id}")
async def generate_word(user_id: int, background_tasks: BackgroundTasks):
    """
    API 端點，根據最新 Baseline 年份生成 Word 和 PDF 檔案後提供下載
    """
    try:
        # 取得最新的 Baseline 年份
        year = get_latest_baseline_year()
        
        # 設定檔案名稱
        base_filename = f"{year}盤查報告書"
        word_filename = f"{base_filename}.docx"
        pdf_filename = f"{base_filename}.pdf"
        
        word_file_path = os.path.join(UPLOAD_FOLDER, word_filename)
        pdf_file_path = os.path.join(UPLOAD_FOLDER, pdf_filename)

        # 將生成檔案的操作放入背景任務
        background_tasks.add_task(merge_documents_and_convert_to_pdf, user_id, word_file_path, pdf_file_path)

        return {
            "message": "Word和PDF文件生成中，請稍後查收下載",
            "word_filename": word_filename,
            "pdf_filename": pdf_filename,
            "year": year,
            "word_file_path": word_file_path,
            "pdf_file_path": pdf_file_path
        }
        
    except HTTPException as e:
        # 重新拋出已知的 HTTP 異常
        raise e
    except Exception as e:
        # 處理其他未預期的錯誤
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"文件生成過程中發生錯誤: {str(e)}"
        )
    

@get_word.get("/check_word_status/{year}")
async def check_word_status(year: int):
    """
    檢查指定年份的Word/PDF檔案是否已生成完成
    """
    try:
        # 檢查Word文件
        word_filename = f"{year}盤查報告書.docx"
        pdf_filename = f"{year}盤查報告書.pdf"
        
        word_path = os.path.join(UPLOAD_FOLDER, word_filename)
        pdf_path = os.path.join(UPLOAD_FOLDER, pdf_filename)
        
        if os.path.exists(pdf_path):  # 優先檢查PDF
            return {
                "exists": True,
                "message": f"{year}年度盤查報告書已成功生成",
                "file_path": pdf_path
            }
        elif os.path.exists(word_path):
            return {
                "exists": True,
                "message": f"{year}年度盤查報告書(Word版)已成功生成",
                "file_path": word_path
            }
        else:
            return {
                "exists": False,
                "message": f"{year}年度盤查報告書尚未生成",
                "file_path": None
            }
    
    except Exception as e:
        return {
            "exists": False,
            "message": f"檢查報告書狀態時發生錯誤: {str(e)}",
            "file_path": None
        }
