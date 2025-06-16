from agents.idea_parser import parse_idea
from agents.market_trend_agent import fetch_trends
from agents.keyword_volume_agent import get_keyword_volume
from agents.vc_funding_agent import get_vc_activity
from agents.startup_compare_agent import compare_with_existing
from agents.score_generator import generate_score
from agents.summary_generator import generate_summary

def evaluate_marketability(idea):
    parsed_text = parse_idea(idea)
    print("Parsed Idea:\n", parsed_text)

    parsed = {
        "Domain": parsed_text.split("Domain:")[-1].split("Problem:")[0].strip(),
        "Problem": parsed_text.split("Problem:")[-1].split("Target Audience:")[0].strip(),
        "Target Audience": parsed_text.split("Target Audience:")[-1].split("Technologies:")[0].strip(),
        "Technologies": parsed_text.split("Technologies:")[-1].strip()
    }

    trend = fetch_trends(idea)
    volume = get_keyword_volume(idea)
    vc = get_vc_activity(parsed['Domain'])
    compare_score = compare_with_existing(parsed)

    index = generate_score(trend, volume, vc, compare_score)
    summary = generate_summary(trend, volume, vc, compare_score, index)

    return index, summary