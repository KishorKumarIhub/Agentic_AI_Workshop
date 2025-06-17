from langchain.vectorstores import Chroma
from langchain.storage import LocalFileStore
from components.embeddings import embedding_model

VECTORSTORE_PATH = "data/vectorstore/"

def load_vectorstore(collection="market_signals"):
    return Chroma(persist_directory=VECTORSTORE_PATH + collection, embedding_function=embedding_model)