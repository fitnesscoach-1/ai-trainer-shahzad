import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-hero-bg">
      <div className="home-hero-content">
        {/* ================= HEADER ================= */}
        <header className="home-header">
          <h1>Welcome to Ai-Trainer-Shahzad 👋</h1>
          <p>Your fitness journey starts here</p>

          {/*
          ================= RUNNING TEXT (TEMPORARILY DISABLED) =================
          NOTE:
          - Quotes are NOT deleted
          - Logic is preserved
          - Safe to re-enable anytime
          */}
          
          {/*
          <div className="running-text">
            <div className="running-text-track">
              <h2 className="quote ai">
                🤖 Your body is data, your habits are algorithms — train both intelligently.
              </h2>
              <h2 className="quote ai">
                ⚡ The future of fitness isn’t harder — it’s smarter.
              </h2>
              <h2 className="quote ai">
                🧠 AI doesn’t replace effort; it amplifies the effort you’re willing to give.
              </h2>
              <h2 className="quote ai">
                🚀 Smart training today builds a stronger, optimized you tomorrow.
              </h2>
              <h2 className="quote ai">
                🔮 When intelligence meets discipline, transformation becomes inevitable.
              </h2>

              <h2 className="quote real">
                💪 Your body achieves what your mind decides to never give up on.
              </h2>
              <h2 className="quote real">
                🔥 Discipline will take you where motivation cannot.
              </h2>
              <h2 className="quote real">
                🏃 Small workouts done consistently beat perfect plans done rarely.
              </h2>
              <h2 className="quote real">
                ⏳ Train today so the future version of you can thank you.
              </h2>
              <h2 className="quote real">
                🏆 Strength isn’t built in comfort — it’s built in commitment.
              </h2>

              <h2 className="quote ai">
                🤖 Your body is data, your habits are algorithms — train both intelligently.
              </h2>
              <h2 className="quote real">
                💪 Your body achieves what your mind decides to never give up on.
              </h2>
            </div>
          </div>
          */}
        </header>

        {/* ================= FEATURE GRID ================= */}
        <div className="home-grid">
          <Link to="/workouts" className="home-card">
            <h3>🏋️ Workouts</h3>
            <p>Personalized workout plans</p>
          </Link>

          <Link to="/diet" className="home-card">
            <h3>🥗 Diet</h3>
            <p>Healthy meal & nutrition plans</p>
          </Link>

          <Link to="/bmi" className="home-card">
            <h3>📊 BMI</h3>
            <p>Check your Body Mass Index</p>
          </Link>

          <Link to="/bmr" className="home-card">
            <h3>🔥 BMR</h3>
            <p>Calculate your daily calories</p>
          </Link>

          <Link to="/contact" className="home-card">
            <h3>📞 Contact</h3>
            <p>Get in touch with our team</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
