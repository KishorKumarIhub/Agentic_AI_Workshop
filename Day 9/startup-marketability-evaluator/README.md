# 🚀 Startup Marketability Evaluator

An AI-powered system that evaluates the market potential of startup ideas using multiple autonomous agents and RAG (Retrieval-Augmented Generation).

## 🌟 Features

- **Multi-Agent Architecture**: Four specialized AI agents working together:
  - 🔍 Idea Parsing Agent
  - 📊 Market Signal Retriever Agent
  - 🔄 Comparative Benchmarking Agent
  - 💯 Marketability Scoring Agent

- **RAG-Enhanced Analysis**: Uses a local vector store with startup data for:
  - Market trend analysis
  - Competitive benchmarking
  - Industry insights

- **Modern UI**: Beautiful Streamlit interface with:
  - Interactive idea input
  - Detailed analysis views
  - Visual score representation
  - Agent insights explorer

## 🛠️ Technology Stack

- LangChain for AI agent orchestration
- ChromaDB for vector storage
- Google's Gemini AI API for LLMs
- Streamlit for user interface
- Python for backend logic
- Google Trends/SerpAPI for real-time data (optional)

## 📋 Prerequisites

- Python 3.8+
- Google API Key (Gemini AI)
- Startup dataset in CSV format

## 🚀 Getting Started

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd startup-marketability-evaluator
   ```

2. **Set Up Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

4. **Prepare Data**
   - Place your startup dataset in `data/reference_datasets/startups.csv`
   - The CSV should have columns: name, industry, description, business_model, target_market, funding, stage, founded_year

5. **Run the Application**
   ```bash
   cd ui
   streamlit run app.py
   ```

## 📊 Data Structure

### Startup Dataset Format
The `startups.csv` file should contain the following columns:
- `name`: Company name
- `industry`: Industry category
- `description`: Business description
- `business_model`: Revenue/business model
- `target_market`: Target customer segment
- `funding`: Funding amount (numeric)
- `stage`: Company stage (e.g., Seed, Series A)
- `founded_year`: Year founded

## 🔍 How It Works

1. **Idea Analysis**
   - User inputs startup idea
   - Idea Parsing Agent extracts key components
   - Structures the idea for further analysis

2. **Market Analysis**
   - Market Signal Retriever Agent gathers trends
   - Uses Google Trends and local data
   - Analyzes market growth and timing

3. **Competition Analysis**
   - Comparative Benchmarking Agent finds similar startups
   - Analyzes competitive landscape
   - Identifies market whitespace

4. **Scoring**
   - Marketability Scoring Agent evaluates overall potential
   - Generates score (0-100)
   - Provides strategic recommendations

## 🤖 Agent Details

### Idea Parsing Agent
- Extracts core theme and domain
- Identifies value proposition
- Determines target audience
- Evaluates innovation factor

### Market Signal Retriever Agent
- Analyzes market trends
- Evaluates market timing
- Assesses growth potential
- Uses RAG for historical data

### Comparative Benchmarking Agent
- Finds similar companies
- Analyzes competition density
- Identifies market gaps
- Evaluates barriers to entry

### Marketability Scoring Agent
- Computes final score
- Assesses opportunity scope
- Evaluates market timing
- Identifies risk zones
- Provides recommendations

## 📈 Output Format

The system provides a comprehensive analysis including:
- Structured idea analysis
- Market signals and trends
- Competitive landscape
- Marketability score (0-100)
- Strategic recommendations
- Risk assessment
- Agent insights

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details. 