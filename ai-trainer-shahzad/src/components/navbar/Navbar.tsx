import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaDumbbell,
  FaAppleAlt,
  FaEnvelope,
  FaHistory,
} from "react-icons/fa";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const user = auth?.user ?? null;
  const logout = auth?.logout;

  const username =
    user?.username ??
    user?.name ??
    (user?.email ? user.email.split("@")[0] : "User");

  return (
    <nav className="navbar">
      {/* LEFT — ATLAS */}
      <div className="navbar-left">
        <div className="atlas-status">
          <span className={`atlas-light ${user ? "online" : "offline"}`} />
          <span className="status-text">Atlas</span>
        </div>
      </div>

      {/* CENTER — NAV */}
      <div className={`navbar-center ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
          <FaHome /> <span>Home</span>
        </Link>

        <Link to="/workouts" className="nav-link" onClick={() => setMenuOpen(false)}>
          <FaDumbbell /> <span>Workout</span>
        </Link>

        <Link to="/diet" className="nav-link" onClick={() => setMenuOpen(false)}>
          <FaAppleAlt /> <span>Diet</span>
        </Link>

        {/* 🔒 AUTH-ONLY LINKS */}
        {user && (
          <>
            <Link
              to="/workout-history"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              <FaHistory /> <span>Workout History</span>
            </Link>

            <Link
              to="/diet-history"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              <FaHistory /> <span>Diet History</span>
            </Link>
          </>
        )}

        <Link to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>
          <FaEnvelope /> <span>Contact</span>
        </Link>
      </div>

      {/* RIGHT — USER */}
      <div className="navbar-right">
        {user ? (
          <>
            <div className="user-status">
              <span className="username-text">{username}</span>
              <span className="online-dot" />
            </div>

            <button
              className="logout-btn"
              onClick={() => {
                logout?.();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        )}

        {/* HAMBURGER */}
        <div
          className="menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
