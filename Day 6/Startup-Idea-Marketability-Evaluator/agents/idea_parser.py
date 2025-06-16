from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from utils.llm import llm


prompt = PromptTemplate.from_template("""
Extract the key components from the startup idea below:
Idea: {idea}

Output format:
- Domain:
- Problem:
- Target Audience:
- Technologies:
""")

chain = LLMChain(prompt=prompt, llm=llm)

def parse_idea(idea):
    return chain.run(idea)