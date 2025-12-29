import { useState } from "react";
import "./BMI.css";

export default function BMI() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState<number>(0);
  const [weightUnit, setWeightUnit] = useState("kg");
  const [height, setHeight] = useState<number>(0);
  const [heightUnit, setHeightUnit] = useState("cm");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [showResult, setShowResult] = useState(false);

  const calculateBMI = () => {
    let weightInKg = weight;
    let heightInMeters = height;

    if (weightUnit === "lbs") weightInKg = weight * 0.453592;
    if (heightUnit === "inches") heightInMeters = height * 0.0254;
    else heightInMeters = height / 100;

    if (weightInKg > 0 && heightInMeters > 0) {
      const result = weightInKg / (heightInMeters * heightInMeters);
      const roundedBMI = Number(result.toFixed(2));
      setBmi(roundedBMI);

      if (roundedBMI < 18.5) setCategory("Underweight");
      else if (roundedBMI < 25) setCategory("Normal weight");
      else if (roundedBMI < 30) setCategory("Overweight");
      else setCategory("Obese");

      setShowResult(true);
    }
  };

  const reset = () => {
    setName("");
    setGender("male");
    setWeight(0);
    setHeight(0);
    setBmi(null);
    setCategory("");
    setShowResult(false);
  };

  const downloadResult = () => {
    if (!bmi) return;

    const content = 
`BMI Calculation Result

Name: ${name || "N/A"}
Gender: ${gender}
Weight: ${weight} ${weightUnit}
Height: ${height} ${heightUnit}
BMI: ${bmi}
Category: ${category}

Note: BMI is a screening tool and does not directly assess body fat.
`;

    const element = document.createElement("a");
    const file = new Blob([content.replace(/\n/g, "\r\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "bmi-result.txt";
    document.body.appendChild(element);
    element.click();
  };

  const copyResult = () => {
    if (!bmi) return;

    const content = 
`BMI Calculation Result

Name: ${name || "N/A"}
Gender: ${gender}
Weight: ${weight} ${weightUnit}
Height: ${height} ${heightUnit}
BMI: ${bmi}
Category: ${category}

Note: BMI is a screening tool and does not directly assess body fat.
`;

    navigator.clipboard.writeText(content);
    alert("BMI result copied to clipboard!");
  };

  return (
    <div className="bmi-page">
      <h1>BMI Calculator</h1>
      <p className="subtitle">Scientifically accurate body mass analysis</p>

      {!showResult ? (
        <div className="bmi-card full-bg">
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

          {/* Gender */}
          <div className="field">
            <label>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
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

          <button onClick={calculateBMI}>Calculate BMI</button>
        </div>
      ) : (
        <div className="bmi-card full-bg">
          <pre style={{ overflowX: "auto", whiteSpace: "pre-wrap" }}>
            {`BMI Calculation Result

Name: ${name || "N/A"}
Gender: ${gender}
Weight: ${weight} ${weightUnit}
Height: ${height} ${heightUnit}
BMI: ${bmi}
Category: ${category}

Note: BMI is a screening tool and does not directly assess body fat.`}
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
