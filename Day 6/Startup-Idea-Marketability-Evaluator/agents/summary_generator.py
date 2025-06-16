from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from utils.llm import llm


prompt = PromptTemplate.from_template("""
Based on the data:
- Trend Results: {trend}
- Keyword Volume: {volume}
- VC Activity: {vc}
- Comparison Score: {compare_score}
- Marketability Index: {index}

Generate a concise 4-5 line report summarizing:
- Market Opportunity
- Saturation Risk
- Timing Fit
""")

chain = LLMChain(prompt=prompt, llm=llm)

def generate_summary(trend, volume, vc, compare_score, index):
    return chain.run({
        "trend": trend,
        "volume": volume,
        "vc": vc,
        "compare_score": compare_score,
        "index": index
    })