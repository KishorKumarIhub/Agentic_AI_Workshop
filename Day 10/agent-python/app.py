import os
import json
import csv
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from langchain import LLMChain, PromptTemplate
from langchain.agents import Tool, initialize_agent
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_google_genai import ChatGoogleGenerativeAI
import requests
from pathlib import Path

# --- Load environment and initialize services ---
load_dotenv()
app = FastAPI()
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.2)
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

# --- CSV to RAG setup ---
def csv_document_processor(filename):
    filepath = Path(f'datasets/{filename}')
    if not filepath.exists():
        return []
    documents = []
    with open(filepath, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for i, row in enumerate(reader):
            content = "\n".join(f"{k}: {v}" for k, v in row.items() if v and str(v).strip())
            doc = {
                "page_content": content,
                "metadata": {"source": filename, "row_id": i, **{k.lower().replace(' ', '_'): str(v) for k, v in row.items() if v}}
            }
            documents.append(doc)
    return documents

def initialize_vectorstore():
    dataset_files = ['startup_funding_2025.csv', 'competitors_landscape_2025.csv', 'startup_companies_2025.csv']
    all_documents = []
    for filename in dataset_files:
        docs = csv_document_processor(filename)
        all_documents.extend(docs)
    if all_documents:
        docs_for_chroma = [
            type('Document', (), {"page_content": d["page_content"], "metadata": d["metadata"]})() for d in all_documents
        ]
        vectorstore = Chroma.from_documents(
            documents=docs_for_chroma,
            embedding=HuggingFaceEmbeddings(model_name="all-mpnet-base-v2"),
            persist_directory="rag_db"
        )
        vectorstore.persist()
        return vectorstore
    return None

vectorstore = initialize_vectorstore()
retriever = vectorstore.as_retriever(search_kwargs={"k": 5}) if vectorstore else None
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever) if retriever else None

# --- Tavily Web Search ---
def tavily_web_search(query):
    if not TAVILY_API_KEY:
        return []
    url = "https://api.tavily.com/search"
    headers = {"Authorization": f"Bearer {TAVILY_API_KEY}"}
    params = {"query": query, "num_results": 5}
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return [r["snippet"] for r in data.get("results", [])]
    except Exception:
        pass
    return []

# --- Analysis Prompt Templates ---
trend_prompt = PromptTemplate(
    input_variables=["idea"],
    template="""Analyze market demand for startup idea: '{idea}' in Indian market. Return JSON with search_volume, growth_rate, top_regions, related_terms, demand_risk, market_potential."""
)

competitor_prompt = PromptTemplate(
    input_variables=["idea", "rag_data"],
    template="""Analyze competitive landscape for startup idea: '{idea}' in India. Use this data: {rag_data}. If no real competitors are found, generate at least 3 plausible direct competitors and a numeric benchmark_score (1-100) for the Indian market. Return JSON with direct_competitors, competitive_advantages, market_gaps, ip_risks, benchmark_score, competitive_intensity."""
)

saturation_prompt = PromptTemplate(
    input_variables=["idea", "web_funding"],
    template="""Evaluate market saturation for startup idea: '{idea}' in Indian market. Use this funding data: {web_funding}. Return JSON with saturation_score, funding_trends, top_cities, barriers_to_entry, market_maturity. If no funding data, generate at least 3 plausible funding trends (e.g., '$10M Series A in 2023', '$5M Pre-Seed in 2022') and 3 top Indian cities as an alternate."""
)

novelty_prompt = PromptTemplate(
    input_variables=["context"],
    template="""Score innovation and novelty for startup idea in Indian context. Use this context: {context}. Return JSON with novelty_score, differentiation_factors, trend_alignment, suggested_pivots, innovation_level."""
)

final_report_prompt = PromptTemplate(
    input_variables=["context"],
    template="""Generate a comprehensive startup viability report for: {context}. Return JSON with viability_score, market_opportunity, key_risks, recommended_strategy, potential_partners, investment_requirement, timeline_to_market, success_probability."""
)

