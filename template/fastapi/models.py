from sqlalchemy import BigInteger, Column, String
from database import Base  # Import Base from your database module

class Test(Base):  # No need to involve the connect.py here
    __tablename__ = "test"

    ID = Column(BigInteger, primary_key=True, index=True)  # Use BigInteger for ID
    name = Column(String(50))
