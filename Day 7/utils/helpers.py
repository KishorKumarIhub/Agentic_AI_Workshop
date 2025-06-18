import json
import os

DATA_PATH = "data/reference_datasets/startups.json"

def benchmark_against_startups(parsed_output: dict) -> dict:
    domain = parsed_output.get("parsed_output", "").lower()

    if not os.path.exists(DATA_PATH):
        return {"competition": [], "message": "No dataset found."}

    with open(DATA_PATH, "r") as f:
        startups = json.load(f)

    matches = [s for s in startups if domain in s["description"].lower()]

    return {"competition": matches[:5]}
