from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def export_to_pdf(idea, index, summary, chart_path):
    c = canvas.Canvas("report.pdf", pagesize=letter)
    c.setFont("Helvetica", 12)
    c.drawString(50, 750, "Startup Marketability Report")
    c.drawString(50, 730, f"Idea: {idea[:90]}...")
    c.drawString(50, 710, f"Marketability Index: {index:.2f}")
    c.drawString(50, 690, "Summary:")
    text = c.beginText(50, 670)
    text.setFont("Helvetica", 10)
    for line in summary.split(". "):
        text.textLine(line.strip() + ".")
    c.drawText(text)
    c.drawImage(chart_path, 50, 450, width=400, preserveAspectRatio=True)
    c.save()