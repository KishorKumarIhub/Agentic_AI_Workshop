# Clothing Store Competitor Intelligence 👗

AI-powered market analysis for clothing stores using real location data and Google Places API.

## Features
- Fetches real clothing store competitors near a specified location using Google Places API
- Analyzes competitors with Gemini LLM (Google Generative AI)
- Provides detailed market, location, and pricing analysis
- Downloadable markdown report
- Streamlit-based interactive UI

## Setup

1. **Clone the repository**

```bash
git clone <repo-url>
cd Conversational_AI_Agent
```

2. **Install dependencies**

```bash
pip install -r requirements.txt
```

3. **Set up environment variables**

Create a `.env` file in the project root with the following:

```
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

4. **Run the app**

```bash
streamlit run app.py
```

## Usage
- Enter a location and search radius
- Fetch nearby clothing store competitors
- Generate a detailed AI-powered analysis
- Download the report as markdown

## Requirements
- Python 3.8+
- Streamlit
- langchain-google-genai
- requests
- python-dotenv

## License
MIT 
