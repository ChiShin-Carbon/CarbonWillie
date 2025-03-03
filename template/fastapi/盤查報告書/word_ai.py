import os
import requests
from openai import OpenAI
from dotenv import load_dotenv  # Import for loading environment variables
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.concurrency import run_in_threadpool  # For running synchronous code
from bs4 import BeautifulSoup  # 用於爬蟲
from langchain import OpenAI as LangChainOpenAI
from langchain_openai import OpenAIEmbeddings

load_dotenv()

word_ai = APIRouter(tags=["word專用"])

# 定義請求模型
class CompanyRequest(BaseModel):
    org_name: str
    org_address: str
    business_id: str

# 函數：抓取企業資料
def fetch_company_data(org_name: str, org_address: str, business_id: str):
    """
    使用爬蟲抓取企業的資料，這裡可以依據實際情況，調整為不同網站的爬蟲邏輯。
    例如可以從網站如`https://www.twreporter.org/`抓取關於公司的相關資訊。
    """
    search_url = f"https://www.google.com/search?q={org_name}+{business_id}"
    response = requests.get(search_url)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        # 這裡的解析邏輯可以根據抓取的網站調整
        # 假設抓取到了公司的一些資料，並將其組合起來
        company_info = {
            "org_name": org_name,
            "org_address": org_address,
            "business_id": business_id,
            "description": "這是從網頁抓取的公司簡介和前言資訊。",
        }
        return company_info
    else:
        raise HTTPException(status_code=500, detail="無法抓取企業資料")

# 函數：使用 OpenAI 處理資料
def generate_intro_and_summary(company_info: dict):
    """使用 OpenAI 根據抓取的資料生成前言和簡介"""
    openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # 傳送給 OpenAI 生成內容
    prompt = f"""
    基於以下企業資料，生成兩個部分：
    1. 前言：用簡單的語言描述企業的背景，發展方向及其核心價值。
    2. 簡介：提供更多具體的企業信息，包括成立背景，業務範圍，員工規模等。
    
    企業資料：
    企業名稱：{company_info['org_name']}
    企業地址：{company_info['org_address']}
    統一編號：{company_info['business_id']}
    企業簡介：{company_info['description']}
    """

    response = openai_client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "你是用來生成企業簡介和前言的助手。"},
            {"role": "user", "content": prompt},
        ]
    )
    result = response.choices[0].message.content

    # 根據結果將前言和簡介分開
    intro, summary = result.split("\n\n")
    return intro.strip(), summary.strip()

# API端點：根據企業資訊生成前言和簡介
@word_ai.post("/generate_company_info")
async def generate_company_info(request: CompanyRequest):
    """接受公司資料，生成前言和簡介"""
    
    # 1. 抓取企業資料
    company_info = fetch_company_data(
        request.org_name, request.org_address, request.business_id
    )
    
    # 2. 使用 OpenAI 生成前言和簡介
    intro, summary = generate_intro_and_summary(company_info)
    
    # 回傳結果
    return {
        "intro": intro,
        "summary": summary
    }

