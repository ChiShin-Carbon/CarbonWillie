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


def set_ch5_table1(table):
    header_cells = [
        (0, 0, "全廠電力"),
        (1, 0, "全校電力\n(仟度)"), (1, 1, "全校火力電力\n(仟度)"),(1, 2,"風力\n(仟度)"),(1, 3, "水力\n(仟度)"), (1, 4, "地熱\n(仟度)"), (1, 5,"潮汐\n(仟度)"), (1, 6,"其他再生能源\n(仟度)"),
        (1, 7,  "其他再生能源\n備註"), (1, 8, "核能發電量\n(仟度)"), (1, 9, "其他發電量\n(仟度)"), (1, 10, "其他發電量\n備註"),
        (1, 11, "全廠蒸氣產生量\n(仟度)")
    ]

    for row_idx, col_idx, text in header_cells:
        cell = table.cell(row_idx, col_idx)
        paragraph = cell.paragraphs[0] if cell.paragraphs else cell.add_paragraph()
        run = paragraph.add_run(text)

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

    table.cell(0, 0).merge(table.cell(0, 11))  # 合併第1列


    for cell in table.rows[0].cells:  # 只針對第一列
        shading = parse_xml(r'<w:shd {} w:fill="FFF2CC"/>'.format(nsdecls('w')))
        cell._tc.get_or_add_tcPr().append(shading)  # 設置背景顏色

        paragraph = cell.paragraphs[0]
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER  # 讓標題水平置中
        cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER  # 這句是為了強制將文字置中

        run = paragraph.runs[0] if paragraph.runs else paragraph.add_run()
        run.font.bold = True  # 設置為粗體

         # 垂直置中
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER  # 垂直置中
           
            
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
            font.size = Pt(9)

             # 設定水平置中
            paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER  
            
            # 設定垂直置中
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER 

def set_ch5_table2(table):
    header_cells = [
        (0, 0, "全廠七大溫室氣體排放量統計表"),
        (1, 0, "溫室氣體"), (1, 1, "CO2"),(1, 2,"CH4"),(1, 3, "N2O"), (1, 4, "HFCs"), (1, 5,"PFCs"), (1, 6,"SF6"),
        (1, 7,  "NF3"), (1, 8, "年總排放當量"), (1, 9, "生質排放當量")
        , (2,0, "排放當量\n(公噸CO2e/年)"), (3,0, "氣體別占比\n(％)"),(4,0,"註：依溫室氣體排放量盤查登錄管理辦法第二條第一款規定，溫室氣體排放量以公噸二氧化碳當量(公噸CO2e)表示，並四捨五入至小數點後第三位。")
    ]

    for row_idx, col_idx, text in header_cells:
        cell = table.cell(row_idx, col_idx)
        paragraph = cell.paragraphs[0] if cell.paragraphs else cell.add_paragraph()
        run = paragraph.add_run(text)

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

    table.cell(0, 0).merge(table.cell(0, 9))  # 合併第1列
    table.cell(4, 0).merge(table.cell(4, 9))  # 合併第1列


    for cell in table.rows[0].cells:  # 只針對第一列
        shading = parse_xml(r'<w:shd {} w:fill="FFF2CC"/>'.format(nsdecls('w')))
        cell._tc.get_or_add_tcPr().append(shading)  # 設置背景顏色

        paragraph = cell.paragraphs[0]
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER  # 讓標題水平置中
        cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER  # 這句是為了強制將文字置中

        run = paragraph.runs[0] if paragraph.runs else paragraph.add_run()
        run.font.bold = True  # 設置為粗體
           
            
    # 設置表格內字體 & 文字對齊
    for row_idx, row in enumerate(table.rows):  # 修改這裡
        for col_idx, cell in enumerate(row.cells):  
            paragraph = cell.paragraphs[0] if cell.paragraphs else cell.add_paragraph()
            run = paragraph.runs[0] if paragraph.runs else paragraph.add_run()

            paragraph_format = paragraph.paragraph_format
            paragraph_format.space_before = Pt(0)
            paragraph_format.space_after = Pt(0)
            paragraph_format.line_spacing_rule = WD_LINE_SPACING.SINGLE

            # 設定字型
            font = run.font
            font.name = "Times New Roman"
            run._element.rPr.rFonts.set(qn('w:eastAsia'), "標楷體")
            font.size = Pt(9)

            # 設定對齊方式
            if row_idx == 4:  # 註解部分
                paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT  # 置左
            else:
                paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER  # 其他部分保持置中

            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER  # 上下置中


