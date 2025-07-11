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
from ocrapi_elec import ocrapi_elec
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
from insert.insert_electricity_usage import insert_electricity_usage
from insert.insert_ref import insert_ref
from insert.insert_commute import insert_commute
from insert.insert_BusinessTrip import insert_BusinessTrip
from insert.insert_waste import insert_waste
from insert.insert_Selling_waste import insert_Selling_waste
from authorizedTable.authorizedTable import authorizedTable
from authorizedTable.insert_authorized import insert_authorized
from authorizedTable.edit_authorized import edit_authorized
from authorizedTable.authorized_review import authorized_review
from vehicle import vehicle
from Selling_waste import Selling_waste
from Operational_Waste import Operational_Waste
from Business_trip import Business_Trip
from commute import Commute
# from Electricity_Usage import Electricity_Usage
from Emergency_Generator import Emergency_Generator

from Electricity import Electricity
from extinguisher import extinguisher
from refrigerant import refrigerant
from employee import employee
from Machinery import Machinery
from Nonemployee import NonEmployee
from insert.insert_nonemployee import insert_nonemployee
from insert.insert_Extinguisher_FillRec import insert_extinguisher_fill

# 盤查登錄表單
from emission_source import emission_source

# 盤查結果
from result import result

from 管理者.adminCompany import adminCompany
from 管理者.insert_adminCompany import insert_adminCompany
from 管理者.edit_adminCompany import edit_adminCompany
from 管理者.delete_adminCompany import delete_adminCompany
from 管理者.adminUser import adminUser
from 管理者.delete_adminUser import delete_adminUser
from 管理者.insert_adminUser import insert_adminUser
from 管理者.edit_adminUser import edit_adminUser
from 管理者.adminConsultant import adminConsultant
from 管理者.delete_adminConsultant import delete_adminConsultant
from 管理者.insert_adminConsultant import insert_adminConsultant
from 管理者.edit_adminConsultant import edit_adminConsultant

from 盤查報告書.getBusiness import word_companyinfo
from 盤查報告書.merge import get_word
from 盤查報告書.word_ai import word_ai
from 盤查報告書.word_爬蟲 import word_bug
from 盤查報告書.zGetReport import report_router
from 盤查報告書.上傳報告書 import report_upload_router



from 盤查清冊.zGetExcel import inventory_router
from 盤查清冊.上傳清冊 import inventory_upload_router

from 盤查清冊.各table.vehicle import get_vehicle
from 盤查清冊.各table.employee import get_employee
from 盤查清冊.各table.nonemployee import get_nonemployee
from 盤查清冊.各table.machinery import get_machinery
from 盤查清冊.各table.fire_extinguisher import get_fire_extinguisher
from 盤查清冊.各table.emergency_generator import get_generator
from 盤查清冊.各table.commute import get_commute
from 盤查清冊.各table.businesstrip import get_businesstrip
from 盤查清冊.各table.operationalwaste import get_operational_waste
from 盤查清冊.各table.sellingwaste import get_selling_waste
from 盤查清冊.各table.authorizedtable import get_authorized_users
from 盤查清冊.各table.electricity_usage import get_electricity


from 盤查清冊.各excel.getyear import latest_baseline_router

from 盤查清冊.各excel.excel_merge import excel_generator_router 


















from findone.vehicle import vehicle_findone
from findone.employee import employee_findone
from findone.Nonemployee import NonEmployee_findone
from findone.Machinery import Machinery_findone
from findone.Emergency_Generator import Emergency_Generator_findone
from findone.Machinery import Machinery_findone
from findone.Emergency_Generator import Emergency_Generator_findone
from findone.Electricity_Usage import ElectricityUsage_findone
from findone.commute import Commute_findone
from findone.Business_trip import Business_Trip_findone
from findone.Operational_Waste import Operational_Waste_findone
from findone.Selling_waste import Selling_waste_findone
from edit.edit_vehicle import edit_vehicle
from edit.edit_employee import edit_employee
from edit.edit_nonemployee import edit_nonemployee
from edit.edit_machine import edit_machine
from edit.edit_emergency import edit_emergency
from findone.extinguisher import Extinguisher_findone
from edit.edit_extinguisher import edit_extinguisher
from findone.extinguisher_Fill import ExtinguisherFill_findone
from edit.edit_extinguisherFill import edit_ExtinguisherFill
from insert.insert_RefFill import insert_RefFill
from findone.Ref import Ref_findone
from edit.edit_Ref import edit_Ref
from edit.edit_RefFill import edit_RefFill
from findone.RefFill import RefFill_findone
from edit.edit_commute import edit_commute
from edit.edit_BusinessTrip import edit_BusinessTrip
from edit.edit_OperationWaste import edit_OperationWaste
from edit.edit_SellingWaste import edit_SellingWaste
from edit.edit_electricityUsage import edit_ElectricityUsage
from findone.Electricity import Electricity_findone
from edit.edit_electricity import edit_electricity
from authorized_table import Authorized_table

