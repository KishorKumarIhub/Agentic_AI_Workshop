import os
from langchain_community.vectorstores import Chroma
from rag.embeddings import get_embedding


CHROMA_PATH = "data/vector_store"

def get_vectorstore():
    return Chroma(persist_directory=CHROMA_PATH, embedding_function=get_embedding)
