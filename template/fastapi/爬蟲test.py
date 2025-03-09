import requests
from urllib.parse import urlencode
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from openai import OpenAI
from PyPDF2 import PdfReader
import os
import re
import ast
import sqlite3
from datetime import datetime
import time
import logging
from connect.connect import connectDB


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("emission_factor_updater")

# Database path
DB_PATH = "emission_factors.db"

# Load environment variables
load_dotenv()

# Get API Keys from environment variables
serp_api_key = os.getenv("SERPAPI_API_KEY")
if not serp_api_key:
    raise ValueError("❌ SERPAPI_API_KEY not set!")

openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("❌ OPENAI_API_KEY not set!")

client = OpenAI(api_key=openai_api_key)

# Store search results
search_results = []
extracted_coefficients = []
verified_coefficients = None

def search_emission_factors(query, year=None, num_results=3):
    """Execute search and return results"""
    search_query = query
    if year:
        search_query += f" 民國{year}年"
    
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
        print(f"❌ API request failed: {e}")
        return []

def process_pdf(pdf_url):
    """Download and process PDF file"""
    print(f"📥 Downloading PDF: {pdf_url}")
    pdf_response = requests.get(pdf_url)
    if pdf_response.status_code == 200:
        pdf_filename = "downloaded_file.pdf"
        with open(pdf_filename, "wb") as file:
            file.write(pdf_response.content)
        print("✅ PDF download complete, parsing content...")

        # Read PDF and extract text
        pdf_text = ""
        try:
            reader = PdfReader(pdf_filename)
            for page in reader.pages:
                page_text = page.extract_text() or ""
                pdf_text += page_text
        except Exception as e:
            print(f"❌ Cannot parse PDF: {e}")
            return None
        
        # Remove PDF file
        os.remove(pdf_filename)
        return pdf_text
    else:
        print(f"❌ Cannot download PDF, HTTP status code: {pdf_response.status_code}")
        return None

def extract_web_content(url):
    """Extract content from webpage"""
    try:
        page_response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=15)
        page_response.raise_for_status()
        # Auto-detect and set encoding
        page_response.encoding = page_response.apparent_encoding or 'utf-8'
        # Parse webpage content
        soup = BeautifulSoup(page_response.content, "html.parser")
        article_text = soup.get_text(separator="\n").strip()
        # Check and replace undecoded characters
        if not article_text or "�" in article_text:
            article_text = page_response.content.decode('utf-8', errors='replace').strip()
        return article_text
    except requests.exceptions.RequestException as e:
        print(f"❌ Error extracting webpage content: {e}")
        return None

def extract_coefficients(text, source_url="", year=""):
    """Use AI to extract electricity emission coefficients"""
    if not text:
        return None
    
    ai_prompt = (
        "Please provide Taiwan government's announced electricity emission factor based on the following text. "
        "Extract the electricity emission factor, which usually appears in formats like '0.424 kg CO2e/kWh' or '0.424 kgCO2e/kWh'. "
        "Please organize according to the following format:\n"
        "{"
        "  \"year\": \"Document publication year\","
        "  \"source\": \"Document source URL\","
        "  \"coefficient\": {"
        "    \"value\": 0.424, "
        "    \"unit\": \"kg CO2e/kWh\" "
        "  },"
        "  \"issuing_authority\": \"Publishing organization name\""
        "}"
        f"The document source URL is: {source_url}, and the publication year should be: {year if year else 'uncertain'}"
        "Please be sure to confirm the publication year and issuing organization (such as Ministry of Environment, EPA, etc.) from the document."
        "If emission factor cannot be found, please fill in null."
        "Note: Output only the JSON format above, no other formats, explanations, or markdown needed."
        "Here is the extracted content:\n"
        f"{text[:10000]}"  # Limit text length to avoid token limit
    )

    try:
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant specialized in extracting electricity emission factors from official documents in Taiwan."},
                {"role": "user", "content": ai_prompt}
            ],
            response_format={"type": "json_object"}
        )
        result = completion.choices[0].message.content
        return result
    except Exception as e:
        print(f"❌ AI processing failed: {e}")
        return None

