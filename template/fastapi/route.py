from fastapi import APIRouter
from connect.connect import connectDB
router = APIRouter()

@router.get("/users")
def read_users():
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        cursor.execute("SELECT user_id, business_id, username, email, telephone, phone, department, position, address, password FROM users")  # Query the users1 table
        users = cursor.fetchall()
        conn.close()

        # Convert rows into a list of dictionaries
        user_list = []
        for row in users:
            user_dict = {
                "user_id": row[0],
                "business_id": row[1],
                "username": row[2],
                "email": row[3],
                "telephone": row[4],
                "phone": row[5],
                "department": row[6],
                "position": row[7],
                "address": row[8],
                "password": row[9]
            }
            user_list.append(user_dict)

        return {"users": user_list}

    else:
        return {"error": "Could not connect to the database."}

@router.post("/create/")
def create_user(name: str):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO test (name) VALUES (?)", name)
        conn.commit()
        conn.close()
        return {"success": "User created successfully!"}
    else:
        return {"error": "Could not connect to the database."}

@router.get("/Company_Info")
def read_Company_Info():
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        cursor.execute("""
                SELECT 
                    Co.business_id, Co.registration_number, Co.org_name, Co.factory_number, Co.county, Co.town, Co.postal_code, Co.org_address,
                    Co.charge_person, Co.org_email, Co.industry_code, Co.industry_name, cont.contact_person, cont.telephone, cont.email, cont.phone, 
                    cfv.reason, cfv.GHG_Reg_Guide, cfv.ISO_CNS_14064_1, cfv.GHG_Protocol, cfv.verification, cfv.inspection_agency, 
                    cfv.significance, cfv.materiality, cfv.exclusion, cfv.GWP_version 
                FROM Company_Info Co 
                LEFT JOIN Contact_Info cont ON Co.business_id = cont.business_id 
                LEFT JOIN CFV_Info cfv ON Co.business_id = cfv.business_id 
                WHERE Co.business_id = '00993654'
            """)  # Query the Company_Info table
        Company_Info = cursor.fetchall()
        conn.close()

        # Convert rows into a list of dictionaries
        company_list = []
        for row in Company_Info:
            company_dict = {
                "business_id": row[0],
                "registration_number": row[1],
                "org_name": row[2],
                "factory_number": row[3],
                "county": row[4],
                "town": row[5],
                "postal_code": row[6],
                "org_address": row[7],
                "charge_person": row[8],
                "org_email": row[9],
                "industry_code": row[10],
                "industry_name": row[11],
                "contact_person": row[12],
                "telephone": row[13],
                "email": row[14],
                "phone": row[15],
                "reason": row[16],
                "GHG_Reg_Guide": row[17],
                "ISO_CNS_14064_1": row[18],
                "GHG_Protocol": row[19],
                "verification": row[20],
                "inspection_agency": row[21],
                "significance": row[22],
                "materiality": row[23],
                "exclusion": row[24],
                "GWP_version": row[25]
            }
            company_list.append(company_dict)

        return {"Company_Info": company_list}

    else:
        return {"error": "Could not connect to the database."}