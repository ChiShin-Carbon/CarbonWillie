import os
import requests
from openai import OpenAI
from dotenv import load_dotenv  # Import for loading environment variables
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.concurrency import run_in_threadpool  # For running synchronous code
from bs4 import BeautifulSoup  # 用於爬蟲
import re  # 正則表達式處理字串
from serpapi import GoogleSearch
import time
import openai

load_dotenv()

word_ai = APIRouter(tags=["word專用"])

# 定義請求模型
class CompanyRequest(BaseModel):
    org_name: str
    business_id: str



# 🔹 **步驟1：使用 SERPAPI 搜尋企業相關連結**
def get_google_search_results(org_name: str, business_id: str, max_results=10):
    """
    使用 SERPAPI 搜尋企業的相關連結
    """
    serpapi_key = os.getenv("SERPAPI_API_KEY")  # 🛑 替換為你的 SERPAPI API KEY
    search_query = f"{org_name} {business_id}"

    params = {
        "engine": "google",
        "q": search_query,
        "hl": "zh-TW",
        "gl": "tw",
        "api_key": serpapi_key
    }

    search = GoogleSearch(params)
    results = search.get_dict()

    if "organic_results" not in results:
        raise HTTPException(status_code=500, detail="❌ SERPAPI 搜尋失敗，未獲取結果")

    # **提取前 N 個相關連結**
    links = []
    for result in results["organic_results"][:max_results]:  # 取前 max_results 筆
        link = result.get("link")
        if link:
            links.append(link)

    return links


