import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-card">
        <h1 className="logo">AI Trainer Shahzad</h1>

        <p className="tagline">
          Your personal AI-powered fitness coach. Get customized workout plans,
          diet guidance, BMI & BMR analysis, and smart insights to help you
          achieve your fitness goals efficiently.
        </p>

        <div className="buttons">
          <Link to="/login">
            <button className="btn primary">Login</button>
          </Link>

          <Link to="/signup">
            <button className="btn secondary">Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
