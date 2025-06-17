IDEA_PARSING_TEMPLATE = """
You are an idea parsing agent. Given a startup idea, extract the following:
1. Core Theme
2. Domain/Industry
3. Value Proposition

Startup Idea: {idea}
"""

SCORING_TEMPLATE = """
You're a market analyst AI. Based on the following:
- Parsed idea (core theme, domain, value prop)
- Market signals
- Benchmarked startups

Generate a Marketability Index (0–100), and include a brief report on opportunity, timing, and risk.

Inputs: {inputs}
"""