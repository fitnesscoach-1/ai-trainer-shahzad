import os
from dotenv import load_dotenv
from openai import OpenAI

# ======================================================
# LOAD ENVIRONMENT VARIABLES
# ======================================================
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not found in .env file")

# Create OpenAI client (single instance)
client = OpenAI(api_key=OPENAI_API_KEY)


# ======================================================
# WORKOUT AI (OLD – FULLY PRESERVED)
# ======================================================
def generate_ai_workout(data):
    """
    Generates a personalized workout plan using OpenAI
    """

    prompt = f"""
Create a personalized workout plan.

User Information:
Name: {data.name}
Age: {data.age}
Weight: {data.weight} {data.weight_unit}
Height: {data.height} {data.height_unit}
Blood Group: {data.blood_group}

Fitness Goal: {data.fitness_goal}
Medical Condition: {data.medical_condition}
Workout Preference: {data.workout_preference}

Instructions:
- Create a 3 to 5 day workout plan
- Include exercise name, sets, and reps
- Keep it beginner friendly and safe
- Add warm-up and cool-down advice
- Simple, clean text format
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        # Never crash backend
        return f"AI workout generation failed. Reason: {str(e)}"


# ======================================================
# DIET AI (NEW – SAFE + MATCHES DB & SCHEMAS)
# ======================================================
def generate_ai_diet(data):
    """
    Generates a personalized diet plan using OpenAI
    """

    prompt = f"""
Create a personalized diet plan.

User Information:
Name: {data.name}
Age: {data.age}
Weight: {data.weight} {data.weight_unit}
Height: {data.height} {data.height_unit}
Blood Group: {data.blood_group}

Fitness Goal: {data.fitness_goal}
Medical Condition: {data.medical_condition}
Diet Preference: {data.diet_preference}

Instructions:
- Create a 7-day diet plan
- Include breakfast, lunch, dinner, and snacks
- Mention portion sizes
- Add hydration tips
- Keep it healthy, realistic, and beginner friendly
- Simple, clean text format
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        # Never crash backend
        return f"AI diet generation failed. Reason: {str(e)}"
