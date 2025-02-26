from openpyxl import Workbook, load_workbook
from openpyxl.utils import get_column_letter
from openpyxl.styles import Font

data = [
    {
        'sheet': '類別一-公務車(汽油)',
        'department':'業務部',
        'name': '陳欣柔',
        'email': 'chen@gmail.com',
        'phone': '09722222',
        'address': 'admin',
        'password': 'chen',
        'role': 'admin',
        'remark': 'none'
     },
     {
        'sheet': '類別一-公務車(柴油)',
        'department':'',
        'name': '',
        'email': '',
        'phone': '',
        'address': '',
        'password': '',
        'role': '',
        'remark': '' 
     },  
     {
        'sheet': '類別一-滅火器',
        'department':'',
        'name': '',
        'email': '',
        'phone': '',
        'address': '',
        'password': '',
        'role': '',
        'remark': '' 
     },    
     {
        'sheet': '類別一-工作時數(員工)',
        'department':'',
        'name': '',
        'email': '',
        'phone': '',
        'address': '',
        'password': '',
        'role': '',
        'remark': '' 
     },
    {
        'sheet': '類別一-工作時數(非員工)',
        'department':'',
        'name': '',
        'email': '',
        'phone': '',
        'address': '',
        'password': '',
        'role': '',
        'remark': '' 
     },
    {
        'sheet': '類別一-冷媒',
        'department':'',
        'name': '',
        'email': '',
        'phone': '',
        'address': '',
        'password': '',
        'role': '',
        'remark': '' 
     },
    {
        'sheet': '類別一-固定式',
        'department':'',
        'name': '',
        'email': '',
        'phone': '',
        'address': '',
        'password': '',
        'role': '',
        'remark': '' 
     } ,
    {
        'sheet': '類別一-產生溫室氣體的排放製程',
        'department':'',
        'name': '',
        'email': '',
        'phone': '',
        'address': '',
        'password': '',
        'role': '',
        'remark': '' 
     } ,
    {
        'sheet': '類別一-廠內機具',
        'department':'',
        'name': '',
        'email': '',
        'phone': '',
        'address': '',
        'password': '',
        'role': '',
        'remark': '' 
     } ,
    {
        'sheet': '類別一-緊急發電機',
        'department':'',
        'name': '',
        'email': '',
        'phone': '',
        'address': '',
        'password': '',
        'role': '',
        'remark': '' 
     } 
     ]

wb = Workbook()
ws = wb.active

title = ['表單名稱', '部門', '姓名(主要填寫人)', '電子郵件', '電話及分機號碼', '平台帳號', '平台密碼','平台權限', '備註']
ws.append(title)

# for row in range(1,18):
#     for col in range(1,6):
#         char = get_column_letter(col)
#             ws.append(list(person.values())) #每一筆值

sheet = ['類別一-公務車(汽油)','類別一-公務車(柴油)','類別一-滅火器','類別一-工作時數(員工)','類別一-工作時數(非員工)','類別一-冷媒','類別一-固定式','類別一-產生溫室氣體的排放製程','類別一-廠內機具','類別一-緊急發電機','類別一-焊條','類別一-氣體斷路器(GCB)','類別一-其他','類別一-電力使用量','類別一-間接蒸氣(汽電共生廠有做溫室氣體盤查)','類別一-間接蒸氣(汽電共生廠沒有做溫室氣體盤查)','類別二-其他']
for i, item in enumerate(sheet, start=2):  # i 對應 Excel 的行號（從 1 開始）
    ws.cell(row=i, column=1, value=item)  # 第一列（A欄）填入資料

#直接包括sheet一路添加
# for person in data:
#     ws.append(list(person.values())) #每一筆值

# 工作表2
wb.create_sheet("工作表2")      # 插入工作表2 在最後方


wb.save('碳盤查基準活動數據.xlsx')