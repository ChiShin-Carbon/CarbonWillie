from typing import Optional
from fastapi import APIRouter, HTTPException, status, Query
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
def read_result(year: Optional[int] = Query(None)):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # 年分
            query_years = "SELECT DISTINCT YEAR(cfv_start_date) AS year FROM Baseline"
            cursor.execute(query_years)
            year_rows = cursor.fetchall()
            available_years = sorted([row[0] for row in year_rows], reverse=True)

            if not available_years:
                raise HTTPException(status_code=404, detail="No available years")

            # 先找出最新具備電力或盤查資料的年分
            selected_year = None
            electricity_usage = None

            for y in available_years:
                has_data = False

                # 查詢該年度電力資料
                cursor.execute("""
                    SELECT activity_data FROM Activity_Data 
                    WHERE source_id = (
                        SELECT source_id FROM Emission_Source 
                        WHERE source_table = 'Electricity_Usage' 
                        AND baseline_id = (
                            SELECT baseline_id FROM Baseline WHERE YEAR(cfv_start_date)=?
                        )
                    )
                """, (y,))
                electricity_record = cursor.fetchone()

                # 查詢該年度盤查資料是否存在
                cursor.execute("""
                    SELECT COUNT(*) FROM Quantitative_inventory qi
                    JOIN Emission_Source es ON qi.source_id = es.source_id
                    WHERE es.baseline_id IN (
                        SELECT baseline_id FROM Baseline WHERE YEAR(cfv_start_date) = ?
                    )
                """, (y,))
                inventory_count = cursor.fetchone()[0]

                # 有任一資料，則使用該年度
                if electricity_record or inventory_count > 0:
                    selected_year = y
                    if electricity_record:
                        electricity_usage = electricity_record[0]
                    break

            if selected_year is None:
                raise HTTPException(status_code=404, detail="No available data for any year")

            # 如果使用者有指定 year，則用指定的；否則使用自動判斷的 selected_year
            if year:
                if year not in available_years:
                    raise HTTPException(status_code=404, detail=f"No data available for year {year}")
            else:
                year = selected_year

            # 重新查詢該年度的電力資料
            cursor.execute("""
                SELECT activity_data FROM Activity_Data 
                WHERE source_id = (
                    SELECT source_id FROM Emission_Source 
                    WHERE source_table = 'Electricity_Usage' 
                    AND baseline_id = (
                        SELECT baseline_id FROM Baseline WHERE YEAR(cfv_start_date)=?
                    )
                )
            """, (year,))
            electricity_record = cursor.fetchone()
            electricity_usage = electricity_record[0] if electricity_record else "0"


            # 全廠電力
            # query_electricity_usage = """
            #     SELECT activity_data FROM Activity_Data 
            #     WHERE source_id = (
            #         SELECT source_id FROM Emission_Source 
            #         WHERE source_table = 'Electricity_Usage' 
            #         AND baseline_id = (
            #             SELECT baseline_id FROM Baseline WHERE YEAR(cfv_start_date)=?
            #         )
            #     )
            # """
            # cursor.execute(query_electricity_usage, (year,))
            # electricity_usage_record = cursor.fetchone()
            
            # if not electricity_usage_record:
            #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Electricity usage data not found")

            # electricity_usage = electricity_usage_record[0]

            # 排放當量
            query_result = """
                SELECT
                    -- (1) 總排放當量
                    SUM(qi.emission_equivalent) AS total_emission_equivalent,

                    -- (2) 全廠 七大溫室氣體排放當量
                    SUM(CASE WHEN qi.gas_type = 1 THEN qi.emission_equivalent ELSE 0 END) AS CO2_emission_equivalent,
                    SUM(CASE WHEN qi.gas_type = 2 THEN qi.emission_equivalent ELSE 0 END) AS CH4_emission_equivalent,
                    SUM(CASE WHEN qi.gas_type = 3 THEN qi.emission_equivalent ELSE 0 END) AS N2O_emission_equivalent,
                    SUM(CASE WHEN qi.gas_type = 4 THEN qi.emission_equivalent ELSE 0 END) AS HFCS_emission_equivalent,
                    SUM(CASE WHEN qi.gas_type = 5 THEN qi.emission_equivalent ELSE 0 END) AS PFCS_emission_equivalent,
                    SUM(CASE WHEN qi.gas_type = 6 THEN qi.emission_equivalent ELSE 0 END) AS SF6_emission_equivalent,
                    SUM(CASE WHEN qi.gas_type = 7 THEN qi.emission_equivalent ELSE 0 END) AS NF3_emission_equivalent,

                    -- (3) 範疇一 總排放當量
                    SUM(CASE WHEN es.emission_category = 1 THEN qi.emission_equivalent ELSE 0 END) AS category1_total_emission_equivalent,

                    -- (4) 範疇一 七大溫室氣體排放當量
                    SUM(CASE WHEN es.emission_category = 1 AND qi.gas_type = 1 THEN qi.emission_equivalent ELSE 0 END) AS category1_CO2_emission_equivalent,
                    SUM(CASE WHEN es.emission_category = 1 AND qi.gas_type = 2 THEN qi.emission_equivalent ELSE 0 END) AS category1_CH4_emission_equivalent,
                    SUM(CASE WHEN es.emission_category = 1 AND qi.gas_type = 3 THEN qi.emission_equivalent ELSE 0 END) AS category1_N2O_emission_equivalent,
                    SUM(CASE WHEN es.emission_category = 1 AND qi.gas_type = 4 THEN qi.emission_equivalent ELSE 0 END) AS category1_HFCS_emission_equivalent,
                    SUM(CASE WHEN es.emission_category = 1 AND qi.gas_type = 5 THEN qi.emission_equivalent ELSE 0 END) AS category1_PFCS_emission_equivalent,
                    SUM(CASE WHEN es.emission_category = 1 AND qi.gas_type = 6 THEN qi.emission_equivalent ELSE 0 END) AS category1_SF6_emission_equivalent,
                    SUM(CASE WHEN es.emission_category = 1 AND qi.gas_type = 7 THEN qi.emission_equivalent ELSE 0 END) AS category1_NF3_emission_equivalent,

                    -- (5) 範疇一 排放形式排放量
                    SUM(CASE WHEN es.emission_category = 1 AND es.emission_pattern = 1 THEN qi.emission_equivalent ELSE 0 END) AS stationary_emission_equivalent,
                    SUM(CASE WHEN es.emission_category = 1 AND es.emission_pattern = 2 THEN qi.emission_equivalent ELSE 0 END) AS mobile_emission_equivalent,
                    SUM(CASE WHEN es.emission_category = 1 AND es.emission_pattern = 3 THEN qi.emission_equivalent ELSE 0 END) AS process_emission_equivalent,
                    SUM(CASE WHEN es.emission_category = 1 AND es.emission_pattern = 4 THEN qi.emission_equivalent ELSE 0 END) AS fugitive_emission_equivalent,

                    -- (6) 範疇二 總排放當量
                    SUM(CASE WHEN es.emission_category = 2 THEN qi.emission_equivalent ELSE 0 END) AS category2_total_emission_equivalent

                FROM Quantitative_inventory qi
                JOIN Emission_Source es ON qi.source_id = es.source_id
                WHERE es.baseline_id IN (
                    SELECT baseline_id
                    FROM Baseline
                    WHERE YEAR(cfv_start_date) = ?
                );
            """
            cursor.execute(query_result,(year,))
            result_record = cursor.fetchone()

            if result_record:
                keys = [
                    "total_emission_equivalent",
                    "CO2_emission_equivalent",
                    "CH4_emission_equivalent",
                    "N2O_emission_equivalent",
                    "HFCS_emission_equivalent",
                    "PFCS_emission_equivalent",
                    "SF6_emission_equivalent",
                    "NF3_emission_equivalent",
                    "category1_total_emission_equivalent",
                    "category1_CO2_emission_equivalent",
                    "category1_CH4_emission_equivalent",
                    "category1_N2O_emission_equivalent",
                    "category1_HFCS_emission_equivalent",
                    "category1_PFCS_emission_equivalent",
                    "category1_SF6_emission_equivalent",
                    "category1_NF3_emission_equivalent",
                    "stationary_emission_equivalent",
                    "mobile_emission_equivalent",
                    "process_emission_equivalent",
                    "fugitive_emission_equivalent",
                    "category2_total_emission_equivalent"
                ]
                quantitative_inventory = {
                    key: (value if value is not None else 0)
                    for key, value in zip(keys, result_record)
                }
            else:
                quantitative_inventory = {key: 0 for key in keys}

            
            conn.close()

            return {
                "result": {
                    "Electricity_Usage": electricity_usage,
                    "Quantitative_Inventory": quantitative_inventory,
                    "Available_Years": available_years,
                    "Selected_Year": year
                }
            }
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading result credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
