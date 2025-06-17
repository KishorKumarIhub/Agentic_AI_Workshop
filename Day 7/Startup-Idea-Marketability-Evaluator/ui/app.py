import streamlit as st
from langgraph_app.executor import run_graph

st.title("🚀 Startup Idea Marketability Evaluator")
idea = st.text_area("Enter your startup idea")

if st.button("Evaluate"):
    with st.spinner("Evaluating marketability..."):
        result = run_graph(idea)
        st.subheader("📊 Marketability Report")
        st.write(result)