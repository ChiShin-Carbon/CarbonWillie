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
            # 全廠電力
            query_electricity_usage = """
                SELECT activity_data FROM Activity_Data
                WHERE source_id = (SELECT source_id FROM Emission_Source WHERE source_table = 'Electricity_Usage')
            """
            cursor.execute(query_electricity_usage)
            electricity_usage_record = cursor.fetchone()
            
            if not electricity_usage_record:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Electricity usage data not found")

            electricity_usage = electricity_usage_record[0]

            # 排放當量
            query_result = """
                SELECT
                    -- (1) 總和
                    SUM(qi.emission_equivalent) AS total_emission_equivalent,

                    -- (2) 按 gas_type 分類加總
                    SUM(CASE WHEN qi.gas_type = 1 THEN qi.emission_equivalent ELSE 0 END) AS CO2_emission_equivalent,
                    SUM(CASE WHEN qi.gas_type = 2 THEN qi.emission_equivalent ELSE 0 END) AS CH4_emission_equivalent,
                    SUM(CASE WHEN qi.gas_type = 3 THEN qi.emission_equivalent ELSE 0 END) AS N2O_emission_equivalent,
                    SUM(CASE WHEN qi.gas_type = 4 THEN qi.emission_equivalent ELSE 0 END) AS HFCS_emission_equivalent,
                    SUM(CASE WHEN qi.gas_type = 5 THEN qi.emission_equivalent ELSE 0 END) AS PFCS_emission_equivalent,
                    SUM(CASE WHEN qi.gas_type = 6 THEN qi.emission_equivalent ELSE 0 END) AS SF6_emission_equivalent,
                    SUM(CASE WHEN qi.gas_type = 7 THEN qi.emission_equivalent ELSE 0 END) AS NF3_emission_equivalent,

                    -- (3) emission_category=1 加總
                    SUM(CASE WHEN es.emission_category = 1 THEN qi.emission_equivalent ELSE 0 END) AS category1_total_emission_equivalent,

                    -- (4) emission_category=1 且按 emission_pattern 分類加總
                    SUM(CASE WHEN es.emission_category = 1 AND es.emission_pattern = 1 THEN qi.emission_equivalent ELSE 0 END) AS 固定排放_emission_equivalent,
                    SUM(CASE WHEN es.emission_category = 1 AND es.emission_pattern = 2 THEN qi.emission_equivalent ELSE 0 END) AS 移動排放_emission_equivalent,
                    SUM(CASE WHEN es.emission_category = 1 AND es.emission_pattern = 3 THEN qi.emission_equivalent ELSE 0 END) AS 製程排放_emission_equivalent,
                    SUM(CASE WHEN es.emission_category = 1 AND es.emission_pattern = 4 THEN qi.emission_equivalent ELSE 0 END) AS 逸散排放_emission_equivalent,

                    -- (5) emission_category=2 加總
                    SUM(CASE WHEN es.emission_category = 2 THEN qi.emission_equivalent ELSE 0 END) AS category2_total_emission_equivalent

                FROM Quantitative_inventory qi
                JOIN Emission_Source es ON qi.source_id = es.source_id;
            """
            cursor.execute(query_result)
            result_record = cursor.fetchone()

            if result_record:
                quantitative_inventory = {
                    "total_emission_equivalent": result_record[0],
                    "CO2_emission_equivalent": result_record[1],
                    "CH4_emission_equivalent": result_record[2],
                    "N2O_emission_equivalent": result_record[3],
                    "HFCS_emission_equivalent": result_record[4],
                    "PFCS_emission_equivalent": result_record[5],
                    "SF6_emission_equivalent": result_record[6],
                    "NF3_emission_equivalent": result_record[7],
                    "category1_total_emission_equivalent": result_record[8], #範疇一
                    "stationary_emission_equivalent": result_record[9], #固定排放
                    "mobile_emission_equivalent": result_record[10], #移動排放
                    "process_emission_equivalent": result_record[11], # 製程排放
                    "fugitive_emission_equivalent": result_record[12], #逸散排放
                    "category2_total_emission_equivalent": result_record[13], #範疇二
                }
            else:
                quantitative_inventory = {}
            
            conn.close()

            return {
                "result": {
                    "Electricity_Usage": electricity_usage,
                    "Quantitative_Inventory": quantitative_inventory
                }
            }
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading result credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
