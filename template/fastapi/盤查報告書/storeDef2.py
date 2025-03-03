
import requests

API_URL = "http://localhost:8000/org_info/"  # 替換為實際 API 伺服器 URL

def get_org_name(user_id):
    """向 API 端點請求 org_name"""
    try:
        response = requests.get(f"{API_URL}{user_id}")
        response.raise_for_status()  # 檢查是否有錯誤
        data = response.json()
        return data.get("org_name", "機構名稱未提供")  # 預設值
    except requests.RequestException as e:
        print(f"獲取 org_name 失敗: {e}")
        return "機構名稱未提供"  # 避免程序崩潰