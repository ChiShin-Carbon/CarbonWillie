import pyodbc as odbc

# 定義連接參數
DRIVER_NAME = 'SQL Server'  # 確保驅動名稱正確
SERVER_NAME = 'MSI\MSSQLSERVER01'
DATABASE = 'Carbon'

# 建立連接字符串
connection_string = f"""
    DRIVER={{{DRIVER_NAME}}};
    SERVER={SERVER_NAME};
    DATABASE={DATABASE};
    Trusted_Connection=yes;  # 使用 Trusted_Connection
"""

try:
    # 嘗試連接到數據庫
    conn = odbc.connect(connection_string)
    print("成功連接到數據庫！")
    print(conn)  # 打印連接對象以確認
except odbc.Error as e:
    print("連接失敗：", e)
