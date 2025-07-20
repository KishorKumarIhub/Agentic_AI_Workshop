import streamlit as st
from crewai import Agent, Task, Crew, Process, LLM
from langchain_google_genai import ChatGoogleGenerativeAI
import os
import ast
from dotenv import load_dotenv

# ===== 100% ONNX-FREE SOLUTION =====
# No chromadb, no CodeInterpreterTool, no ONNX runtime

# Load environment variables
load_dotenv()

# Custom Python Analyzer (No ONNX)
def analyze_python_code(code: str) -> str:
    """Static analysis without executing code."""
    try:
        # 1. Check syntax via AST
        tree = ast.parse(code)
        
        # 2. Basic checks
        issues = []
        
        # Check for print statements (not recommended in production)
        if any(isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == 'print' 
               for node in ast.walk(tree)):
            issues.append("⚠️ Found `print()` - Use logging in production.")

        # Check for broad exceptions
        for node in ast.walk(tree):
            if isinstance(node, ast.ExceptHandler) and node.type is None:
                issues.append("⚠️ Found bare `except:` - Specify exception types.")

        # 3. Return results
        if issues:
            return "Found issues:\n" + "\n".join(issues)
        return "✅ No syntax errors found. Code looks good!"
    
    except SyntaxError as e:
        return f"❌ Syntax Error: {e.msg} (Line {e.lineno})"

# Initialize LLM (Groq or Gemini)
# llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=os.getenv("GOOGLE_API_KEY") , temperature=0.1)  # or ChatGoogleGenerativeAI(model="gemini-pro")
llm = LLM(
    api_key=os.getenv("GOOGLE_API_KEY"),
    model="gemini/gemini-2.5-flash"  # Must include provider prefix
)
# ===== Agents =====
code_analyzer = Agent(
    role="Python Static Analyzer",
    goal="Find issues in Python code WITHOUT executing it",
    backstory="Expert in static code analysis using AST parsing.",
    llm=llm,
    verbose=True
)

code_corrector = Agent(
    role="Python Code Fixer",
    goal="Fix issues while keeping original functionality",
    backstory="Specializes in clean, PEP 8 compliant fixes.",
    llm=llm,
    verbose=True
)

manager = Agent(
    role="Code Review Manager",
    goal="Ensure smooth analysis & correction",
    backstory="Coordinates the review process.",
    llm=llm,
    verbose=True
)

# ===== Streamlit UI =====
# Sidebar with app info
st.sidebar.title("🤖 Python Code Debugging Assistant")
st.sidebar.markdown("""
Welcome to the **Python Code Reviewer**! Paste your Python code, analyze for issues, and get instant fixes—all without code execution.

- **Static Analysis** (AST-based)
- **AI-powered Fixes**
- No ONNX, No Code Execution

---
**Instructions:**
1. Paste your Python code in the main area.
2. Click **Analyze & Fix**.
3. Review the results below.
""")

# Main UI
st.markdown("""
<style>
.big-title { font-size:2.5rem; font-weight:700; color:#4F8BF9; }
.section-title { font-size:1.3rem; font-weight:600; margin-top:2rem; }
.code-area { border-radius: 8px; border: 1px solid #e0e0e0; background: #f9f9f9; }
.result-box { background: #f6f8fa; border-radius: 8px; padding: 1.2em; border: 1px solid #e0e0e0; }
.footer { color: #888; font-size: 0.95em; margin-top: 2em; text-align: center; }
</style>
""", unsafe_allow_html=True)

st.markdown('<div class="big-title">🔍 Python Code Reviewer <span style="font-size:1.2rem; color:#888;">(No ONNX)</span></div>', unsafe_allow_html=True)
st.markdown("<hr>", unsafe_allow_html=True)

col1, col2 = st.columns([2, 1])
with col1:
    st.markdown('<div class="section-title">Paste your Python code below:</div>', unsafe_allow_html=True)
    code_input = st.text_area("", height=300, key="code_input", placeholder="Paste your Python code here...", help="Paste the code you want to analyze and fix.")
with col2:
    st.markdown('<div class="section-title">How it works:</div>', unsafe_allow_html=True)
    st.markdown("""
    1. **Static Analysis**: Checks for syntax and common issues.
    2. **AI Fixes**: Suggests and applies code corrections.
    3. **No Execution**: Your code is never run.
    """)
    st.markdown("---")
    st.markdown("<span style='color:#4F8BF9'>Powered by Gemini & CrewAI</span>", unsafe_allow_html=True)

st.markdown("<hr>", unsafe_allow_html=True)

analyze_btn = st.button("✨ Analyze & Fix", use_container_width=True)

if analyze_btn:
    if not code_input.strip():
        st.warning("⚠️ Please enter Python code.")
    else:
        with st.spinner("Analyzing your code, please wait..."):
            # Task 1: Static Analysis
            analysis_task = Task(
                description=f"Analyze this code:\n```python\n{code_input}\n```",
                agent=code_analyzer,
                expected_output="List of static analysis issues."
            )

            # Task 2: Fix Code
            correction_task = Task(
                description="Fix all issues found.",
                agent=code_corrector,
                expected_output="Corrected Python code with explanations.",
                context=[analysis_task]
            )

            # Run CrewAI
            crew = Crew(
                agents=[code_analyzer, code_corrector, manager],
                tasks=[analysis_task, correction_task],
                verbose=True,
                process=Process.sequential
            )
            result = crew.kickoff()

        st.markdown('<div class="section-title">🔧 Fixed Code</div>', unsafe_allow_html=True)
        st.code(result, language="python")
        st.success("✅ Analysis and correction complete!")

