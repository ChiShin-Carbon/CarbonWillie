from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

gwp_factors = APIRouter()

@gwp_factors.post("/gwp_factors")
def read_user_credentials():
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = "SELECT * FROM gwp_factors"
            cursor.execute(query)
            
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                result = [
                    {
                        "gwp_id": record[0],
                        "gwp_type": record[1],
                        "chemical_formula": record[2],
                        "gwp_value": record[3],
                        "publication_year": record[4],
                        "reference": record[5],
                        "updata_time": record[6].strftime("%Y-%m-%d %H:%M") if record[6] else None,
                    }
                    for record in user_records
                ]
                return {"gwp_factors": result}
            else:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No gwp_factors found for this user")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")