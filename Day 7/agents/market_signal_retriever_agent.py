from langchain_core.tools import tool

@tool
def market_signal_tool(parsed_idea: dict) -> dict:
    """
    Retrieves real-time market signals (trends, funding, etc.) based on the parsed idea.
    """
    # Simulate market signal retrieval
    return {
        "trend_score": 78,
        "funding_activity": "High",
        "related_startups": ["StartupA", "StartupB"],
        "search_volume": "Growing"
    }
