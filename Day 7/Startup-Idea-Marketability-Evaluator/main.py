# main.py
from langgraph_app.executor import run_graph

def main():
    print("📥 Enter your startup idea:")
    idea = input(">>> ")
    result = run_graph(idea)
    print("\n📊 Marketability Evaluation Result:\n")
    print(result)

if __name__ == "__main__":
    main()
