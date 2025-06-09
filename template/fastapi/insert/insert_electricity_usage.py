from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path
from decimal import Decimal

uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

insert_electricity_usage = APIRouter()

@insert_electricity_usage.post("/insert_electricity_usage")
async def read_user_credentials(
    electricity_id: int = Form(...),
    user_id: int = Form(...),
    date: str = Form(...),
    number: str = Form(...),
    start: str = Form(...),
    end: str = Form(...),
    electricity_type: int = Form(...),
    usage: Decimal = Form(...),
    amount: Decimal = Form(...),
    carbon_emission: Decimal = Form(...),
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
            # Insert into Electricity_Usage - without trying to get the ID in the same query
            query = """
                INSERT INTO Electricity_Usage (electricity_id, user_id, Doc_date, Doc_number, period_start, 
                period_end, electricity_type, usage, amount, carbon_emission, remark, img_path, edit_time)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            values = (electricity_id, user_id, date, number, start, end, electricity_type, 
                     usage, amount, carbon_emission, remark, str(image_path), datetime.now())

            print("Executing query:", query)  # Debug print
            print("With values:", values)     # Debug print

            cursor.execute(query, values)
            conn.commit()

            # Get baseline_id separately - similar to vehicle approach
            baseline_id_query = "SELECT baseline_id FROM Baseline WHERE is_completed = 0"
            cursor.execute(baseline_id_query)
            baseline_id = cursor.fetchone()[0]

            fuel_code = "350099"
            emission_remark = "台電-外購電力"  # Renamed to avoid conflict with parameter

            # Check if Emission_Source already exists
            check_query = "SELECT source_id FROM Emission_Source WHERE baseline_id = ? AND fuel_code = ? AND source_table = ?"
            cursor.execute(check_query, (baseline_id, fuel_code, "Electricity_Usage"))
            emission_source = cursor.fetchone()

            if emission_source:
                source_id = emission_source[0]  # Use existing source_id
            else:
                # Insert new Emission_Source - similar to vehicle approach
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
                    baseline_id, "Electricity_Usage", "000999", "9999", 0, fuel_code, 
                    1, "", 2, 1, "台灣電力公司", 0, emission_remark
                )
                cursor.execute(emission_source_query, emission_values)
                source_id = cursor.fetchone()[0]
                conn.commit()

            # Determine value to use based on electricity_type
            if electricity_type == 1:
                value_to_use = usage  # Use 'usage' when electricity_type is 1
            elif electricity_type == 2:
                value_to_use = amount  # Use 'amount' when electricity_type is 2
            else:
                raise ValueError("Invalid electricity_type: Must be 1 or 2")

            # 在 Activity_Data 表插入資料
            data_source = "活動數據盤點-電力使用量"
            save_unit = "管理部門"
            data_type = 0
            calorific_value = 7800  # 熱值

            # 查詢是否已有相同 source_id 之 Activity_Data 記錄
            check_activity_query = "SELECT activity_data FROM Activity_Data WHERE source_id = ?"
            cursor.execute(check_activity_query, (source_id,))
            existing_activity_data = cursor.fetchone()

            if existing_activity_data:
                # Update existing Activity_Data
                new_activity_data = existing_activity_data[0] + value_to_use
                update_activity_query = "UPDATE Activity_Data SET activity_data = ? WHERE source_id = ?"
                cursor.execute(update_activity_query, (new_activity_data, source_id))
            else:
                # Insert new Activity_Data
                insert_activity_query = """
                    INSERT INTO Activity_Data (
                        source_id, activity_data, distribution_ratio, activity_data_unit, data_source, save_unit, data_type,
                        calorific_value, moisture_content, carbon_content
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """
                insert_activity_values = (
                    source_id, value_to_use, 100, 4, data_source, save_unit, data_type, calorific_value, 0, 0
                )
                cursor.execute(insert_activity_query, insert_activity_values)
            conn.commit()
            
            # 查詢 Emission_Factor 表中的 factor 和 GWP
            factor_gwp_query = "SELECT gas_type, factor, GWP FROM Emission_Factor WHERE fuel_code = ?"
            cursor.execute(factor_gwp_query, (fuel_code,))
            factor_gwp_list = cursor.fetchall()

            if factor_gwp_list:
                for gas_type, factor, gwp in factor_gwp_list:
                    if carbon_emission is None or carbon_emission == 0:
    emissions = round(value_to_use * factor / 1000, 5)  # 使用因子計算排放量
else:
    emissions = round(carbon_emission / 1000, 5)  # 使用提供的碳排資料

                    emissions = round(carbon_emission / 1000, 5) #排放量
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
            conn.rollback()  # Rollback on error
            raise HTTPException(status_code=500, detail=f"Database insert error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")