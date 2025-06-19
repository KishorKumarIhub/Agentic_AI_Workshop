import os
import streamlit as st
from typing import TypedDict, Annotated
from langchain_core.messages import HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain.tools import tool
from langgraph.graph import END, StateGraph
from langchain_core.prompts import MessagesPlaceholder
from langchain_community.cache import InMemoryCache
from langchain.globals import set_llm_cache
from langchain_community.document_loaders import CSVLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.agents import AgentFinish
import google.generativeai as genai

# Initialize caching
set_llm_cache(InMemoryCache())

# Configure Google API
GOOGLE_API_KEY = st.secrets.get("GOOGLE_API_KEY", os.getenv("GOOGLE_API_KEY"))
if not GOOGLE_API_KEY:
    st.error("Please set GOOGLE_API_KEY in environment variables or Streamlit secrets")
    st.stop()

genai.configure(api_key=GOOGLE_API_KEY)
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7, convert_system_message_to_human=True)
embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# Define State
class AgentState(TypedDict):
    messages: Annotated[list, lambda x, y: x + y]
    agent_outcome: AgentFinish | None

# Initialize vector stores
def initialize_vectorstore(dataset_path, store_name):
    """Initialize a Chroma vector store from a CSV file"""
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset file {dataset_path} not found")
    
    os.makedirs(f"data/vectorstores/{store_name}", exist_ok=True)
    
    loader = CSVLoader(dataset_path)
    docs = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = splitter.split_documents(docs)
    
    return Chroma.from_documents(
        splits, 
        embedding, 
        persist_directory=f"data/vectorstores/{store_name}"
    )

@st.cache_resource
def setup_vector_stores():
    """Initialize all required vector stores"""
    datasets = {
        "yc_companies": "data/reference_datasets/yc_companies.csv",
        "unique_startup_companies": "data/reference_datasets/unique_startup_companies.csv",
        "startup_fundings": "data/reference_datasets/startup_fundings.csv"
    }
    
    stores = {}
    for name, path in datasets.items():
        store_path = f"data/vectorstores/{name}"
        if os.path.exists(store_path):
            stores[name] = Chroma(persist_directory=store_path, embedding_function=embedding)
        else:
            st.warning(f"Initializing {name} vector store for the first time...")
            stores[name] = initialize_vectorstore(path, name)
            st.success(f"{name} vector store created!")
    
    return stores

# Tool definitions
@tool
def extract_idea_components(idea: str) -> dict:
    """Extract domain, theme, and value proposition from startup idea."""
    prompt = ChatPromptTemplate.from_template(
        """Extract these components from the startup idea:
        Idea: {idea}
        
        Return JSON with:
        - domain: Primary industry/vertical
        - theme: Core innovation theme
        - value_prop: Unique value proposition
        - problem: Problem being solved
        """
    )
    chain = prompt | llm | StrOutputParser()
    return chain.invoke({"idea": idea})

@tool
def retrieve_market_signals(domain: str, theme: str) -> dict:
    """Retrieve funding trends and market signals."""
    docs = vector_stores["startup_fundings"].similarity_search(f"{domain} {theme}", k=5)
    prompt = ChatPromptTemplate.from_template(
        """Analyze funding trends for '{domain}' and '{theme}':
        {context}
        
        Return JSON with:
        - momentum_score: 0-100 based on funding activity
        - interest_trend: "rising", "stable", or "declining"
        - key_players: Top companies in this space
        - recent_funding: Notable recent investments
        """
    )
    chain = prompt | llm | StrOutputParser()
    return chain.invoke({"domain": domain, "theme": theme, "context": docs})

@tool
def find_comparable_startups(domain: str, theme: str) -> dict:
    """Find comparable startups from YC and other datasets."""
    yc_docs = vector_stores["yc_companies"].similarity_search(f"{domain} {theme}", k=3)
    startup_docs = vector_stores["unique_startup_companies"].similarity_search(f"{domain} {theme}", k=3)
    
    prompt = ChatPromptTemplate.from_template(
        """Compare this idea (Domain: {domain}, Theme: {theme}) with:
        YC Companies: {yc_companies}
        Other Startups: {other_startups}
        
        Return JSON with:
        - closest_matches: Similar companies
        - differentiation: Key differences
        - whitespace: Unaddressed opportunities
        - competitive_risk: Potential threats
        """
    )
    chain = prompt | llm | StrOutputParser()
    return chain.invoke({
        "domain": domain, 
        "theme": theme,
        "yc_companies": yc_docs,
        "other_startups": startup_docs
    })

