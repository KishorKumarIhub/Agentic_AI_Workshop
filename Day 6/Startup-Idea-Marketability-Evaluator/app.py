import streamlit as st
from chains.evaluate_chain import evaluate_marketability
from utils.chart_generator import generate_chart
from utils.pdf_generator import export_to_pdf
from PIL import Image
import base64
from io import BytesIO

st.set_page_config(page_title="Startup Marketability Evaluator", layout="wide")

# --- Load and center logo with HTML ---
def center_logo(path, width):
    img = Image.open(path)
    img = img.resize(width)
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode()
    html = f"""
    <div style="text-align: center;">
        <img src="data:image/png;base64,{encoded}" style="width:{width[0]}px; height:{width[1]}px;" />
    </div>
    """
    st.markdown(html, unsafe_allow_html=True)

center_logo("assets/logo-black.png", (150, 50))

# --- App Title ---
st.title("🚀 Startup Idea Marketability Evaluator")

# --- User Input ---
idea = st.text_area("Enter your startup idea:", height=200)

# --- Evaluation Process ---
if st.button("Evaluate Idea") and idea:
    index, summary = evaluate_marketability(idea)

    st.subheader("Marketability Index")
    st.metric(label="📈 Score", value=f"{index:.2f}")

    # --- Display Marketability Chart ---
    chart_path = generate_chart(index)
    st.image(chart_path, caption="Marketability Index Chart")

    # --- Show Summary Report ---
    st.subheader("📋 Summary Report")
    st.write(summary)
