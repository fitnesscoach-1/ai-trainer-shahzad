import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Login.css";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ✅ HIDE NAVBAR ON LOGIN PAGE */
  useEffect(() => {
    document.body.classList.add("auth-page");
    return () => {
      document.body.classList.remove("auth-page");
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", identifier.trim());
      formData.append("password", password.trim());

      const res = await api.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      localStorage.setItem("token", res.data.access_token);
      window.location.replace("/");
    } catch (err: any) {
      if (!err.response) {
        setError("Server not reachable. Please try again.");
      } else {
        setError(err.response?.data?.detail || "Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
       

        <h1>Welcome Back</h1>
        <p className="subtitle">Login to your account</p>

        {/* SOCIAL LOGIN UI (UI ONLY) */}
        <button className="social-btn google" type="button">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
          />
          Continue with Google
        </button>

        <button className="social-btn facebook" type="button">
          <img
            src="https://www.svgrepo.com/show/475647/facebook-white.svg"
            alt="Facebook"
          />
          Continue with Facebook
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        {/* ERROR */}
        {error && <div className="error">{error}</div>}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email or Username</label>
            <input
              type="text"
              placeholder="Enter email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
            <span className="forgot">Forgot password?</span>
          </div>

          <button className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="signup">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
