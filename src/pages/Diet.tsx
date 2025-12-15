import { useState } from "react";
import "./Diet.css";

export default function Diet() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    weight: "",
    weightUnit: "kg",
    height: "",
    heightUnit: "cm",
    bloodGroup: "",
    fitnessGoal: "weight loss",
    medicalCondition: "none",
    dietPreference: "balanced",
  });

  const [dietPlan, setDietPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false); // track result view

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateDiet = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setDietPlan(`
🥗 Hello ${formData.name || "Athlete"} 👋

Here is your AI-generated personalized diet plan based on your body,
fitness goal, and medical preferences.

📌 Goal: ${formData.fitnessGoal.toUpperCase()}
📌 Diet Type: ${formData.dietPreference}
📌 Medical Condition: ${formData.medicalCondition}
📌 Weight: ${formData.weight} ${formData.weightUnit}
📌 Height: ${formData.height} ${formData.heightUnit}

🍳 Breakfast
• Oatmeal with fruits
• Boiled eggs / Paneer
• Green tea

🥗 Lunch
• Brown rice / Whole wheat roti
• Grilled chicken / Lentils
• Mixed vegetables

🍎 Snacks
• Nuts & seeds
• Fruit smoothie

🍽 Dinner
• Steamed vegetables
• Grilled fish / Tofu
• Light soup

💧 Hydration
• 2.5 – 3 liters of water daily

⚠️ AI Note:
This plan is informational. Consult a dietitian for medical conditions.
      `);
      setLoading(false);
      setShowResult(true); // show result
    }, 1500);
  };

  const resetForm = () => {
    setShowResult(false);
    setDietPlan("");
    setFormData({
      name: "",
      age: "",
      weight: "",
      weightUnit: "kg",
      height: "",
      heightUnit: "cm",
      bloodGroup: "",
      fitnessGoal: "weight loss",
      medicalCondition: "none",
      dietPreference: "balanced",
    });
  };

  const downloadDiet = () => {
    const formattedText = dietPlan
      .split("\n")
      .map((line) => line.trimStart()) // clean leading spaces
      .join("\r\n"); // Windows-style line breaks

    const element = document.createElement("a");
    const file = new Blob([formattedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "diet-plan.txt";
    document.body.appendChild(element);
    element.click();
  };

  const copyDiet = () => {
    navigator.clipboard.writeText(dietPlan);
    alert("Diet plan copied to clipboard!");
  };

  return (
    <div className="diet-page">
      <h1>AI Diet Generator</h1>
      <p className="subtitle">Smart nutrition plans powered by AI</p>

      <div className="diet-layout">
        {!showResult ? (
          <form className="diet-form full-bg" onSubmit={generateDiet}>
            <div className="field">
              <label>Name</label>
              <input
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Age</label>
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label>Weight</label>
                <input
                  type="number"
                  name="weight"
                  placeholder="Weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>Unit</label>
                <select
                  name="weightUnit"
                  value={formData.weightUnit}
                  onChange={handleChange}
                >
                  <option value="kg">Kg</option>
                  <option value="lbs">Lbs</option>
                </select>
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Height</label>
                <input
                  type="number"
                  name="height"
                  placeholder="Height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>Unit</label>
                <select
                  name="heightUnit"
                  value={formData.heightUnit}
                  onChange={handleChange}
                >
                  <option value="cm">Cm</option>
                  <option value="inches">Inches</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
              </select>
            </div>

            <div className="field">
              <label>Fitness Goal</label>
              <select
                name="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={handleChange}
              >
                <option value="weight loss">Weight Loss</option>
                <option value="weight gain">Weight Gain</option>
                <option value="muscle building">Muscle Building</option>
                <option value="body toning">Body Toning</option>
              </select>
            </div>

            <div className="field">
              <label>Medical Condition</label>
              <select
                name="medicalCondition"
                value={formData.medicalCondition}
                onChange={handleChange}
              >
                <option value="none">None</option>
                <option value="diabetes">Diabetes</option>
                <option value="thyroid">Thyroid</option>
                <option value="blood pressure">Blood Pressure</option>
                <option value="cholesterol">Cholesterol</option>
              </select>
            </div>

            <div className="field">
              <label>Diet Preference</label>
              <select
                name="dietPreference"
                value={formData.dietPreference}
                onChange={handleChange}
              >
                <option value="balanced">Balanced</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="low carb">Low Carb</option>
              </select>
            </div>

            <button type="submit">
              {loading ? "AI is Preparing Diet..." : "Generate Diet Plan"}
            </button>
          </form>
        ) : (
          <div className="diet-result full-bg">
            <pre>{dietPlan}</pre>
            <div className="result-buttons-container">
              <button className="generate-again" onClick={resetForm}>
                Generate Again
              </button>
              <button className="download-btn" onClick={downloadDiet}>
                Download
              </button>
              <button className="copy-btn" onClick={copyDiet}>
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
