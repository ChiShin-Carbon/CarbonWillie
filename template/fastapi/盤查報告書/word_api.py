import os
from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import FileResponse
from 盤查報告書.word import create_word_file

word_api = APIRouter(tags=["盤查報告書"])

def remove_file(filename: str):
    """ 刪除伺服器上的檔案 """
    if os.path.exists(filename):
        os.remove(filename)

@word_api.get("/download-docx/")
async def download_word(background_tasks: BackgroundTasks):
    filename = "test.docx"
    create_word_file(filename)  # 產生 Word 文件
    
    # **下載完成後，在背景刪除 Word 檔案**
    background_tasks.add_task(remove_file, filename)

    return FileResponse(
        filename, 
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
        filename=filename
    )
