from rag.vector_store import get_vectorstore

def retrieve_market_signals(parsed_output: dict) -> dict:
    query = parsed_output.get("parsed_output", "")
    retriever = get_vectorstore().as_retriever()
    docs = retriever.get_relevant_documents(query)
    return {"market_signals": [doc.page_content for doc in docs]}
