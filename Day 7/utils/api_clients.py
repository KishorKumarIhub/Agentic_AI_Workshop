from pytrends.request import TrendReq
from py_crunchbase import PyCrunchbase
from config.settings import CRUNCHBASE_API_KEY

# Google Trends client
pytrends = TrendReq(hl="en-US", tz=360)

# Crunchbase client
cb = PyCrunchbase(CRUNCHBASE_API_KEY)

def fetch_trends(keyword: str):
    pytrends.build_payload([keyword], timeframe="today 12-m")
    df = pytrends.interest_over_time()
    return df[keyword].tolist()

def fetch_crunchbase_signals(domain: str):
    api = cb.search_organizations(domain)
    results = api.get("data", {}).get("items", [])
    signals = []
    for ent in results:
        signals.append({
            "name": ent["properties"]["name"],
            "country": ent["properties"].get("country_code"),
            "funding": ent["properties"].get("total_funding_usd")
        })
    return signals
