# 🧾 Bill Management Agent

An intelligent AI-powered bill management system that automatically categorizes and analyzes expenses from uploaded bill images using Google Gemini Vision API and AutoGen multi-agent framework.

## ✨ Features

- **📸 Image Processing**: Upload bill images (JPG, JPEG, PNG) for automatic expense extraction
- **🏷️ Smart Categorization**: Automatically categorizes expenses into:
  - Groceries
  - Dining
  - Utilities
  - Shopping
  - Entertainment
  - Others
- **📊 Expense Analysis**: Provides detailed spending summaries and trend analysis
- **🤖 Multi-Agent Architecture**: Uses AutoGen framework with specialized agents:
  - Bill Processing Agent: Handles expense categorization
  - Expense Summarization Agent: Analyzes spending patterns
- **🎨 Modern UI**: Beautiful Streamlit interface with responsive design
- **💬 Agent Chat Logs**: Real-time visibility into agent interactions

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Bill_Managing_Agent
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the application**
   ```bash
   streamlit run app.py
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:8501`

## 📋 Requirements

The following packages are required (see `requirements.txt`):

- `streamlit` - Web application framework
- `python-dotenv` - Environment variable management
- `Pillow` - Image processing
- `google-generativeai` - Google Gemini API integration
- `pyautogen` - AutoGen multi-agent framework

## 🎯 How to Use

1. **Upload a Bill**: Click the file uploader and select a bill image (JPG, JPEG, or PNG format)

2. **Automatic Processing**: The system will:
   - Extract all expenses from the image using Gemini Vision
   - Categorize expenses into predefined categories
   - Generate a comprehensive spending summary

3. **View Results**: 
   - See categorized expenses organized by category
   - Review the AI-generated spending analysis
   - Monitor agent interactions in the chat logs

## 🏗️ Architecture

### Multi-Agent System
The application uses AutoGen's multi-agent framework with three specialized agents:

- **UserProxy Agent**: Manages user interactions and coordinates other agents
- **Bill Processing Agent**: Handles expense categorization and data processing
- **Expense Summarization Agent**: Analyzes spending patterns and generates insights

### Technology Stack
- **Frontend**: Streamlit for web interface
- **AI Vision**: Google Gemini 1.5 Flash for image analysis
- **Multi-Agent Framework**: AutoGen for agent orchestration
- **Image Processing**: PIL (Python Imaging Library)

## 🔧 Configuration

### Environment Variables
- `GEMINI_API_KEY`: Your Google Gemini API key (required)

### API Setup
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your `.env` file

## 📁 Project Structure

```
Bill_Managing_Agent/
├── app.py              # Main application file
├── requirements.txt    # Python dependencies
├── README.md          # This file
└── .env               # Environment variables (create this)
```

## 🎨 UI Features

- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Processing**: Live updates during bill analysis
- **Visual Feedback**: Progress indicators and success/error messages
- **Organized Display**: Clean categorization and summary sections

## 🔍 Example Output

### Categorized Expenses
```
🗂️ Groceries
- Milk: ₹50
- Bread: ₹30

🗂️ Dining
- Restaurant: ₹500

📋 Spending Summary
Total expenditure: ₹580
Highest category: Dining (₹500)
Analysis: Dining expenses are unusually high...
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **API Key Error**: Ensure your `GEMINI_API_KEY` is correctly set in the `.env` file
2. **Image Upload Issues**: Make sure the image format is supported (JPG, JPEG, PNG)
3. **Processing Errors**: Check your internet connection and API quota

### Getting Help

If you encounter any issues:
1. Check the console output for error messages
2. Verify your API key is valid
3. Ensure all dependencies are installed correctly

