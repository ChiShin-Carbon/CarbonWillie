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
    """使用 OpenAI 生成企業前言與簡介，根據爬蟲獲得的多個網頁內容"""

    openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # 構建 OpenAI 輸入提示
    messages = [
        {"role": "system", "content": "你是一个專業的企業資訊生成助手，根據這些內容，整合並輸出以下內容： - 企業前言：描述企業的願景、使命、經營理念等（正式、嚴謹） - 企業簡介：詳細介紹企業的歷史、創立背景、主要業務等（正式、嚴謹）"},
        {"role": "user", "content": f"這是關於企業 '{company_name}' 的資訊，企業編號為 '{company_id}'。請從以下多個來源的內容中提取最相關的企業資訊，形成正式的企業前言與簡介。每個網頁內容可能包含不同的信息，請盡可能整合它們並給出準確且專業的描述。"}
    ]

    # 添加爬蟲結果到messages
    for idx, result in enumerate(results):
        messages.append({
            "role": "user",
            "content": f"網頁{idx+1}：\n標題：{result['title']}\n描述：{result['description']}\n內容：{result['content']}"
        })

    
    # 呼叫 OpenAI 接口生成結果
    response = openai_client.chat.completions.create(
        model="gpt-4",
        messages=messages,
        max_tokens=1500,  # 設定適當的返回長度
        temperature=0.5  # 設定適當的溫度
    )
    
    # 解析 OpenAI 返回的內容
    generated_text = response.choices[0].message.content.strip()

    # 解析生成的文本，分割成前言與簡介
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
    company_info = {
        "org_name": request.org_name,
        "business_id": request.business_id
    }
    
    generated_data = generate_intro_and_summary_from_results(request.org_name, request.business_id, results)

    return {
        "company": company_info,
        "intro": generated_data['intro'],
        "summary": generated_data['summary'],
        "fetched_data": results
    }



