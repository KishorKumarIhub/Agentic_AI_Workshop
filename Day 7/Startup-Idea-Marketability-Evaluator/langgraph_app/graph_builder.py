from langgraph.graph import StateGraph
from agents.idea_parser import parse_idea
from agents.market_signal_retriever import retrieve_signals
from agents.benchmarking_agent import benchmark_idea
from agents.scoring_agent import score_marketability

workflow = StateGraph()
workflow.add_node("parse_idea", parse_idea)
workflow.add_node("market_signals", retrieve_signals)
workflow.add_node("benchmark", benchmark_idea)
workflow.add_node("score", score_marketability)

workflow.set_entry_point("parse_idea")
workflow.connect("parse_idea", "market_signals")
workflow.connect("market_signals", "benchmark")
workflow.connect("benchmark", "score")
workflow.set_finish_point("score")

def get_graph():
    return workflow.compile()