# Financial Portfolio Manager

## Objective

Build a Financial Portfolio Manager that assists users in managing their investments using Group Chat for agent collaboration and StateFlow for dynamic workflow management based on user inputs.

## System Overview

This agentic system leverages multiple specialized agents collaborating via a group chat, with dynamic workflow management to provide personalized investment recommendations and reports.

## Architecture & Agent Flow

1. **User Proxy Agent**
   - Initiates the chat and activates the Group Chat Manager.
   - Informs the Group Chat Manager about the user’s intention to manage investments.

2. **Group Chat Manager**
   - Manages the group chat and directs the conversation flow.
   - Calls the Portfolio Analysis Agent to take user inputs.

3. **Portfolio Analysis Agent**
   - Summarizes the user’s existing portfolio and determines the investment category.
   - **Inputs Expected:**
     - Current salary
     - Summary of current investment portfolio (e.g., amounts in fixed deposits, SIPs, real estate, etc.)
   - **Output:** Determines whether to pursue Growth or Value investments based on the user’s portfolio.

4. **StateFlow Workflow Management**
   - Dynamically manages the workflow based on the Portfolio Analysis Agent’s recommendation.
   - Directs the workflow to either the Growth Investment Agent or the Value Investment Agent.

5. **Growth Investment Agent**
   - Suggests investments for maximizing portfolio growth.
   - Provides recommendations for high-growth investment options.

6. **Value Investment Agent**
   - Recommends stable investments for long-term value.
   - Provides recommendations for stable, long-term investment options.

7. **Investment Advisor Agent**
   - Compiles a detailed report of holdings and recommendations.
   - Generates a personalized financial report based on the insights from previous agents.

## Key Concepts

- **Group Chat for Collaboration:** Agents collaborate through a group chat managed by the Group Chat Manager.
- **Dynamic Workflow Management:** StateFlow manages the workflow based on user inputs and agent recommendations.
- **Portfolio Analysis:** Summarizes the user’s investment portfolio and determines the investment category (Growth or Value).
- **Investment Recommendations:** Growth and Value Investment Agents provide specific investment suggestions.
- **Personalized Financial Report:** The Investment Advisor Agent compiles a detailed report based on the insights from previous agents.

## Expected Conversation Flow

1. User Proxy Agent initiates the chat.
2. Group Chat Manager manages the flow and calls the Portfolio Analysis Agent.
3. Portfolio Analysis Agent summarizes the portfolio and determines investment direction.
4. StateFlow directs to Growth or Value Investment Agent.
5. Growth/Value Investment Agent provides recommendations.
6. Investment Advisor Agent generates a personalized financial report.

## Expected Output

A personalized financial report including portfolio analysis, growth, and value investment suggestions. The output of the Investment Advisor Agent is displayed to the user.

## Usage

1. Clone the repository.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   python app.py
   ```
4. Follow the prompts to input your financial details and receive a personalized report.

---

*This project demonstrates agent collaboration, dynamic workflow management, and personalized financial advising using modern AI techniques.* 