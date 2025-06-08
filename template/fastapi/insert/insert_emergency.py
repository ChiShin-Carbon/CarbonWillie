from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path
from decimal import Decimal

uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

insert_emergency = APIRouter()

@insert_emergency.post("/insert_emergency")
async def read_user_credentials(
    user_id: int = Form(...),
    date: str = Form(...),
    number: str = Form(...),
    usage: Decimal = Form(...),
    remark: str = Form(...),
    image: UploadFile = File(...)
):
    image_path = uploads_dir / image.filename
    try:
        with open(image_path, "wb") as file:
            file.write(await image.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not save image file")

    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # Adjust placeholder syntax based on the database library you're using
            query = """
                INSERT INTO Emergency_Generator (user_id, Doc_date, Doc_number, usage, remark, img_path, edit_time)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """
            values = (user_id, date, number, usage, remark, str(image_path), datetime.now())
            print("Executing query:", query)  # Debug print
            print("With values:", values)     # Debug print

            cursor.execute(query, values)
            conn.commit()

            # 構建對應的 Emission_Source（排放源鑑別） 插入邏輯
            baseline_id_query = "SELECT baseline_id FROM Baseline WHERE is_completed = 0"
            cursor.execute(baseline_id_query)
            baseline_id = cursor.fetchone()[0]

            fuel_code = "170006"
            remark = "緊急發電機-柴油"

            # 查詢 Emission_Source 表，確認是否已存在相同之 fuel_code
            check_query = "SELECT source_id FROM Emission_Source WHERE baseline_id = ? AND fuel_code = ? AND source_table = ?"
            cursor.execute(check_query, (baseline_id, fuel_code, "Emergency_Generator"))
            emission_source = cursor.fetchone()

            if emission_source:
                source_id = emission_source[0] # 若已有記錄，取得已存在之source_id
            else:
                emission_source_query = """
                    INSERT INTO Emission_Source (
                        baseline_id, source_table, process_code, device_code, fuel_category, fuel_code,
                        trust_category, credibility_info, emission_category, emission_pattern, 
                        supplier, is_CHP, remark
                    )
                    OUTPUT INSERTED.source_id
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """
                emission_values = (
                    baseline_id, "Emergency_Generator", "000999", "9999", 0, fuel_code, 2, "", 1, 1, "", 0, remark
                )
                cursor.execute(emission_source_query, emission_values)
                source_id = cursor.fetchone()[0]
                conn.commit()

            # 在 Activity_Data 表插入資料
            data_source = "活動數據盤點-緊急發電機"
            save_unit = "管理部門"
            data_type = 3
            calorific_value = 8400 # 熱值

            # 查詢是否已有相同 source_id 之 Activity_Data 記錄
            check_activity_query = "SELECT activity_data FROM Activity_Data WHERE source_id = ?"
            cursor.execute(check_activity_query, (source_id,))
            existing_activity_data = cursor.fetchone()

            if existing_activity_data:
                # 若存在，累加 activity_data
                new_activity_data = existing_activity_data[0] + usage
                update_activity_query = "UPDATE Activity_Data SET activity_data = ? WHERE source_id = ?"
                cursor.execute(update_activity_query, (new_activity_data, source_id))
            else:
                # 若不存在，插入新記錄
                insert_activity_query = """
                    INSERT INTO Activity_Data (
                        source_id, activity_data, distribution_ratio, activity_data_unit, data_source, save_unit, data_type,
                        calorific_value, moisture_content, carbon_content
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """
                insert_activity_values = (
                    source_id, usage, 100, 2, data_source, save_unit, data_type, calorific_value, 0, 0
                )
                cursor.execute(insert_activity_query, insert_activity_values)
            conn.commit()

            # 查詢 Emission_Factor 表中的 factor 和 GWP
            factor_gwp_query = "SELECT gas_type, factor, GWP FROM Emission_Factor WHERE fuel_code = ?"
            cursor.execute(factor_gwp_query, (fuel_code,))
            factor_gwp_list = cursor.fetchall()

            if factor_gwp_list:
                for gas_type, factor, gwp in factor_gwp_list:
                    emissions = round((usage / 1000) * factor,5) #排放量
                    emission_equivalent = round(emissions * gwp, 5) #排放當量

                    # 在 Quantitative_Inventory 表插入資料
                    # 查詢是否已有相同 source_id 之 Quantitative_Inventory 記錄
                    check_emissions_query = "SELECT emissions, emission_equivalent FROM Quantitative_Inventory WHERE source_id = ? AND gas_type = ?"
                    cursor.execute(check_emissions_query, (source_id, gas_type))
                    existing_emissions = cursor.fetchone()

                    if existing_emissions:
                        # 若存在，累加 emissions, emission_equivalent
                        new_emissions = round(existing_emissions[0] + emissions, 5)
                        new_emission_equivalent = round(existing_emissions[1] + emission_equivalent, 5)
                        update_emissions_query = "UPDATE Quantitative_Inventory SET emissions = ?, emission_equivalent = ? WHERE source_id = ? AND gas_type = ?"
                        cursor.execute(update_emissions_query, (new_emissions, new_emission_equivalent, source_id, gas_type))
                    else:
                        # 若不存在，插入新記錄
                        insert_emissions_query = "INSERT INTO Quantitative_Inventory (source_id, gas_type, emissions, emission_equivalent) VALUES (?, ?, ?, ?)"
                        cursor.execute(insert_emissions_query, (source_id, gas_type, emissions, emission_equivalent))
                    conn.commit()

            return {"status": "success", "image_path": str(image_path)}
        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database insert error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")