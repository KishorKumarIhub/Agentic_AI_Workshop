from langgraph.graph import StateGraph
from langchain_core.runnables import RunnableLambda
from langgraph.graph import END

# Import your agents/tools
from agents.idea_parsing_agent import idea_parsing_tool
from agents.market_signal_retriever_agent import market_signal_tool
from agents.comparative_benchmarking_agent import benchmarking_tool
from agents.marketability_scoring_agent import scoring_tool

# Define state schema
from typing import TypedDict, Optional, Dict, Any

class MarketabilityState(TypedDict):
    startup_idea: str
    parsed_idea: Optional[Dict[str, Any]]
    market_signals: Optional[Dict[str, Any]]
    benchmark_results: Optional[Dict[str, Any]]
    final_score: Optional[Dict[str, Any]]

def build_graph():
    workflow = StateGraph(MarketabilityState)

    # ✅ Idea Parsing Agent — FIXED KEY NAME!
    workflow.add_node(
        "idea_parser",
        RunnableLambda(lambda state: {"parsed_idea": idea_parsing_tool.invoke({"text": state["startup_idea"]})})
    )

    # Market Signal Retriever Agent
    workflow.add_node(
        "market_signal",
        RunnableLambda(lambda state: {
            "market_signals": market_signal_tool.invoke({"parsed_idea": state["parsed_idea"]})
        })
    )
    # Benchmarking Agent
    workflow.add_node(
        "benchmarking",
        RunnableLambda(lambda state: {
            "benchmark_results": benchmarking_tool.invoke({
                "parsed_idea": state["parsed_idea"],
            "market_signals": state["market_signals"]
        })
    })
)


    # Marketability Scoring Agent
    workflow.add_node(
        "scoring",
        RunnableLambda(lambda state: {
            "final_score": scoring_tool.invoke({
                "parsed_idea": state["parsed_idea"],
                "market_signals": state["market_signals"],
                "benchmark_results": state["benchmark_results"]
            })
        })
    )

    # Define the flow of nodes
    workflow.set_entry_point("idea_parser")
    workflow.add_edge("idea_parser", "market_signal")
    workflow.add_edge("market_signal", "benchmarking")
    workflow.add_edge("benchmarking", "scoring")
    workflow.add_edge("scoring", END)

    # Compile the workflow
    graph = workflow.compile()
    return graph
