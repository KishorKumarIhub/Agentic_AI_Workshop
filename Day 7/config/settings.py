import os
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
CRUNCHBASE_API_KEY = os.getenv("CRUNCHBASE_API_KEY")
