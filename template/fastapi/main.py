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
from edit.edituserinfo import edituserinfo
from edit.editaddress import editaddress
from edit.editpassword import editpassword
from companyinfo import companyinfo
from edit.editcompanyinfo import editcompanyinfo
from edit.editcfvinfo import editcfvinfo
from ocrapi import ocrapi
from bot import botapi
from insert.insert_vehicle import insert_vehicle
from insert.insert_Extinguisher import insert_Extinguisher
from insert.insert_employee import insert_employee
from baseline import baseline
from boundary import boundary
from langchain_gpt import langchaingpt
from news import news
from insert.insert_machine import insert_machine

from insert.insert_emergency import insert_emergency
from insert.insert_electricity import insert_electricity
from insert.insert_ref import insert_ref
from insert.insert_commute import insert_commute
from insert.insert_BusinessTrip import insert_BusinessTrip
from insert.insert_waste import insert_waste
from insert.insert_Selling_waste import insert_Selling_waste
from authorizedTable.authorizedTable import authorizedTable
from authorizedTable.insert_authorized import insert_authorized
from authorizedTable.edit_authorized import edit_authorized
from vehicle import vehicle
from Selling_waste import Selling_waste
from Operational_Waste import Operational_Waste
from Business_trip import Business_Trip
from commute import Commute
from Electricity_Usage import Electricity_Usage
from Emergency_Generator import Emergency_Generator

from extinguisher import extinguisher
from refrigerant import refrigerant
from employee import employee
from Machinery import Machinery
from Nonemployee import NonEmployee
from insert.insert_nonemployee import insert_nonemployee

from emission_source import emission_source

from 管理者.adminCompany import adminCompany
from 管理者.insert_adminCompany import insert_adminCompany
from 管理者.edit_adminCompany import edit_adminCompany
from 管理者.delete_adminCompany import delete_adminCompany



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
app.include_router(baseline)
app.include_router(boundary)
app.include_router(insert_vehicle)
app.include_router(insert_Extinguisher)
app.include_router(insert_employee)
app.include_router(authorizedTable)
app.include_router(insert_authorized)
app.include_router(edit_authorized)

app.include_router(insert_machine)
app.include_router(insert_emergency)
app.include_router(insert_electricity)
app.include_router(insert_ref)
app.include_router(insert_commute)
app.include_router(insert_BusinessTrip)
app.include_router(insert_waste)
app.include_router(insert_Selling_waste)
app.include_router(vehicle)

app.include_router(Selling_waste)
app.include_router(Operational_Waste)
app.include_router(Business_Trip)
app.include_router(Commute)
app.include_router(Electricity_Usage)
app.include_router(Emergency_Generator)
app.include_router(extinguisher)
app.include_router(refrigerant)
app.include_router(employee)
app.include_router(Machinery)
app.include_router(NonEmployee)
app.include_router(insert_nonemployee)
app.include_router(langchaingpt)
app.include_router(emission_source)
app.include_router(news)
app.include_router(adminCompany)
app.include_router(insert_adminCompany)
app.include_router(edit_adminCompany)
app.include_router(delete_adminCompany)
