from chains.evaluate_chain import evaluate_marketability

idea = input("Enter your startup idea: ")
index, summary = evaluate_marketability(idea)

print("\nMarketability Index:", index)
print("\nSummary Report:\n", summary)