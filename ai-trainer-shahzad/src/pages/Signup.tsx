import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import { Country } from "country-state-city";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const countries = Country.getAllCountries();

  /* ✅ HIDE NAVBAR ON SIGNUP PAGE */
  useEffect(() => {
    document.body.classList.add("auth-page");
    return () => {
      document.body.classList.remove("auth-page");
    };
  }, []);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    country: "",
    phone: "",
    address: "",
    zip_code: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     COUNTRY OPTIONS (FLAG + NAME)
  ========================= */
  const countryOptions = countries.map((c) => ({
    value: c.name,
    label: (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img
          src={`https://flagcdn.com/w20/${c.isoCode.toLowerCase()}.png`}
          alt={c.name}
          width={20}
          height={14}
          style={{ borderRadius: 2 }}
        />
        <span>{c.name}</span>
      </div>
    ),
  }));

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
              onChange={(e) =>
                setForm({ ...form, first_name: e.target.value })
              }
              autoComplete="given-name"
              required
            />
            <input
              name="last_name"
              value={form.last_name}
              placeholder="Last Name"
              onChange={(e) =>
                setForm({ ...form, last_name: e.target.value })
              }
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
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            autoComplete="email"
            required
          />

          {/* USERNAME */}
          <input
            name="username"
            value={form.username}
            placeholder="Username"
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            autoComplete="username"
            required
          />

          {/* COUNTRY (FLAG + NAME, PROPERLY ALIGNED) */}
          <div className="select-wrapper">
            <Select
              options={countryOptions}
              placeholder="🌍 Select Country"
              onChange={(option: any) =>
                setForm({ ...form, country: option.value })
              }
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: "48px",
                  height: "48px",
                  backgroundColor: "rgba(10, 20, 30, 0.75)",
                  borderRadius: "12px",
                  borderColor: state.isFocused
                    ? "#4facfe"
                    : "rgba(255, 255, 255, 0.3)",
                  boxShadow: state.isFocused
                    ? "0 0 0 3px rgba(79, 172, 254, 0.25)"
                    : "none",
                }),
                valueContainer: (base) => ({
                  ...base,
                  height: "48px",
                  padding: "0 12px",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#b9c8d3",
                }),
                input: (base) => ({
                  ...base,
                  color: "#ffffff",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#0f172a",
                  borderRadius: "12px",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused
                    ? "rgba(79, 172, 254, 0.15)"
                    : "transparent",
                  color: "#ffffff",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }),
              }}
            />
          </div>

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
            />
          </div>

          {/* ADDRESS */}
          <input
            name="address"
            value={form.address}
            placeholder="Address"
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
            autoComplete="street-address"
            required
          />

          {/* ZIP */}
          <input
            name="zip_code"
            value={form.zip_code}
            placeholder="Zip Code"
            onChange={(e) =>
              setForm({ ...form, zip_code: e.target.value })
            }
            autoComplete="postal-code"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            value={form.password}
            placeholder="Password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
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
