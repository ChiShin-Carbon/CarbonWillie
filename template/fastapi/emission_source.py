from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


emission_source = APIRouter()

class Emission_Source(BaseModel):
    source_id: int
    process_code: str
    device_code: str
    fuel_category: bool
    fuel_code: str
    trust_category: int
    credibility_info: str
    is_bioenergy: bool
    emission_category: int
    emission_pattern: int
    process_category: int
    escape_category: int
    power_category: int
    supplier: str
    is_CHP: bool
    remark: str


# 編輯排放源鑑別
# @emission_source.put("/emission_source/{source_id}")
# def update_emission_source(source_id: int, boundary: Emission_Source):
#     conn = connectDB()
#     if conn:
#         cursor = conn.cursor()
#         try:
#             query = """
#                 UPDATE Emission_Source
#                 SET user_id = ?, field_name = ?, field_address = ?, is_inclusion = ?, remark = ?
#                 WHERE source_id = ?
#             """
#             cursor.execute(query, (boundary.user_id, boundary.field_name, boundary.field_address, boundary.is_inclusion, boundary.remark, boundary_id))
#             conn.commit()
#             conn.close()
#             return {"message": "Emission_Source updated successfully"}
        
#         except Exception as e:
#             conn.rollback()
#             raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating emission_source: {e}")
#     else:
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")

@emission_source.get("/emission_source")
def read_emission_source():
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            gas_type_query = """
                SELECT fuel_code, STRING_AGG(gas_type, ', ') AS gas_types
                FROM Emission_Factor
                GROUP BY fuel_code
            """
            cursor.execute(gas_type_query)
            gas_type_map = {row[0]: row[1] for row in cursor.fetchall()}

            emission_source_query = """
                SELECT 
                    source_id, process_code, device_code, fuel_category, fuel_code, trust_category, 
                    credibility_info, is_bioenergy, emission_category, emission_pattern, process_category, 
                    escape_category, power_category, supplier, is_CHP, remark
                FROM Emission_Source
                WHERE baseline_id = (
                    SELECT TOP 1 baseline_id 
                    FROM Baseline ORDER BY edit_time DESC
                )"""
            cursor.execute(emission_source_query)
            emission_source_records = cursor.fetchall()
            conn.close()

            if emission_source_records:
                result = []
                for record in emission_source_records:
                    gas_types = gas_type_map.get(record[4], "N/A")
                    result.append({
                        "source_id": record[0],
                        "process_code": record[1],
                        "device_code": record[2],
                        "fuel_category": record[3],
                        "fuel_code": record[4],
                        "trust_category": record[5],
                        "credibility_info": record[6],
                        "is_bioenergy": record[7],
                        "emission_category": record[8],
                        "emission_pattern": record[9],
                        "process_category": record[10],
                        "escape_category": record[11],
                        "power_category": record[12],
                        "supplier": record[13],
                        "is_CHP": record[14],
                        "remark": record[15],
                        "gas_types": gas_types
                    }) 
                return {"emission_sources": result}  
            else:
                # Raise a 404 error if user not found
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Emission_Source not found")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading emission_source credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
