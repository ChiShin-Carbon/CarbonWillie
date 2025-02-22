from docx import Document
from docx.shared import Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.text import WD_PARAGRAPH_ALIGNMENT, WD_LINE_SPACING
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_ALIGN_VERTICAL
from docx.shared import Inches
from docx.shared import Cm

def set_heading(paragraph):
    run = paragraph.runs[0] if paragraph.runs else paragraph.add_run()
    font = run.font
    font.name = "Times New Roman"
    run._element.rPr.rFonts.set(qn('w:eastAsia'), "標楷體")
    font.size = Pt(18)
    font.color.rgb = RGBColor(0, 0, 0)  # 設置字體為黑色
    
    paragraph_format = paragraph.paragraph_format
    paragraph_format.space_before = Pt(18)
    paragraph_format.space_after = Pt(12)

    paragraph_format.line_spacing_rule = WD_LINE_SPACING.SINGLE
    paragraph.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER  # 設定標題置中

def set_heading2(paragraph):
    run = paragraph.runs[0] if paragraph.runs else paragraph.add_run()
    font = run.font
    font.name = "Times New Roman"
    run._element.rPr.rFonts.set(qn('w:eastAsia'), "標楷體")
    font.size = Pt(16)
    font.color.rgb = RGBColor(0, 0, 0)  # 設置字體為黑色
    
    paragraph_format = paragraph.paragraph_format
    paragraph_format.space_before = Pt(12)
    paragraph_format.space_after = Pt(12)

    paragraph_format.line_spacing_rule = WD_LINE_SPACING.SINGLE

def set_paragraph(paragraph):
    run = paragraph.runs[0] if paragraph.runs else paragraph.add_run()
    font = run.font
    font.name = "Times New Roman"
    run._element.rPr.rFonts.set(qn('w:eastAsia'), "標楷體")
    font.size = Pt(12)
    
    paragraph_format = paragraph.paragraph_format
    paragraph_format.space_before = Pt(0)
    paragraph_format.space_after = Pt(6)

    paragraph_format.line_spacing_rule = WD_LINE_SPACING.MULTIPLE
    paragraph_format.line_spacing = 1.15

    # **設定首行縮排 (2 個中文字元寬度)**
    paragraph_format.first_line_indent = Pt(24)  # 一般中文字大小是 12pt，2 個字就是 24pt

def set_explain(paragraph):
    run = paragraph.runs[0] if paragraph.runs else paragraph.add_run()
    font = run.font
    font.name = "Times New Roman"
    run._element.rPr.rFonts.set(qn('w:eastAsia'), "標楷體")
    font.size = Pt(10)
    
    paragraph_format = paragraph.paragraph_format
    paragraph_format.space_before = Pt(12)
    paragraph_format.space_after = Pt(0)
    paragraph_format.line_spacing_rule = WD_LINE_SPACING.SINGLE
    paragraph.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER  # 設定標題置中

def set_table(table):

    # 合併第1, 2, 15, 16列的最上面兩行
    table.cell(0, 0).merge(table.cell(1, 0))  # 合併第1列
    table.cell(0, 1).merge(table.cell(1, 1))  # 合併第2列
    table.cell(0, 14).merge(table.cell(1, 14))  # 合併第15列
    table.cell(0, 15).merge(table.cell(1, 15))  # 合併第16列

    # 合併第3, 4, 5列的第一行為一個大格
    table.cell(0, 2).merge(table.cell(0, 4))  # 合併第3, 4, 5列
    table.cell(0, 5).merge(table.cell(0, 6))  # 合併第3, 4, 5列
    table.cell(0, 7).merge(table.cell(0, 13))  # 合併第3, 4, 5列

    for row in table.rows:
        for cell in row.cells:
            tc_pr = cell._element.get_or_add_tcPr()
            tc_borders = OxmlElement('w:tcBorders')

            for border_name in ['w:top', 'w:left', 'w:bottom', 'w:right', 'w:insideH', 'w:insideV']:
                border = OxmlElement(border_name)
                border.set(qn('w:val'), 'single')  # 單線
                border.set(qn('w:sz'), '4')       # 線條大小（1/8 pt）
                border.set(qn('w:space'), '0')    # 無間距
                border.set(qn('w:color'), '000000')  # 黑色
                tc_borders.append(border)

            tc_pr.append(tc_borders)
    
    # 設置第一列和第二列（Header Row）的背景色、置中
    for row_index in range(2):  # 迭代第一行和第二行
        for cell in table.rows[row_index].cells:  # 針對每一行的儲存格
            shading = parse_xml(r'<w:shd {} w:fill="CCFFFF"/>'.format(nsdecls('w')))
            cell._tc.get_or_add_tcPr().append(shading)  # 設置背景顏色

            paragraph = cell.paragraphs[0]
            paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER  # 讓標題水平置中
            cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER  # 這句是為了強制將文字置中

            # 垂直置中
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER  # 垂直置中
            
    # 設置從第3行開始的顏色
    for row_index in range(2, len(table.rows)):  # 從第3行開始
        # 設置第1, 2, 4列顏色為DBDBDB
        for col_index in [0, 1, 3]:
            shading = parse_xml(r'<w:shd {} w:fill="DBDBDB"/>'.format(nsdecls('w')))
            table.cell(row_index, col_index)._tc.get_or_add_tcPr().append(shading)

        # 設置第3, 5-15列顏色為F8CBAD
        for col_index in [2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]:
            shading = parse_xml(r'<w:shd {} w:fill="F8CBAD"/>'.format(nsdecls('w')))
            table.cell(row_index, col_index)._tc.get_or_add_tcPr().append(shading)


    # 設置表格內字體
    for row in table.rows:
        for cell in row.cells:
            paragraph = cell.paragraphs[0]
            run = paragraph.runs[0] if paragraph.runs else paragraph.add_run()

            paragraph_format = paragraph.paragraph_format
            paragraph_format.space_before = Pt(0)
            paragraph_format.space_after = Pt(0)
            paragraph_format.line_spacing_rule = WD_LINE_SPACING.SINGLE

            # 設定字型
            font = run.font
            font.name = "Times New Roman"
            run._element.rPr.rFonts.set(qn('w:eastAsia'), "標楷體")
            font.size = Pt(6)
    


