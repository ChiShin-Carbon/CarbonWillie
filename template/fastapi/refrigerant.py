from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from collections import defaultdict

refrigerant = APIRouter()

@refrigerant.get("/refrigerant")
def read_refrigerant():
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = """
                SELECT 
                    r.refrigerant_id, r.user_id, u.username, r.device_type, r.device_location,
                    r.refrigerant_type, r.remark, r.img_path, r.edit_time,
                    f.fillrec_id, f.Doc_date, f.Doc_number, f.usage, f.escape_rate, f.remark AS fillrec_remark,
                    f.img_path AS fillrec_img_path, f.user_id AS fillrec_user_id, uf.username AS fillrec_username,
                    f.edit_time AS fillrec_edit_time
                FROM Refrigerant r
                LEFT JOIN Refrigerant_FillRec f ON r.refrigerant_id = f.refrigerant_id
                LEFT JOIN users u ON r.user_id = u.user_id
                LEFT JOIN users uf ON f.user_id = uf.user_id
                """
            cursor.execute(query)
            
            # Fetch all records for the user
            refrigerant_records = cursor.fetchall()
            conn.close()

            if not refrigerant_records:  # If no records are found
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No refrigerants found."
                )

            refrigerants = defaultdict(lambda: {
                "fillrec": []  # Initialize with an empty list for fill records
            })

            for record in refrigerant_records:
                refrigerant_id = record[0]
                if refrigerant_id not in refrigerants:
                    refrigerants[refrigerant_id].update({
                        "refrigerant_id": record[0],
                        "user_id": record[1],
                        "username": record[2],
                        "device_type": record[3],
                        "device_location": record[4],
                        "refrigerant_type": record[5],
                        "remark": record[6],
                        "img_path": record[7],
                        "edit_time": record[8],
                    })
                if record[9]:  # If there is a fill record
                    refrigerants[refrigerant_id]["fillrec"].append({
                        "fillrec_id": record[9],
                        "Doc_date": record[10],
                        "Doc_number": record[11],
                        "usage": record[12],
                        "escape_rate": record[13],
                        "fillrec_remark": record[14],
                        "fillrec_img_path": record[15],
                        "fillrec_user_id": record[16],
                        "fillrec_username": record[17],
                        "fillrec_edit_time": record[18],
                    })
            return {"refrigerants": list(refrigerants.values())}
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading refrigerants credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
