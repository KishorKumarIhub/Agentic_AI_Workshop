from typing import Dict, List
import os
import pandas as pd
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import initialize_agent, Tool, AgentType
from langchain.tools import BaseTool
from langchain.embeddings import GoogleGenerativeAIEmbeddings
from langchain.vectorstores import Chroma
from pytrends.request import TrendReq

class GoogleTrendsTool(BaseTool):
    name = "Google Trends Analysis"
    description = "Get search trend data for keywords related to the startup idea"
    
    def __init__(self):
        super().__init__()
        self.pytrends = TrendReq(hl='en-US', tz=360)
        
    def _run(self, keywords: str) -> Dict:
        try:
            # Convert string to list if needed
            if isinstance(keywords, str):
                keywords = [kw.strip() for kw in keywords.split(',')]
            
            self.pytrends.build_payload(keywords, timeframe='today 5-y')
            interest_over_time = self.pytrends.interest_over_time()
            
            if interest_over_time.empty:
                return {"error": "No trend data found"}
            
            # Calculate trend metrics
            trend_data = {}
            for kw in keywords:
                if kw in interest_over_time.columns:
                    data = interest_over_time[kw]
                    trend_data[kw] = {
                        "current_interest": int(data.iloc[-1]),
                        "avg_interest": float(data.mean()),
                        "trend_direction": "up" if data.iloc[-1] > data.iloc[0] else "down",
                        "volatility": float(data.std())
                    }
            
            return trend_data
        except Exception as e:
            return {"error": str(e)}

class MarketSignalRetrieverAgent:
    def __init__(self, api_key: str, vector_store_path: str):
        """Initialize the Market Signal Retriever Agent."""
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=api_key,
            temperature=0.3
        )
        
        # Initialize embeddings
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=api_key
        )
        
        # Initialize vector store
        self.vector_store = Chroma(
            persist_directory=vector_store_path,
            embedding_function=self.embeddings
        )
        
        # Initialize tools
        self.trends_tool = GoogleTrendsTool()
        self.tools = [
            Tool(
                name="Google Trends Analysis",
                func=self.trends_tool._run,
                description="Get search trend data for keywords related to the startup idea"
            ),
            Tool(
                name="Similar Startups Search",
                func=self._search_similar_startups,
                description="Search for similar startups in the database"
            ),
            Tool(
                name="Market Analysis",
                func=self._analyze_market_data,
                description="Analyze market data and provide insights"
            )
        ]
        
        # Initialize agent
        self.agent = initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True
        )

    def _search_similar_startups(self, query: str) -> List[Dict]:
        """Search for similar startups in the vector store."""
        try:
            results = self.vector_store.similarity_search(query, k=5)
            return [{"content": doc.page_content, "metadata": doc.metadata} for doc in results]
        except Exception as e:
            return {"error": str(e)}

    def _analyze_market_data(self, data: Dict) -> Dict:
        """Analyze market data using the LLM."""
        try:
            prompt = f"""Analyze the following market data and provide insights:
            
            Market Data: {data}
            
            Please provide:
            1. Market growth indicators
            2. Competition level
            3. Market timing assessment
            4. Risk factors
            """
            
            response = self.llm.predict(prompt)
            return {"analysis": response}
        except Exception as e:
            return {"error": str(e)}

    def analyze_market_signals(self, parsed_idea: Dict) -> Dict:
        """Main method to analyze market signals for a startup idea."""
        try:
            # Extract relevant keywords
            keywords = [
                parsed_idea["analysis"]["theme"],
                parsed_idea["analysis"]["domain"]
            ]
            
            # Let the agent orchestrate the analysis
            result = self.agent.run(
                f"""Analyze market signals for this startup idea:
                Theme: {parsed_idea['analysis']['theme']}
                Domain: {parsed_idea['analysis']['domain']}
                Value Proposition: {parsed_idea['analysis']['value_proposition']}
                """
            )
            
            # Get trend data
            trend_data = self.trends_tool._run(", ".join(keywords))
            
            # Search for similar startups
            similar_startups = self._search_similar_startups(
                f"{parsed_idea['analysis']['theme']} {parsed_idea['analysis']['value_proposition']}"
            )
            
            # Analyze all collected data
            market_analysis = self._analyze_market_data({
                "trends": trend_data,
                "similar_startups": similar_startups
            })
            
            return {
                "success": True,
                "trend_data": trend_data,
                "similar_startups": similar_startups,
                "market_analysis": market_analysis,
                "agent_thoughts": result
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

if __name__ == "__main__":
    # Test the agent
    api_key = os.getenv("GOOGLE_API_KEY")
    vector_store_path = "../data/vector_store"
    
    agent = MarketSignalRetrieverAgent(api_key, vector_store_path)
    
    test_parsed_idea = {
        "analysis": {
            "theme": "Renewable Energy",
            "domain": "Solar Power",
            "value_proposition": "AI-powered solar panel placement optimization"
        }
    }
    
    result = agent.analyze_market_signals(test_parsed_idea)
    print(result)
