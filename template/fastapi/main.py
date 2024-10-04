from fastapi import FastAPI, Depends, HTTPException
from dotenv import load_dotenv
import os
from route import router
from login import login
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import logging
import pyodbc
from connect.connect import connectDB
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
load_dotenv()
connectDB()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Database connection URL
SQLALCHEMY_DATABASE_URL = os.getenv('DATABASE_URL')
print(SQLALCHEMY_DATABASE_URL)

@app.get("/")
def read_root():
    return {"Hello": "World"}

# Include the router from the route module
app.include_router(router)
app.include_router(login)