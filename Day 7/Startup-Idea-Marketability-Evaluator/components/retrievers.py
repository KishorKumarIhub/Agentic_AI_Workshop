def get_combined_market_signals(query_vector, vectorstore):
    return vectorstore.similarity_search_by_vector(query_vector, k=10)