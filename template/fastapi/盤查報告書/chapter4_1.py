from docx import Document
from docx.shared import Cm

from storeDef import set_heading, set_heading2, set_paragraph, set_explain,set_ch4_table1,set_ch4_stairs1,set_ch4_stairs2,set_ch4_stairs3,set_ch4_stairs4


def create_chapter4_1():
    doc = Document()

        # 獲取文檔的第一個 section（默認只有一個）
    section = doc.sections[0]

    # 設置自訂邊界，單位是厘米 (cm)
    section.top_margin = Cm(2)  # 上邊距
    section.bottom_margin = Cm(2)  # 下邊距
    section.left_margin = Cm(2)  # 左邊距
    section.right_margin = Cm(2)  # 右邊距
        
    ###############第四章######################
    #標題
    title = doc.add_heading("第四章、數據品質管理",level=1)
    set_heading(title)
    
    #4.1 量化方法
    preface = doc.add_heading("4.1 量化方法",level=2)
    set_heading2(preface)
    
    content = doc.add_paragraph("本公司各種溫室氣體排放量計算方式主要採用「排放係數法」計算。")
    set_paragraph(content)

    stairs1 = doc.add_paragraph("(1) 類別1 – 直接排放")
    set_ch4_stairs1(stairs1)
################################################################################
    stairs2 = doc.add_paragraph("A. 固定燃燒排放源（緊急發電機）：")
    set_ch4_stairs2(stairs2)

    stairs3 = doc.add_paragraph("(A) 溫室氣體排放量計算公式如下：\n溫室氣體排放量 = 活動數據 × 排放係數 × 全球暖化潛勢值(GWP)")
    set_ch4_stairs3(stairs3)

    stairs3 = doc.add_paragraph("(B) 活動數據：汽油用量（公噸）、柴油用量（公秉）")
    set_ch4_stairs3(stairs3)

    stairs3 = doc.add_paragraph("(C) 排放係數：溫室氣體排放係數管理表6.0.4版。")
    set_ch4_stairs3(stairs3)

    table_explain = doc.add_paragraph("表4-1、固定燃燒排放源（緊急發電機）CO2")
    set_explain(table_explain)
    table1 = doc.add_table(rows=3, cols=16)
    set_ch4_table1(table1)

    table_explain = doc.add_paragraph("表4-2、固定燃燒排放源（緊急發電機）CH4")
    set_explain(table_explain)
    table2 = doc.add_table(rows=3, cols=16)
    set_ch4_table1(table2)

    table_explain = doc.add_paragraph("表4-3、固定燃燒排放源（緊急發電機）N2O")
    set_explain(table_explain)
    table3 = doc.add_table(rows=3, cols=16)
    set_ch4_table1(table3)

    doc.add_paragraph("")  # 插入一個空白行
############################################################################
    stairs2 = doc.add_paragraph("B.	逸散排放源（化糞池）：")
    set_ch4_stairs2(stairs2)

    stairs3 = doc.add_paragraph("(A) 溫室氣體排放量計算公式如下：\n溫室氣體排放量 = 活動數據 × 排放係數 × 全球暖化潛勢值(GWP)")
    set_ch4_stairs3(stairs3)

    stairs3 = doc.add_paragraph("(B) 活動數據：統計全年人小時")
    set_ch4_stairs3(stairs3)

    stairs3 = doc.add_paragraph("(C) 排放係數：溫室氣體排放係數管理表6.0.4版(6_逸散排放源)之化糞池係數，並換算為人時0.0000015938公噸/人時。")
    set_ch4_stairs3(stairs3)

    table_explain = doc.add_paragraph("表4-4、逸散排放源（化糞池）CH4")
    set_explain(table_explain)
    table4 = doc.add_table(rows=3, cols=16)
    set_ch4_table1(table4)
    
    doc.add_paragraph("")  # 插入一個空白行
    ############################################################################
    stairs2 = doc.add_paragraph("C.	逸散排放源（滅火器）：")
    set_ch4_stairs2(stairs2)

    stairs3 = doc.add_paragraph("(A) 溫室氣體排放量計算公式如下：\n溫室氣體排放量 = 活動數據 × 排放係數 × 全球暖化潛勢值(GWP)")
    set_ch4_stairs3(stairs3)

    stairs3 = doc.add_paragraph("(B) 活動數據：CO2滅火器該年度使用量（公噸）")
    set_ch4_stairs3(stairs3)

    stairs3 = doc.add_paragraph("(C) 排放係數：質量平衡係數CO2為1。")
    set_ch4_stairs3(stairs3)

    table_explain = doc.add_paragraph("表4-5、逸散排放源（滅火器）CO2、HFCS")
    set_explain(table_explain)
    table5 = doc.add_table(rows=3, cols=16)
    set_ch4_table1(table5)

    doc.add_paragraph("")  # 插入一個空白行

    return doc
