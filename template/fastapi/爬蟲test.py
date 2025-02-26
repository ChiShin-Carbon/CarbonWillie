import requests
from urllib.parse import urlencode
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from openai import OpenAI
from pdfminer.high_level import extract_text
from PyPDF2 import PdfReader
import os
import re
import ast
from connect.connect import connectDB
from datetime import datetime




# 載入環境變數
load_dotenv()

# 從環境變數取得 API Key
api_key = os.getenv("SERPAPI_API_KEY")
if not api_key:
    raise ValueError("❌ SERPAPI_API_KEY 未設定！")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # Pass the API key directly here


# 定義查詢參數
params = {
    "engine": "google",
    "q": "環境部公告 公告溫室氣體排放係數.pdf",
    "location": "Taiwan",
    "hl": "zh-TW",
    "gl": "tw",
    "google_domain": "google.com",
    "num": 1,
    "start": 0,
    "safe": "active",
    "api_key": api_key
}

# 組合 URL
base_url = "https://serpapi.com/search.json"
query_string = urlencode(params)
full_url = f"{base_url}?{query_string}"

# PDF 處理函數
def process_pdf(pdf_url):
    print(f"📥 下載 PDF：{pdf_url}")
    pdf_response = requests.get(pdf_url)
    if pdf_response.status_code == 200:
        pdf_filename = "downloaded_file.pdf"
        with open(pdf_filename, "wb") as file:
            file.write(pdf_response.content)
        print("✅ PDF 下載完成，開始解析內容...")

        # 讀取 PDF 並提取文字
        pdf_text = ""
        try:
            reader = PdfReader(pdf_filename)
            for page in reader.pages:
                pdf_text += page.extract_text()
        except Exception as e:
            print(f"❌ 無法解析 PDF：{e}")
            return None
        
        # 移除 PDF 文件
        os.remove(pdf_filename)
        
        # 返回前 2000 個字元
        return pdf_text
    else:
        print(f"❌ 無法下載 PDF，HTTP狀態碼：{pdf_response.status_code}")
        return None

try:
    response = requests.get(full_url, timeout=10)
    response.raise_for_status()  # 檢查是否有 HTTP 錯誤
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

            # 檢查是否為 PDF 檔案
            if re.search(r'\.pdf$', link, re.IGNORECASE):
                print("🔗 檢測到 PDF 檔案，開始處理 PDF...")
                article_text = process_pdf(link)
            else:
                # 嘗試擷取連結的網頁內容
                try:
                    page_response = requests.get(link, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
                    page_response.raise_for_status()

                    # 自動檢測並設置編碼
                    page_response.encoding = page_response.apparent_encoding or 'utf-8'

                    # 解析網頁內容
                    soup = BeautifulSoup(page_response.content, "html.parser")
                    article_text = soup.get_text(separator="\n").strip()

                    # 檢查並替換無法解碼的字元
                    if not article_text or "�" in article_text:
                        print("⚠️ 擷取內容包含無法解碼的字元，嘗試其他解碼方式...\n")
                        article_text = page_response.content.decode('utf-8', errors='replace')[:1000].strip()

                    if not article_text:
                        print("⚠️ 無法擷取內容或內容過短。\n")
                        continue

                except requests.exceptions.RequestException as e:
                    print(f"❌ 擷取網頁內容時發生錯誤：{e}\n")
                    continue
    else:
        print("⚠️ 沒有找到相關結果。")

except requests.exceptions.RequestException as e:
    print(f"❌ API 請求失敗：{e}")


if article_text:
    # Create the AI prompt for extracting emission coefficients
    ai_prompt = (
        "請根據以下文本提供環境部公告的溫室氣體排放係數。"
        "請從以下文本中擷取各種燃料的 CO2、CH4、N2O 燃料單位熱值之排放係數，並按照以下格式整理成二維陣列，單位：（公斤/兆焦耳）(kg/TJ)"
        "["
        "['車用汽油', 'CO2', 'CH4', 'N2O'],"
        "['柴油', 'CO2', 'CH4', 'N2O'],"
        "['乙烷', 'CO2', 'CH4', 'N2O'],"
        "['天然氣', 'CO2', 'CH4', 'N2O'],"
        "['事業廢棄物', 'CO2', 'CH4', 'N2O'],"
        "['車用汽油-未控制', 'CO2', 'CH4', 'N2O'],"
        "['車用汽油-氧化觸媒', 'CO2', 'CH4', 'N2O'],"
        "['車用汽油-1995年後之低里程輕型車輛', 'CO2', 'CH4', 'N2O']"
        "['柴油(移動燃燒排放源)', 'CO2', 'CH4', 'N2O']"
        "]\n"
        "文本內容顯示：車用汽油  \nGasoli ne Motor Gasoli ne 69,300  3 0.6 ，代表車用汽油的 CO2 排放係數為 69,300 公斤/兆焦耳，CH4 排放係數為 3 公斤/兆焦耳，N2O 排放係數為 0.6 公斤/兆焦耳。"
        "請在陣列中顯示[車用汽油, 69,300, 3, 0.6]。"
        "柴油  Gas/Diesel Oil  74,100  3 0.6，代表柴油的 CO2 排放係數為 74,100 公斤/兆焦耳，CH4 排放係數為 3 公斤/兆焦耳，N2O 排放係數為 0.6 公斤/兆焦耳。"
        "請在陣列中顯示[柴油, 74,100, 3, 0.6]。"
        "而車用汽油-未控制 、車用汽油-氧化觸媒、車用汽油-1995年和柴油(移動燃燒排放源)的CO2排放係數等於車用汽油和柴油的CO2固定燃燒排放係數"
        "注意：只需要輸出二維陣列，不需要其他任何格式、解釋、markdown。"
        "以下是擷取到的文本內容：\n"
        f"{article_text}"
    )

    # Call the Mistral or OpenAI API
    completion =client.chat.completions.create(
        model="gpt-4o",  # Make sure this model is supported by your client
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": ai_prompt}
        ]
    )

    # Print the response from the model
    print(completion.choices[0].message.content)  # Correctly access content using dot notation
