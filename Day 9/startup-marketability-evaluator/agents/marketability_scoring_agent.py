from typing import Dict
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import initialize_agent, Tool, AgentType
from langchain.prompts import PromptTemplate
from langchain.output_parsers import ResponseSchema, StructuredOutputParser

class MarketabilityScoringAgent:
    def __init__(self, api_key: str):
        """Initialize the Marketability Scoring Agent."""
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=api_key,
            temperature=0.3
        )
        
        # Define the output schema for structured scoring
        self.output_schemas = [
            ResponseSchema(name="marketability_score", description="Overall marketability score (0-100)"),
            ResponseSchema(name="opportunity_scope", description="Assessment of market opportunity size and potential"),
            ResponseSchema(name="market_timing", description="Evaluation of market timing and readiness"),
            ResponseSchema(name="risk_zones", description="Identification of key risk areas"),
            ResponseSchema(name="recommendations", description="Strategic recommendations for improvement")
        ]
        
        self.output_parser = StructuredOutputParser.from_response_schemas(self.output_schemas)
        
        # Create scoring prompt
        self.scoring_prompt = PromptTemplate(
            template="""Evaluate the marketability of this startup idea based on the following analysis:

            Parsed Idea:
            {parsed_idea}

            Market Signals:
            {market_signals}

            Competitive Analysis:
            {competitive_analysis}

            Please provide a structured evaluation following this format:
            {format_instructions}

            Base your scoring on:
            1. Market opportunity and growth potential
            2. Competitive advantage and differentiation
            3. Market timing and readiness
            4. Risk assessment and mitigation potential
            
            The marketability score should be a number between 0-100, where:
            - 90-100: Exceptional market potential
            - 75-89: Strong market potential
            - 60-74: Moderate market potential
            - 40-59: Limited market potential
            - 0-39: High-risk/low potential
            """,
            input_variables=["parsed_idea", "market_signals", "competitive_analysis"],
            partial_variables={"format_instructions": lambda: output_parser.get_format_instructions()}
        )
        
        # Initialize tools
        self.tools = [
            Tool(
                name="Score Calculator",
                func=self._calculate_score,
                description="Calculate the final marketability score"
            ),
            Tool(
                name="Risk Analyzer",
                func=self._analyze_risks,
                description="Analyze potential risks and challenges"
            ),
            Tool(
                name="Recommendation Generator",
                func=self._generate_recommendations,
                description="Generate strategic recommendations"
            )
        ]
        
        # Initialize agent
        self.agent = initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True
        )

    def _calculate_score(self, data: Dict) -> Dict:
        """Calculate the marketability score based on various factors."""
        try:
            # Extract relevant metrics
            market_growth = data.get("market_signals", {}).get("growth", "medium")
            competition_level = data.get("competitive_metrics", {}).get("market_saturation", "medium")
            timing_assessment = data.get("market_signals", {}).get("timing", "neutral")
            
            # Base score calculations
            base_scores = {
                "market_potential": {
                    "high": 35,
                    "medium": 25,
                    "low": 15
                },
                "competition": {
                    "low": 35,
                    "medium": 25,
                    "high": 15
                },
                "timing": {
                    "favorable": 30,
                    "neutral": 20,
                    "unfavorable": 10
                }
            }
            
            # Calculate total score
            score = (
                base_scores["market_potential"].get(market_growth, 25) +
                base_scores["competition"].get(competition_level, 25) +
                base_scores["timing"].get(timing_assessment, 20)
            )
            
            return {"score": score}
        except Exception as e:
            return {"error": str(e)}

    def _analyze_risks(self, data: Dict) -> Dict:
        """Analyze potential risks and challenges."""
        try:
            prompt = f"""Analyze the potential risks and challenges for this startup based on:

            Market Analysis: {data.get('market_signals', {})}
            Competition: {data.get('competitive_analysis', {})}
            
            Identify:
            1. Market risks
            2. Competitive risks
            3. Timing risks
            4. Execution risks
            """
            
            response = self.llm.predict(prompt)
            return {"risks": response}
        except Exception as e:
            return {"error": str(e)}

    def _generate_recommendations(self, data: Dict) -> Dict:
        """Generate strategic recommendations."""
        try:
            prompt = f"""Based on the analysis:

            Market Score: {data.get('score', 0)}
            Risks: {data.get('risks', {})}
            
            Provide strategic recommendations for:
            1. Improving market positioning
            2. Addressing identified risks
            3. Optimizing timing
            4. Enhancing competitive advantage
            """
            
            response = self.llm.predict(prompt)
            return {"recommendations": response}
        except Exception as e:
            return {"error": str(e)}

    def evaluate_marketability(self, 
                             parsed_idea: Dict, 
                             market_signals: Dict, 
                             competitive_analysis: Dict) -> Dict:
        """Main method to evaluate startup marketability."""
        try:
            # Let the agent orchestrate the evaluation
            result = self.agent.run(
                f"""Evaluate the marketability of this startup idea:
                
                Idea Analysis: {parsed_idea}
                Market Signals: {market_signals}
                Competitive Analysis: {competitive_analysis}
                """
            )
            
            # Calculate initial score
            score_data = {
                "market_signals": market_signals,
                "competitive_metrics": competitive_analysis.get("competitive_metrics", {})
            }
            score_result = self._calculate_score(score_data)
            
            # Analyze risks
            risks_result = self._analyze_risks({
                "market_signals": market_signals,
                "competitive_analysis": competitive_analysis
            })
            
            # Generate recommendations
            recommendations = self._generate_recommendations({
                "score": score_result.get("score", 0),
                "risks": risks_result.get("risks", {})
            })
            
            # Format final response
            final_analysis = {
                "marketability_score": score_result.get("score", 0),
                "opportunity_scope": market_signals.get("market_analysis", {}).get("growth", ""),
                "market_timing": market_signals.get("market_analysis", {}).get("timing", ""),
                "risk_zones": risks_result.get("risks", ""),
                "recommendations": recommendations.get("recommendations", "")
            }
            
            return {
                "success": True,
                "analysis": final_analysis,
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
    
    agent = MarketabilityScoringAgent(api_key)
    
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
    
    test_competitive_analysis = {
        "competitive_metrics": {
            "market_saturation": "medium",
            "total_competitors": 15,
            "avg_competitor_funding": 5000000
        },
        "competitive_analysis": {
            "analysis": "Moderate competition with room for innovation..."
        }
    }
    
    result = agent.evaluate_marketability(
        test_parsed_idea,
        test_market_signals,
        test_competitive_analysis
    )
    print(result)
