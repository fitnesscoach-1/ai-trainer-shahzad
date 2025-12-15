import "./Signup.css";

export default function Signup() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-subtitle">
          Join AI Trainer Shahzad and start your personalized fitness journey.
        </p>

        <form className="auth-form">
          <input type="text" placeholder="Full Name" />
          <input type="email" placeholder="Email Address" />
          <input type="password" placeholder="Password" />

          <button className="btn primary">Create Account</button>
        </form>
      </div>
    </div>
  );
}
