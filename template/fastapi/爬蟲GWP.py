import requests
from bs4 import BeautifulSoup
from openai import OpenAI
import os
import re
import ast
import logging
from datetime import datetime
from dotenv import load_dotenv
import sqlite3
from urllib.parse import urlencode
from connect.connect import connectDB



# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("gwp_factor_updater")

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

# Store search results and extracted coefficients
search_results = []
extracted_gwp_values = []
verified_gwp_values = None

def search_gwp_factors(query, num_results=5):
    """Execute search and return results for GWP factors"""
    params = {
        "engine": "google",
        "q": query,
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
            from PyPDF2 import PdfReader
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

def extract_gwp_values(text, source_url="", year=""):
    """Use AI to extract GWP values for CO2, CH4, and N2O"""
    if not text:
        return None
    
    ai_prompt = (
        "Please extract the 100-year Global Warming Potential (GWP) values for CO2, CH4, and N2O from the following text. "
        "We're specifically looking for the most recent IPCC values or official values used by environmental agencies. "
        "Please organize according to the following format:\n"
        "{"
        "  \"publication_year\": \"Document publication year\","
        "  \"source\": \"Document source URL\","
        "  \"gwp_values\": {"
        "    \"CO2\": 1, "
        "    \"CH4\": 28, "
        "    \"N2O\": 265 "
        "  },"
        "  \"reference\": \"Reference information (IPCC AR5, AR6, etc.)\","
        "  \"issuing_authority\": \"Publishing organization name\""
        "}"
        f"The document source URL is: {source_url}, and the publication year should be: {year if year else 'extracted from document'}"
        "Please be sure to confirm the publication year and issuing organization from the document."
        "Note: CO2 should always be 1. If values for CH4 or N2O cannot be found, please fill in null."
        "Note: Output only the JSON format above, no other formats, explanations, or markdown needed."
        "Here is the extracted content:\n"
        f"{text[:10000]}"  # Limit text length to avoid token limit
    )

    try:
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant specialized in extracting Global Warming Potential (GWP) values from official documents."},
                {"role": "user", "content": ai_prompt}
            ],
            response_format={"type": "json_object"}
        )
        result = completion.choices[0].message.content
        return result
    except Exception as e:
        print(f"❌ AI processing failed: {e}")
        return None

def verify_gwp_values(gwp_values_list):
    """Compare and verify GWP values from different sources"""
    if not gwp_values_list or len(gwp_values_list) < 1:
        return None
    
    # If only one result, return it directly
    if len(gwp_values_list) == 1:
        return gwp_values_list[0]
    
    verification_prompt = (
    "You are a professional climate science expert. Please systematically evaluate the following Global Warming Potential (GWP) values to determine the most reliable data.\n\n"
    "Evaluation steps:\n"
    "1. Analyze the publication year of each source\n"
    "2. Evaluate the authority of the source organization\n"
    "3. Check if the values come from recent IPCC assessment reports\n"
    "4. Confirm if these are the latest published GWP values\n"
    "5. Note that CO2 should always have a GWP value of 1\n\n"
    
    "GWP data to evaluate:\n"
    f"{gwp_values_list}\n\n"
    
    "Please provide your response in the following exact JSON format after evaluation, with no extra text:\n"
    "{\n"
    "  \"most_reliable\": {complete most reliable GWP values JSON object},\n"
    "  \"reason\": \"3-5 specific reasons for choosing these values\",\n"
    "  \"reference\": \"confirmed reference (IPCC AR5, AR6, etc.)\",\n"
    "  \"confidence_level\": \"high/medium/low\",\n"
    "  \"final_values\": {\n"
    "    \"CO2\": 1,\n"
    "    \"CH4\": 28,\n"
    "    \"N2O\": 265\n"
    "  }\n"
    "}\n\n"
    
    "Please ensure your response is valid JSON format that can be parsed directly by programs. If there are obvious contradictions in the data or the most reliable source cannot be determined, please explain in additional_notes."
    "Only use values from authoritative sources like IPCC, EPA, or other recognized environmental agencies."
)

    try:
        completion = client.chat.completions.create(
            model="gpt-4o",
            temperature=0,  # Reduce temperature for consistency
            messages=[
                {"role": "system", "content": "You are a climate science expert specializing in Global Warming Potential values. Please analyze data based on scientific evidence and best practices, and respond strictly in the required JSON format."},
                {"role": "user", "content": verification_prompt}
            ],
            response_format={"type": "json_object"}  # Force JSON format response
        )

        result = completion.choices[0].message.content
        return result
    except Exception as e:
        print(f"❌ Verification processing failed: {e}")
        return None

