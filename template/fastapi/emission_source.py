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
            # 查詢 七種溫室氣體年總排放當量
            total_emission_equivalent_query = """
                SELECT SUM(emission_equivalent) FROM Quantitative_Inventory
            """
            cursor.execute(total_emission_equivalent_query)
            total_emission_equivalent = cursor.fetchone()[0] or 0

            # 查詢每個fuel_code對應之氣體類型
            gas_type_query = """
                SELECT fuel_code, STRING_AGG(gas_type, ', ') AS gas_types
                FROM Emission_Factor
                GROUP BY fuel_code
            """
            cursor.execute(gas_type_query)
            gas_type_map = {row[0]: row[1] for row in cursor.fetchall()}

            # 查詢每個fuel_code對應之factor_data
            emission_factor_query = """
                SELECT 
                    fuel_code, 
                    gas_type, 
                    factor_type, 
                    factor, 
                    factor_source, 
                    confidence_interval_L, 
                    confidence_interval_U, 
                    GWP
                FROM Emission_Factor
                WHERE fuel_code IN (SELECT DISTINCT fuel_code FROM Emission_Source)
            """
            cursor.execute(emission_factor_query)
            emission_factor_map = {}
            for row in cursor.fetchall():
                if row[0] not in emission_factor_map:
                    emission_factor_map[row[0]] = []
                emission_factor_map[row[0]].append({
                    "gas_type": row[1],
                    "factor_type": row[2],
                    "factor": row[3],
                    "factor_source": row[4],
                    "confidence_interval_L": row[5],
                    "confidence_interval_U": row[6],
                    "GWP": row[7]
                })

            # 排放源鑑別
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

            if emission_source_records:
                result = []
                for record in emission_source_records:
                    gas_types = gas_type_map.get(record[4], "N/A")
                    emission_factors = emission_factor_map.get(record[4], [])

                    # 查詢source_id對應之活動數據
                    activity_data_query = """
                    SELECT 
                        activity_data, distribution_ratio, activity_data_unit, custom_unit_name,
                        data_source, save_unit, data_type, calorific_value, moisture_content, carbon_content
                    FROM Activity_Data WHERE source_id = ?"""
                    cursor.execute(activity_data_query, (record[0],))
                    activity_data_records = cursor.fetchall()
                    activity_data_list = [
                        {
                            "activity_data": activity[0],
                            "distribution_ratio": activity[1],
                            "activity_data_unit": activity[2],
                            "custom_unit_name": activity[3],
                            "data_source": activity[4],
                            "save_unit": activity[5],
                            "data_type": activity[6],
                            "calorific_value": activity[7],
                            "moisture_content": activity[8],
                            "carbon_content": activity[9]
                        }
                        for activity in activity_data_records
                    ]

                    # 查詢source_id對應之排放量&排放當量
                    emissions_query = "SELECT gas_type, emissions, emission_equivalent FROM Quantitative_Inventory WHERE source_id = ?"
                    cursor.execute(emissions_query, (record[0],))
                    emissions_records = cursor.fetchall()
                    emissions_list = [
                        {
                            "gas_type": emissions[0],
                            "emissions": emissions[1],
                            "emission_equivalent": emissions[2]
                        }
                        for emissions in emissions_records
                    ]

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
                        "gas_types": gas_types,
                        "emission_factors": emission_factors,
                        "activity_data": activity_data_list,
                        "emissions": emissions_list
                    }) 
                return {"emission_sources": result,  "total_emission_equivalent": total_emission_equivalent}  
            else:
                # Raise a 404 error if user not found
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Emission_Source not found")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading emission_source credentials: {e}")
        finally:
            conn.close()
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
