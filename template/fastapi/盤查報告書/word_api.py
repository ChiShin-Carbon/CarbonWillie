from docx import Document
from docx.shared import Cm

# 創建一個 Word 文件
doc = Document()

# 獲取文檔的第一個 section（默認只有一個）
section = doc.sections[0]

# 設置自訂邊界，單位是厘米 (cm)
section.top_margin = Cm(2)  # 上邊距
section.bottom_margin = Cm(2)  # 下邊距
section.left_margin = Cm(2)  # 左邊距
section.right_margin = Cm(2)  # 右邊距

# 添加內容到文檔
doc.add_paragraph("這是一個測試文檔，邊界已設置為 2 公分。")

# 保存文檔
doc.save("output_with_custom_margins.docx")
