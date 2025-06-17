from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableLambda
from utils.prompt_templates import IDEA_PARSING_TEMPLATE
from langchain_google_genai import ChatGoogleGenerativeAI
import os

llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=os.getenv("GEMINI_API_KEY"))

prompt = PromptTemplate.from_template(IDEA_PARSING_TEMPLATE)
idea_parser_chain = prompt | llm
parse_idea = RunnableLambda(lambda input: idea_parser_chain.invoke({"idea": input}))