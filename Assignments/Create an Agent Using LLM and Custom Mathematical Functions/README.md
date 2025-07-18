# LangGraph Math & General Question Agent

## Problem Statement

Create an agent using LangGraph that answers general questions using an LLM, and when asked to perform mathematical operations (addition, subtraction, multiplication, and division), it calls four predefined functions (`plus`, `subtract`, `multiply`, `divide`) for answering. The agent should handle both general and math-related queries seamlessly.

## Features
- Uses an LLM API (Groq, Gemini, or local LLM via Ollama) for general reasoning.
- Four custom mathematical functions for addition, subtraction, multiplication, and division (with error handling for division by zero).
- Automatically detects if a query is mathematical and routes to the correct function.
- Handles both general and math-related queries in a unified way.

## Requirements
- Python 3.8+
- [LangGraph](https://github.com/langchain-ai/langgraph)
- An LLM API (e.g., OpenAI, Groq, Gemini) or local LLM (Ollama)
- API key for your chosen LLM provider

Install dependencies:
```bash
pip install -r requirements.txt
```

## Setup
1. **Clone the repository**
2. **Install dependencies**
3. **Set your LLM API key**
   - Create a `.env` file in the project root and add your API key, e.g.:
     ```
     OPENAI_API_KEY=your_openai_key_here
     # or
     GROQ_API_KEY=your_groq_key_here
     # or
     GEMINI_API_KEY=your_gemini_key_here
     ```
4. **Run the agent**
   - Example:
     ```bash
     python math_agent.py
     ```

## Usage
- Ask general questions (e.g., "Who is the president of France?")
- Ask math questions (e.g., "What is 5 plus 3?", "How much is 8 divided by 2?")
- The agent will automatically choose the correct response path.

## Custom Math Functions
- `plus(a, b)`: Add two numbers
- `subtract(a, b)`: Subtract two numbers
- `multiply(a, b)`: Multiply two numbers
- `divide(a, b)`: Divide two numbers (with division by zero handling)

## Project Structure
- `math_agent.py` — Main agent code
- `requirements.txt` — Python dependencies
- `.gitignore` — Files and folders to ignore in git
- `README.md` — This file

## License
MIT 