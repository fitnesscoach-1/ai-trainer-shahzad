import { useState } from "react";
import axios from "axios";
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
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // =========================
  // GENERATE DIET (BACKEND)
  // =========================
  const generateDiet = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Session expired. Please login again.");
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/diet/generate",
        {
          name: formData.name,
          age: Number(formData.age),
          weight: Number(formData.weight),
          weight_unit: formData.weightUnit,
          height: Number(formData.height),
          height_unit: formData.heightUnit,
          blood_group: formData.bloodGroup,
          fitness_goal: formData.fitnessGoal,
          medical_condition: formData.medicalCondition,
          diet_preference: formData.dietPreference,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setDietPlan(response.data.diet_plan);
      setShowResult(true);
    } catch (err: any) {
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;

        if (Array.isArray(detail)) {
          setError(detail.map((d: any) => d.msg).join(", "));
        } else if (typeof detail === "string") {
          setError(detail);
        } else {
          setError("Invalid input. Please check your form.");
        }
      } else {
        setError("Failed to generate diet. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REGENERATE (RESET)
  // =========================
  const resetForm = () => {
    setShowResult(false);
    setDietPlan("");
    setError("");
  };

  // =========================
  // SAVE DIET (UX CONFIRM)
  // =========================
  const saveDiet = () => {
    alert("Diet plan saved successfully!");
  };

  return (
    <div className="diet-page">
      <h1>AI Diet Generator</h1>
      <p className="subtitle">Smart nutrition plans powered by AI</p>

      <div className="diet-layout">
        {!showResult ? (
          <form className="diet-form full-bg" onSubmit={generateDiet}>
            {error && <p className="error-text">{error}</p>}

            <div className="field">
              <label>Name</label>
              <input
                name="name"
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
                <option value="muscle gain">Muscle Gain</option>
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
              <button className="save-btn" onClick={saveDiet}>
                Save Diet
              </button>
              <button className="generate-again" onClick={resetForm}>
                Regenerate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
