import matplotlib.pyplot as plt
import os

def generate_chart(score):
    plt.figure(figsize=(5, 2.5))
    plt.barh(["Marketability Index"], [score], color="skyblue")
    plt.xlim(0, 100)
    plt.xlabel("Score")
    plt.title("Startup Marketability Score")
    chart_path = os.path.join("charts", "index_chart.png")
    plt.tight_layout()
    plt.savefig(chart_path)
    return chart_path