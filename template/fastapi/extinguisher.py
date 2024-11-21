from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from collections import defaultdict

extinguisher = APIRouter()

@extinguisher.get("/extinguisher")
def read_extinguisher():
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = """
                SELECT 
                    e.extinguisher_id, e.user_id, u.username, e.item_name, e.ingredient,
                    e.specification, e.remark, e.img_path, e.edit_time,
                    f.fillrec_id, f.Doc_date, f.Doc_number, f.usage, f.remark AS fillrec_remark,
                    f.img_path AS fillrec_img_path, f.user_id AS fillrec_user_id, uf.username AS fillrec_username,
                    f.edit_time AS fillrec_edit_time
                FROM Extinguisher e
                LEFT JOIN Extinguisher_FillRec f ON e.extinguisher_id = f.extinguisher_id
                LEFT JOIN users u ON e.user_id = u.user_id
                LEFT JOIN users uf ON f.user_id = uf.user_id
                """
            cursor.execute(query)
            
            # Fetch all records for the user
            extinguisher_records = cursor.fetchall()
            conn.close()

            if not extinguisher_records:  # If no records are found
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No extinguishers found."
                )

            extinguishers = defaultdict(lambda: {
                "fillrec": []  # Initialize with an empty list for fill records
            })

            for record in extinguisher_records:
                extinguisher_id = record[0]
                if extinguisher_id not in extinguishers:
                    extinguishers[extinguisher_id].update({
                        "extinguisher_id": record[0],
                        "user_id": record[1],
                        "username": record[2],
                        "item_name": record[3],
                        "ingredient": record[4],
                        "specification": record[5],
                        "remark": record[6],
                        "img_path": record[7],
                        "edit_time": record[8],
                    })
                if record[9]:  # If there is a fill record
                    extinguishers[extinguisher_id]["fillrec"].append({
                        "fillrec_id": record[9],
                        "Doc_date": record[10],
                        "Doc_number": record[11],
                        "usage": record[12],
                        "fillrec_remark": record[13],
                        "fillrec_img_path": record[14],
                        "fillrec_user_id": record[15],
                        "fillrec_username": record[16],
                        "fillrec_edit_time": record[17],
                    })
            return {"extinguishers": list(extinguishers.values())}
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading extinguishers credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
