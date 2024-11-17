from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


editcompanyinfo = APIRouter()

class Company(BaseModel):
    org_name: str
    county: str
    town: str
    postal_code: str
    org_address: str
    charge_person: str
    org_email: str
    contact_person: str
    telephone: str
    email: str
    phone:str

@editcompanyinfo.post("/editcompanyinfo")
def read_company_credentials(company: Company):
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using parameterized query to prevent SQL injection
            company_query = """
                UPDATE Company_Info 
                SET org_name = ?, county = ?, town = ?, postal_code = ?, org_address = ?, charge_person = ?, org_email = ? 
                WHERE business_id = '00993654'
            """
            cursor.execute(company_query, (
                company.org_name, company.county, company.town, company.postal_code, 
                company.org_address, company.charge_person, company.org_email
            ))
            contact_query = """
                UPDATE Contact_Info 
                SET contact_person = ?, telephone = ?, email = ?, phone = ? 
                WHERE business_id = '00993654'
            """
            cursor.execute(contact_query, (
                company.contact_person, company.telephone, company.email, company.phone
            ))
            conn.commit()  # Commit the changes

            if cursor.rowcount > 0:
                # If the update was successful
                return {"message": "Company information updated successfully"}
            else:
                # Raise a 404 error if the user was not found
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating company credentials: {e}")
        finally:
            conn.close()  # Close the connection
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")