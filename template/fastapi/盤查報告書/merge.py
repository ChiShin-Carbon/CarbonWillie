from chapter1 import create_chapter1
from chapter2 import create_chapter2
from chapter3 import create_chapter3

from docx import Document
from docx.shared import Cm



def merge_documents():
    doc1 = create_chapter1()
    doc2 = create_chapter2()
    doc3 = create_chapter3()

    combined_doc = Document()

    
    # 合併 chapter1 的內容
    for element in doc1.element.body:
        combined_doc.element.body.append(element)

    # 合併 chapter2 的內容
    for element in doc2.element.body:
        combined_doc.element.body.append(element)

    # 合併 chapter3 的內容
    for element in doc3.element.body:
        combined_doc.element.body.append(element)

    combined_doc.save("combined.docx")
    print("合併完成，生成 combined.docx")

if __name__ == "__main__":
    merge_documents()
