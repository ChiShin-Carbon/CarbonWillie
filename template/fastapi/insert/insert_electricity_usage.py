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
            baseline_query = "SELECT TOP 1 baseline_id, cfv_start_date, cfv_end_date, edit_time FROM Baseline ORDER BY edit_time DESC"
            cursor.execute(baseline_query)
            baseline_id = cursor.fetchone()[0]

            fuel_code = "350099"
            emission_remark = "台電-外購電力"  # Renamed to avoid conflict with parameter

            # Check if Emission_Source already exists
            check_query = "SELECT source_id FROM Emission_Source WHERE fuel_code = ? AND source_table = ?"
            cursor.execute(check_query, (fuel_code, "Electricity_Usage"))
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
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """
                emission_values = (
                    baseline_id, "Electricity_Usage", "000999", "9999", 0, fuel_code, 
                    1, "", 2, 1, "台灣電力公司", 0, emission_remark
                )
                cursor.execute(emission_source_query, emission_values)
                conn.commit()
                
                # Now get the source_id in a separate query
                cursor.execute("SELECT @@IDENTITY")  # Get the last inserted ID
                source_id = cursor.fetchone()[0]

            # Determine value to use based on electricity_type
            if electricity_type == 1:
                value_to_use = usage  # Use 'usage' when electricity_type is 1
            elif electricity_type == 2:
                value_to_use = amount  # Use 'amount' when electricity_type is 2
            else:
                raise ValueError("Invalid electricity_type: Must be 1 or 2")

            # Check if Activity_Data exists for this source
            check_activity_query = "SELECT activity_data FROM Activity_Data WHERE source_id = ?"
            cursor.execute(check_activity_query, (source_id,))
            existing_activity_data = cursor.fetchone()

            data_source = "活動數據盤點-電力使用量"
            save_unit = "管理部門"
            data_type = 0
            calorific_value = 7800  # 熱值

            if existing_activity_data:
                # Update existing Activity_Data
                new_activity_data = existing_activity_data[0] + value_to_use
                update_activity_query = "UPDATE Activity_Data SET activity_data = ? WHERE source_id = ?"
                cursor.execute(update_activity_query, (new_activity_data, source_id))
            else:
                # Insert new Activity_Data
                insert_activity_query = """
                    INSERT INTO Activity_Data (
                        source_id, activity_data, distribution_ratio, data_source, save_unit, data_type,
                        calorific_value, moisture_content, carbon_content
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """
                insert_activity_values = (
                    source_id, value_to_use, 100, data_source, save_unit, data_type, calorific_value, 0, 0
                )
                cursor.execute(insert_activity_query, insert_activity_values)
            
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