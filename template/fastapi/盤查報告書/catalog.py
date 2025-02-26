from docx import Document
from docx.shared import Cm

from storeDef import set_title, set_heading

def create_title():
    doc = Document()

    # 獲取文檔的第一個 section（默認只有一個）
    section = doc.sections[0]

    # 設置自訂邊界，單位是厘米 (cm)
    section.top_margin = Cm(2)  # 上邊距
    section.bottom_margin = Cm(2)  # 下邊距
    section.left_margin = Cm(2)  # 左邊距
    section.right_margin = Cm(2)  # 右邊距
    
    ###################################################
 
    heading = doc.add_heading("目錄")
    set_heading(heading)
    


    # 插入分頁符號
    doc.add_page_break()



    return doc