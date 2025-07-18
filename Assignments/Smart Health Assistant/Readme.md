# Smart Health Assistant

## Objective

Build a Smart Health Assistant using a sequential conversation pattern with multiple agents to provide personalized health recommendations, meal plans, and workout schedules.

## Features
- **User Proxy Agent:** Collects user data (weight, height, age, gender, dietary preference).
- **BMI Tool & Agent:** Calculates BMI and provides health recommendations.
- **Diet Planner Agent:** Suggests meal plans based on BMI and dietary preferences.
- **Workout Scheduler Agent:** Creates a weekly workout plan based on user profile and meal plan.
- **Sequential Conversation Pattern:** Agents interact in a predefined sequence to deliver a comprehensive health plan.

## Conversation Flow

1. **User Proxy Agent**
    - Collects:
        - Weight (kg)
        - Height (cm)
        - Age
        - Gender
        - Dietary Preference (Veg, Non-Veg, Vegan)
2. **BMI Tool**
    - Converts height to meters
    - Calculates BMI: `BMI = Weight (kg) / (Height (m))^2`
3. **BMI Agent**
    - Analyzes BMI score
    - Provides health recommendations
4. **Diet Planner Agent**
    - Suggests meal plan based on BMI insights and dietary preference
5. **Workout Scheduler Agent**
    - Creates a weekly workout plan based on meal plan, age, and gender

## Expected Output
A seamless multi-agent conversation resulting in:
- BMI insights
- Tailored diet plan
- Personalized fitness schedule

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd Smart-Health-Assistant
   ```
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Run the application:**
   ```bash
   streamlit run health_agent.py
   ```

## Requirements
- Python 3.8+
- See `requirements.txt` for package versions

## License
MIT License 