def create_chapter3():
    doc = Document()

        # 獲取文檔的第一個 section（默認只有一個）
    section = doc.sections[0]

    # 設置自訂邊界，單位是厘米 (cm)
    section.top_margin = Cm(2)  # 上邊距
    section.bottom_margin = Cm(2)  # 下邊距
    section.left_margin = Cm(2)  # 左邊距
    section.right_margin = Cm(2)  # 右邊距
        
    ################第三章######################
    #標題
    title = doc.add_heading("第三章、報告溫室氣體排放量",level=1)
    set_heading(title)
    
    #3.1 溫室氣體排放類型與排放量說明
    preface = doc.add_heading("3.1 溫室氣體排放類型與排放量說明",level=2)
    set_heading2(preface)
    
    content = doc.add_paragraph("經盤查，本校排放之溫室氣體種類主要有二氧化碳(CO2)、氧化亞氮(N2O)、甲烷(CH4)及氫氟碳化物(HFCs)四類。其中，二氧化碳(CO2)排放主要來自消防設施（滅火器）、清潔設備（洗地機）、其他發電引擎（緊急發電機）及外購電力，甲烷(CH4)的排放來自化糞池、清潔設備（洗地機）及其他發電引擎(緊急發電機)，氧化亞氮(N2O) 排放來自清潔設備（洗地機）和其他發電引擎（緊急發電機），氫氟碳化物(HFCs)的排放來自廠區內消防設施（滅火器）、各式冰水機（冰水主機）、飲水機及冷氣機的冷媒逸散。")
    set_paragraph(content)

    #3.2 直接溫室氣體排放（類別1排放）
    preface = doc.add_heading("3.2 直接溫室氣體排放（類別1排放）",level=2)
    set_heading2(preface)
    
    content = doc.add_paragraph("本校直接溫室氣體排放源，如表3-1所示。")
    set_paragraph(content)

    table_explain = doc.add_paragraph("表3-1、亞東科技大學直接溫室氣體排放源")
    set_explain(table_explain)
    # 新增表格
    table = doc.add_table(rows=15, cols=16)
     # 設定表頭
    table.cell(0, 0).text = "製程名稱"
    table.cell(0, 1).text = "設備名稱"
    table.cell(0, 2).text = "原燃物料或產品"
    table.cell(0, 5).text = "排放源資料"
    table.cell(0, 7).text = "可能產生溫室氣體種類"
    table.cell(0, 14).text ="是否屬汽電共生設備"
    table.cell(0, 15).text = "備註*"

    table.cell(1, 2).text = "類別"
    table.cell(1, 3).text = "名稱"
    table.cell(1, 4).text = "是否屬生質能源"
    table.cell(1, 5).text = "範疇別"
    table.cell(1, 6).text = "製程/逸散/外購電力類別"
    table.cell(1, 7).text = "CO2"
    table.cell(1, 8).text = "CH4"
    table.cell(1, 9).text = "N2O"
    table.cell(1, 10).text = "HFCS"
    table.cell(1, 11).text = "PFCS"
    table.cell(1, 12).text = "SF6"
    table.cell(1, 13).text = "NF3"



   


    set_table(table)

    return doc
