import requests
from urllib.parse import urlencode
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from openai import OpenAI
from PyPDF2 import PdfReader
import os
import re
import ast
from connect.connect import connectDB
from datetime import datetime
import time

# 載入環境變數
load_dotenv()

# 從環境變數取得 API Key
serp_api_key = os.getenv("SERPAPI_API_KEY")
if not serp_api_key:
    raise ValueError("❌ SERPAPI_API_KEY 未設定！")

openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("❌ OPENAI_API_KEY 未設定！")

client = OpenAI(api_key=openai_api_key)

# 儲存多次查詢結果
search_results = []
extracted_coefficients = []
verified_coefficients = None

# 定義查詢函數
def search_emission_factors(query, year=None, num_results=3):
    """執行搜尋並返回結果"""
    search_query = query
    if year:
        search_query += f" {year}年"
    
    params = {
        "engine": "google",
        "q": search_query,
        "location": "Taiwan",
        "hl": "zh-TW",
        "gl": "tw",
        "google_domain": "google.com",
        "num": num_results,
        "start": 0,
        "safe": "active",
        "api_key": serp_api_key
    }
    
    base_url = "https://serpapi.com/search.json"
    query_string = urlencode(params)
    full_url = f"{base_url}?{query_string}"
    
    try:
        response = requests.get(full_url, timeout=15)
        response.raise_for_status()
        data = response.json()
        return data.get("organic_results", [])
    except requests.exceptions.RequestException as e:
        print(f"❌ API 請求失敗：{e}")
        return []

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
                page_text = page.extract_text() or ""
                pdf_text += page_text
        except Exception as e:
            print(f"❌ 無法解析 PDF：{e}")
            return None
        
        # 移除 PDF 文件
        os.remove(pdf_filename)
        return pdf_text
    else:
        print(f"❌ 無法下載 PDF，HTTP狀態碼：{pdf_response.status_code}")
        return None

# 從網頁擷取內容
def extract_web_content(url):
    try:
        page_response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=15)
        page_response.raise_for_status()
        # 自動檢測並設置編碼
        page_response.encoding = page_response.apparent_encoding or 'utf-8'
        # 解析網頁內容
        soup = BeautifulSoup(page_response.content, "html.parser")
        article_text = soup.get_text(separator="\n").strip()
        # 檢查並替換無法解碼的字元
        if not article_text or "�" in article_text:
            article_text = page_response.content.decode('utf-8', errors='replace').strip()
        return article_text
    except requests.exceptions.RequestException as e:
        print(f"❌ 擷取網頁內容時發生錯誤：{e}")
        return None

# 使用 AI 擷取排放係數
def extract_coefficients(text, source_url="", year=""):
    if not text:
        return None
    
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
        "['車用汽油-1995年後之低里程輕型車輛', 'CO2', 'CH4', 'N2O'],"
        "['柴油(移動燃燒排放源)', 'CO2', 'CH4', 'N2O']"
        "]\n"
        "文本內容顯示：車用汽油 \nGasoli ne Motor Gasoli ne 69,300 3 0.6 ，代表車用汽油的 CO2 排放係數為 69,300 公斤/兆焦耳，CH4 排放係數為 3 公斤/兆焦耳，N2O 排放係數為 0.6 公斤/兆焦耳。"
        "請在陣列中顯示[車用汽油, 69300, 3, 0.6]。請注意數字不要加上千分位逗號。"
        "柴油 Gas/Diesel Oil 74,100 3 0.6，代表柴油的 CO2 排放係數為 74,100 公斤/兆焦耳，CH4 排放係數為 3 公斤/兆焦耳，N2O 排放係數為 0.6 公斤/兆焦耳。"
        "請在陣列中顯示[柴油, 74100, 3, 0.6]。請注意數字不要加上千分位逗號。"
        "而車用汽油-未控制 、車用汽油-氧化觸媒、車用汽油-1995年和柴油(移動燃燒排放源)的CO2排放係數等於車用汽油和柴油的CO2固定燃燒排放係數"
        f"這個文件來源網址是: {source_url}，發布年份應該是: {year if year else '不確定'}"
        "請務必從文件中確認發布年份，並在回應中標明。如果找不到排放係數，填入null。"
        "注意：只需要輸出以下格式的JSON，不需要其他任何格式、解釋、markdown：\n"
        "{"
        "  \"year\": \"文件發布年份\","
        "  \"source\": \"文件來源網址\","
        "  \"coefficients\": ["
        "    [\"燃料類型\", CO2數值, CH4數值, N2O數值],"
        "    ..."
        "  ]"
        "}"
        "以下是擷取到的文本內容：\n"
        f"{text[:10000]}"  # 限制文本長度避免超出 token 限制
    )

    try:
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant specialized in extracting greenhouse gas emission factors from official documents."},
                {"role": "user", "content": ai_prompt}
            ],
            response_format={"type": "json_object"}
        )
        result = completion.choices[0].message.content
        return result
    except Exception as e:
        print(f"❌ AI 處理失敗：{e}")
        return None