# 🔹 **步驟2：擷取網頁內容（更完整）**
def extract_web_content(url):
    """
    進入網頁，擷取標題、meta 描述、關鍵字與主要內文
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        response.encoding = response.apparent_encoding or "utf-8"

        # 解析網頁內容
        soup = BeautifulSoup(response.text, "html.parser")

        # **擷取網站標題**
        title_tag = soup.find("title")
        title = title_tag.text.strip() if title_tag else "未找到標題"

        # **擷取 meta description**
        description_tag = soup.find("meta", attrs={"name": "description"})
        description = description_tag["content"].strip() if description_tag else "未找到網站簡介"

        # **擷取 meta keywords**
        keywords_tag = soup.find("meta", attrs={"name": "keywords"})
        keywords = keywords_tag["content"].strip() if keywords_tag else "未找到關鍵字"

        # **擷取主要內容（最多 10 段）**
        paragraphs = [p.text.strip() for p in soup.find_all("p") if p.text.strip()]
        headings = [h.text.strip() for h in soup.find_all(["h1", "h2", "h3"]) if h.text.strip()]

        # 合併標題與內文
        main_content = "\n".join(headings[:5] + paragraphs[:10])  # 最多 5 個標題 + 10 段文字

        return {
            "url": url,
            "title": title,
            "description": description,
            "keywords": keywords,
            "content": main_content
        }

    except requests.exceptions.RequestException as e:
        print(f"❌ 擷取網頁內容時發生錯誤：{e}")
        return None


# 🔹 **步驟3：API 端點**
@word_ai.post("/scrape_company_data")
async def scrape_company_data(request: CompanyRequest):
    """
    使用企業名稱 & 統編來搜尋 Google，擷取企業資訊
    """
    links = get_google_search_results(request.org_name, request.business_id, max_results=10)

    if not links:
        return {"message": "未找到相關企業網站"}

    results = []
    for link in links:
        data = extract_web_content(link)
        if data:
            results.append(data)
        time.sleep(1)  # 避免爬取過快被封鎖

    return {
        "company": request.org_name,
        "search_results": results
    }










def generate_intro_and_summary_from_results(company_name: str, company_id: str, results: list):
    """使用 OpenAI 先過濾企業相關資訊，再生成企業前言與簡介"""
    openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    # **Step 1: 先過濾與企業無關的內容**
    filter_prompt = [
        {"role": "system", "content": "你是一個企業資訊專家，請根據以下網頁內容判斷哪些與公司最相關，只保留高度相關的資訊。"},
        {"role": "user", "content": f"這是企業 '{company_name}' (編號: {company_id}) 的相關資訊。請篩選出與該企業直接相關的內容，忽略無關的內容，只返回與該企業高度相關的內容。"}
    ]
    
    for idx, result in enumerate(results):
        filter_prompt.append({
            "role": "user", 
            "content": f"網頁{idx+1}：\n標題：{result['title']}\n描述：{result['description']}\n內容：{result['content']}"
        })
    
    filter_response = openai_client.chat.completions.create(
        model="gpt-4",
        messages=filter_prompt,
        max_tokens=2000,
        temperature=0.3
    )
    
    filtered_text = filter_response.choices[0].message.content.strip()
    
    # **Step 2: 生成企業前言與簡介**
    generate_prompt = [
        {"role": "system", "content": "你是一個專業的企業資訊生成助手，請根據提供的企業資訊，整合並輸出以下內容："},
        {"role": "user", "content": f"""
        企業前言：描述企業的願景、使命、經營理念等（正式、嚴謹），內容請參考篩選後的資訊，生成與以下前言範例字數差不多的答案
        前言範例(參考其架構):
        本校創校迄今，歷任校長遵循創辦人創校職志，經營擘畫，積極發揚「誠、勤、樸、慎、創新」精神形成優良校風，並秉持「創意、務實、宏觀、合作、溝通、熱忱」的教育理念，以科技與人文融匯、創新與品質並重、專業與通識兼顧、理論與實務結合為主軸，發展為實務化、資訊化、人文化、創新化、國際化的高等學府。
        為提供學生多元學習，整合相關學術資源，本校特成立電通、工程、醫護暨管理三大學院，藉由各學系的合作、因應產業需求，開設相關學程，讓學生透過跨領域學習，提升專業知能與職場競爭力。
        本校積極提升教學、研究、輔導與服務外，並與遠傳、新世紀資通、遠東新世紀、亞東醫院等遠東集團產學合作，成果斐然，已成為技職教育新典範。
        
        企業簡介：詳細介紹企業的歷史、創立背景、創立年分、主要業務等（正式、嚴謹），內容請參考篩選後的資訊，生成與以下簡介範例字數差不多的答案
        簡介範例(參考其架構):
        亞東科技大學於民國五十七年十月，在遠東集團創辦人徐有庠先生的「弘文明德，育才興國」理念下創設，初名「私立亞東工業技藝專科學校」，為全國第一所私立二年制專科學校，六十二年六月奉准正名為「私立亞東工業專科學校」，八十九學年度獲教育部核定改制為「亞東技術學院」，一一Ｏ學年度改名為「亞東學校財團法人亞東科技大學」。
        本校教職員生人數4,397人(資料時間2024年)其中學生3,931人，教職員工451人。

        這是企業 '{company_name}' 的篩選後資訊，請根據這些內容撰寫企業前言與企業簡介。\n\n{filtered_text}
        """}
    ]
    
    generate_response = openai_client.chat.completions.create(
        model="gpt-4",
        messages=generate_prompt,
        max_tokens=1500,
        temperature=0.5
    )
    
    generated_text = generate_response.choices[0].message.content.strip()
    
    # **Step 3: 擷取企業前言與簡介**
    intro_start = generated_text.find("企業前言：")
    summary_start = generated_text.find("企業簡介：")
    
    intro = generated_text[intro_start + len("企業前言："):summary_start].strip() if intro_start != -1 else ""
    summary = generated_text[summary_start + len("企業簡介："):].strip() if summary_start != -1 else ""
    
    return {"intro": intro, "summary": summary}


# 修改 API 端點，整合爬蟲與 OpenAI 的功能
@word_ai.post("/generate_company_info")
async def generate_company_info(request: CompanyRequest):
    """接受公司資料，爬取數據並生成企業前言與簡介"""
    # 獲取爬蟲結果
    links = get_google_search_results(request.org_name, request.business_id, max_results=10)
    results = []

    for link in links:
        data = extract_web_content(link)
        if data:
            results.append(data)
    
    # 生成前言與簡介
    generated_data = generate_intro_and_summary_from_results(request.org_name, request.business_id, results)

    return {
        "company": request.org_name,
        "business_id": request.business_id,
        "intro": generated_data['intro'],
        "summary": generated_data['summary']
    }

