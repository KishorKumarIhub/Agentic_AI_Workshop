from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os

embedding_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=os.getenv("GEMINI_API_KEY"))

def embed_query(text):
    return embedding_model.embed_query(text)