import { useState } from "react";
import "./Workout.css";

export default function Workout() {
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
    workoutPreference: "balanced", // new field like diet preference
  });

  const [workoutPlan, setWorkoutPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false); // track result view

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateWorkout = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setWorkoutPlan(`
🏋️ Personalized AI Workout Plan for ${formData.name || "Athlete"} 👋

Goal: ${formData.fitnessGoal.toUpperCase()}
Workout Type: ${formData.workoutPreference}
Medical Condition: ${formData.medicalCondition}

Age: ${formData.age}
Weight: ${formData.weight} ${formData.weightUnit}
Height: ${formData.height} ${formData.heightUnit}
Blood Group: ${formData.bloodGroup}

Day 1: Full Body Strength
- Squats: 4 x 12
- Push-ups: 3 x 15
- Plank: 3 x 40 sec

Day 2: Cardio & Core
- Jogging / Brisk Walk: 30 minutes
- Bicycle Crunch: 3 x 20

Day 3: Upper Body
- Dumbbell Press: 4 x 10
- Pull-ups / Lat Pulldown: 3 x 8

💡 Tip: Maintain hydration, warm up before exercise, and rest properly.
      `);
      setLoading(false);
      setShowResult(true);
    }, 1500);
  };

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

  const downloadWorkout = () => {
    const formattedText = workoutPlan
      .split("\n")
      .map((line) => line.trimStart())
      .join("\r\n");

    const element = document.createElement("a");
    const file = new Blob([formattedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "workout-plan.txt";
    document.body.appendChild(element);
    element.click();
  };

  const copyWorkout = () => {
    navigator.clipboard.writeText(workoutPlan);
    alert("Workout plan copied to clipboard!");
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
              <select name="weightUnit" value={formData.weightUnit} onChange={handleChange}>
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
              <select name="heightUnit" value={formData.heightUnit} onChange={handleChange}>
                <option value="cm">Cm</option>
                <option value="inches">Inches</option>
              </select>
            </div>
          </div>

          {/* Blood Group */}
          <div className="field">
            <label>Blood Group</label>
            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
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
            <select name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange}>
              <option value="weight loss">Weight Loss</option>
              <option value="weight gain">Weight Gain</option>
              <option value="muscle transformation">Muscle Transformation</option>
              <option value="body toning">Body Toning</option>
            </select>
          </div>

          {/* Medical Condition */}
          <div className="field">
            <label>Medical Condition</label>
            <select name="medicalCondition" value={formData.medicalCondition} onChange={handleChange}>
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
            <select name="workoutPreference" value={formData.workoutPreference} onChange={handleChange}>
              <option value="balanced">Balanced</option>
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibility</option>
            </select>
          </div>

          <button type="submit">{loading ? "Generating AI Plan..." : "Generate Workout"}</button>
        </form>
      ) : (
        <div className="workout-result full-bg">
          <pre>{workoutPlan}</pre>
          <div className="result-buttons-container">
            <button className="generate-again" onClick={resetForm}>Generate Again</button>
            <button className="download-btn" onClick={downloadWorkout}>Download</button>
            <button className="copy-btn" onClick={copyWorkout}>Copy to Clipboard</button>
          </div>
        </div>
      )}
    </div>
  );
}
