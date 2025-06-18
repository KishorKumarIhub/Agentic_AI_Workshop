import streamlit as st
from langgraph_flow.marketability_graph import build_graph

# Build the LangGraph agent flow
graph = build_graph()

def run():
    st.set_page_config(page_title="Startup Marketability Evaluator")
    st.title("🚀 Startup Marketability Evaluator")

    # User input for startup idea
    user_input = st.text_area("Enter your startup idea:", height=150)

    if st.button("Evaluate Marketability"):
        if user_input.strip():
            # ✅ FIXED: Pass dictionary directly without `input=`
            results = graph.invoke({"startup_idea": user_input.strip()})

            # Display results
            st.subheader("📊 Marketability Report")
            st.json(results)
        else:
            st.warning("Please enter a valid startup idea to proceed.")
