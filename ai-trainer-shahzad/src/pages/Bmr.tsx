import { useState } from "react";
import "./BMR.css";

export default function BMR() {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [weightUnit, setWeightUnit] = useState("kg");
  const [height, setHeight] = useState<number>(0);
  const [heightUnit, setHeightUnit] = useState("cm");
  const [gender, setGender] = useState("male");
  const [bmr, setBmr] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const calculateBMR = () => {
    let weightInKg = weight;
    let heightInCm = height;

    if (weightUnit === "lbs") weightInKg = weight * 0.453592;
    if (heightUnit === "inches") heightInCm = height * 2.54;

    if (age > 0 && weightInKg > 0 && heightInCm > 0) {
      let result = 0;

      // Mifflin-St Jeor Equation (Most Accurate)
      if (gender === "male") result = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
      else result = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;

      setBmr(Math.round(result));
      setShowResult(true);
    }
  };

  const reset = () => {
    setName("");
    setAge(0);
    setWeight(0);
    setHeight(0);
    setGender("male");
    setBmr(null);
    setShowResult(false);
  };

  const downloadResult = () => {
    if (!bmr) return;

    const content = 
`BMR Calculation Result

Name: ${name || "N/A"}
Age: ${age} years
Weight: ${weight} ${weightUnit}
Height: ${height} ${heightUnit}
Gender: ${gender}
BMR: ${bmr} kcal/day

Note: This is the minimum energy your body needs at complete rest.
`;

    const element = document.createElement("a");
    const file = new Blob([content.replace(/\n/g, "\r\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "bmr-result.txt";
    document.body.appendChild(element);
    element.click();
  };

  const copyResult = () => {
    if (!bmr) return;

    const content = 
`BMR Calculation Result

Name: ${name || "N/A"}
Age: ${age} years
Weight: ${weight} ${weightUnit}
Height: ${height} ${heightUnit}
Gender: ${gender}
BMR: ${bmr} kcal/day

Note: This is the minimum energy your body needs at complete rest.
`;

    navigator.clipboard.writeText(content);
    alert("BMR result copied to clipboard!");
  };

  return (
    <div className="bmr-page">
      <h1>BMR Calculator</h1>
      <p className="subtitle">Basal Metabolic Rate — calories your body burns at rest</p>

      {!showResult ? (
        <div className="bmr-card full-bg">
          {/* Name */}
          <div className="field">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Age */}
          <div className="field">
            <label>Age</label>
            <input
              type="number"
              placeholder="Years"
              value={age > 0 ? age : ""}
              onChange={(e) => setAge(+e.target.value)}
            />
          </div>

          {/* Weight */}
          <div className="field-row">
            <div className="field">
              <label>Weight</label>
              <input
                type="number"
                placeholder="Enter weight"
                value={weight > 0 ? weight : ""}
                onChange={(e) => setWeight(+e.target.value)}
              />
            </div>
            <div className="field">
              <label>Unit</label>
              <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}>
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
                placeholder="Enter height"
                value={height > 0 ? height : ""}
                onChange={(e) => setHeight(+e.target.value)}
              />
            </div>
            <div className="field">
              <label>Unit</label>
              <select value={heightUnit} onChange={(e) => setHeightUnit(e.target.value)}>
                <option value="cm">Cm</option>
                <option value="inches">Inches</option>
              </select>
            </div>
          </div>

          {/* Gender */}
          <div className="field">
            <label>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <button onClick={calculateBMR}>Calculate BMR</button>
        </div>
      ) : (
        <div className="bmr-card full-bg">
          <pre style={{ overflowX: "auto", whiteSpace: "pre-wrap" }}>
            {`BMR Calculation Result

Name: ${name || "N/A"}
Age: ${age} years
Weight: ${weight} ${weightUnit}
Height: ${height} ${heightUnit}
Gender: ${gender}
BMR: ${bmr} kcal/day

Note: This is the minimum energy your body needs at complete rest.`}
          </pre>

          <div className="result-buttons-container">
            <button className="reset-btn" onClick={reset}>Reset</button>
            <button className="download-btn" onClick={downloadResult}>Download</button>
            <button className="copy-btn" onClick={copyResult}>Copy to Clipboard</button>
          </div>
        </div>
      )}
    </div>
  );
}
