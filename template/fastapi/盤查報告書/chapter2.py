from docx import Document
from docx.shared import Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.text import WD_PARAGRAPH_ALIGNMENT, WD_LINE_SPACING
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls
from docx.enum.text import WD_ALIGN_PARAGRAPH
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
    
    # 設置第一列（Header Row）的背景色、粗體與置中
    for cell in table.rows[0].cells:  # 只針對第一列
        shading = parse_xml(r'<w:shd {} w:fill="E2EFD9"/>'.format(nsdecls('w')))
        cell._tc.get_or_add_tcPr().append(shading)  # 設置背景顏色

        paragraph = cell.paragraphs[0]
        run = paragraph.runs[0] if paragraph.runs else paragraph.add_run()
        run.font.bold = True  # 設置為粗體
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER  # 讓標題置中

    # 設置第一欄（Column 1）內容置中，第二欄（Column 2）內容靠左
    for row in table.rows[1:]:  # 跳過第一列，從第二列開始
        first_col = row.cells[0]  # 第一欄
        second_col = row.cells[1]  # 第二欄

        # 第一欄置中
        first_paragraph = first_col.paragraphs[0]
        first_paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER

        # 第二欄靠左
        second_paragraph = second_col.paragraphs[0]
        second_paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT

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
            font.size = Pt(12)
    
     # 設定欄位寬度（第一欄30%，第二欄70%）
    table.autofit = False  # 取消自動調整大小，手動設定寬度
    for row in table.rows:
        row.cells[0].width = Inches(2)  # 第一欄 30%
        row.cells[1].width = Inches(5)  # 第二欄 70%


def create_chapter2():
    doc = Document()

        # 獲取文檔的第一個 section（默認只有一個）
    section = doc.sections[0]

    # 設置自訂邊界，單位是厘米 (cm)
    section.top_margin = Cm(2)  # 上邊距
    section.bottom_margin = Cm(2)  # 下邊距
    section.left_margin = Cm(2)  # 左邊距
    section.right_margin = Cm(2)  # 右邊距
    
    ################第二章######################
    #標題
    title = doc.add_heading("第二章、盤查邊界設定",level=1)
    set_heading(title)
    
    #2.1 組織邊界設定
    preface = doc.add_heading("2.1 組織邊界設定",level=2)
    set_heading2(preface)
    
    content = doc.add_paragraph("本次溫室氣體盤查專案，其組織邊界設定乃是參考ISO/CNS 14064-1:2018年版與環境部113年溫室氣體盤查指引之建議，規劃並執行符合相關設定，包括(1)控制權、(2)持有股權比例、(3)財務邊界、(4)生產配股，以及(5)在法律合約定義的特定安排下，可使用不同的整合方法論等各項規定。設定上，以亞東科技大學位於新北市板橋區四川路二段58號的五棟校園大樓（有痒科技大樓、誠勤大樓、元智大樓、樸慎大樓預定地、實習大樓），以及亞東第一停車場為組織邊界，統一編號為33503910。")
    set_paragraph(content)

    content = doc.add_paragraph("【請放置組織邊界圖】")
    set_paragraph(content)

    photo_explain = doc.add_paragraph("圖二、亞東科技大學板橋校區 組織邊界")
    set_explain(photo_explain)


    #2.2 報告邊界
    preface = doc.add_heading("2.2 報告邊界",level=2)
    set_heading2(preface)
    
    content = doc.add_paragraph("本公司報告邊界包含組織邊界的五棟校園大樓與停車場，盤查內容包含直接排放（類別1）與能源間接排放（類別2），表2為報告邊界與排放源彙整表。")
    set_paragraph(content)

    table_explain = doc.add_paragraph("表2、亞東科技大學板橋校區 報告邊界與活動源彙整表")
    set_explain(table_explain)
    # 新增表格
    table = doc.add_table(rows=3, cols=2)

    # 設定表頭
    table.cell(0, 0).text = "報告邊界"
    table.cell(0, 1).text = "排放源"

    # 設定表頭
    table.cell(0, 0).text = "報告邊界"
    table.cell(0, 1).text = "排放源"

    # 第一列 (類別1)
    table.cell(1, 0).text = "直接排放源\n（類別1）"
    table.cell(1, 1).text = "1. 固定：洗地機-汽油\n2. 人為逸散：化糞池(CH4)\n3. 人為逸散：消防設施(滅火器)、冰水主機、飲水機、冷氣機"

    # 第二列 (類別2)
    table.cell(2, 0).text = "能源間接排放源\n（類別2）"
    table.cell(2, 1).text = "1. 亞東校園大樓台電電力\n(電號：01-18-2933-11-6、01-18-2931-11-4、01-18-2931-01-2)"


    set_table(table)

    return doc
