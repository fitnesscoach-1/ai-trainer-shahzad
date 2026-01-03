import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./Home.css";

const Home = () => {
  /* ================= AUDIO REFS ================= */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedRef = useRef(false);

  const [muted, setMuted] = useState(true);

  /* ================= INIT AUDIO ================= */
  useEffect(() => {
    audioRef.current = new Audio("/assets/audio/background.mp3");
    audioRef.current.volume = 0;      // start silent (fade-in)
    audioRef.current.loop = false;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  /* ================= FADE IN ================= */
  const fadeIn = () => {
    if (!audioRef.current) return;

    let volume = 0;
    audioRef.current.volume = 0;

    const interval = setInterval(() => {
      volume += 0.05;
      if (audioRef.current) {
        audioRef.current.volume = Math.min(volume, 0.7);
      }
      if (volume >= 0.7) clearInterval(interval);
    }, 50);
  };

  /* ================= FADE OUT ================= */
  const fadeOut = () => {
    if (!audioRef.current) return;

    let volume = audioRef.current.volume;

    const interval = setInterval(() => {
      volume -= 0.05;
      if (audioRef.current) {
        audioRef.current.volume = Math.max(volume, 0);
      }
      if (volume <= 0) {
        audioRef.current?.pause();
        clearInterval(interval);
      }
    }, 50);
  };

  /* ================= PLAY ON FIRST INTERACTION ================= */
  const handleFirstInteraction = () => {
    if (!audioRef.current || hasPlayedRef.current || muted) return;

    hasPlayedRef.current = true;
    audioRef.current.play().catch(() => {});
    fadeIn();

    // Remove listener after first play
    window.removeEventListener("click", handleFirstInteraction);
  };

  useEffect(() => {
    window.addEventListener("click", handleFirstInteraction);
    return () => window.removeEventListener("click", handleFirstInteraction);
  }, [muted]);

  /* ================= TOGGLE MUTE ================= */
  const toggleMute = () => {
    if (!audioRef.current) return;

    if (muted) {
      setMuted(false);
      if (!hasPlayedRef.current) {
        hasPlayedRef.current = true;
        audioRef.current.play().catch(() => {});
      }
      fadeIn();
    } else {
      setMuted(true);
      fadeOut();
    }
  };

  return (
    <div className="home-hero-bg">
      <div className="home-hero-content">
        {/* ================= HEADER ================= */}
        <header className="home-header">
          <h1>Welcome to Ai-Trainer-Shahzad 👋</h1>
          <p>Your fitness journey starts here</p>
        </header>

        {/* ================= SOUND TOGGLE ================= */}
        <button
          onClick={toggleMute}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 999,
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.4)",
            borderRadius: "50px",
            padding: "10px 16px",
            cursor: "pointer",
            backdropFilter: "blur(8px)"
          }}
        >
          {muted ? "🔇 Sound Off" : "🔊 Sound On"}
        </button>

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