def set_ch5_table3(table):
    header_cells = [
        (0, 0, "類別一、七大溫室氣體排放量統計表"),
        (1, 0, "溫室氣體"), (1, 1, "CO2"),(1, 2,"CH4"),(1, 3, "N2O"), (1, 4, "HFCs"), (1, 5,"PFCs"), (1, 6,"SF6"),
        (1, 7,  "NF3"), (1, 8, "年總排放當量"), (1, 9, "生質排放當量")
        , (2,0, "排放當量\n(公噸CO2e/年)"), (3,0, "氣體別占比\n(％)")
    ]

    for row_idx, col_idx, text in header_cells:
        cell = table.cell(row_idx, col_idx)
        paragraph = cell.paragraphs[0] if cell.paragraphs else cell.add_paragraph()
        run = paragraph.add_run(text)

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

    table.cell(0, 0).merge(table.cell(0, 9))  # 合併第1列

    for cell in table.rows[0].cells:  # 只針對第一列
        shading = parse_xml(r'<w:shd {} w:fill="FFF2CC"/>'.format(nsdecls('w')))
        cell._tc.get_or_add_tcPr().append(shading)  # 設置背景顏色

        paragraph = cell.paragraphs[0]
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER  # 讓標題水平置中
        cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER  # 這句是為了強制將文字置中

        run = paragraph.runs[0] if paragraph.runs else paragraph.add_run()
        run.font.bold = True  # 設置為粗體

         # 垂直置中
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER  # 垂直置中
           
            
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
            font.size = Pt(9)

             # 設定水平置中
            paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER  
            
            # 設定垂直置中
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER 

def set_ch5_table4(table):
    header_cells = [
        (0, 0, "全廠溫室氣體範疇別及類別一與二排放型式排放量統計表"),
        (1, 0, "範疇"),(1, 1, "類別一"),(1, 5, "類別二"),(1, 6, "總排放當量"),
        (2, 1, "固定排放"),(2, 2, "製程排放"),(2, 3, "移動排放"),(2, 4, "逸散排放"),(2, 5, "能源間接排放"),
        (3, 0, "排放當量\n(公噸CO2e/年)"),(5, 0, "氣體別占比\n(%)"),
        (7, 0, "註：依溫室氣體排放量盤查登錄管理辦法第二條第一款規定，溫室氣體排放量以公噸二氧化碳當量(公噸CO2e)表示，並四捨五入至小數點後第三位。"),
    ]

    for row_idx, col_idx, text in header_cells:
        cell = table.cell(row_idx, col_idx)
        paragraph = cell.paragraphs[0] if cell.paragraphs else cell.add_paragraph()
        run = paragraph.add_run(text)

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

    # 進行合併
    table.cell(0, 0).merge(table.cell(0, 6)) 
    table.cell(7, 0).merge(table.cell(7, 6))  # 註解部分
    table.cell(1, 1).merge(table.cell(1, 4))  
    table.cell(3, 1).merge(table.cell(3, 4))  
    table.cell(5, 1).merge(table.cell(5, 4))

    table.cell(1, 0).merge(table.cell(2, 0))  
    table.cell(3, 0).merge(table.cell(4, 0))
    table.cell(5, 0).merge(table.cell(6, 0))  

    table.cell(1, 6).merge(table.cell(2, 6))  
    table.cell(3, 6).merge(table.cell(4, 6))
    table.cell(5, 6).merge(table.cell(6, 6)) 
    

    for cell in table.rows[0].cells:  # 只針對第一列
        shading = parse_xml(r'<w:shd {} w:fill="FFF2CC"/>'.format(nsdecls('w')))
        cell._tc.get_or_add_tcPr().append(shading)  # 設置背景顏色

        paragraph = cell.paragraphs[0]
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER  # 讓標題水平置中

        run = paragraph.runs[0] if paragraph.runs else paragraph.add_run()
        run.font.bold = True  # 設置為粗體

    # 設置表格內字體 & 文字對齊
    for row_idx, row in enumerate(table.rows):
        for col_idx, cell in enumerate(row.cells):
            paragraph = cell.paragraphs[0] if cell.paragraphs else cell.add_paragraph()
            run = paragraph.runs[0] if paragraph.runs else paragraph.add_run()

            paragraph_format = paragraph.paragraph_format
            paragraph_format.space_before = Pt(0)
            paragraph_format.space_after = Pt(0)
            paragraph_format.line_spacing_rule = WD_LINE_SPACING.SINGLE

            # 設定字型
            font = run.font
            font.name = "Times New Roman"
            run._element.rPr.rFonts.set(qn('w:eastAsia'), "標楷體")
            font.size = Pt(9)

            # 設定對齊方式
            if row_idx == 7:  # 註解部分
                paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT  # 置左
            else:
                paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER  # 其他部分保持置中

            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER  # 上下置中

                # 設定特定儲存格 (1,1) 和 (1,5) 為粗體
            if (row_idx == 1 and col_idx in [1, 5]):
                run.font.bold = True  # 設置為粗體

