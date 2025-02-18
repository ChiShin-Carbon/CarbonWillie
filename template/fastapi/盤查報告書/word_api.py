from fastapi import APIRouter
from fastapi.responses import FileResponse
from 盤查報告書.word import create_word_file

word_api = APIRouter(tags=["盤查報告書"])

@word_api.get("/download-docx/")
async def download_word():
    filename = "test.docx"
    create_word_file(filename)  # 產生 Word 文件
    return FileResponse(
        filename, 
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
        filename=filename
    )
