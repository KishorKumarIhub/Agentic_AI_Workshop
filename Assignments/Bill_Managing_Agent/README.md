# 🧾 Bill Management Agent

A modern, AI-powered Streamlit app for extracting, categorizing, and analyzing expenses from bill images using Google Gemini and AutoGen agents.

## Features
- **Bill Image Upload:** Upload your bill as a photo (JPG, PNG).
- **AI Extraction:** Uses Gemini Vision to extract and categorize expenses.
- **Expense Categorization:** Groups expenses into Groceries, Dining, Utilities, Shopping, Entertainment, Others.
- **Spending Insights:** Summarizes total and per-category spending, highlights trends and alerts.
- **Agent Collaboration:** Uses AutoGen agents for bill processing and summarization.
- **Modern UI:** Beautiful, dark-mode compatible interface.

## Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Bill_Managing_Agent
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the project root.
   - Add your Google Gemini API key:
     ```env
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

4. **Run the app:**
   ```bash
   streamlit run app.py
   ```

## Usage
- Open the app in your browser (Streamlit will provide a local URL).
- Upload a bill image.
- View categorized expenses, summaries, and AI agent chat logs.

## Requirements
- Python 3.8+
- See `requirements.txt` for full dependencies.

## File Structure
- `app.py` — Main Streamlit app
- `requirements.txt` — Python dependencies
- `.env` — Environment variables (not committed)
- `.gitignore` — Git ignore rules

## License
MIT License

---
