import streamlit as st
import json
import autogen
from autogen import AssistantAgent, UserProxyAgent


import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('GOOGLE_API_KEY')  
if not api_key:
    raise ValueError("Gemini API key missing!")


config_list_gemini = [{
    "model": "gemini-2.5-flash",
    "api_key": api_key,
    "api_type": "google"
}]


# --- Custom CSS for a modern look ---
st.markdown(
    """
    <style>
    .main-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: #2d3748;
        margin-bottom: 0.2em;
        letter-spacing: -1px;
    }
    .subtitle {
        font-size: 1.2rem;
        color: #4a5568;
        margin-bottom: 1.5em;
    }
    .section-card {
        background: #f8fafc;
        border-radius: 1.2em;
        padding: 2em 2em 1.5em 2em;
        margin-bottom: 2em;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.04);
    }
    .stButton>button {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-weight: 600;
        border-radius: 0.7em;
        padding: 0.7em 2em;
        font-size: 1.1em;
        margin-top: 1em;
    }
    .report-card {
        background: #fff;
        border-radius: 1.2em;
        padding: 2em;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.07);
        margin-top: 2em;
    }
    .stSpinner > div > div {
        color: #764ba2 !important;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# --- Header & Branding ---
st.markdown('<div class="main-title">💼 Financial Portfolio Manager</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">AI-powered personalized investment report</div>', unsafe_allow_html=True)

# --- Main Form Layout ---
with st.form("financial_form"):
    st.markdown('<div class="section-card">', unsafe_allow_html=True)
    st.markdown("<h4>👤 User Profile</h4>", unsafe_allow_html=True)
    col1, col2 = st.columns(2)
    with col1:
        salary = st.text_input("Annual Salary (₹)", placeholder="1200000", help="Enter your total annual income.")
        age = st.number_input("Your Age", min_value=18, max_value=100, step=1, help="Must be between 18 and 100.")
        expenses = st.text_input("Annual Expenses (₹)", placeholder="500000", help="Total yearly expenses.")
    with col2:
        goals = st.text_area("Financial Goals", placeholder="Retirement in 20 years, buying a home in 5 years", height=90, help="List your main financial goals.")
        risk = st.selectbox("Risk Tolerance", ["Conservative", "Moderate", "Aggressive"], help="Choose your risk profile.")
    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown('<div class="section-card">', unsafe_allow_html=True)
    st.markdown("<h4>🪙 Portfolio Details</h4>", unsafe_allow_html=True)
    col3, col4 = st.columns(2)
    with col3:
        mutual_funds = st.text_area("Mutual Funds (Name + Type + Amount)", placeholder="Axis Bluechip - Equity - ₹2L", height=70, help="E.g., Axis Bluechip - Equity - ₹2L")
        stocks = st.text_area("Stocks (Name + Qty + Buy Price)", placeholder="Infosys - 10 shares - ₹1500", height=70, help="E.g., Infosys - 10 shares - ₹1500")
    with col4:
        real_estate = st.text_area("Real Estate (Type + Location + Value)", placeholder="Residential Apartment - Mumbai - ₹10L", height=70, help="E.g., Residential Apartment - Mumbai - ₹10L")
        fixed_deposit = st.text_input("Fixed Deposit (Total ₹)", placeholder="500000", help="Total value of all fixed deposits.")
    st.markdown('</div>', unsafe_allow_html=True)

    submit = st.form_submit_button("✨ Generate Report")


portfolio_analyst = AssistantAgent(
    name="PortfolioAnalyst",
    llm_config={"config_list": config_list_gemini},
    system_message="""
    Analyze the user's portfolio and determine investment strategy. 
    Output ONLY in JSON format: {"strategy": "Growth" or "Value", "reason": "brief explanation"}
    """
)

growth_strategist = AssistantAgent(
    name="GrowthStrategist",
    llm_config={"config_list": config_list_gemini},
    system_message="""
    Suggest high-growth investments: mid-cap mutual funds, global ETFs, tech stocks, or crypto.
    Output: {"recommendations": ["item1", "item2", ...], "rationale": "brief explanation"}
    """
)

value_strategist = AssistantAgent(
    name="ValueStrategist",
    llm_config={"config_list": config_list_gemini},
    system_message="""
    Suggest stable investments: bonds, blue-chip stocks, or government schemes.
    Output: {"recommendations": ["item1", "item2", ...], "rationale": "brief explanation"}
    """
)

financial_advisor = AssistantAgent(
    name="FinancialAdvisor",
    llm_config={"config_list": config_list_gemini},
    system_message="""
    Compile a comprehensive financial report with:
    1. Portfolio Analysis Summary
    2. Recommended Strategy
    3. Specific Investment Recommendations
    4. Implementation Plan
    5. Risk Assessment
    Format the report in Markdown. Add "TERMINATE" at the end when done.
    """
)

user_proxy = UserProxyAgent(
    name="UserProxy",
    human_input_mode="NEVER",
    max_consecutive_auto_reply=5,
    is_termination_msg=lambda x: "TERMINATE" in x.get("content", ""),
    code_execution_config=False
)

def extract_strategy(content):
    try:
        data = json.loads(content.strip())
        return data.get("strategy", "Growth")
    except:
        return "Growth"


def manage_investment_portfolio():
    message = f"""
User Profile:
- Age: {age}
- Annual Salary: ₹{salary}
- Annual Expenses: ₹{expenses}
- Risk Tolerance: {risk}
- Financial Goals: {goals}

Current Portfolio:
- Mutual Funds: {mutual_funds or 'None'}
- Stocks: {stocks or 'None'}
- Real Estate: {real_estate or 'None'}
- Fixed Deposit: ₹{fixed_deposit or '0'}
"""

    # Step 1: Portfolio Analysis
    analysis_result = user_proxy.initiate_chat(
        portfolio_analyst,
        message=message,
        summary_method="last_msg",
        silent=True
    )
    analysis_summary = analysis_result.chat_history[-1]["content"]
    strategy = extract_strategy(analysis_summary)

    # Step 2: Get Recommendations
    agent = growth_strategist if strategy == "Growth" else value_strategist
    recommendations_result = user_proxy.initiate_chat(
        agent,
        message=f"{message}\nStrategy: {strategy}",
        summary_method="last_msg",
        silent=True
    )
    recommendations_summary = recommendations_result.chat_history[-1]["content"]

    # Step 3: Generate Final Report
    report_result = user_proxy.initiate_chat(
        financial_advisor,
        message=f"""
Generate a comprehensive financial report based on:

User Profile:
{message}

Portfolio Analysis:
{analysis_summary}

Investment Recommendations:
{recommendations_summary}

Include these sections:
1. Portfolio Analysis Summary
2. Recommended Strategy
3. Specific Investment Recommendations
4. Implementation Plan
5. Risk Assessment
""",
        summary_method="last_msg",
        silent=True
    )

    # Extract the actual report content
    report_content = report_result.chat_history[-1]["content"]
    if "TERMINATE" in report_content:
        return report_content.split("TERMINATE")[0].strip()
    return report_content

# ⏳ Generate and Display
if submit:
    with st.spinner("🧠 Analyzing your portfolio... This may take 1-2 minutes"):
        try:
            result = manage_investment_portfolio()
            st.markdown('<div class="report-card">', unsafe_allow_html=True)
            st.subheader("📊 Your Personalized Financial Report")
            st.markdown(result)
            st.markdown('</div>', unsafe_allow_html=True)
        except Exception as e:
            st.error(f"Error generating report: {str(e)}")
            st.info("Please check your inputs and try again. If the problem persists, try reducing the amount of text in your inputs.")