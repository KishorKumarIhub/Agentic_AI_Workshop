import os
import sys
import streamlit as st
from dotenv import load_dotenv

# Add parent directory to path to import from main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import StartupMarketabilityEvaluator

# Load environment variables
load_dotenv()

# Page config
st.set_page_config(
    page_title="Startup Marketability Evaluator",
    page_icon="🚀",
    layout="wide"
)

# Custom CSS
st.markdown("""
<style>
    .main {
        padding: 2rem;
    }
    .stTextArea {
        height: 200px;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 0.5rem 0;
    }
    .insight-card {
        background-color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid #e0e0e0;
        margin: 0.5rem 0;
    }
</style>
""", unsafe_allow_html=True)

def format_score_color(score):
    """Return color based on score range."""
    if score >= 90:
        return "green"
    elif score >= 75:
        return "lightgreen"
    elif score >= 60:
        return "orange"
    elif score >= 40:
        return "darkorange"
    else:
        return "red"

def main():
    # Header
    st.title("🚀 Startup Marketability Evaluator")
    st.markdown("""
    Evaluate your startup idea's market potential using our AI-powered analysis system.
    Get insights on market signals, competition, and overall marketability.
    """)
    
    # Initialize evaluator
    try:
        evaluator = StartupMarketabilityEvaluator()
    except ValueError as e:
        st.error("⚠️ Error: Google API Key not found. Please set the GOOGLE_API_KEY environment variable.")
        return
    except Exception as e:
        st.error(f"⚠️ Error initializing the evaluator: {str(e)}")
        return
    
    # Input section
    st.header("💡 Your Startup Idea")
    idea = st.text_area(
        "Describe your startup idea in detail",
        height=150,
        help="Include the problem you're solving, your solution, target market, and key features."
    )
    
    # Analysis button
    if st.button("🔍 Analyze Idea", type="primary"):
        if not idea:
            st.warning("Please enter your startup idea first!")
            return
        
        # Show progress
        with st.spinner("🔄 Analyzing your startup idea..."):
            result = evaluator.evaluate_startup_idea(idea)
            
            if not result["success"]:
                st.error(f"⚠️ Analysis failed: {result['error']}")
                st.error(f"Details: {result['details']}")
                return
            
            # Display results in columns
            col1, col2 = st.columns(2)
            
            # Column 1: Idea Analysis and Market Signals
            with col1:
                # Idea Analysis
                st.subheader("🎯 Idea Analysis")
                with st.expander("View Details", expanded=True):
                    idea_analysis = result["idea_analysis"]
                    st.markdown(f"""
                    **Theme:** {idea_analysis['theme']}  
                    **Domain:** {idea_analysis['domain']}  
                    **Value Proposition:** {idea_analysis['value_proposition']}  
                    **Target Audience:** {idea_analysis['target_audience']}  
                    **Innovation Factor:** {idea_analysis['innovation_factor']}
                    """)
                
                # Market Signals
                st.subheader("📊 Market Signals")
                with st.expander("View Details", expanded=True):
                    market_signals = result["market_signals"]
                    
                    # Display trend data
                    if "trend_data" in market_signals:
                        st.markdown("### Market Trends")
                        for keyword, data in market_signals["trend_data"].items():
                            if isinstance(data, dict) and "error" not in data:
                                st.markdown(f"""
                                **{keyword}**
                                - Current Interest: {data['current_interest']}
                                - Average Interest: {data['avg_interest']:.2f}
                                - Trend Direction: {data['trend_direction'].upper()}
                                - Volatility: {data['volatility']:.2f}
                                """)
            
            # Column 2: Competition and Score
            with col2:
                # Competitive Analysis
                st.subheader("🔄 Competitive Analysis")
                with st.expander("View Details", expanded=True):
                    comp_analysis = result["competitive_analysis"]
                    
                    if "competitive_metrics" in comp_analysis:
                        metrics = comp_analysis["competitive_metrics"]
                        st.markdown(f"""
                        **Market Competition Metrics:**
                        - Total Competitors: {metrics['total_competitors']}
                        - Average Competitor Funding: ${metrics['avg_competitor_funding']:,.2f}
                        - Market Saturation: {metrics['market_saturation'].upper()}
                        """)
                    
                    if "whitespace_analysis" in comp_analysis:
                        st.markdown("### Market Whitespace Analysis")
                        st.write(comp_analysis["whitespace_analysis"])
                
                # Marketability Score
                st.subheader("💯 Marketability Score")
                with st.expander("View Details", expanded=True):
                    score_analysis = result["marketability_score"]
                    
                    # Display score
                    score = score_analysis["marketability_score"]
                    st.markdown(f"""
                    <div style='text-align: center; font-size: 48px; color: {format_score_color(score)};'>
                        {score}/100
                    </div>
                    """, unsafe_allow_html=True)
                    
                    # Display other metrics
                    st.markdown(f"""
                    **Opportunity Scope:** {score_analysis['opportunity_scope']}
                    
                    **Market Timing:** {score_analysis['market_timing']}
                    
                    **Risk Zones:**
                    {score_analysis['risk_zones']}
                    
                    **Recommendations:**
                    {score_analysis['recommendations']}
                    """)
            
            # Agent Insights (Collapsible)
            st.subheader("🤖 Agent Insights")
            with st.expander("View AI Agent Thoughts", expanded=False):
                agent_insights = result["agent_insights"]
                
                st.markdown("### 🔍 Idea Parser")
                st.write(agent_insights["idea_parser"])
                
                st.markdown("### 📊 Market Analyzer")
                st.write(agent_insights["market_analyzer"])
                
                st.markdown("### 🔄 Competition Analyzer")
                st.write(agent_insights["competition_analyzer"])
                
                st.markdown("### 💯 Marketability Scorer")
                st.write(agent_insights["marketability_scorer"])

if __name__ == "__main__":
    main()