else:
    print("⚠️ 無法提供回應，請檢查內容。")


# Parse the response safely
try:
    TJ_to_kcal_Array = ast.literal_eval(completion.choices[0].message.content)
except (SyntaxError, ValueError) as e:
    print(f"❌ 解析 OpenAI 回應失敗：{e}")
    TJ_to_kcal_Array = []

Kcal_to_TJ = 4.1868 * 10**-9 ##根據台灣溫室氣體排放量盤查作業指引113年版 
TJ_to_Kcal = 1 / Kcal_to_TJ  
n=len(TJ_to_kcal_Array)

# Convert and keep numbers as floats
for i in range(n):
    for j in range(1, 4):
        # Convert values to floats before calculation
        TJ_to_kcal_Array[i][j] = float(TJ_to_kcal_Array[i][j]) / TJ_to_Kcal

# Display the intermediate result in scientific notation
print("After Conversion to Kg/Kcal:")
for row in TJ_to_kcal_Array:
    formatted_row = [row[0]] + ["{:.2E}".format(x) for x in row[1:]]
    print(formatted_row)

# LHV values corresponding to each fuel type
LHV = [7800, 8400, 6156, 8000, 1, 7800, 7800, 7800, 8400]

# Perform calculations using float values
for i in range(n):
    # Append LHV to the current row
    TJ_to_kcal_Array[i].append(LHV[i])

    # Calculate emissions using float values
    CO2 = TJ_to_kcal_Array[i][1] * LHV[i]
    CH4 = TJ_to_kcal_Array[i][2] * LHV[i]
    N2O = TJ_to_kcal_Array[i][3] * LHV[i]

    # Append the raw float values
    TJ_to_kcal_Array[i].extend([CO2, CH4, N2O])

# Display the final result, consistently formatted
print("\nFinal Result in Scientific Notation:")
for row in TJ_to_kcal_Array:
    # Format the entire row consistently for display
    formatted_row = [row[0]] + ["{:.2E}".format(x) if isinstance(x, float) else x for x in row[1:]]
    print(formatted_row)

#insert to database
conn = connectDB()
if conn:
    cursor = conn.cursor()
    try:
        for i in range(len(TJ_to_kcal_Array)):
            row = TJ_to_kcal_Array[i]
            # Create the SQL query
            query = """
            INSERT INTO Fuel_Factors (FuelType, CO2_Emission, CH4_Emission, N2O_Emission, LowerHeatingValue, update_time)
            VALUES (?, ?, ?, ?, ?, ?)
                """
            values = (TJ_to_kcal_Array[i][0], TJ_to_kcal_Array[i][1], TJ_to_kcal_Array[i][2], TJ_to_kcal_Array[i][3], TJ_to_kcal_Array[i][4], datetime.now())

            print("Executing query:", query)

            cursor.execute(query, values)
        conn.commit()
        conn.close()
    except Exception as e:
        print("Database error:", e)
        conn.close()        
