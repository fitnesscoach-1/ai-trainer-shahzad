import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  FaPowerOff,
  FaUserCircle,
  FaSignInAlt,
} from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      {/* LEFT — ACTIVE STATUS (REPLACES LOGO) */}
      <div className="navbar-left">
        <div className={`active-status ${user ? "online" : "offline"}`}>
          <span className="status-dot"></span>
          <span className="status-text">
            {user ? "Active" : "Offline"}
          </span>
        </div>
      </div>

      {/* CENTER — MAIN NAV */}
      <div className="navbar-center">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/diet" className="nav-link">Diet</Link>
        <Link to="/contact" className="nav-link">Contact</Link>

        {user && (
          <>
            <Link to="/workouts" className="nav-link">Workout</Link>
            <Link to="/workout-history" className="nav-link">Workout History</Link>
            <Link to="/diet-history" className="nav-link">Diet History</Link>
          </>
        )}
      </div>

      {/* RIGHT — AUTH / ROLE */}
      <div className="navbar-right">
        {user?.role === "admin" && (
          <Link to="/admin" className="admin-btn">
            🛡 Admin Dashboard
          </Link>
        )}

        {user && (
          <div
            className="profile-wrapper"
            title="Profile"
            onClick={() => navigate("/profile")}
          >
            <FaUserCircle className="profile-icon" />
            <span className="online-dot"></span>
          </div>
        )}

        {user ? (
          <FaPowerOff
            className="power-icon off"
            title="Logout"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          />
        ) : (
          <FaSignInAlt
            className="power-icon on"
            title="Login"
            onClick={() => navigate("/login")}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
