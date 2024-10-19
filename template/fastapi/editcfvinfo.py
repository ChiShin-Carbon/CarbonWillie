from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


editcfvinfo = APIRouter()

# class Company(BaseModel):
#     reason: int
#     GHG_Reg_Guide: bool
#     ISO_CNS_14064_1: bool
#     GHG_Protocol: bool
#     verification: bool
#     inspection_agency: str
#     GWP_version: str

@editcfvinfo.post("/editcfvinfo")
def read_company_credentials():
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using parameterized query to prevent SQL injection
            query = """
                UPDATE CFV_Info 
                SET reason = ?, GHG_Reg_Guide = ?, ISO_CNS_14064_1 = ?, GHG_Protocol = ?, verification = ?, inspection_agency = ?, GWP_version = ? 
                WHERE business_id = '00993654'
            """
            cursor.execute(query)
            conn.commit()  # Commit the changes

            if cursor.rowcount > 0:
                # If the update was successful
                return {"message": "CFV information updated successfully"}
            else:
                # Raise a 404 error if the user was not found
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CFV not found")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating cfv credentials: {e}")
        finally:
            conn.close()  # Close the connection
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")