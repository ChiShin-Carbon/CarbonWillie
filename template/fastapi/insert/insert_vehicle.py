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
            baseline_id = "SELECT TOP 1 baseline_id, cfv_start_date, cfv_end_date, edit_time FROM Baseline ORDER BY edit_time DESC"  # 假設基準年固定為 1，可根據需求調整
            cursor.execute(baseline_id)
            baseline_id = cursor.fetchone()[0]

            fuel_code = "170001" if oil_species == 0 else "170006"  # 0: 汽油, 1: 柴油
            remark = "公務車-汽油" if oil_species == 0 else "公務車-柴油"

            # 查詢 Emission_Source 表，確認是否已經存在相同的 fuel_code
            check_query = """
                SELECT COUNT(*) FROM Emission_Source
                WHERE fuel_code = ? AND source_table = ?
            """
            cursor.execute(check_query, (fuel_code, "Vehicle"))
            existing_count = cursor.fetchone()[0]

             # 如果該條記錄已經存在，則不插入
            if existing_count == 0:
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

            return {"status": "success", "image_path": str(image_path)}
        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database insert error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")