from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from collections import defaultdict

Electricity = APIRouter()

@Electricity.get("/Electricity")
def read_electricity():
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = """
            SELECT 
                e.electricity_id, e.user_id, u.username, e.customer_number, e.remark, e.edit_time,
                us.usage_id, us.Doc_date, us.Doc_number, us.period_start, us.period_end, us.electricity_type, 
                us.usage, us.amount, us.carbon_emission, us.remark AS usage_remark, us.img_path AS usage_img_path, 
                us.user_id AS usage_user_id, uf.username AS usage_username, us.edit_time AS usage_edit_time
            FROM Electricity e
            LEFT JOIN Electricity_Usage us ON e.electricity_id = us.electricity_id
            LEFT JOIN users u ON e.user_id = u.user_id
            LEFT JOIN users uf ON us.user_id = uf.user_id
            """
            cursor.execute(query)
            
            # Fetch all records for the user
            electricity_records = cursor.fetchall()
            conn.close()

            if not electricity_records:  # If no records are found
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No electricities found."
                )

            electricities = defaultdict(lambda: {
                "fillrec": []  # Initialize with an empty list for fill records
            })

            for record in electricity_records:
                electricity_id = record[0]
                if electricity_id not in electricities:
                    electricities[electricity_id].update({
                        "electricity_id": electricity_id,
                        "user_id": record[1],
                        "username": record[2],
                        "customer_number": record[3],
                        "remark": record[4],
                        "edit_time": record[5].strftime('%Y-%m-%d %H:%M'),
                    })
                if record[6]:  # If there is a fill record
                    # electricity_type = record[14] if record[14] is not None else 0
                    # usage_value = 0
                    # amount_value = 0

                    # if electricity_type == 1:
                    #     usage_value = float(record[15]) if record[15] is not None else 0
                    # elif electricity_type == 2:
                    #     amount_value = float(record[16]) if record[16] is not None else 0

                    electricities[electricity_id]["fillrec"].append({
                        "usage_id": record[6],
                        "Doc_date": record[7],
                        "Doc_number": record[8],
                        "period_start": record[9],
                        "period_end": record[10],
                        "electricity_type": record[11],
                        "usage": float(record[12]),
                        "amount": record[13],
                        "carbon_emission": float(record[14]),
                        "usage_remark": record[15],
                        "usage_img_path": record[16],
                        "usage_user_id": record[17],
                        "usage_username": record[18],
                        "usage_edit_time": record[19].strftime('%Y-%m-%d %H:%M'),
                    })
            return {"electricities": list(electricities.values())}
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
