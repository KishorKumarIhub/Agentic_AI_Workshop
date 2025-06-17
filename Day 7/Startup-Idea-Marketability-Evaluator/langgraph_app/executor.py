from langgraph_app.graph_builder import get_graph

def run_graph(idea_text):
    graph = get_graph()
    result = graph.invoke({"input": idea_text})
    return result