import os
from typing import List, Dict
import pandas as pd
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document

class StartupDataRetriever:
    def __init__(self, api_key: str, vector_store_path: str, dataset_path: str):
        """Initialize the Startup Data Retriever with RAG capabilities."""
        self.api_key = api_key
        self.vector_store_path = vector_store_path
        self.dataset_path = dataset_path
        
        # Initialize embeddings
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=api_key
        )
        
        # Initialize text splitter for chunking
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        
        # Initialize or load vector store
        self._initialize_vector_store()

    def _initialize_vector_store(self):
        """Initialize or load the vector store."""
        try:
            # Check if vector store exists
            if os.path.exists(self.vector_store_path):
                self.vector_store = Chroma(
                    persist_directory=self.vector_store_path,
                    embedding_function=self.embeddings
                )
            else:
                # Create new vector store from dataset
                self._create_vector_store()
        except Exception as e:
            raise Exception(f"Failed to initialize vector store: {str(e)}")

    def _create_vector_store(self):
        """Create a new vector store from the startup dataset."""
        try:
            # Load startup dataset
            df = pd.read_csv(self.dataset_path)
            
            # Prepare documents for indexing
            documents = []
            for _, row in df.iterrows():
                # Create a structured text representation of the startup
                text = f"""
                Startup: {row.get('name', 'N/A')}
                Industry: {row.get('industry', 'N/A')}
                Description: {row.get('description', 'N/A')}
                Business Model: {row.get('business_model', 'N/A')}
                Target Market: {row.get('target_market', 'N/A')}
                Funding: {row.get('funding', 'N/A')}
                Stage: {row.get('stage', 'N/A')}
                Founded: {row.get('founded_year', 'N/A')}
                """
                
                # Create document with metadata
                doc = Document(
                    page_content=text,
                    metadata={
                        "name": row.get('name', ''),
                        "industry": row.get('industry', ''),
                        "funding": row.get('funding', 0),
                        "stage": row.get('stage', ''),
                        "founded_year": row.get('founded_year', '')
                    }
                )
                documents.append(doc)
            
            # Split documents into chunks
            chunks = self.text_splitter.split_documents(documents)
            
            # Create and persist vector store
            self.vector_store = Chroma.from_documents(
                documents=chunks,
                embedding=self.embeddings,
                persist_directory=self.vector_store_path
            )
            self.vector_store.persist()
            
        except Exception as e:
            raise Exception(f"Failed to create vector store: {str(e)}")

    def similarity_search(self, query: str, k: int = 5) -> List[Dict]:
        """Search for similar startups based on the query."""
        try:
            results = self.vector_store.similarity_search(query, k=k)
            return [{"content": doc.page_content, "metadata": doc.metadata} for doc in results]
        except Exception as e:
            raise Exception(f"Failed to perform similarity search: {str(e)}")

    def search_by_industry(self, industry: str, k: int = 5) -> List[Dict]:
        """Search for startups in a specific industry."""
        try:
            results = self.vector_store.similarity_search_with_metadata(
                industry,
                k=k,
                filter={"industry": industry}
            )
            return [{"content": doc.page_content, "metadata": doc.metadata} for doc in results]
        except Exception as e:
            raise Exception(f"Failed to search by industry: {str(e)}")

    def search_by_funding_range(self, min_funding: float, max_funding: float, k: int = 5) -> List[Dict]:
        """Search for startups within a funding range."""
        try:
            results = self.vector_store.similarity_search_with_metadata(
                "funding",
                k=k,
                filter={
                    "funding": {
                        "$gte": min_funding,
                        "$lte": max_funding
                    }
                }
            )
            return [{"content": doc.page_content, "metadata": doc.metadata} for doc in results]
        except Exception as e:
            raise Exception(f"Failed to search by funding range: {str(e)}")

    def get_industry_stats(self, industry: str) -> Dict:
        """Get statistics for a specific industry."""
        try:
            startups = self.search_by_industry(industry, k=100)
            
            # Calculate statistics
            total_startups = len(startups)
            total_funding = sum(float(s["metadata"]["funding"]) for s in startups if s["metadata"]["funding"])
            avg_funding = total_funding / total_startups if total_startups > 0 else 0
            
            stages = {}
            for s in startups:
                stage = s["metadata"]["stage"]
                stages[stage] = stages.get(stage, 0) + 1
            
            return {
                "total_startups": total_startups,
                "total_funding": total_funding,
                "avg_funding": avg_funding,
                "stage_distribution": stages
            }
        except Exception as e:
            raise Exception(f"Failed to get industry stats: {str(e)}")

if __name__ == "__main__":
    # Test the retriever
    api_key = os.getenv("GOOGLE_API_KEY")
    vector_store_path = "../data/vector_store"
    dataset_path = "../data/reference_datasets/startups.csv"
    
    retriever = StartupDataRetriever(api_key, vector_store_path, dataset_path)
    
    # Test similarity search
    results = retriever.similarity_search(
        "AI-powered solar panel optimization startup"
    )
    print("Similar Startups:", results)
    
    # Test industry stats
    stats = retriever.get_industry_stats("Renewable Energy")
    print("Industry Stats:", stats)
