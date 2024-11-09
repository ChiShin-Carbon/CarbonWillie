from fastapi import FastAPI, Depends, HTTPException
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import logging
import pyodbc
from connect.connect import connectDB
from fastapi.middleware.cors import CORSMiddleware

from route import router
from login import login
from userinfo import userinfo
from edituserinfo import edituserinfo
from editaddress import editaddress
from editpassword import editpassword
from companyinfo import companyinfo
from editcompanyinfo import editcompanyinfo
from editcfvinfo import editcfvinfo
from ocrapi import ocrapi
from bot import botapi
from insert_vehicle import insert_vehicle
from insert_Extinguisher import insert_Extinguisher
from insert_employee import insert_employee

from authorizedTable import authorizedTable
from insert_authorized import insert_authorized
from insert_machine import insert_machine


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
app.include_router(userinfo)
app.include_router(edituserinfo)
app.include_router(editaddress)
app.include_router(editpassword)
app.include_router(companyinfo)
app.include_router(editcompanyinfo)
app.include_router(editcfvinfo)
app.include_router(ocrapi)
app.include_router(botapi)
app.include_router(insert_vehicle)
app.include_router(authorizedTable)

app.include_router(insert_Extinguisher)
app.include_router(insert_employee)

app.include_router(insert_authorized)
app.include_router(insert_machine)

