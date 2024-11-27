from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from connect.connect import connectDB
from datetime import datetime
from pathlib import Path

uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

insert_vehicle = APIRouter()

@insert_vehicle.post("/insert_vehicle")
async def read_user_credentials(
    user_id: int = Form(...),
    date: str = Form(...),
    number: str = Form(...),
    oil_species: int = Form(...),
    liters: float = Form(...),
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
                INSERT INTO vehicle (user_id, Doc_date, Doc_number, oil_species, liters, remark, img_path, edit_time)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """
            values = (user_id, date, number, oil_species, liters, remark, str(image_path), datetime.now())

            print("Executing query:", query)  # Debug print
            print("With values:", values)     # Debug print

            cursor.execute(query, values)
            conn.commit()

            # 構建對應的 Emission_Source（排放源鑑別） 插入邏輯
            baseline_id = "SELECT TOP 1 baseline_id, cfv_start_date, cfv_end_date, edit_time FROM Baseline ORDER BY edit_time DESC"
            cursor.execute(baseline_id)
            baseline_id = cursor.fetchone()[0]

            fuel_code = "170001" if oil_species == 0 else "170006"  # 0: 汽油, 1: 柴油
            remark = "公務車-汽油" if oil_species == 0 else "公務車-柴油"

            # 查詢 Emission_Source 表，確認是否已存在相同之 fuel_code
            check_query = "SELECT source_id FROM Emission_Source WHERE fuel_code = ? AND source_table = ?"
            cursor.execute(check_query, (fuel_code, "Vehicle"))
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
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """
                emission_values = (
                    baseline_id, "Vehicle", "G20900", "0020", 0, fuel_code, 2, "", 1, 2, "", 0, remark
                )
                cursor.execute(emission_source_query, emission_values)
                conn.commit()
                source_id = cursor.lastrowid

            # 在 Activity_Data 表插入資料
            data_source = "活動數據盤點-公務車"
            save_unit = "管理部門"
            data_type = 3
            calorific_value = 7800 if oil_species == 0 else 8400  # 熱值

            # 查詢是否已有相同 source_id 之 Activity_Data 記錄
            check_activity_query = "SELECT activity_data FROM Activity_Data WHERE source_id = ?"
            cursor.execute(check_activity_query, (source_id,))
            existing_activity_data = cursor.fetchone()

            if existing_activity_data:
                # 若存在，累加 activity_data
                new_activity_data = existing_activity_data[0] + liters
                update_activity_query = "UPDATE Activity_Data SET activity_data = ? WHERE source_id = ?"
                cursor.execute(update_activity_query, (new_activity_data, source_id))
            else:
                # 若不存在，插入新記錄
                insert_activity_query = """
                    INSERT INTO Activity_Data (
                        source_id, activity_data, distribution_ratio, data_source, save_unit, data_type,
                        calorific_value, moisture_content, carbon_content
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """
                insert_activity_values = (
                    source_id, liters, 100, data_source, save_unit, data_type, calorific_value, 0, 0
                )
                cursor.execute(insert_activity_query, insert_activity_values)
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