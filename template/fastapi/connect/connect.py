import pyodbc

def connectDB():
    try:
        conn = pyodbc.connect("Driver={ODBC Driver 17 for SQL Server};"
                              "Server=Melody的電腦;"
                              "Database=Carbon;"
                              "Trusted_Connection=yes;")
        print("Connection successful!")
        return conn
    except Exception as e:
        print("Error connecting to database:", e)
        return None
