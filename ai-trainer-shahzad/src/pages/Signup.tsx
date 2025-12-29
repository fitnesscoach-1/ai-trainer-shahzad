import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Country } from "country-state-city";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const countries = Country.getAllCountries();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    country: "",
    phone: "",
    zip_code: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =========================
     SUBMIT FORM
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.country) {
      setError("Please select a country");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/signup", form);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>Create Account</h1>
        <p className="subtitle">Join our global community</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="off">
          {/* NAME */}
          <div className="row">
            <input
              name="first_name"
              value={form.first_name}
              placeholder="First Name"
              onChange={handleChange}
              autoComplete="given-name"
              required
            />
            <input
              name="last_name"
              value={form.last_name}
              placeholder="Last Name"
              onChange={handleChange}
              autoComplete="family-name"
              required
            />
          </div>

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            value={form.email}
            placeholder="Email Address"
            onChange={handleChange}
            autoComplete="email"
            required
          />

          {/* USERNAME */}
          <input
            name="username"
            value={form.username}
            placeholder="Username"
            onChange={handleChange}
            autoComplete="username"
            required
          />

          {/* COUNTRY */}
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            autoComplete="country"
            required
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* PHONE */}
          <div className="phone-wrapper">
            <PhoneInput
              country="pk"
              enableSearch
              value={form.phone}
              onChange={(value) =>
                setForm({ ...form, phone: "+" + value })
              }
              inputProps={{
                name: "phone",
                required: true,
                autoComplete: "tel",
              }}
              inputStyle={{ width: "100%" }}
            />
          </div>

          {/* ZIP */}
          <input
            name="zip_code"
            value={form.zip_code}
            placeholder="Zip Code"
            onChange={handleChange}
            autoComplete="postal-code"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            value={form.password}
            placeholder="Password"
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
