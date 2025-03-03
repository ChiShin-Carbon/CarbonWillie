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
from fastapi import FastAPI,APIRouter
import os
from fastapi.responses import FileResponse

from fastapi import BackgroundTasks



# 建立 APIRouter 實例
get_word = APIRouter(tags=["word專用"])

def merge_documents(user_id):
    doc1 = create_chapter1(1)
    doc2 = create_chapter2()
    doc3 = create_chapter3()
    doc4_1 = create_chapter4_1()
    doc4_2 = create_chapter4_2()
    doc4_3 = create_chapter4_3()
    doc5 = create_chapter5()
    doc6 = create_chapter6()
    title = create_title()


    combined_doc = Document()

    for element in title.element.body:
        combined_doc.element.body.append(element)
    
    # 合併 chapter1 的內容
    for element in doc1.element.body:
        combined_doc.element.body.append(element)

    # # 合併 chapter2 的內容
    # for element in doc2.element.body:
    #     combined_doc.element.body.append(element)

    # # 合併 chapter3 的內容
    # for element in doc3.element.body:
    #     combined_doc.element.body.append(element)

    # #  合併 chapter4 的內容
    # for element in doc4_1.element.body:
    #     combined_doc.element.body.append(element)
    
    # for element in doc4_2.element.body:
    #     combined_doc.element.body.append(element)

    # for element in doc4_3.element.body:
    #     combined_doc.element.body.append(element)

    # for element in doc5.element.body:
    #     combined_doc.element.body.append(element)

    # for element in doc6.element.body:
    #     combined_doc.element.body.append(element)

    combined_doc.save("combined.docx")
    print("合併完成，生成 combined.docx")

if __name__ == "__main__":
    merge_documents()




@get_word.get("/generate_word/{user_id}")
async def generate_word(user_id: int, background_tasks: BackgroundTasks):
    """API 端點，生成 Word 檔案後提供下載"""
    file_path = "combined.docx"  # 設定檔案名稱

    # 將生成檔案的操作放入背景任務
    background_tasks.add_task(merge_documents, user_id)

    return {"message": "文件生成中，請稍後查收下載"}

@get_word.get("/generate_word/{user_id}")
async def generate_word(user_id:int, background_tasks: BackgroundTasks):
    """API 端點，生成 Word 檔案後提供下載"""
    file_path = "combined.docx"  # 設定檔案名稱
    merge_documents(user_id)   # 先生成 Word 檔案

    background_tasks.add_task(merge_documents, user_id)
    if os.path.exists(file_path):
        return FileResponse(
            path=file_path,
            filename="碳盤查報告.docx",  # 可修改為你想要的檔名
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            # 將生成檔案的操作放入背景任務
        )
    else:
        return {"error": "檔案生成失敗"}