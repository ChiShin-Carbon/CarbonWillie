from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


result = APIRouter()

class Result(BaseModel):
    user_id: int
    field_name: str
    field_address: str
    is_inclusion: bool
    remark: str


@result.get("/result")
def read_result():
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = """
                SELECT activity_data FROM Activity_Data
                WHERE source_id = (SELECT source_id FROM Emission_Source WHERE source_table = 'Electricity_Usage')
            """
            cursor.execute(query)
            result_record = cursor.fetchone()
            conn.close()

            if result_record:
                result = {
                    "Electricity_Usage": result_record[0],
                }
                return {"result": result}  
            else:
                # Raise a 404 error if user not found
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Result not found")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading result credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
