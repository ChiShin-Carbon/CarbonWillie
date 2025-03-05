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
    請根據以下企業資料，生成兩個部分：
    
    **1. 前言**：
    - 用正式、莊重的語氣描述該企業的願景、精神與經營理念。
    - 可包含企業的核心價值、產業發展趨勢，以及該企業如何回應市場需求。
    - 內容應該類似於學術機構或大型企業的正式介紹，如：「本公司秉持XX理念，致力於XXX領域的發展，積極與產業鏈合作，提升技術創新與市場競爭力。」

    **2. 企業簡介**：
    - 詳細介紹該企業的歷史、創立背景、業務範圍、產業影響力等。
    - 需要提及企業的成立年份、發展歷程，以及重要的合作夥伴或里程碑。
    - 若可能，應包含企業的員工數量或規模數據。

    企業資料：
    企業名稱：{company_info['org_name']}
    企業地址：{company_info['org_address']}
    統一編號：{company_info['business_id']}
    企業簡介：{company_info['description']}
    
    **請注意**：
    - 生成內容需正式、嚴謹，並符合企業官方介紹風格。
    - 請勿添加不確定或臆測的資訊，若無資料可用，請合理撰寫。
    """

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "你是專門為企業撰寫正式介紹的專家。"},
                {"role": "user", "content": prompt},
            ]
        )
        print(response)  # **檢查 API 回應**
        
        if response.choices:
            result = response.choices[0].message.content
            return result.strip()
        else:
            raise ValueError("OpenAI API 回應中沒有 choices。")

    except Exception as e:
        print(f"發生錯誤: {e}")
        return "無法生成內容，請稍後再試。"




# API端點：根據企業資訊生成前言和簡介
@word_ai.post("/generate_company_info")
async def generate_company_info(request: CompanyRequest):
    """接受公司資料，生成完整企業介紹"""

    # 1. 抓取企業資料
    company_info = fetch_company_data(
        request.org_name, request.org_address, request.business_id
    )
    
    # 2. 使用 OpenAI 生成完整企業介紹
    content = generate_intro_and_summary(company_info)
    
    # 回傳結果
    return {"content": content}
