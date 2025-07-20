import os
import json
from typing import List, Dict, Any
from dotenv import load_dotenv
from pydantic import BaseModel, Field
import google.generativeai as genai
import requests
import re
import streamlit as st

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SERPER_API_KEY = os.getenv("SERPER_API_KEY")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# Helper Functions
def search_learning_materials(topic: str) -> Dict[str, Any]:
    """Search for learning materials on a given topic."""
    try:
        url = "https://google.serper.dev/search"
        headers = {"X-API-KEY": SERPER_API_KEY}
        
        # Search for videos
        video_query = f"{topic} tutorial video"
        video_results = requests.post(url, json={"q": video_query}, headers=headers).json()
        
        # Search for articles
        article_query = f"{topic} guide article"
        article_results = requests.post(url, json={"q": article_query}, headers=headers).json()
        
        # Search for exercises
        exercise_query = f"{topic} practice exercises"
        exercise_results = requests.post(url, json={"q": exercise_query}, headers=headers).json()
        
        videos = []
        articles = []
        exercises = []
        
        # Extract videos
        for v in video_results.get("organic", [])[:3]:
            videos.append(f"{v['title']}: {v['link']}")
        
        # Extract articles
        for a in article_results.get("organic", [])[:3]:
            articles.append(f"{a['title']}: {a['link']}")
            
        # Extract exercises
        for e in exercise_results.get("organic", [])[:3]:
            exercises.append(f"{e['title']}: {e['link']}")
        
        return {
            "topic": topic,
            "videos": videos,
            "articles": articles,
            "exercises": exercises
        }
    except Exception as e:
        return {
            "topic": topic,
            "videos": [f"Error searching videos: {str(e)}"],
            "articles": [f"Error searching articles: {str(e)}"],
            "exercises": [f"Error searching exercises: {str(e)}"]
        }

def generate_quiz_questions(topic: str) -> List[Dict[str, Any]]:
    """Generate quiz questions on a given topic."""
    try:
        prompt = f"""Create 3 multiple-choice questions about {topic}. Format each question as follows:

Question: [Your question here]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Answer: [Correct option letter]

Make sure the questions are clear and educational."""
        
        response = model.generate_content(prompt).text
        questions = []
        
        # Parse the response
        question_blocks = response.split("Question:")
        for block in question_blocks[1:]:  # Skip first empty element
            lines = [line.strip() for line in block.strip().split("\n") if line.strip()]
            if len(lines) >= 6:
                question = lines[0]
                options = []
                answer_line = ""
                
                for line in lines[1:]:
                    if line.startswith(('A)', 'B)', 'C)', 'D)')):
                        options.append(line[3:].strip())
                    elif line.startswith("Answer:"):
                        answer_line = line.split(":")[-1].strip()
                
                if len(options) == 4 and answer_line:
                    # Convert answer letter to actual answer text
                    answer_index = ord(answer_line.upper()) - ord('A')
                    if 0 <= answer_index < 4:
                        questions.append({
                            "question": question,
                            "options": options,
                            "answer": options[answer_index]
                        })
        
        return questions[:3]
    except Exception as e:
        return [{"question": f"Error generating quiz: {str(e)}", "options": ["Error", "Error", "Error", "Error"], "answer": "Error"}]

def suggest_projects(topic: str, level: str) -> List[Dict[str, Any]]:
    """Generate project ideas based on topic and expertise level."""
    try:
        prompt = f"""Suggest 3 practical project ideas for someone at a {level} level learning about {topic}.
For each project, provide:
- A clear title
- A detailed description explaining what the project involves
- Why it's suitable for {level} level

Format each project as:
Project: [Title]
Description: [Detailed description]
"""
        
        response = model.generate_content(prompt).text
        projects = []
        
        # Parse the response
        project_blocks = response.split("Project:")
        for block in project_blocks[1:]:  # Skip first empty element
            lines = [line.strip() for line in block.strip().split("\n") if line.strip()]
            
            title = lines[0] if lines else "Untitled Project"
            description = ""
            
            for line in lines[1:]:
                if line.startswith("Description:"):
                    description = line.split(":", 1)[1].strip()
                    break
            
            if description:
                projects.append({
                    "title": title,
                    "description": description,
                    "level": level
                })
        
        return projects[:3]
    except Exception as e:
        return [{"title": f"Error generating projects: {str(e)}", "description": "Unable to generate project suggestions", "level": level}]

# Execution function
def generate_learning_path(topic: str, level: str):
    """Generate a complete learning path for the given topic and level."""
    
    try:
        # Directly call helper functions
        learning_materials = search_learning_materials(topic)
        quiz_questions = generate_quiz_questions(topic)
        project_ideas = suggest_projects(topic, level)

        return {
            "learning_materials": learning_materials,
            "quiz_questions": quiz_questions,
            "project_ideas": project_ideas
        }
    except Exception as e:
        st.error(f"❌ Error generating content: {str(e)}")
        return {
            "learning_materials": {},
            "quiz_questions": [],
            "project_ideas": []
        }

