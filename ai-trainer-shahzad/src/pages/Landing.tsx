import { Link } from "react-router-dom";
import "./Landing.css";

/* ✅ IMPORT BACKGROUND IMAGE (Vite-safe) */
import landingBg from "../assets/landing-page.png";

export default function Landing() {
  return (
    <div
      className="landing"
      /* ✅ APPLY BACKGROUND IMAGE INLINE */
      style={{
        backgroundImage: `
          linear-gradient(
            135deg,
            rgba(15, 32, 39, 0.85),
            rgba(32, 58, 67, 0.85),
            rgba(44, 83, 100, 0.85)
          ),
          url(${landingBg})
        `
      }}
    >
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
