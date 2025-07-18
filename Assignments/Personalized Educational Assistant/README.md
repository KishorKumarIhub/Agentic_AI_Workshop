# Personalized Educational Assistant

A sequential CrewAI-powered system that provides personalized educational recommendations for users. This system generates learning materials tailored to user topics of interest, creates quizzes, and suggests project ideas based on expertise level.

## Key Features
- **Sequential Processing:** Tasks are executed in a sequential manner.
- **Content Selection:** Curates learning materials based on user-provided topics.
- **Quiz Generation:** Creates quizzes to test understanding of the learning materials.
- **Project Suggestions:** Recommends practical project ideas based on the user’s expertise level.
- **Custom Tool:** Project Suggestion Tool generates project ideas tailored to the user’s expertise level and topics of interest.
- **Structured Outputs:** Uses Pydantic models for structured outputs (learning materials, quizzes, project ideas).

## Agents and Tasks
- **Learning Material Agent:** Curates learning materials based on the user’s topics of interest.
- **Quiz Creator Agent:** Generates personalized quizzes for the provided topics.
- **Project Idea Agent:** Recommends practical project ideas based on the user’s expertise level.

### Tasks
1. Generate learning materials.
2. Create quizzes.
3. Suggest project ideas.

## Expected Outputs
- **Learning Materials:** Curated lists of videos, articles, and exercises tailored to the user’s topics of interest.
- **Quizzes:** Personalized quizzes to assess understanding.
- **Project Suggestions:** Practical ideas aligned with the user’s expertise level and topics.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd Personalized-Educational-Assistant
   ```
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the project root with the following content:
     ```env
     SERPER_API_KEY=your_serper_api_key_here
     OPENAI_API_KEY=your_openai_api_key_here
     ```
   - Replace `your_serper_api_key_here` and `your_openai_api_key_here` with your actual API keys.

## API Keys Required

- **SERPER_API_KEY:**
  - Used to fetch search results from Google via the Serper API.
  - [Get your Serper API key here](https://serper.dev/)
- **OPENAI_API_KEY:**
  - Used to access the OpenAI API for GPT-based tasks.
  - [Get your OpenAI API key here](https://platform.openai.com/account/api-keys)

## Usage

Run the Streamlit app:
```bash
streamlit run app.py
```

Follow the prompts to enter your topics of interest and expertise level. The system will generate learning materials, quizzes, and project ideas tailored to you.

## License

MIT License 