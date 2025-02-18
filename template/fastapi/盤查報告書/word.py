from docx import Document

def create_word_file(filename: str):
    """ 產生 Word 文件 """
    doc = Document()
    doc.add_heading('測試文件', level=1)
    doc.add_paragraph('這是一個由 FastAPI 產生的 Word 文件')
    doc.save(filename)