# 比較和驗證不同來源的係數
def verify_coefficients(coefficients_list):
    if not coefficients_list or len(coefficients_list) < 1:
        return None
    
    # 如果只有一個結果，直接返回
    if len(coefficients_list) == 1:
        return coefficients_list[0]
    
    verification_prompt = (
    "你是一位專業的溫室氣體數據分析專家，請系統性評估以下溫室氣體排放係數來源，確定最可靠的數據。\n\n"
    "評估步驟：\n"
    "1. 分析每個係數來源的發布年份\n"
    "2. 評估來源機構的權威性（如政府機構、國際組織優於私人組織）\n"
    "3. 檢查數據的完整性和詳細程度\n"
    "4. 比較數據與公認標準的一致性\n"
    "5. 請以適用於台灣的標準評估\n\n"
    
    "需評估的係數數據：\n"
    f"{coefficients_list}\n\n"
    
    "請在評估後提供以下確切JSON格式的回應，不要有任何多餘文字：\n"
    "{\n"
    "  \"most_reliable\": {完整的最可靠係數JSON對象},\n"
    "  \"reason\": \"選擇此係數的3-5個具體理由\",\n"
    "  \"year\": \"確認的發布年份\",\n"
    "  \"confidence_level\": \"高/中/低\",\n"
    "  \"additional_notes\": \"任何需要使用者注意的重要說明\"\n"
    "}\n\n"
    
    "請確保你的回應是有效的JSON格式，可以直接被程式解析。如果數據中有明顯矛盾或無法確定最可靠來源，請在additional_notes中說明。"
)

    
    try:
        completion = client.chat.completions.create(
    model="gpt-4o",
    temperature=0,  # 降低溫度以提高一致性
    messages=[
        {"role": "system", "content": "你是台灣專業的溫室氣體數據與碳排放分析專家。請基於科學證據和最佳實踐分析數據，並嚴格按照要求的JSON格式回應。"},
        {"role": "user", "content": verification_prompt}
    ],
    response_format={"type": "json_object"}  # 強制JSON格式回應
)

        result = completion.choices[0].message.content
        return result
    except Exception as e:
        print(f"❌ 驗證處理失敗：{e}")
        return None

