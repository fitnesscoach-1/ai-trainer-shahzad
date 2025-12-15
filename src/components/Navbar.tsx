import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">AI Trainer Shahzad</div>

      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/workout">Workout</Link></li>
        <li><Link to="/diet">Diet</Link></li>
        <li><Link to="/bmi">BMI</Link></li>
        <li><Link to="/bmr">BMR</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}
