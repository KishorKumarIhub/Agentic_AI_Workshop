from tavily import TavilyClient
import os

tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def fetch_trends(query):
    return tavily.search(query=query, max_results=3)