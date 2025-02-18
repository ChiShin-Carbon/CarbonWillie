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
                us.Doc_date, us.Doc_number, us.period_start, us.period_end, us.electricity_type, 
                us.usage, us.amount, us.carbon_emission, us.remark AS usage_remark, us.img_path AS usage_img_path, us.user_id AS usage_user_id, uf.username AS usage_username, 
                us.edit_time AS usage_edit_time
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
                        "electricity_id": record[0],
                        "user_id": record[1],
                        "username": record[2],
                        "customer_number": record[3],
                        "remark": record[4],
                        "edit_time": record[5].strftime('%Y-%m-%d %H:%M'),
                    })
                if record[9]:  # If there is a fill record
                    electricities[electricity_id]["fillrec"].append({
                        "usage_id": record[9],
                        "Doc_date": record[10],
                        "Doc_number": record[11],
                        "period_start": record[12],
                        "period_end": record[13],
                        "electricity_type": float(record[14]),
                        "usage": float(record[15]),
                        "amount": float(record[16]),
                        "carbon_emission": float(record[17]),
                        "usage_remark": record[18],
                        "usage_img_path": record[19],
                        "usage_user_id": record[20],
                        "usage_username": record[21],
                        "usage_edit_time": record[22].strftime('%Y-%m-%d %H:%M'),
                    })
            return {"electricities": list(electricities.values())}
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
