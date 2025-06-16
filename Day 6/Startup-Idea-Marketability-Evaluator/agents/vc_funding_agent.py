import json

def get_vc_activity(domain):
    with open("data/mocked_crunchbase.json") as f:
        data = json.load(f)
    return [d for d in data if domain.lower() in d["domain"].lower()]