from delete.delete_vehicle import delete_vehicle
from delete.delete_Extinguisher import delete_router
from delete.delete_employee import delete_employee
from delete.delete_nonemployee import delete_nonemployee
from delete.delete_Refrigerant import delete_refrigerant
from delete.delete_mahine import delete_machine
from delete.delete_emergency import delete_emergency
from delete.delete_commute import delete_commute
from delete.delete_OperationalWaste import delete_waste
from delete.delete_SellingWaste import delete_SellingWaste
from delete.delete_electricity import electricity_delete_router

from Fuel_Factor_GWP import Fuel_Factors
from power_emission_factor import Power_Emission_Factor
from GWP import gwp_factors

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
app.include_router(ocrapi_elec)
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
app.include_router(authorized_review)

app.include_router(insert_machine)
app.include_router(insert_emergency)
app.include_router(insert_electricity)
app.include_router(insert_electricity_usage)
app.include_router(insert_ref)
app.include_router(insert_commute)
app.include_router(insert_BusinessTrip)
app.include_router(insert_waste)
app.include_router(insert_Selling_waste)
app.include_router(insert_extinguisher_fill)
app.include_router(vehicle)

app.include_router(Selling_waste)
app.include_router(Operational_Waste)
app.include_router(Business_Trip)
app.include_router(Commute)
# app.include_router(Electricity_Usage)
app.include_router(Emergency_Generator)
app.include_router(Electricity)
app.include_router(extinguisher)
app.include_router(refrigerant)
app.include_router(employee)
app.include_router(Machinery)
app.include_router(NonEmployee)
app.include_router(insert_nonemployee)
app.include_router(langchaingpt)
app.include_router(emission_source)
app.include_router(result)
app.include_router(news)

app.include_router(adminCompany)
app.include_router(insert_adminCompany)
app.include_router(edit_adminCompany)
app.include_router(delete_adminCompany)
app.include_router(adminUser)
app.include_router(delete_adminUser)
app.include_router(insert_adminUser)
app.include_router(edit_adminUser)
app.include_router(adminConsultant)
app.include_router(delete_adminConsultant)
app.include_router(insert_adminConsultant)
app.include_router(edit_adminConsultant)






app.include_router(vehicle_findone)
app.include_router(employee_findone)
app.include_router(NonEmployee_findone)
app.include_router(Machinery_findone)
app.include_router(Emergency_Generator_findone)
app.include_router(ElectricityUsage_findone)
app.include_router(Commute_findone)
app.include_router(Business_Trip_findone)
app.include_router(Operational_Waste_findone)
app.include_router(Selling_waste_findone)
app.include_router(edit_vehicle)
app.include_router(edit_employee)
app.include_router(edit_nonemployee)
app.include_router(edit_machine)
app.include_router(edit_emergency)
app.include_router(Extinguisher_findone)
app.include_router(edit_extinguisher)
app.include_router(ExtinguisherFill_findone)
app.include_router(edit_ExtinguisherFill)
app.include_router(insert_RefFill)
app.include_router(Ref_findone)
app.include_router(edit_Ref)
app.include_router(edit_RefFill)
app.include_router(RefFill_findone)
app.include_router(edit_commute)
app.include_router(edit_BusinessTrip)
app.include_router(edit_OperationWaste)
app.include_router(edit_SellingWaste)
app.include_router(delete_vehicle)
app.include_router(Fuel_Factors)




app.include_router(word_companyinfo)
app.include_router(get_word)
app.include_router(word_ai)
app.include_router(word_bug)
app.include_router(report_router)
app.include_router(report_upload_router)



app.include_router(inventory_router)
app.include_router(inventory_upload_router)

app.include_router(get_vehicle)
app.include_router(get_employee)
app.include_router(get_fire_extinguisher)
app.include_router(get_nonemployee)
app.include_router(get_machinery)
app.include_router(get_generator)
app.include_router(get_commute)
app.include_router(get_businesstrip)
app.include_router(get_operational_waste)
app.include_router(get_selling_waste)
app.include_router(get_authorized_users)
app.include_router(get_electricity)



app.include_router(excel_generator_router)




app.include_router(latest_baseline_router)










app.include_router(delete_router)
app.include_router(delete_employee)
app.include_router(delete_nonemployee)
app.include_router(delete_refrigerant)
app.include_router(delete_machine)
app.include_router(delete_emergency)
app.include_router(delete_commute)
app.include_router(delete_waste)
app.include_router(delete_SellingWaste)
app.include_router(edit_ElectricityUsage)
app.include_router(Electricity_findone)
app.include_router(edit_electricity)
app.include_router(electricity_delete_router)
app.include_router(Authorized_table)
app.include_router(Power_Emission_Factor)
app.include_router(gwp_factors)