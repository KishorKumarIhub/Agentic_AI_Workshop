# rag/embeddings.py

import google.generativeai as genai
from config.settings import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

def get_embedding(text: str) -> list:
    model = genai.get_model('models/embedding-001')
    response = model.embed_content(
        content=text,
        task_type="retrieval_document"
    )
    return response['embedding']
