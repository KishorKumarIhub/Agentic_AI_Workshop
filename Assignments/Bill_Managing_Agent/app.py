import os
import streamlit as st
from dotenv import load_dotenv
from PIL import Image
import tempfile
import json
import google.generativeai as genai
from autogen.agentchat import UserProxyAgent, AssistantAgent, GroupChat, GroupChatManager

# Load API Key
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("models/gemini-1.5-flash")

# --- UI CONFIG ---
st.set_page_config(page_title="🧾 Bill Management Agent", layout="wide")
st.markdown("""
    <style>
    .main-title { font-size: 2.5rem !important; font-weight: 800; color: #4F46E5; margin-bottom: 0.5rem; }
    .subtitle { font-size: 1.2rem !important; color: #64748B; margin-bottom: 2rem; }
    .section-card { border-radius: 18px; background: #fff; box-shadow: 0 4px 24px rgba(80,80,120,0.08); padding: 2rem 2.5rem; margin-bottom: 2rem; }
    .category-badge { display: inline-block; padding: 0.3em 0.9em; border-radius: 12px; font-size: 1em; font-weight: 600; margin-right: 0.5em; margin-bottom: 0.5em; }
    .Groceries { background: #DCFCE7; color: #166534; }
    .Dining { background: #FEF9C3; color: #92400E; }
    .Utilities { background: #E0E7FF; color: #3730A3; }
    .Shopping { background: #FCE7F3; color: #9D174D; }
    .Entertainment { background: #FFE4E6; color: #BE185D; }
    .Others { background: #F3F4F6; color: #374151; }
    .summary-box { border-radius: 15px; background: linear-gradient(90deg, #6366F1 0%, #A5B4FC 100%); color: white; padding: 1.5rem; font-size: 1.1rem; font-weight: 500; margin-bottom: 2rem; box-shadow: 0 2px 12px rgba(99,102,241,0.10); }
    .chat-log-title { font-size: 1.3rem; font-weight: 700; color: #4F46E5; margin-bottom: 1rem; }
    .user { background: #E0F2FE; color: #0369A1; padding: 1rem; border-radius: 12px; margin-bottom: 0.7rem; box-shadow: 0 1px 4px rgba(14,165,233,0.08); }
    .agent { background: #F3E8FF; color: #7C3AED; padding: 1rem; border-radius: 12px; margin-bottom: 0.7rem; box-shadow: 0 1px 4px rgba(168,85,247,0.08); }
    .divider { border-top: 2px solid #E5E7EB; margin: 2rem 0; }
    </style>
""", unsafe_allow_html=True)

# --- HEADER ---
st.markdown("<div class='main-title'>💼 AI Bill Management Agent</div>", unsafe_allow_html=True)
st.markdown("<div class='subtitle'>Upload a bill and let AI categorize and analyze your expenses in style.</div>", unsafe_allow_html=True)

# --- LAYOUT ---
col1, col2 = st.columns([1, 2])

with col1:
    st.markdown("<div class='section-card'>", unsafe_allow_html=True)
    st.markdown("### 📤 Upload your bill")
    uploaded_file = st.file_uploader("", type=["jpg", "jpeg", "png"])
    st.markdown("</div>", unsafe_allow_html=True)

chat_log = []

# --- Gemini Vision to extract expense categories ---
def process_bill_with_gemini(image_file):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(image_file.read())
        tmp_path = tmp.name

    image = Image.open(tmp_path)

    response = model.generate_content([
        "Extract all expenses from this bill image. Group them into categories: Groceries, Dining, Utilities, Shopping, Entertainment, Others. Return as JSON format like {category: [{item, cost}]}",
        image
    ])

    try:
        text = response.text.strip()
        json_start = text.find("{")
        json_end = text.rfind("}") + 1
        data = json.loads(text[json_start:json_end])
        return data, response.text
    except Exception as e:
        return None, response.text

# --- Gemini Summary ---
def summarize_expenses_with_gemini(expenses):
    prompt = (
        f"Given the following categorized expenses: {expenses}, "
        "summarize the total expenditure, show each category total, and mention which category has the highest cost and why it could be unusual."
    )
    response = model.generate_content(prompt)
    return response.text.strip()

# --- AutoGen Agents (no Docker, Gemini only) ---
user_proxy = UserProxyAgent(
    name="UserProxy",
    human_input_mode="NEVER",
    code_execution_config={"use_docker": False},
    llm_config=False
)

bill_processing_agent = AssistantAgent(
    name="BillProcessingAgent",
    llm_config=False,
    system_message="You categorize expenses from a bill into standard categories."
)

summary_agent = AssistantAgent(
    name="ExpenseSummarizationAgent",
    llm_config=False,
    system_message="You analyze categorized expenses and summarize trends."
)

group_chat = GroupChat(agents=[user_proxy, bill_processing_agent, summary_agent])
manager = GroupChatManager(groupchat=group_chat)

# --- Main Execution Flow ---
with col2:
    if uploaded_file:
        st.success("✅ File uploaded. Processing...")
        with st.spinner("🔍 Extracting expenses..."):
            categorized_data, raw_response = process_bill_with_gemini(uploaded_file)

        if not categorized_data:
            st.error("❌ Failed to extract expenses.")
            st.text(raw_response)
        else:
            # 1. User → Group Manager
            user_proxy.send("Bill uploaded", manager)
            chat_log.append(("UserProxy → chat_manager", "Bill uploaded"))

            # 2. User → BillProcessingAgent
            user_proxy.send(f"Categorized expenses: {categorized_data}", bill_processing_agent)
            chat_log.append(("UserProxy → BillProcessingAgent", json.dumps(categorized_data, indent=2)))

            # 3. Simulate BillProcessingAgent response
            bp_response = "Categorization complete. Expenses sorted into available categories."
            chat_log.append(("BillProcessingAgent", bp_response))

            # 4. User → ExpenseSummarizationAgent
            user_proxy.send("Summarize this data", summary_agent)
            chat_log.append(("UserProxy → ExpenseSummarizationAgent", "Summarize this data"))

            # 5. Generate and simulate response
            with st.spinner("📊 Generating spending summary..."):
                summary = summarize_expenses_with_gemini(categorized_data)

            chat_log.append(("ExpenseSummarizationAgent", summary))

            # --- Display Categorized Expenses ---
            st.markdown("<div class='section-card'>", unsafe_allow_html=True)
            st.markdown("## 📂 Categorized Expenses")
            for category, items in categorized_data.items():
                if items:
                    st.markdown(f"<span class='category-badge {category}'>{category}</span>", unsafe_allow_html=True)
                    for i in items:
                        st.markdown(f"- <b>{i['item']}</b>: ₹{i['cost']}", unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)

            st.markdown("<div class='section-card'>", unsafe_allow_html=True)
            st.markdown("## 📋 Spending Summary")
            st.markdown(f"<div class='summary-box'>{summary}</div>", unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)

            # --- Agent Chat Logs ---
            st.markdown("<div class='divider'></div>", unsafe_allow_html=True)
            st.markdown("<div class='section-card'>", unsafe_allow_html=True)
            st.markdown("<div class='chat-log-title'>💬 Agent Chat Logs</div>", unsafe_allow_html=True)
            for sender, message in chat_log:
                style = "user" if "UserProxy" in sender else "agent"
                st.markdown(f"<div class='{style}'><strong>{sender}</strong><br>{message}</div>", unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)