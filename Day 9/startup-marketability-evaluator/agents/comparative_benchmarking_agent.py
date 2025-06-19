from typing import Dict, List
import os
import pandas as pd
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import initialize_agent, Tool, AgentType
from langchain.embeddings import GoogleGenerativeAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.prompts import PromptTemplate

class ComparativeBenchmarkingAgent:
    def __init__(self, api_key: str, vector_store_path: str):
        """Initialize the Comparative Benchmarking Agent."""
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
        
        # Create analysis prompts
        self.competition_prompt = PromptTemplate(
            template="""Analyze the competitive landscape for this startup idea:

            Startup Idea:
            Theme: {theme}
            Domain: {domain}
            Value Proposition: {value_prop}

            Similar Companies:
            {competitors}

            Please provide:
            1. Competitive Density Analysis
            2. Key Differentiators
            3. Market Positioning Opportunities
            4. Potential Barriers to Entry
            """,
            input_variables=["theme", "domain", "value_prop", "competitors"]
        )
        
        self.whitespace_prompt = PromptTemplate(
            template="""Identify market whitespace opportunities based on this analysis:

            Market Context:
            {market_context}

            Competitive Analysis:
            {competitive_analysis}

            Please identify:
            1. Unmet Market Needs
            2. Underserved Customer Segments
            3. Technology Gap Opportunities
            4. Potential Innovation Areas
            """,
            input_variables=["market_context", "competitive_analysis"]
        )
        
        # Initialize tools
        self.tools = [
            Tool(
                name="Competitor Analysis",
                func=self._analyze_competitors,
                description="Analyze competitive landscape and market positioning"
            ),
            Tool(
                name="Whitespace Analysis",
                func=self._analyze_whitespace,
                description="Identify market whitespace opportunities"
            ),
            Tool(
                name="Similarity Search",
                func=self._search_similar_companies,
                description="Search for similar companies in the database"
            )
        ]
        
        # Initialize agent
        self.agent = initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True
        )

    def _search_similar_companies(self, query: str, k: int = 10) -> List[Dict]:
        """Search for similar companies in the vector store."""
        try:
            results = self.vector_store.similarity_search(query, k=k)
            return [{"content": doc.page_content, "metadata": doc.metadata} for doc in results]
        except Exception as e:
            return {"error": str(e)}

    def _analyze_competitors(self, data: Dict) -> Dict:
        """Analyze competitive landscape using the LLM."""
        try:
            prompt = self.competition_prompt.format(
                theme=data.get("theme", ""),
                domain=data.get("domain", ""),
                value_prop=data.get("value_prop", ""),
                competitors=data.get("competitors", [])
            )
            
            response = self.llm.predict(prompt)
            return {"analysis": response}
        except Exception as e:
            return {"error": str(e)}

    def _analyze_whitespace(self, data: Dict) -> Dict:
        """Identify market whitespace opportunities."""
        try:
            prompt = self.whitespace_prompt.format(
                market_context=data.get("market_context", ""),
                competitive_analysis=data.get("competitive_analysis", "")
            )
            
            response = self.llm.predict(prompt)
            return {"analysis": response}
        except Exception as e:
            return {"error": str(e)}

    def _calculate_competitive_metrics(self, competitors: List[Dict]) -> Dict:
        """Calculate quantitative competitive metrics."""
        try:
            total_competitors = len(competitors)
            
            # Extract and analyze funding data if available
            funding_data = []
            for comp in competitors:
                if "funding" in comp.get("metadata", {}):
                    funding_data.append(float(comp["metadata"]["funding"]))
            
            metrics = {
                "total_competitors": total_competitors,
                "avg_competitor_funding": sum(funding_data) / len(funding_data) if funding_data else 0,
                "market_saturation": "high" if total_competitors > 20 else "medium" if total_competitors > 10 else "low"
            }
            
            return metrics
        except Exception as e:
            return {"error": str(e)}

    def analyze_competition(self, parsed_idea: Dict, market_signals: Dict) -> Dict:
        """Main method to analyze competition and market whitespace."""
        try:
            # Let the agent orchestrate the analysis
            result = self.agent.run(
                f"""Analyze the competitive landscape and market whitespace for this startup idea:
                Theme: {parsed_idea['analysis']['theme']}
                Domain: {parsed_idea['analysis']['domain']}
                Value Proposition: {parsed_idea['analysis']['value_proposition']}
                
                Market Signals: {market_signals.get('market_analysis', {})}
                """
            )
            
            # Search for similar companies
            similar_companies = self._search_similar_companies(
                f"{parsed_idea['analysis']['theme']} {parsed_idea['analysis']['value_proposition']}"
            )
            
            # Analyze competition
            competitive_analysis = self._analyze_competitors({
                "theme": parsed_idea['analysis']['theme'],
                "domain": parsed_idea['analysis']['domain'],
                "value_prop": parsed_idea['analysis']['value_proposition'],
                "competitors": similar_companies
            })
            
            # Calculate competitive metrics
            metrics = self._calculate_competitive_metrics(similar_companies)
            
            # Analyze whitespace opportunities
            whitespace_analysis = self._analyze_whitespace({
                "market_context": market_signals.get('market_analysis', {}),
                "competitive_analysis": competitive_analysis
            })
            
            return {
                "success": True,
                "competitive_analysis": competitive_analysis,
                "competitive_metrics": metrics,
                "whitespace_analysis": whitespace_analysis,
                "similar_companies": similar_companies,
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
    
    agent = ComparativeBenchmarkingAgent(api_key, vector_store_path)
    
    test_parsed_idea = {
        "analysis": {
            "theme": "Renewable Energy",
            "domain": "Solar Power",
            "value_proposition": "AI-powered solar panel placement optimization"
        }
    }
    
    test_market_signals = {
        "market_analysis": {
            "growth": "high",
            "timing": "favorable",
            "risks": "moderate"
        }
    }
    
    result = agent.analyze_competition(test_parsed_idea, test_market_signals)
    print(result)