def verify_coefficients(coefficients_list, roc_year):
    """Compare and verify coefficients from different sources"""
    if not coefficients_list or len(coefficients_list) < 1:
        return None
    
    # If only one result, return it directly
    if len(coefficients_list) == 1:
        return coefficients_list[0]
    
    verification_prompt = (
    "You are a professional electricity emission factor analysis expert. Please systematically evaluate the following Taiwan electricity emission factor sources to determine the most reliable data.\n\n"
    "Evaluation steps:\n"
    "1. Analyze the publication year of each coefficient source\n"
    "2. Evaluate the authority of the source organization (must be Taiwan government agencies like Ministry of Environment, EPA, etc.)\n"
    "3. Check the completeness and level of detail of the data\n"
    "4. Confirm if it is the latest announced electricity emission factor\n"
    "5. Please evaluate using standards applicable to Taiwan\n\n"
    f"6. Ensure the data match the R.O.C. year {roc_year}"
    
    "Coefficient data to evaluate:\n"
    f"{coefficients_list}\n\n"
    
    "Please provide your response in the following exact JSON format after evaluation, with no extra text:\n"
    "{\n"
    "  \"most_reliable\": {complete most reliable coefficient JSON object},\n"
    "  \"reason\": \"3-5 specific reasons for choosing this coefficient\",\n"
    "  \"year\": \"confirmed publication year\",\n"
    "  \"confidence_level\": \"high/medium/low\",\n"
    "  \"additional_notes\": \"Any important notes for user attention\"\n"
    "}\n\n"
    
    "Please ensure your response is valid JSON format that can be parsed directly by programs. If there are obvious contradictions in the data or the most reliable source cannot be determined, please explain in additional_notes."
    "Only electricity emission factors announced by Taiwan government agencies (such as Ministry of Environment, EPA) are accepted as reliable sources."
)

    
    try:
        completion = client.chat.completions.create(
            model="gpt-4o",
            temperature=0,  # Reduce temperature for consistency
            messages=[
                {"role": "system", "content": "You are a Taiwan professional electricity emission factor analysis expert. Please analyze data based on scientific evidence and best practices, and respond strictly in the required JSON format."},
                {"role": "user", "content": verification_prompt}
            ],
            response_format={"type": "json_object"}  # Force JSON format response
        )

        result = completion.choices[0].message.content
        return result
    except Exception as e:
        print(f"❌ Verification processing failed: {e}")
        return None

def update_database(year, emission_factor):
    """Update emission factor in database, insert new record if year doesn't exist, otherwise update existing record"""
    conn = connectDB()
    cursor = conn.cursor()
    
    try:
        # Check if the year exists
        cursor.execute("SELECT 1 FROM power_emission_factors WHERE year = ?", (year,))
        exists = cursor.fetchone() is not None
        
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        if exists:
            # Update existing record
            cursor.execute("""
            UPDATE power_emission_factors 
            SET emission_factor = ?, update_time = ? 
            WHERE year = ?
            """, (emission_factor, current_time, year))
            logger.info(f"Updated emission factor for year {year}")
        else:
            # Insert new record
            cursor.execute("""
            INSERT INTO power_emission_factors (year, emission_factor, update_time) 
            VALUES (?, ?, ?)
            """, (year, emission_factor, current_time))
            logger.info(f"Added emission factor for year {year}")
        
        conn.commit()
    
    except Exception as e:
        conn.rollback()
        logger.error(f"Error updating database: {str(e)}")
        raise
    
    finally:
        conn.close()


