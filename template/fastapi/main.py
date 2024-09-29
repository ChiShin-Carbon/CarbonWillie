from fastapi import FastAPI
from dotenv import load_dotenv
import os
from route import router  # Correct import for the router
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import logging
import pyodbc
import connect

app = FastAPI()
# Load environment variables from .env file
load_dotenv()
connect.connect()

# Database connection URL
SQLALCHEMY_DATABASE_URL = os.getenv('DATABASE_URL')
print(SQLALCHEMY_DATABASE_URL)


@app.get("/")
def read_root():
    return {"Hello": "World"}

# Include the router from the route module
app.include_router(router)
