import requests
import os
from urllib.parse import urlencode
from bs4 import BeautifulSoup

import os
from mistralai import Mistral


# 載入環境變數
from dotenv import load_dotenv
load_dotenv()

# 從環境變數取得 API Key
api_key = os.getenv("SERPAPI_API_KEY")
if not api_key:
    raise ValueError("❌ SERPAPI_API_KEY 未設定！")

# 定義查詢參數
params = {
    "engine": "google",
    "q": "一百十四年電力排碳係數",
    "location": "Taiwan",
    "hl": "zh-TW",
    "gl": "tw",
    "google_domain": "google.com",
    "num": 1,   # 顯示 5 筆結果以利測試
    "start": 0,
    "safe": "active",
    "api_key": api_key
}

# 組合 URL
base_url = "https://serpapi.com/search.json"
query_string = urlencode(params)
full_url = f"{base_url}?{query_string}"

# 執行 API 請求
try:
    response = requests.get(full_url)
    if response.status_code == 200:
        data = response.json()
        organic_results = data.get("organic_results", [])

        if organic_results:
            print("\n🔍 搜尋結果：\n")
            for i, result in enumerate(organic_results, 1):
                title = result.get("title", "無標題")
                snippet = result.get("snippet", "無描述")
                link = result.get("link", "#")

                print(f"{i}. 📰 **{title}**\n")
                print(f"📖 摘要：{snippet}\n🔗 連結：{link}\n")

                # 嘗試擷取連結的網頁內容
                try:
                    page_response = requests.get(link, headers={"User-Agent": "Mozilla/5.0"})
                    if page_response.status_code == 200:
                        soup = BeautifulSoup(page_response.content, "html.parser")
                        # 提取文章前 500 字以防過長
                        article_text = soup.get_text()[:1000].strip()
                    else:
                        print(f"⚠️ 無法擷取 {link} 內容，HTTP狀態碼：{page_response.status_code}\n")

                except Exception as e:
                    print(f"❌ 擷取全文時發生錯誤：{e}\n")

        else:
            print("⚠️ 沒有找到相關結果。")

    else:
        print(f"❌ API 請求失敗，HTTP狀態碼：{response.status_code}\n回應內容：{response.text}")

except Exception as e:
    print(f"❌ 錯誤：{e}")

AI_api_key = os.environ["MISTRAL_API_KEY"]
model = "codestral-latest"

client = Mistral(api_key=AI_api_key)
ai_prompt = f"僅輸出114年電力排碳係數：\n{article_text}"

chat_response = client.chat.complete(
    model= model,
    messages = [
        {
            "role": "user",
            "content": ai_prompt
        },
    ]
)
print("AI:",chat_response.choices[0].message.content)