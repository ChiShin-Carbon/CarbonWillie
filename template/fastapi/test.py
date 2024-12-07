from openai import OpenAI
import os
from dotenv import load_dotenv  # Import for loading environment variables

# Load environment variables from a .env file
load_dotenv()

# Set your API key from the environment variable
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # Pass the API key directly here



completion =client.chat.completions.create(
    model="gpt-4",  # Use a valid model like 'gpt-4' or 'gpt-3.5-turbo'
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "請問碳盤查是什麼?"
        }
    ]
)

# Print the response from the model
print(completion.choices[0].message.content)  # Correctly access content using dot notation

