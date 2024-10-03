from fastapi import FastAPI, Depends, HTTPException
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import logging
import pyodbc
import connect
from fastapi.middleware.cors import CORSMiddleware

from route import router
from login import login
from userinfo import userinfo
from edituserinfo import edituserinfo


app = FastAPI()
load_dotenv()
connect.connect()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Move this argument inside the constructor
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
app.include_router(userinfo)
app.include_router(edituserinfo)