def update_gwp_database(co2_value, ch4_value, n2o_value, publication_year, reference):
    """Delete existing GWP values and insert new ones"""
    conn = connectDB()
    cursor = conn.cursor()
    
    try:
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Delete all existing records
        cursor.execute("DELETE FROM gwp_factors")
        logger.info("Deleted existing GWP records")
        
        # Insert new records with fixed IDs
        cursor.execute("""
        INSERT INTO gwp_factors (id, gwp_type, chemical_formula, gwp_value, publication_year, reference, update_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (1, "二氧化碳", "CO₂", co2_value, publication_year, reference, current_time))
        
        cursor.execute("""
        INSERT INTO gwp_factors (id, gwp_type, chemical_formula, gwp_value, publication_year, reference, update_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (2, "甲烷", "CH₄", ch4_value, publication_year, reference, current_time))
        
        cursor.execute("""
        INSERT INTO gwp_factors (id, gwp_type, chemical_formula, gwp_value, publication_year, reference, update_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (3, "氧化亞氮", "N₂O", n2o_value, publication_year, reference, current_time))
        
        logger.info(f"Added new GWP values based on {reference}")
        conn.commit()
    
    except Exception as e:
        conn.rollback()
        logger.error(f"Error updating database: {str(e)}")
        raise
    
    finally:
        conn.close()
def main():
    """Main execution process for GWP scraping"""    
    print("\n🔍 Searching for GWP values for CO2, CH4, and N2O...\n")
    
    # Use different search queries to cover various sources
    search_queries = [
        "IPCC AR6 Global Warming Potential CO2 CH4 N2O",
        "EPA Global Warming Potential 100-year values",
        "最新 溫室氣體潛勢 GWP 100年 二氧化碳 甲烷 氧化亞氮",
        "環保署 GWP 值 CO2 CH4 N2O"
    ]
    
    for query in search_queries:
        print(f"\n🔍 Searching with query: {query}\n")
        results = search_gwp_factors(query)
        
        if not results:
            print(f"⚠️ No results found for query: {query}, trying next query.")
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
                "snippet": snippet
            })
            
            # Check if it's a PDF file
            if re.search(r'\.pdf$', link, re.IGNORECASE):
                article_text = process_pdf(link)
            else:
                article_text = extract_web_content(link)
                
            if article_text:
                # Use AI to extract GWP values
                extracted_json = extract_gwp_values(article_text, link)
                if extracted_json:
                    try:
                        extracted_data = ast.literal_eval(extracted_json)
                        extracted_gwp_values.append(extracted_data)
                        print(f"✅ Successfully extracted GWP values from source {i}!")
                    except (SyntaxError, ValueError) as e:
                        print(f"❌ Failed to parse extracted JSON: {e}")
                else:
                    print("⚠️ Could not extract GWP values from this source.")
            else:
                print("⚠️ Could not extract text content.")
                
        # If enough GWP values have been extracted, proceed to verification
        if len(extracted_gwp_values) >= 2:
            break
    
    # Verify GWP values
    if extracted_gwp_values:
        print("\n🔍 Verifying GWP values...\n")
        verified_result = verify_gwp_values(extracted_gwp_values)
        
        if verified_result:
            try:
                verified_data = ast.literal_eval(verified_result)
                most_reliable = verified_data.get("most_reliable", {})
                verification_reason = verified_data.get("reason", "")
                final_values = verified_data.get("final_values", {})
                reference = verified_data.get("reference", "Unknown reference")
                
                print(f"✅ Verification complete! Using {reference} values.")
                print(f"📝 Verification reason: {verification_reason}")
                
                # Display most reliable GWP values
                co2_value = final_values.get("CO2", 1)
                ch4_value = final_values.get("CH4", None)
                n2o_value = final_values.get("N2O", None)
                publication_year = most_reliable.get("publication_year", datetime.now().year)
                
                print("\n🌡️ Global Warming Potential (GWP) Values (100-year):")
                print(f"CO2: {co2_value}")
                print(f"CH4: {ch4_value}")
                print(f"N2O: {n2o_value}")
                print(f"📅 Reference: {reference}")
                print(f"📅 Publication year: {publication_year}")
                
                # Save to database
                update_gwp_database(co2_value, ch4_value, n2o_value, publication_year,reference)
                
            except (SyntaxError, ValueError) as e:
                print(f"❌ Failed to parse verification result: {e}")
        else:
            print("⚠️ Could not verify GWP values.")
    else:
        print("⚠️ Could not extract any GWP value data, verification not possible.")
        
        # If no values found online, use IPCC AR6 values as fallback
        print("\n⚠️ Using IPCC AR6 default values as fallback:")
        print("CO2: 1")
        print("CH4: 28")
        print("N2O: 265")
        
        update_gwp_database("IPCC AR6 (Fallback)", 2021, 1, 28, 265)
        
        return

if __name__ == "__main__":
    main()