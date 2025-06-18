from langchain.tools import tool
from typing import Dict

@tool
def idea_parsing_tool(text: str) -> Dict:
    """
    Parses the startup idea text and extracts:
    - core theme
    - domain/industry
    - value proposition

    Args:
        text (str): A raw startup idea input from user.

    Returns:
        Dict: A dictionary with parsed components.
    """
    # 🔧 Dummy implementation — replace with LLM logic or pattern matching as needed
    parsed_result = {
        "core_theme": "AI",
        "domain": "Healthcare",
        "value_proposition": "Uses AI to personalize treatment recommendations"
    }

    print(f"Parsed Idea from input: {text}")
    return parsed_result
