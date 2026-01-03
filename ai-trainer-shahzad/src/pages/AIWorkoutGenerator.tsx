import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './AIWorkoutGenerator.css';


export default function AIWorkoutGenerator() {
  const navigate = useNavigate();

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
    workoutPreference: "balanced",
  });

  const [workoutPlan, setWorkoutPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ===============================
  // REAL AI WORKOUT GENERATOR
  // ===============================
  const generateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/workouts/generate",
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
          workout_preference: formData.workoutPreference,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWorkoutPlan(response.data.workout_plan);
      setShowResult(true);
    } catch (error) {
      console.error(error);
      alert("Failed to generate workout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // RESET (REGENERATE)
  // ===============================
  const resetForm = () => {
    setShowResult(false);
    setWorkoutPlan("");
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
      workoutPreference: "balanced",
    });
  };

  // ===============================
  // SAVE WORKOUT (UX CONFIRMATION)
  // ===============================
  const saveWorkout = () => {
    alert("Workout saved successfully!");
    navigate("/workout-history");
  };

  return (
    <div className="workout-page">
      {!showResult ? (
        <form className="workout-form full-bg" onSubmit={generateWorkout}>
          <h1>AI Workout Generator</h1>
          <p className="subtitle">Get workouts based on your body & fitness goal</p>

          {/* Name */}
          <div className="field">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Age */}
          <div className="field">
            <label>Age</label>
            <input
              type="number"
              name="age"
              placeholder="Enter your age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          {/* Weight */}
          <div className="field-row">
            <div className="field">
              <label>Weight</label>
              <input
                type="number"
                name="weight"
                placeholder="Enter weight"
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

          {/* Height */}
          <div className="field-row">
            <div className="field">
              <label>Height</label>
              <input
                type="number"
                name="height"
                placeholder="Enter height"
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

          {/* Blood Group */}
          <div className="field">
            <label>Blood Group</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* Fitness Goal */}
          <div className="field">
            <label>Fitness Goal</label>
            <select
              name="fitnessGoal"
              value={formData.fitnessGoal}
              onChange={handleChange}
            >
              <option value="weight loss">Weight Loss</option>
              <option value="weight gain">Weight Gain</option>
              <option value="muscle transformation">Muscle Transformation</option>
              <option value="body toning">Body Toning</option>
            </select>
          </div>

          {/* Medical Condition */}
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

          {/* Workout Preference */}
          <div className="field">
            <label>Workout Preference</label>
            <select
              name="workoutPreference"
              value={formData.workoutPreference}
              onChange={handleChange}
            >
              <option value="balanced">Balanced</option>
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibility</option>
            </select>
          </div>

          <button type="submit">
            {loading ? "Generating AI Plan..." : "Generate Workout"}
          </button>
        </form>
      ) : (
        <div className="workout-result full-bg">
          <pre>{workoutPlan}</pre>

          <div className="result-buttons-container">
            <button className="save-btn" onClick={saveWorkout}>
              Save Workout
            </button>
            <button className="generate-again" onClick={resetForm}>
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
