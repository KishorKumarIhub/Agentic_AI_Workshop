from typing import Dict
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import initialize_agent, Tool, AgentType
from langchain.prompts import PromptTemplate
from langchain.output_parsers import ResponseSchema, StructuredOutputParser

class IdeaParsingAgent:
    def __init__(self, api_key: str):
        """Initialize the Idea Parsing Agent with Gemini AI."""
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=api_key,
            temperature=0.3
        )
        
        # Define the output schema
        self.output_schemas = [
            ResponseSchema(name="theme", description="The core theme or category of the startup"),
            ResponseSchema(name="domain", description="The specific industry or market domain"),
            ResponseSchema(name="value_proposition", description="The unique value proposition or main benefit"),
            ResponseSchema(name="target_audience", description="The primary target audience or customer segment"),
            ResponseSchema(name="innovation_factor", description="What makes this idea innovative or unique")
        ]
        
        self.output_parser = StructuredOutputParser.from_response_schemas(self.output_schemas)
        
        # Create the parsing tool
        self.tools = [
            Tool(
                name="Idea Analysis",
                func=self._analyze_idea,
                description="Analyzes a startup idea to extract key components"
            )
        ]
        
        # Initialize the agent
        self.agent = initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True
        )
        
        # Create the analysis prompt
        self.analysis_prompt = PromptTemplate(
            template="""Analyze the following startup idea and extract key components:
            
            Startup Idea: {idea}
            
            Please provide a structured analysis with the following components:
            {format_instructions}
            
            Focus on being specific and actionable in your analysis.
            """,
            input_variables=["idea"],
            partial_variables={"format_instructions": self.output_parser.get_format_instructions()}
        )

    def _analyze_idea(self, idea: str) -> Dict:
        """Internal method to analyze the startup idea."""
        prompt = self.analysis_prompt.format(idea=idea)
        response = self.llm.predict(prompt)
        return self.output_parser.parse(response)

    def parse_idea(self, idea: str) -> Dict:
        """Main method to parse and analyze a startup idea."""
        try:
            # Let the agent decide how to analyze the idea
            result = self.agent.run(
                f"Analyze this startup idea and extract key information: {idea}"
            )
            
            # Use the structured analysis tool for detailed parsing
            parsed_result = self._analyze_idea(idea)
            
            return {
                "success": True,
                "analysis": parsed_result,
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
    agent = IdeaParsingAgent(api_key)
    
    test_idea = """
    A platform that uses AI to analyze satellite imagery and predict optimal locations 
    for solar panel installations, helping renewable energy companies maximize efficiency.
    """
    
    result = agent.parse_idea(test_idea)
    print(result)
