import os
import pandas as pd
import streamlit as st
import google.generativeai as genai
from autogen.agentchat import (
    AssistantAgent,
    UserProxyAgent,
    GroupChat,
    GroupChatManager,
)
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")

genai.configure(api_key=api_key)

def gemini_call(prompt, model_name="models/gemini-1.5-flash"):
    return genai.GenerativeModel(model_name).generate_content(prompt).text

# ===== Agent Definitions =====
class DataPrepAgent(AssistantAgent):
    def generate_reply(self, messages, sender, config=None):
        df = st.session_state["df"]
        prompt = f"""You are a Data Cleaning Agent.
- Handle missing values
- Fix data types
- Remove duplicates

Dataset head:
{df.head().to_string()}

Summary stats:
{df.describe(include='all').to_string()}

Return Python code for preprocessing and a short explanation."""
        return gemini_call(prompt)

class EDAAgent(AssistantAgent):
    def generate_reply(self, messages, sender, config=None):
        df = st.session_state["df"]
        prompt = f"""You are an EDA Agent.
- Provide summary statistics
- Extract at least 3 insights
- Suggest visualizations

Dataset head:
{df.head().to_string()}"""
        return gemini_call(prompt)

class ReportGeneratorAgent(AssistantAgent):
    def generate_reply(self, messages, sender, config=None):
        insights = st.session_state.get("eda_output", "")
        prompt = f"""You are a Report Generator.
Create a clean EDA report based on insights:

{insights}

Include:
- Overview
- Key Findings
- Visual Suggestions
- Summary conclusion."""
        return gemini_call(prompt)

class CriticAgent(AssistantAgent):
    def generate_reply(self, messages, sender, config=None):
        report = st.session_state.get("report_output", "")
        prompt = f"""You are a Critic Agent.
Review the EDA report:

{report}

Comment on clarity, accuracy, completeness, and suggest improvements."""
        return gemini_call(prompt)

class ExecutorAgent(AssistantAgent):
    def generate_reply(self, messages, sender, config=None):
        code = st.session_state.get("prep_output", "")
        prompt = f"""You are an Executor Agent.
Validate the following data preprocessing code:

{code}

- Is it runnable?
- Suggest corrections if needed."""
        return gemini_call(prompt)

# ===== Admin / Proxy Agent =====
admin_agent = UserProxyAgent(
    name="Admin",
    human_input_mode="NEVER",
    code_execution_config=False  # disables Docker requirement
)

# ===== Streamlit UI =====
st.set_page_config(layout="wide", page_title="Agentic EDA", page_icon="🔍")

# Sidebar
with st.sidebar:
    st.title("🔍 Agentic EDA")
    st.markdown("""
    **How to use:**
    1. Upload a CSV file
    2. Click **Run Agentic EDA**
    3. Explore the results for each step
    
    ---
    **About:**
    - Multi-agent EDA pipeline using Gemini + Autogen
    - Created for AI Bootcamp
    - [GitHub](https://github.com/langchain-ai/langgraph)
    """)
    st.markdown("---")
    st.caption("Made with ❤️ by your AI Agent.")

st.markdown("""
<style>
/* Custom CSS for section dividers and cards */
.section {
    border-radius: 12px;
    background: #f8fafc;
    padding: 1.5rem 1.5rem 1rem 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.status-bar {
    display: flex;
    gap: 8px;
    margin-bottom: 1.5rem;
}
.status-step {
    padding: 0.5rem 1rem;
    border-radius: 999px;
    font-weight: 600;
    background: #e0e7ef;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
}
.status-step.active {
    background: #2563eb;
    color: #fff;
}
</style>
""", unsafe_allow_html=True)

st.title("🔍 Agentic EDA: Beautiful Edition")
st.markdown(
    "<span style='font-size:1.2rem;'>Upload a CSV and let our multi-agent system analyze it step-by-step, now with a modern UI! 🚀</span>",
    unsafe_allow_html=True
)

uploaded = st.file_uploader("📁 Upload CSV file", type=["csv"])

if uploaded:
    df = pd.read_csv(uploaded)
    st.session_state["df"] = df
    st.markdown("---")
    st.subheader("📄 Raw Dataset Preview")
    st.dataframe(df.head(), use_container_width=True)

    # Status bar for pipeline steps
    steps = [
        ("🧹", "Data Prep", "prep_output"),
        ("📊", "EDA", "eda_output"),
        ("📄", "Report", "report_output"),
        ("🧐", "Critic", "critic_output"),
        ("✅", "Executor", "exec_output"),
    ]
    completed = [k for _, _, k in steps if k in st.session_state]
    st.markdown('<div class="status-bar">' + ''.join([
        f'<span class="status-step {"active" if k in completed else ""}">{icon} {name}</span>'
        for icon, name, k in steps
    ]) + '</div>', unsafe_allow_html=True)

    if st.button("🚀 Run Agentic EDA", use_container_width=True):
        with st.spinner("Initializing agents..."):
            agents = [
                admin_agent,
                DataPrepAgent(name="DataPrep"),
                EDAAgent(name="EDA"),
                ReportGeneratorAgent(name="ReportGen"),
                CriticAgent(name="Critic"),
                ExecutorAgent(name="Executor"),
            ]
            chat = GroupChat(agents=agents, messages=[])
            manager = GroupChatManager(groupchat=chat)

        with st.spinner("Running multi-agent system..."):
            # ===== Data Preparation Output =====
            prep = agents[1].generate_reply([], "Admin")
            st.session_state["prep_output"] = prep
            with st.container():
                st.markdown('<div class="section">', unsafe_allow_html=True)
                st.markdown("### 🧹 Data Preparation Output")
                st.markdown("**Python Code:**")
                st.code(prep, language="python")
                st.markdown('</div>', unsafe_allow_html=True)

            # ===== EDA Agent Output =====
            eda_out = agents[2].generate_reply([], "Admin")
            st.session_state["eda_output"] = eda_out
            with st.container():
                st.markdown('<div class="section">', unsafe_allow_html=True)
                st.markdown("### 📊 EDA Insights")
                st.markdown(eda_out)
                st.markdown('</div>', unsafe_allow_html=True)

            # ===== Report Generation =====
            report = agents[3].generate_reply([], "Admin")
            st.session_state["report_output"] = report
            with st.container():
                st.markdown('<div class="section">', unsafe_allow_html=True)
                st.markdown("### 📄 EDA Report")
                st.markdown(report)
                st.markdown('</div>', unsafe_allow_html=True)

            # ===== Critic Feedback =====
            critique = agents[4].generate_reply([], "Admin")
            st.session_state["critic_output"] = critique
            with st.container():
                st.markdown('<div class="section">', unsafe_allow_html=True)
                st.markdown("### 🧐 Critic Agent Feedback")
                st.markdown(critique)
                st.markdown('</div>', unsafe_allow_html=True)

            # ===== Code Execution Check =====
            exec_feedback = agents[5].generate_reply([], "Admin")
            st.session_state["exec_output"] = exec_feedback
            with st.container():
                st.markdown('<div class="section">', unsafe_allow_html=True)
                st.markdown("### ✅ Executor Agent Validation")
                st.markdown(exec_feedback)
                st.markdown('</div>', unsafe_allow_html=True)

        st.success("✔️ Agentic EDA completed successfully.")
else:
    st.info("Upload a CSV file above to begin.")
