import os
from typing import Dict
from dotenv import load_dotenv
from agents.idea_parsing_agent import IdeaParsingAgent
from agents.market_signal_retriever_agent import MarketSignalRetrieverAgent
from agents.comparative_benchmarking_agent import ComparativeBenchmarkingAgent
from agents.marketability_scoring_agent import MarketabilityScoringAgent
from rag.retriever import StartupDataRetriever

class StartupMarketabilityEvaluator:
    def __init__(self):
        """Initialize the Startup Marketability Evaluator system."""
        # Load environment variables
        load_dotenv()
        self.api_key = os.getenv("GOOGLE_API_KEY")
        
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is not set")
        
        # Set up paths
        self.vector_store_path = "data/vector_store"
        self.dataset_path = "data/reference_datasets/startups.csv"
        
        # Initialize RAG system
        self.retriever = StartupDataRetriever(
            self.api_key,
            self.vector_store_path,
            self.dataset_path
        )
        
        # Initialize agents
        self.idea_parser = IdeaParsingAgent(self.api_key)
        self.market_signal_retriever = MarketSignalRetrieverAgent(
            self.api_key,
            self.vector_store_path
        )
        self.comparative_benchmarker = ComparativeBenchmarkingAgent(
            self.api_key,
            self.vector_store_path
        )
        self.marketability_scorer = MarketabilityScoringAgent(self.api_key)

    def evaluate_startup_idea(self, idea: str) -> Dict:
        """
        Evaluate a startup idea using the multi-agent system.
        
        Args:
            idea (str): The startup idea to evaluate
            
        Returns:
            Dict: Complete analysis including all agent outputs
        """
        try:
            # Step 1: Parse the idea
            print("🔍 Analyzing startup idea...")
            parsed_result = self.idea_parser.parse_idea(idea)
            
            if not parsed_result["success"]:
                return {
                    "success": False,
                    "error": "Failed to parse startup idea",
                    "details": parsed_result["error"]
                }
            
            # Step 2: Analyze market signals
            print("📊 Gathering market signals...")
            market_signals = self.market_signal_retriever.analyze_market_signals(
                parsed_result
            )
            
            if not market_signals["success"]:
                return {
                    "success": False,
                    "error": "Failed to analyze market signals",
                    "details": market_signals["error"]
                }
            
            # Step 3: Analyze competition and market whitespace
            print("🔄 Analyzing competition and market whitespace...")
            competitive_analysis = self.comparative_benchmarker.analyze_competition(
                parsed_result,
                market_signals
            )
            
            if not competitive_analysis["success"]:
                return {
                    "success": False,
                    "error": "Failed to analyze competition",
                    "details": competitive_analysis["error"]
                }
            
            # Step 4: Calculate final marketability score
            print("🎯 Calculating marketability score...")
            final_score = self.marketability_scorer.evaluate_marketability(
                parsed_result,
                market_signals,
                competitive_analysis
            )
            
            if not final_score["success"]:
                return {
                    "success": False,
                    "error": "Failed to calculate marketability score",
                    "details": final_score["error"]
                }
            
            # Compile final results
            return {
                "success": True,
                "idea_analysis": parsed_result["analysis"],
                "market_signals": market_signals,
                "competitive_analysis": competitive_analysis,
                "marketability_score": final_score["analysis"],
                "agent_insights": {
                    "idea_parser": parsed_result["agent_thoughts"],
                    "market_analyzer": market_signals["agent_thoughts"],
                    "competition_analyzer": competitive_analysis["agent_thoughts"],
                    "marketability_scorer": final_score["agent_thoughts"]
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": "Evaluation failed",
                "details": str(e)
            }

if __name__ == "__main__":
    # Test the system
    evaluator = StartupMarketabilityEvaluator()
    
    test_idea = """
    A platform that uses AI to analyze satellite imagery and predict optimal locations 
    for solar panel installations, helping renewable energy companies maximize efficiency.
    """
    
    result = evaluator.evaluate_startup_idea(test_idea)
    
    if result["success"]:
        print("\n✨ Evaluation Results:")
        print("\n🎯 Idea Analysis:")
        print(result["idea_analysis"])
        
        print("\n📊 Market Signals:")
        print(result["market_signals"])
        
        print("\n🔄 Competitive Analysis:")
        print(result["competitive_analysis"])
        
        print("\n💯 Marketability Score:")
        print(result["marketability_score"])
    else:
        print("\n❌ Evaluation Failed:")
        print(result["error"])
        print("Details:", result["details"])
