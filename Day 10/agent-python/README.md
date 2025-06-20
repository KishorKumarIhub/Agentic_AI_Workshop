# Startup Marketability Evaluator

A FastAPI application that evaluates the marketability and viability of startup ideas in the Indian market using LLMs, RAG (Retrieval-Augmented Generation), and web search. It analyzes trends, competitors, market saturation, novelty, and provides a comprehensive viability report.

## Features
- **Market Trend Analysis**: Evaluates demand and trends for a startup idea in India.
- **Competitor Analysis**: Uses RAG and LLM to analyze competitors from local datasets and generate plausible competitors if needed.
- **Market Saturation**: Assesses funding trends and market maturity using web search.
- **Novelty Scoring**: Scores innovation and differentiation.
- **Comprehensive Report**: Generates a JSON report with actionable insights.

## Requirements
- Python 3.8+
- See `requirements.txt` for dependencies

## Installation & Setup
1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd startup-marketability-evaluator
   ```
2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
3. **Set up environment variables**
   - Create a `.env` file in the root directory with:
     ```env
     TAVILY_API_KEY=your_tavily_api_key
     ```
   - (Optional) Configure any other required environment variables for LLM providers.
4. **Datasets**
   - Ensure the `datasets/` directory contains:
     - `startup_funding_2025.csv`
     - `competitors_landscape_2025.csv`
     - `startup_companies_2025.csv`

## Running the Application
Start the FastAPI server (default port: 8000):
```bash
uvicorn app:app --reload
```

## API Usage
### Validate Startup Idea
- **Endpoint:** `POST /validate-idea`
- **Request Body:**
  ```json
  {
    "startup_idea": "Your startup idea description here"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "startup_idea": "...",
      "analysis_results": {
        "trends": { ... },
        "competitors": { ... },
        "saturation": { ... },
        "novelty": { ... },
        "final_report": { ... }
      }
    }
  }
  ```

## CORS
CORS is enabled for all origins, so you can access the backend from any frontend (e.g., React on port 3000).

## Environment Variables
- `TAVILY_API_KEY`: API key for Tavily web search (required for funding/saturation analysis).

## Notes
- The app uses HuggingFace embeddings and Chroma for RAG.
- LLM used: Google Gemini (via `langchain_google_genai`).
- For best results, ensure datasets are up-to-date and relevant to the Indian startup ecosystem.

## License
MIT (or specify your license)