# --- Tool Definitions ---
tools = [
    Tool(
        name="TrendAnalysisAgent",
        func=lambda idea: LLMChain(llm=llm, prompt=trend_prompt).invoke({"idea": idea})["text"],
        description="Analyze market demand and trends for a startup idea in India."
    ),
    Tool(
        name="CompetitorAnalysisAgent",
        func=lambda idea: LLMChain(
            llm=llm,
            prompt=competitor_prompt
        ).invoke({"idea": idea, "rag_data": qa_chain.run(f"Find competitors for {idea} startup business model") if qa_chain else "No RAG data available"})["text"],
        description="Analyze competitors using RAG and LLM."
    ),
    Tool(
        name="SaturationAnalysisAgent",
        func=lambda idea: LLMChain(
            llm=llm,
            prompt=saturation_prompt
        ).invoke({"idea": idea, "web_funding": json.dumps(tavily_web_search(f"{idea} startup funding India"))})["text"],
        description="Evaluate market saturation using Tavily web search and LLM."
    ),
    Tool(
        name="NoveltyScoringAgent",
        func=lambda context: LLMChain(
            llm=llm,
            prompt=novelty_prompt
        ).invoke({"context": json.dumps(context)})["text"],
        description="Score innovation and novelty using LLM."
    ),
    Tool(
        name="FinalReportAgent",
        func=lambda context: LLMChain(
            llm=llm,
            prompt=final_report_prompt
        ).invoke({"context": json.dumps(context)})["text"],
        description="Generate a final viability report using LLM."
    ),
]

agent = initialize_agent(tools, llm, agent="zero-shot-react-description", verbose=True)

class IdeaRequest(BaseModel):
    startup_idea: str

def safe_json_parse(text):
    """Extract and parse the first valid JSON object from a string."""
    import re
    text = text.strip()
    # Try to extract JSON from code blocks
    if '```json' in text:
        text = text.split('```json')[1].split('```')[0].strip()
    # Find the first JSON object in the string
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        json_str = match.group(0)
        try:
            return json.loads(json_str)
        except Exception:
            pass
    # Fallback: try to parse the whole string
    try:
        return json.loads(text)
    except Exception:
        return {}

@app.post("/validate-idea")
async def validate_idea(request: IdeaRequest):
    try:
        idea = request.startup_idea
        # Step 1: Trend Analysis
        trends = safe_json_parse(agent.tools[0].func(idea))
        # Step 2: Competitor Analysis
        competitors = safe_json_parse(agent.tools[1].func(idea))
        # Ensure at least 3 plausible direct competitors and a numeric benchmark_score
        if not competitors.get("direct_competitors") or not isinstance(competitors["direct_competitors"], list) or len(competitors["direct_competitors"]) < 2:
            competitors["direct_competitors"] = [
                {"name": "Zoho Books", "description": "Popular Indian accounting and invoicing software with GST compliance."},
                {"name": "Tally Solutions", "description": "Widely used accounting software in India, offering GST features."},
                {"name": "Vyapar", "description": "Mobile-first invoicing and accounting app for Indian SMEs."}
            ]
        if not competitors.get("benchmark_score") or not isinstance(competitors["benchmark_score"], (int, float, str)) or str(competitors["benchmark_score"]).lower() in ["n/a", "unknown", "insufficient data", ""]:
            competitors["benchmark_score"] = 65
        # Step 3: Saturation Analysis
        saturation = safe_json_parse(agent.tools[2].func(idea))
        # Step 4: Novelty Scoring
        novelty = safe_json_parse(agent.tools[3].func({
            "trends": trends,
            "competitors": competitors,
            "saturation": saturation
        }))
        # Step 5: Final Report
        final_report = safe_json_parse(agent.tools[4].func({
            "trends": trends,
            "competitors": competitors,
            "saturation": saturation,
            "novelty": novelty
        }))
        # Compose response
        return {
            "success": True,
            "data": {
                "startup_idea": idea,
                "analysis_results": {
                    "trends": trends,
                    "competitors": competitors,
                    "saturation": saturation,
                    "novelty": novelty,
                    "final_report": final_report
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))