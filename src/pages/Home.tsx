import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome back to AI Trainer Shahzad 👋</h1>
        <p className="hero-text">
          Your intelligent fitness assistant to build personalized workouts,
          diet plans, and scientifically accurate BMI & BMR insights.
        </p>

        <div className="hero-actions">
          <a href="/workout" className="primary-btn">Generate Workout</a>
          <a href="/diet" className="secondary-btn">Create Diet Plan</a>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <div className="action-card">
          <h3>🏋️ AI Workout</h3>
          <p>Personalized training plans based on your body & goals.</p>
          <a href="/workout">Start</a>
        </div>

        <div className="action-card">
          <h3>🥗 AI Diet</h3>
          <p>Nutrition plans for fitness, health & medical needs.</p>
          <a href="/diet">Start</a>
        </div>

        <div className="action-card">
          <h3>📊 BMI</h3>
          <p>Check your body mass index with medical accuracy.</p>
          <a href="/bmi">Calculate</a>
        </div>

        <div className="action-card">
          <h3>🔥 BMR</h3>
          <p>Know how many calories your body burns daily.</p>
          <a href="/bmr">Calculate</a>
        </div>
      </section>

      {/* Value Section */}
      <section className="value">
        <h2>Why AI Trainer Shahzad?</h2>
        <p>
          Unlike generic fitness apps, our AI adapts workouts and diet plans
          based on your age, body composition, metabolism, and fitness goals.
        </p>
      </section>
    </div>
  );
}
