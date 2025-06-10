from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path
from decimal import Decimal

insert_employee = APIRouter()
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

@insert_employee.post("/insert_employee")
async def read_user_credentials(
    user_id: int = Form(...),
    month: str = Form(...),
    employee_number: int = Form(...),
    daily_hours: int = Form(...),
    workday: int = Form(...),
    overtime: Decimal = Form(...),
    sick: Decimal = Form(...),
    personal: Decimal = Form(...),
    business: Decimal = Form(...),
    funeral: Decimal = Form(...),
    special: Decimal = Form(...),
    explain: str = Form(None),
    image: UploadFile = File(...)
):
    # Save image file
    image_path = uploads_dir / image.filename
    try:
        with open(image_path, "wb") as file:
            file.write(await image.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not save image file")

    # Database insertion
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            current_time = datetime.now()

            query = """
                INSERT INTO Employee (
                    user_id, period_date, employee_number, daily_hours, workday, overtime,
                    sick_leave, personal_leave, business_trip, wedding_and_funeral, special_leave,
                    remark, img_path, edit_time)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            values = (
                user_id,
                month,
                employee_number,
                daily_hours,
                workday,
                overtime,
                sick,
                personal,
                business,
                funeral,
                special,
                explain,
                str(image_path),
                current_time
            )

            print("Executing query:", query)  # Debug print
            print("With values:", values)     # Debug print

            cursor.execute(query, values)
            conn.commit()

            # 構建對應的 Emission_Source（排放源鑑別） 插入邏輯
            baseline_id_query = "SELECT baseline_id FROM Baseline WHERE is_completed = 0"
            cursor.execute(baseline_id_query)
            baseline_id = cursor.fetchone()[0]

            fuel_code = "360006" 
            remark = "化糞池"

            # 查詢 Emission_Source 表，確認是否已存在相同之 fuel_code
            check_query = "SELECT source_id FROM Emission_Source WHERE baseline_id = ? AND fuel_code = ? AND source_table = ?"
            cursor.execute(check_query, (baseline_id, fuel_code, "Employee"))
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
                    baseline_id, "Employee", "370004", "9795", 0, fuel_code, 2, "", 1, 4, "", 0, remark
                )
                cursor.execute(emission_source_query, emission_values)
                source_id = cursor.fetchone()[0]
                conn.commit()

            # 在 Activity_Data 表插入資料
            data_source = "活動數據盤點-化糞池"
            save_unit = "管理部門"
            data_type = 3
            calorific_value = 0  # 熱值
            person_hours = employee_number * daily_hours * workday

            # 查詢是否已有相同 source_id 之 Activity_Data 記錄
            check_activity_query = "SELECT activity_data FROM Activity_Data WHERE source_id = ?"
            cursor.execute(check_activity_query, (source_id,))
            existing_activity_data = cursor.fetchone()

            

            if existing_activity_data:
                # 若存在，累加 activity_data
                new_activity_data = existing_activity_data[0] + person_hours
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
                    source_id, person_hours, 100, 5, data_source, save_unit, data_type, calorific_value, 0, 0
                )
                cursor.execute(insert_activity_query, insert_activity_values)
            conn.commit()

            # 查詢 Emission_Factor 表中的 factor 和 GWP
            factor_gwp_query = "SELECT gas_type, factor, GWP FROM Emission_Factor WHERE fuel_code = ?"
            cursor.execute(factor_gwp_query, (fuel_code,))
            factor_gwp_list = cursor.fetchall()

            if factor_gwp_list:
                for gas_type, factor, gwp in factor_gwp_list:
                    emissions = round(person_hours * factor,5) #排放量
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
            print("Database error:", e)
            raise HTTPException(status_code=500, detail=f"Database insert error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")

