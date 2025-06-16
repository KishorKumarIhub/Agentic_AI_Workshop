def get_keyword_volume(keyword):
    mocked_data = {
        "AI legal assistant": 1900,
        "Gen Z fitness app": 1100,
        "mental health AI": 1600
    }
    return mocked_data.get(keyword.lower(), 500)