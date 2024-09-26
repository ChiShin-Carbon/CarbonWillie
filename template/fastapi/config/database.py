from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 連接字串
SQLALCHEMY_DATABASE_URL = "mssql+pyodbc://MSI\MSSQLSERVER01/Carbon?driver=SQL+Server+Native+Client+11.0"

# 創建引擎
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 創建SessionLocal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 創建基礎類別
Base = declarative_base()

# 獲取數據庫連接
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
