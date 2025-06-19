# 🚀 Startup Idea Validator

An AI-powered Streamlit app to validate and analyze startup ideas using real-world data from Y Combinator, startup funding records, and industry datasets. The app leverages advanced LLMs (Google Gemini) and vector search to provide actionable insights, market signals, and a marketability score for your startup concept.

---

## Features
- **Idea Parsing:** Extracts the core components (domain, theme, value proposition, problem) from your startup idea.
- **Market Signals:** Analyzes funding trends and market momentum for your idea's domain and theme.
- **Competitive Benchmarking:** Finds comparable startups from YC and other datasets, highlighting differentiation and whitespace.
- **Marketability Scoring:** Calculates a comprehensive score and provides opportunity, timing, and risk analysis.
- **Interactive UI:** Simple Streamlit interface for input and results, with expandable sections for each analysis step.

---

## How It Works
1. **Input:** Enter your startup idea in plain English.
2. **Analysis:** The app runs a multi-step agent workflow:
    - Parses your idea
    - Retrieves market signals
    - Benchmarks against similar startups
    - Scores the marketability
3. **Output:** Get a detailed breakdown and a marketability score (0-100), plus recommendations and insights.

---

## Example Usage

1. **Run the app:**
   ```bash
   streamlit run app.py
   ```
2. **Enter an idea:**
   > "AI-powered legal document review for small businesses"
3. **View results:**
   - Idea components (domain, theme, value prop, problem)
   - Market signals (momentum, trends, key players)
   - Competitive landscape (similar companies, whitespace)
   - Marketability score and recommendations

---

## Project Structure

```
DAY 9/
├── app.py                  # Main Streamlit app and agent workflow
├── requirements.txt        # Python dependencies
├── README.md               # This file
├── .streamlit/
│   └── secrets.toml        # API keys (Google Gemini)
├── data/
│   ├── reference_datasets/ # CSVs: yc_companies, startup_fundings, unique_startup_companies
│   └── vectorstores/       # Chroma vector DBs for fast retrieval
└── venv/                   # Python virtual environment
```

---

## Setup Instructions

1. **Clone the repo and navigate to the project folder.**
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Set up your Google API key:**
   - Add your key to `.streamlit/secrets.toml`:
     ```toml
     GOOGLE_API_KEY = "your-google-api-key"
     ```
   - Or set the `GOOGLE_API_KEY` environment variable.
4. **Run the app:**
   ```bash
   streamlit run app.py
   ```

---

## Data Sources
- **Y Combinator Companies:** `data/reference_datasets/yc_companies.csv`
- **Startup Fundings:** `data/reference_datasets/startup_fundings.csv`
- **Unique Startup Companies:** `data/reference_datasets/unique_startup_companies.csv`

Vector stores are auto-initialized on first run and stored in `data/vectorstores/`.

---

## Main Files Explained
- **app.py:** Contains the Streamlit UI, agent workflow, and all logic for parsing, retrieval, and scoring.
- **requirements.txt:** Lists all required Python packages.
- **.streamlit/secrets.toml:** Store your Google API key here for secure access.
- **data/reference_datasets/:** Raw CSV datasets used for analysis.
- **data/vectorstores/:** Persistent vector databases for fast semantic search.

---

## Credits
- Built with [Streamlit](https://streamlit.io/), [LangChain](https://www.langchain.com/), [Google Gemini](https://ai.google.dev/), and [ChromaDB](https://www.trychroma.com/).

---

## License
MIT License 