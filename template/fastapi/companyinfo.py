from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


companyinfo = APIRouter()


@companyinfo.post("/companyinfo")
def read_company_credentials():
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using parameterized query to prevent SQL injection
            query = """
                SELECT 
                    Co.business_id, Co.registration_number, Co.org_name, Co.factory_number, Co.county, Co.town, Co.postal_code, Co.org_address,
                    Co.charge_person, Co.org_email, Co.industry_code, Co.industry_name, cont.contact_person, cont.telephone, cont.email, cont.phone, 
                    cfv.reason, cfv.GHG_Reg_Guide, cfv.ISO_CNS_14064_1, cfv.GHG_Protocol, cfv.verification, cfv.inspection_agency, 
                    cfv.significance, cfv.materiality, cfv.exclusion, cfv.GWP_version 
                FROM Company_Info Co 
                LEFT JOIN Contact_Info cont ON Co.business_id = cont.business_id 
                LEFT JOIN CFV_Info cfv ON Co.business_id = cfv.business_id 
                WHERE Co.business_id = '00993654'
            """
            cursor.execute(query)   # Use parameterized query
            company_record = cursor.fetchone()
            conn.close()

            if company_record:
                # Convert the result into a dictionary
                result = {
                    "business_id": company_record[0],
                    "registration_number": company_record[1],
                    "org_name": company_record[2],
                    "factory_number": company_record[3],
                    "county": company_record[4],
                    "town": company_record[5],
                    "postal_code": company_record[6],
                    "org_address": company_record[7],
                    "charge_person": company_record[8],
                    "org_email": company_record[9],
                    "industry_code": company_record[10],
                    "industry_name": company_record[11],
                    "contact_person": company_record[12],
                    "telephone": company_record[13],
                    "email": company_record[14],
                    "phone": company_record[15],
                    "reason": company_record[16],
                    "GHG_Reg_Guide": company_record[17],
                    "ISO_CNS_14064_1": company_record[18],
                    "GHG_Protocol": company_record[19],
                    "verification": company_record[20],
                    "inspection_agency": company_record[21],
                    "significance": company_record[22],
                    "materiality": company_record[23],
                    "exclusion": company_record[24],
                    "GWP_version": company_record[25]
                }
                return {"company": result}  
            else:
                # Raise a 404 error if user not found
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading company credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
