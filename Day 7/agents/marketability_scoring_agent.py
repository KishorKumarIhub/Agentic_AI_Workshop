from langchain_core.tools import tool

@tool
def scoring_tool(inputs: dict) -> dict:
    """
    Computes a marketability score using parsed idea, market signals, and benchmark data.
    """
    parsed_idea = inputs.get("parsed_idea", {})
    market_signals = inputs.get("market_signals", {})
    benchmark_results = inputs.get("benchmark_results", {})

    # Simulated scoring logic
    score = 0

    if parsed_idea:
        score += 30
    if market_signals:
        score += 30
    if benchmark_results:
        score += 40

    final_score = min(score, 100)

    return {
        "marketability_index": final_score,
        "summary": "High potential with moderate competition and strong market trends."
    }
