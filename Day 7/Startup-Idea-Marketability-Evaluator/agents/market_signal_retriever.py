from components.retrievers import get_combined_market_signals
from components.vectorstore import load_vectorstore
from components.embeddings import embed_query
from utils.clean_text import clean_input

def retrieve_signals(idea_summary):
    cleaned = clean_input(idea_summary)
    query_vector = embed_query(cleaned)
    vectorstore = load_vectorstore()
    return get_combined_market_signals(query_vector, vectorstore)