@tool
def calculate_marketability_score(idea_analysis: dict, market_signals: dict, comparisons: dict) -> dict:
    """Calculate Marketability Index (0-100)."""
    context = {
        "idea": idea_analysis,
        "market": market_signals,
        "comparisons": comparisons
    }
    prompt = ChatPromptTemplate.from_template(
        """Evaluate startup potential:
        {context}
        
        Return JSON with:
        - marketability_score: 0-100
        - opportunity_analysis: Problem/solution fit
        - timing_analysis: Market readiness
        - risk_analysis: Key risks
        - recommendation: Next steps
        """
    )
    chain = prompt | llm | StrOutputParser()
    return chain.invoke({"context": context})

# Initialize vector stores
vector_stores = setup_vector_stores()

# Agent workflow
def create_agent_executor(name, tools):
    prompt = ChatPromptTemplate.from_messages([
        ("system", f"You are the {name} Agent. Be concise and analytical."),
        MessagesPlaceholder(variable_name="messages"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])
    agent = create_tool_calling_agent(llm, tools, prompt)
    return AgentExecutor(agent=agent, tools=tools, handle_parsing_errors=True)

# Initialize StateGraph
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("idea_parser", create_agent_executor("Idea Parsing", [extract_idea_components]))
workflow.add_node("market_signal", create_agent_executor("Market Signal", [retrieve_market_signals]))
workflow.add_node("comparison", create_agent_executor("Comparative Benchmarking", [find_comparable_startups]))
workflow.add_node("scoring", create_agent_executor("Marketability Scoring", [calculate_marketability_score]))

# Add edges (now supports multiple edges from same node)
workflow.add_edge("idea_parser", "market_signal")
workflow.add_edge("idea_parser", "comparison")
workflow.add_edge("market_signal", "scoring")
workflow.add_edge("comparison", "scoring")
workflow.add_edge("scoring", END)

# Set entry point
workflow.set_entry_point("idea_parser")

# Compile the graph
app = workflow.compile()

# Streamlit UI
st.set_page_config(page_title="Startup Validator", layout="wide")
st.title("🚀 Startup Idea Validator")
st.caption("AI-powered validation using YC and funding data")

AGENT_DISPLAY = {
    "idea_parser": {"icon": "🧠", "name": "Idea Analysis"},
    "market_signal": {"icon": "🌐", "name": "Market Signals"},
    "comparison": {"icon": "🆚", "name": "Competitive Landscape"},
    "scoring": {"icon": "🎯", "name": "Market Potential"}
}

def display_agent_result(agent_key, result):
    with st.expander(f"{AGENT_DISPLAY[agent_key]['icon']} {AGENT_DISPLAY[agent_key]['name']}"):
        if isinstance(result, dict):
            for k, v in result.items():
                if k.endswith("_score"):
                    st.metric(k.replace("_", " ").title(), v)
                else:
                    st.subheader(k.replace("_", " ").title())
                    st.write(v)
        else:
            st.write(result)

idea_input = st.text_area("Describe your startup idea:", height=100,
                         placeholder="e.g. 'AI-powered legal document review for small businesses'")

if st.button("Validate Idea", type="primary") and idea_input:
    with st.spinner("Analyzing your idea..."):
        try:
            inputs = {"messages": [HumanMessage(content=idea_input)]}
            
            for output in app.stream(inputs):
                for agent_key, value in output.items():
                    if agent_key != "__end__" and "output" in value:
                        display_agent_result(agent_key, value["output"])
            
            st.success("Analysis complete!")
            
        except Exception as e:
            st.error(f"Analysis failed: {str(e)}")
            st.exception(e)

st.sidebar.markdown("""
### How It Works
1. Enter your startup idea
2. AI analyzes:
   - Core components
   - Market trends
   - Competitive landscape
3. Get a marketability score

Data sources:
- Y Combinator companies
- Startup funding records
- Industry datasets
""")