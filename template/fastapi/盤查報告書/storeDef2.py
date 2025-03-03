import requests

API_URL = "http://localhost:8000/org_info/"  # 替換為實際 API 伺服器 URL

# 設定快取變數，避免重複請求 API
org_info_cache = {}

def fetch_org_info(user_id):
    """向 API 端點請求完整的機構資訊，並快取結果"""
    global org_info_cache
    if user_id in org_info_cache:
        return org_info_cache[user_id]  # 直接返回快取資料，避免多次請求 API

    try:
        response = requests.get(f"{API_URL}{user_id}")
        response.raise_for_status()
        data = response.json()
        org_info_cache[user_id] = {
            "business_id": data.get("business_id", "business_id 未提供"),
            "org_name": data.get("org_name", "機構名稱未提供"),
            "org_address": data.get("org_address", "地址未提供"),
            "charge_person": data.get("charge_person", "負責人未提供")
        }
        return org_info_cache[user_id]
    except requests.RequestException as e:
        print(f"獲取機構資訊失敗: {e}")
        return {
            "business_id": "business_id 未提供",
            "org_name": "機構名稱未提供",
            "org_address": "地址未提供",
            "charge_person": "負責人未提供"
        }

def get_org_name(user_id):
    """獲取 org_name，不重複請求 API"""
    return fetch_org_info(user_id)["org_name"]

def get_org_address(user_id):
    """獲取 org_address，不重複請求 API"""
    return fetch_org_info(user_id)["org_address"]

def get_charge_person(user_id):
    """獲取 charge_person，不重複請求 API"""
    return fetch_org_info(user_id)["charge_person"]

def get_business_id(user_id):
    """獲取 business_id，不重複請求 API"""
    return fetch_org_info(user_id)["business_id"]
