
import json

def compare_with_existing(parsed_idea):
    with open("data/mocked_crunchbase.json") as f:
        startups = json.load(f)
    score = 0
    for startup in startups:
        if parsed_idea['Domain'].lower() in startup['domain'].lower():
            score += 1
    return score