# Streamlit UI
def main():
    # Add custom CSS for gradients and beautiful UI
    st.markdown(
        """
        <style>
        body {
            background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%) !important;
        }
        .stApp {
            background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%) !important;
        }
        .gradient-header {
            background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
            color: white;
            padding: 2rem 1rem 1rem 1rem;
            border-radius: 1.5rem;
            box-shadow: 0 4px 24px 0 rgba(99,102,241,0.15);
            margin-bottom: 2rem;
            text-align: center;
        }
        .gradient-section {
            background: linear-gradient(90deg, #f1f5f9 0%, #e0e7ff 100%);
            border-radius: 1rem;
            padding: 1.5rem 1rem;
            margin-bottom: 2rem;
            box-shadow: 0 2px 12px 0 rgba(99,102,241,0.07);
        }
        .tab-content {
            background: linear-gradient(90deg, #f1f5f9 0%, #e0e7ff 100%);
            border-radius: 1rem;
            padding: 1.5rem 1rem;
            margin-bottom: 1.5rem;
        }
        .stButton>button {
            background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 0.5rem !important;
            font-weight: 600 !important;
            box-shadow: 0 2px 8px 0 rgba(99,102,241,0.10);
        }
        .stTextInput>div>div>input {
            background: #f1f5f9 !important;
            border-radius: 0.5rem !important;
        }
        .stSelectbox>div>div>div>div {
            background: #f1f5f9 !important;
            border-radius: 0.5rem !important;
        }
        </style>
        """,
        unsafe_allow_html=True
    )

    st.markdown(
        """
        <div class="gradient-header">
            <h1 style="margin-bottom: 0.5rem; font-size: 2.8rem;">🎓 Personalized Learning Assistant</h1>
            <p style="font-size: 1.2rem; margin-bottom: 0;">Generate comprehensive learning materials, quizzes, and project ideas for any topic!</p>
        </div>
        """,
        unsafe_allow_html=True
    )
    st.markdown("---")

    # Check for API keys
    if not GEMINI_API_KEY:
        st.error("⚠️ Please set your GEMINI_API_KEY in the environment variables.")
        st.stop()

    if not SERPER_API_KEY:
        st.error("⚠️ Please set your SERPER_API_KEY in the environment variables.")
        st.stop()

    col1, col2 = st.columns(2)

    with col1:
        st.markdown('<div class="gradient-section">', unsafe_allow_html=True)
        topic = st.text_input("📚 Enter your learning topic:", placeholder="e.g., Machine Learning, Python, Data Science")
        st.markdown('</div>', unsafe_allow_html=True)

    with col2:
        st.markdown('<div class="gradient-section">', unsafe_allow_html=True)
        level = st.selectbox("📊 Select your skill level:", ["Beginner", "Intermediate", "Advanced"])
        st.markdown('</div>', unsafe_allow_html=True)

    st.markdown("<div style='height: 0.5rem'></div>", unsafe_allow_html=True)

    if st.button("🚀 Generate Learning Path", type="primary"):
        if not topic.strip():
            st.error("Please enter a topic to learn about.")
            return

        with st.spinner("🔍 Creating your personalized learning path..."):
            result = generate_learning_path(topic, level)

            if result:
                st.success("✅ Learning path generated successfully!")
                st.markdown("---")

                # Display results in tabs
                tab1, tab2, tab3 = st.tabs(["📚 Learning Materials", "📝 Quiz", "🚀 Project Ideas"])

                with tab1:
                    st.markdown('<div class="tab-content">', unsafe_allow_html=True)
                    st.subheader("📚 Learning Materials")

                    learning_materials = result.get("learning_materials", {})

                    if learning_materials.get("videos"):
                        st.markdown("### 🎥 Videos")
                        for video in learning_materials["videos"]:
                            st.write(f"• {video}")

                    if learning_materials.get("articles"):
                        st.markdown("### 📄 Articles")
                        for article in learning_materials["articles"]:
                            st.write(f"• {article}")

                    if learning_materials.get("exercises"):
                        st.markdown("### 💪 Exercises")
                        for exercise in learning_materials["exercises"]:
                            st.write(f"• {exercise}")
                    st.markdown('</div>', unsafe_allow_html=True)

                with tab2:
                    st.markdown('<div class="tab-content">', unsafe_allow_html=True)
                    st.subheader("📝 Quiz Questions")

                    quiz_questions = result.get("quiz_questions", [])

                    if quiz_questions:
                        for i, q in enumerate(quiz_questions, 1):
                            st.markdown(f"**Question {i}: {q['question']}**")
                            for j, option in enumerate(q['options'], 1):
                                st.write(f"   {chr(64+j)}) {option}")
                            st.write(f"**✅ Correct Answer:** {q['answer']}")
                            st.markdown("---")
                    else:
                        st.write("No quiz questions generated.")
                    st.markdown('</div>', unsafe_allow_html=True)

                with tab3:
                    st.markdown('<div class="tab-content">', unsafe_allow_html=True)
                    st.subheader("🚀 Project Ideas")

                    project_ideas = result.get("project_ideas", [])

                    if project_ideas:
                        for i, project in enumerate(project_ideas, 1):
                            st.markdown(f"### Project {i}: {project['title']}")
                            st.write(f"**Description:** {project['description']}")
                            st.write(f"**Level:** {project['level']}")
                            st.markdown("---")
                    else:
                        st.write("No project ideas generated.")
                    st.markdown('</div>', unsafe_allow_html=True)

                # Optional: Show raw crew result
                if result.get("raw_result"):
                    with st.expander("🔍 View Raw AI Output"):
                        st.text(str(result["raw_result"]))

    st.markdown("---")
    st.markdown(
        """
        <div style='text-align: center; color: #666; margin-top: 2rem;'>
            <p>🤖 Powered by Google Gemini AI | 🔍 Web Search via Serper API</p>
            <p>💡 This tool generates learning materials, quizzes, and project ideas for any topic</p>
        </div>
        """,
        unsafe_allow_html=True
    )

if __name__ == "__main__":
    main()