# 主要執行過程
def main():
    search_years = [None, "2025", "2024", "2023"]  # None代表不指定年份，搜尋最新資料
    
    for year in search_years:
        print(f"\n🔍 搜尋 {year if year else '最新'} 年度排放係數...\n")
        results = search_emission_factors("環境部公告 公告溫室氣體排放係數.pdf", year)
        
        if not results:
            print(f"⚠️ 未找到 {year if year else '最新'} 年度結果，嘗試下一個年份。")
            continue
            
        for i, result in enumerate(results, 1):
            title = result.get("title", "無標題")
            snippet = result.get("snippet", "無描述")
            link = result.get("link", "#")
            
            print(f"{i}. 📰 **{title}**\n")
            print(f"📖 摘要：{snippet}\n🔗 連結：{link}\n")
            
            # 儲存搜尋結果
            search_results.append({
                "title": title,
                "link": link,
                "year": year,
                "snippet": snippet
            })
            
            # 檢查是否為 PDF 檔案
            if re.search(r'\.pdf$', link, re.IGNORECASE):
                article_text = process_pdf(link)
            else:
                article_text = extract_web_content(link)
                
            if article_text:
                # 使用 AI 擷取係數
                extracted_json = extract_coefficients(article_text, link, year)
                if extracted_json:
                    try:
                        extracted_data = ast.literal_eval(extracted_json)
                        extracted_coefficients.append(extracted_data)
                        print(f"✅ 成功從來源 {i} 提取排放係數！")
                    except (SyntaxError, ValueError) as e:
                        print(f"❌ 解析提取的 JSON 失敗：{e}")
                else:
                    print("⚠️ 無法從該來源提取排放係數。")
            else:
                print("⚠️ 無法提取文本內容。")
                
        # 如果已提取足夠的係數，進入驗證階段
        if len(extracted_coefficients) >= 2:
            break
    
    # 驗證排放係數
    if extracted_coefficients:
        print("\n🔍 驗證排放係數中...\n")
        verified_result = verify_coefficients(extracted_coefficients)
        
        if verified_result:
            try:
                verified_data = ast.literal_eval(verified_result)
                verified_coefficients = verified_data.get("most_reliable", {}).get("coefficients", [])
                verified_year = verified_data.get("year", "未知")
                verification_reason = verified_data.get("reason", "")
                
                print(f"✅ 驗證完成！使用 {verified_year} 年度數據。")
                print(f"📝 驗證理由：{verification_reason}")
            except (SyntaxError, ValueError) as e:
                print(f"❌ 解析驗證結果失敗：{e}")
                verified_coefficients = extracted_coefficients[0].get("coefficients", [])
    else:
        print("⚠️ 未能提取任何排放係數資料，無法進行驗證。")
        return
    
    # 計算最終結果
    if verified_coefficients:
        # 轉換計算
        Kcal_to_TJ = 4.1868 * 10**-9  # 根據台灣溫室氣體排放量盤查作業指引113年版 
        TJ_to_Kcal = 1 / Kcal_to_TJ  
        
        # 建立計算用陣列
        calculation_array = []
        for item in verified_coefficients:
            if len(item) >= 4:  # 確保有足夠的元素
                fuel_type = item[0]
                
                # 確保所有數值都是數字
                try:
                    co2 = float(item[1]) if item[1] is not None else 0
                    ch4 = float(item[2]) if item[2] is not None else 0
                    n2o = float(item[3]) if item[3] is not None else 0
                    calculation_array.append([fuel_type, co2, ch4, n2o])
                except (ValueError, TypeError):
                    print(f"⚠️ 無法轉換 {fuel_type} 的排放係數為數字。")
                    calculation_array.append([fuel_type, 0, 0, 0])
        
        # LHV values corresponding to each fuel type
        fuel_lhv_map = {
            "車用汽油": 7800,
            "柴油": 8400,
            "乙烷": 15.40,
            "天然氣": 8000,
            "事業廢棄物": 1,
            "車用汽油-未控制": 7800,
            "車用汽油-氧化觸媒": 7800,
            "車用汽油-1995年後之低里程輕型車輛": 7800,
            "柴油(移動燃燒排放源)": 8400
        }
        
        # Convert and calculate final values
        final_results = []
        for row in calculation_array:
            fuel_type = row[0]
            
            # 轉換為 kg/Kcal
            co2_per_kcal = row[1] / TJ_to_Kcal
            ch4_per_kcal = row[2] / TJ_to_Kcal
            n2o_per_kcal = row[3] / TJ_to_Kcal
            
            # 取得對應的 LHV 值
            lhv = fuel_lhv_map.get(fuel_type, 0)
            
            # 計算排放量
            co2_emission = co2_per_kcal * lhv
            ch4_emission = ch4_per_kcal * lhv
            n2o_emission = n2o_per_kcal * lhv
            
            final_results.append([
                fuel_type, 
                co2_per_kcal,
                ch4_per_kcal,
                n2o_per_kcal,
                lhv,
                co2_emission,
                ch4_emission,
                n2o_emission
            ])
        
        # 顯示結果
        print("\n最終計算結果:")
        print("燃料類型 | CO2(kg/Kcal) | CH4(kg/Kcal) | N2O(kg/Kcal) | LHV | CO2排放量 | CH4排放量 | N2O排放量")
        for row in final_results:
            formatted_row = [row[0]] + ["{:.2E}".format(x) if isinstance(x, float) else x for x in row[1:]]
            print(" | ".join(str(x) for x in formatted_row))
        
        # 存入資料庫
        save_to_database(final_results)
    else:
        print("⚠️ 沒有可用的驗證係數，無法計算最終結果。")

def save_to_database(results):
    conn = connectDB()
    if not conn:
        print("❌ 無法連接資料庫")
        return
    
    cursor = conn.cursor()
    
    try:
        if not results:
            print("⚠️ 無數據可存入資料庫")
            return

        # 先清除舊數據
        cursor.execute("DELETE FROM Fuel_Factors")

        # 批量插入數據
        query = """
        INSERT INTO Fuel_Factors (FuelType, CO2_Emission, CH4_Emission, N2O_Emission, 
                                 LowerHeatingValue, CO2_Total, CH4_Total, N2O_Total, 
                                 update_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        values = [
            (
                row[0],  # FuelType
                row[1],  # CO2_Emission
                row[2],  # CH4_Emission
                row[3],  # N2O_Emission
                row[4],  # LowerHeatingValue
                row[5],  # CO2_Total
                row[6],  # CH4_Total
                row[7],  # N2O_Total
                datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # 格式化 update_time
            )
            for row in results
        ]
        
        cursor.executemany(query, values)  # 使用批量插入
        conn.commit()
        print("✅ 資料成功存入資料庫！")

    except Exception as e:
        conn.rollback()  # 若發生錯誤，回滾
        print(f"❌ 資料庫錯誤：{e}")

    finally:
        conn.close()  # 確保關閉連接

if __name__ == "__main__":
    main()