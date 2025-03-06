import requests
import time
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from bs4 import BeautifulSoup
from serpapi import GoogleSearch
import os
from fastapi import APIRouter

word_bug = APIRouter(tags=["word爬蟲專用"])

# 🔹 **企業請求模型**
class CompanyRequest(BaseModel):
    org_name: str
    business_id: str  # 統一編號


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
@word_bug.post("/scrape_company_data")
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