def main():
    """Main execution process"""
    # Calculate current ROC year and previous years
    current_year = datetime.now().year
    roc_year = current_year - 1911
    
    # Convert numeric years to Chinese representation
    def convert_to_chinese_year(year):
        chinese_nums = {
            0: '零', 1: '一', 2: '二', 3: '三', 4: '四',
            5: '五', 6: '六', 7: '七', 8: '八', 9: '九',
        }
        
        if year >= 100:
            hundred_digit = year // 100
            ten_digit = (year % 100) // 10
            unit_digit = year % 10
            
            result = chinese_nums[hundred_digit] + '百'
            
            if ten_digit > 0:
                result += chinese_nums[ten_digit] + '十'
            elif unit_digit > 0:  # Handle cases like 110, 120
                result += '零'
                
            if unit_digit > 0:
                result += chinese_nums[unit_digit]
                
            return result
        elif year >= 10:
            ten_digit = year // 10
            unit_digit = year % 10
            
            result = chinese_nums[ten_digit] + '十'
            if unit_digit > 0:
                result += chinese_nums[unit_digit]
                
            return result
        else:
            return chinese_nums[year]
    
    # Generate current and previous years in ROC format (Chinese representation)
    current_roc_chinese = convert_to_chinese_year(roc_year)
    prev1_roc_chinese = convert_to_chinese_year(roc_year - 1)
    prev2_roc_chinese = convert_to_chinese_year(roc_year - 2)
    prev3_roc_chinese = convert_to_chinese_year(roc_year - 3)
    
    search_years = [current_roc_chinese, prev1_roc_chinese, prev2_roc_chinese, prev3_roc_chinese]  # Use ROC years in Chinese
    
    for year in search_years:
        print(f"\n🔍 Searching for ROC year {year} electricity emission factor...\n")
        results = search_emission_factors("台灣 電力排放係數 公告", year)
        
        if not results:
            print(f"⚠️ No results found for ROC year {year}, trying next year.")
            continue
            
        for i, result in enumerate(results, 1):
            title = result.get("title", "No title")
            snippet = result.get("snippet", "No description")
            link = result.get("link", "#")
            
            print(f"{i}. 📰 **{title}**\n")
            print(f"📖 Summary: {snippet}\n🔗 Link: {link}\n")
            
            # Store search results
            search_results.append({
                "title": title,
                "link": link,
                "year": year,
                "snippet": snippet
            })
            
            # Check if it's a PDF file
            if re.search(r'\.pdf$', link, re.IGNORECASE):
                article_text = process_pdf(link)
            else:
                article_text = extract_web_content(link)
                
            if article_text:
                # Use AI to extract coefficients
                extracted_json = extract_coefficients(article_text, link, year)
                if extracted_json:
                    try:
                        extracted_data = ast.literal_eval(extracted_json)
                        extracted_coefficients.append(extracted_data)
                        print(f"✅ Successfully extracted electricity emission factor from source {i}!")
                    except (SyntaxError, ValueError) as e:
                        print(f"❌ Failed to parse extracted JSON: {e}")
                else:
                    print("⚠️ Could not extract electricity emission factor from this source.")
            else:
                print("⚠️ Could not extract text content.")
                
        # If enough coefficients have been extracted, proceed to verification
        if len(extracted_coefficients) >= 2:
            break
    
    # Verify emission factors
    if extracted_coefficients:
        print("\n🔍 Verifying electricity emission factors...\n")
        verified_result = verify_coefficients(extracted_coefficients, roc_year)
        
        if verified_result:
            try:
                verified_data = ast.literal_eval(verified_result)
                most_reliable = verified_data.get("most_reliable", {})
                verified_year = verified_data.get("year", "Unknown")
                verification_reason = verified_data.get("reason", "")
                
                print(f"✅ Verification complete! Using data from year {verified_year}.")
                print(f"📝 Verification reason: {verification_reason}")
                
                # Display most reliable electricity emission factor
                coefficient = most_reliable.get("coefficient", {})
                value = coefficient.get("value", "Unknown")
                unit = coefficient.get("unit", "Unknown")
                authority = most_reliable.get("issuing_authority", "Unknown organization")
                
                print(f"\n🔌 Electricity emission factor: {value} {unit}")
                print(f"📅 Publication year: {verified_year}")
                print(f"🏢 Issuing organization: {authority}")
                
                # Convert verified year to numeric format (Western calendar year)
                # Assume verified_year could be in various formats including ROC year
                western_year = None
                
                # Try to extract year as a 4-digit number (Western calendar)
                match = re.search(r'(\d{4})', verified_year)
                if match:
                    western_year = int(match.group(1))
                else:
                    # If verified_year contains ROC year references
                    roc_match = re.search(r'民國\s*(\d+)\s*年', verified_year)
                    if roc_match:
                        roc_num_year = int(roc_match.group(1))
                        western_year = roc_num_year + 1911
                
                # If we couldn't extract a year, use current year as fallback
                if not western_year:
                    western_year = datetime.now().year
                    logger.warning(f"Could not extract year from '{verified_year}', using current year {western_year}")
                
                # Save to database using the new update_database function
                update_database(western_year, value)
                
            except (SyntaxError, ValueError) as e:
                print(f"❌ Failed to parse verification result: {e}")
    else:
        print("⚠️ Could not extract any electricity emission factor data, verification not possible.")
        return

if __name__ == "__main__":
    main()