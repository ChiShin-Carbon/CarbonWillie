import pyodbc

def connect():
    try:
        conn = pyodbc.connect("Driver={ODBC Driver 17 for SQL Server};"
                              "Server=MSI\MSSQLSERVER01;"
                              "Database=Carbon;"
                              "Trusted_Connection=yes;")
        print("Connection successful!")
        return conn
    except Exception as e:
        print("Error connecting to database:", e)
        return None
