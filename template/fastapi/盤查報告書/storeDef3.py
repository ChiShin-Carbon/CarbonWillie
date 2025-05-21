
import requests

API_URL = "http://localhost:8000/"  # 替換為實際 API 伺服器 URL

# 設定快取變數，避免重複請求 API
baseline_cache = None

def fetch_latest_baseline_year():
    """向 API 端點請求最新的 Baseline 年份資訊，並快取結果"""
    global baseline_cache
    if baseline_cache:
        return baseline_cache  # 直接返回快取資料，避免多次請求 API

    try:
        response = requests.get(f"{API_URL}latest_baseline_year")
        response.raise_for_status()
        data = response.json()
        baseline_cache = {
            "baseline_id": data.get("baseline_id", 0),
            "year": data.get("year", 0),
            "cfv_start_date": data.get("cfv_start_date", "日期未提供")
        }
        return baseline_cache
    except requests.RequestException as e:
        print(f"獲取最新 Baseline 年份資訊失敗: {e}")
        return {
            "baseline_id": 0,
            "year": 0,
            "cfv_start_date": "日期未提供"
        }

def get_latest_baseline_id():
    """獲取最新的 baseline_id，不重複請求 API"""
    return fetch_latest_baseline_year()["baseline_id"]

def get_latest_baseline_year():
    """獲取最新的 baseline 年份，不重複請求 API"""
    return fetch_latest_baseline_year()["year"]

def get_latest_cfv_start_date():
    """獲取最新的 cfv_start_date，不重複請求 API"""
    return fetch_latest_baseline_year()["cfv_start_date"]

def clear_cache():
    """清除快取，用於當需要強制更新資料時"""
    global baseline_cache
    baseline_cache = None