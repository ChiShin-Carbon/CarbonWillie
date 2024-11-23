from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from fastapi.middleware.cors import CORSMiddleware

adminCompany = APIRouter()

@adminCompany.get("/adminCompany")
def read_all_company_data():
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to fetch all data from the Company_Info table
            query = """
                SELECT 
                    Co.business_id, Co.registration_number, Co.org_name, Co.factory_number, Co.county, Co.town, Co.postal_code, Co.org_address,
                    Co.charge_person, Co.org_email, Co.industry_code, Co.industry_name, cont.contact_person, cont.telephone, cont.email, cont.phone, 
                    cfv.reason, cfv.GHG_Reg_Guide, cfv.ISO_CNS_14064_1, cfv.GHG_Protocol, cfv.verification, cfv.inspection_agency, 
                    cfv.significance, cfv.materiality, cfv.exclusion, cfv.GWP_version 
                FROM Company_Info Co 
                LEFT JOIN Contact_Info cont ON Co.business_id = cont.business_id 
                LEFT JOIN CFV_Info cfv ON Co.business_id = cfv.business_id
            """
            cursor.execute(query)
            company_records = cursor.fetchall()
            conn.close()

            if company_records:
                # Convert results into a list of dictionaries
                results = []
                for record in company_records:
                    results.append({
                        "business_id": record[0],
                        "registration_number": record[1],
                        "org_name": record[2],
                        "factory_number": record[3],
                        "county": record[4],
                        "town": record[5],
                        "postal_code": record[6],
                        "org_address": record[7],
                        "charge_person": record[8],
                        "org_email": record[9],
                        "industry_code": record[10],
                        "industry_name": record[11],
                        "contact_person": record[12],
                        "telephone": record[13],
                        "email": record[14],
                        "phone": record[15],
                        "reason": record[16],
                        "GHG_Reg_Guide": record[17],
                        "ISO_CNS_14064_1": record[18],
                        "GHG_Protocol": record[19],
                        "verification": record[20],
                        "inspection_agency": record[21],
                        "significance": record[22],
                        "materiality": record[23],
                        "exclusion": record[24],
                        "GWP_version": record[25]
                    })
                return {"companies": results}  
            else:
                # Raise a 404 error if no data found
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No company data found")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading company data: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
