import requests

API_URL = "http://localhost:8000/"  # 替換為實際 API 伺服器 URL

# 設定快取變數，避免重複請求 API
emission_cache = None

def fetch_emission_result():
    """向 API 端點請求排放量相關數據，並快取結果"""
    global emission_cache
    if emission_cache:
        return emission_cache  # 直接返回快取資料，避免多次請求 API

    try:
        response = requests.get(f"{API_URL}result")
        response.raise_for_status()
        data = response.json()
        
        # 提取量化清單數據
        quant_inventory = data.get("result", {}).get("Quantitative_Inventory", {})
        
        emission_cache = {
            "electricity_usage": data.get("result", {}).get("Electricity_Usage", 0),
            "total_emission_equivalent": quant_inventory.get("total_emission_equivalent", 0),
            "category1_total_emission_equivalent": quant_inventory.get("category1_total_emission_equivalent", 0),
            "category2_total_emission_equivalent": quant_inventory.get("category2_total_emission_equivalent", 0),
            # 以下是額外可能有用的數據
            "CO2_emission_equivalent": quant_inventory.get("CO2_emission_equivalent", 0),
            "CH4_emission_equivalent": quant_inventory.get("CH4_emission_equivalent", 0),
            "N2O_emission_equivalent": quant_inventory.get("N2O_emission_equivalent", 0),
            "stationary_emission_equivalent": quant_inventory.get("stationary_emission_equivalent", 0),
            "mobile_emission_equivalent": quant_inventory.get("mobile_emission_equivalent", 0),
            "process_emission_equivalent": quant_inventory.get("process_emission_equivalent", 0),
            "fugitive_emission_equivalent": quant_inventory.get("fugitive_emission_equivalent", 0)
        }
        return emission_cache
    except requests.RequestException as e:
        print(f"獲取排放量數據失敗: {e}")
        return {
            "electricity_usage": 0,
            "total_emission_equivalent": 0,
            "category1_total_emission_equivalent": 0,
            "category2_total_emission_equivalent": 0,
            "CO2_emission_equivalent": 0,
            "CH4_emission_equivalent": 0,
            "N2O_emission_equivalent": 0,
            "stationary_emission_equivalent": 0,
            "mobile_emission_equivalent": 0,
            "process_emission_equivalent": 0,
            "fugitive_emission_equivalent": 0
        }

def get_total_emission_equivalent():
    """獲取總排放當量，不重複請求 API"""
    return fetch_emission_result()["total_emission_equivalent"]

def get_category1_total_emission_equivalent():
    """獲取範疇一總排放當量，不重複請求 API"""
    return fetch_emission_result()["category1_total_emission_equivalent"]

def get_category2_total_emission_equivalent():
    """獲取範疇二總排放當量，不重複請求 API"""
    return fetch_emission_result()["category2_total_emission_equivalent"]

def get_electricity_usage():
    """獲取全廠電力使用量，不重複請求 API"""
    return fetch_emission_result()["electricity_usage"]

def get_co2_emission_equivalent():
    """獲取 CO2 排放當量，不重複請求 API"""
    return fetch_emission_result()["CO2_emission_equivalent"]

def get_mobile_emission_equivalent():
    """獲取移動排放當量，不重複請求 API"""
    return fetch_emission_result()["mobile_emission_equivalent"]

def clear_cache():
    """清除快取，用於當需要強制更新資料時"""
    global emission_cache
    emission_cache = None