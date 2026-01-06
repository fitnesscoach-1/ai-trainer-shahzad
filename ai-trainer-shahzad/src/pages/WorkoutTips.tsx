import "./WorkoutTips.css";
import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

type TipsBySection = {
  warmup: string[];
  workout: string[];
  recovery: string[];
};

export default function WorkoutTips() {
  const navigate = useNavigate();
  const chatRef = useRef<HTMLDivElement>(null);

  // =========================
  // EXISTING STATES (PRESERVED)
  // =========================
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tips, setTips] = useState(""); // preserved
  const [createdAt, setCreatedAt] = useState("");
  const [generated, setGenerated] = useState(false);

  // =========================
  // STRUCTURED STATE
  // =========================
  const [tipsBySection, setTipsBySection] =
    useState<TipsBySection | null>(null);

  const [currentSection, setCurrentSection] =
    useState<"warmup" | "workout" | "recovery">("warmup");

  // =========================
  // UI STATE (PRESERVED)
  // =========================
  const [coach, setCoach] = useState<"aria" | "atlas">("aria");

  // =========================
  // TYPING EFFECT STATE
  // =========================
  const [displayedTips, setDisplayedTips] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // =========================
  // SAVE / TOAST STATE (NEW)
  // =========================
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // =========================
  // SAFE SECTION ACCESSOR
  // =========================
  const getSectionTips = (): string[] => {
    if (!tipsBySection) return [];
    if (!tipsBySection[currentSection]) return [];
    return tipsBySection[currentSection];
  };

  // =========================
  // AUTH CHECK
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // =========================
  // GENERATE AI TIPS
  // =========================
  const handleGenerateTips = async () => {
    try {
      setLoading(true);
      setError("");
      setGenerated(false);
      setDisplayedTips([]);
      setCurrentSection("warmup");
      setSaved(false); // reset save state

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get("/workout-tips", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTipsBySection({
        warmup: res.data.warmup || [],
        workout: res.data.workout || [],
        recovery: res.data.recovery || [],
      });

      setCreatedAt(res.data.created_at);
      setGenerated(true);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Generate a workout first to unlock AI tips.");
      } else if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to generate workout tips.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REFRESH (PRESERVED)
  // =========================
  const handleRefresh = () => {
    setTipsBySection(null);
    setDisplayedTips([]);
    setIsTyping(false);
    setSaved(false);
    handleGenerateTips();
  };

  // =========================
  // SAVE TIPS (UPGRADED)
  // =========================
  const handleSaveTips = async () => {
    if (!tipsBySection || saving || saved) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      await axios.post(
        "/workout-history/save-tips",
        { tips: tipsBySection },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSaved(true);
      setToast("Workout tips saved successfully ✅");
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast("Failed to save workout tips ❌");
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // AUTO COACH SWITCH
  // =========================
  useEffect(() => {
    if (currentSection === "workout") {
      setCoach("atlas");
    } else {
      setCoach("aria");
    }
  }, [currentSection]);

  // =========================
  // SAFE SECTION TYPING
  // =========================
  useEffect(() => {
    if (!generated) return;

    const lines = getSectionTips();
    if (lines.length === 0) return;

    let lineIndex = 0;
    let charIndex = 0;
    let cancelled = false;

    setDisplayedTips([]);
    setIsTyping(true);

    const interval = setInterval(() => {
      if (cancelled) return;

      setDisplayedTips((prev) => {
        const updated = [...prev];
        if (!updated[lineIndex]) updated[lineIndex] = "";
        updated[lineIndex] += lines[lineIndex]?.[charIndex] ?? "";
        return updated;
      });

      charIndex++;

      if (charIndex >= lines[lineIndex].length) {
        charIndex = 0;
        lineIndex++;

        if (lineIndex >= lines.length) {
          clearInterval(interval);
          setIsTyping(false);

          setTimeout(() => {
            if (currentSection === "warmup" && tipsBySection?.workout?.length) {
              setCurrentSection("workout");
            } else if (
              currentSection === "workout" &&
              tipsBySection?.recovery?.length
            ) {
              setCurrentSection("recovery");
            }
          }, 600);
        }
      }
    }, 24);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [generated, currentSection, tipsBySection]);

  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [displayedTips]);

  return (
    <div className="workout-tips-page">
      {toast && <div className="toast">{toast}</div>}

      <div className="ai-panel-outer">
        <div className="ai-panel-glow"></div>

        <div className="ai-panel">
          {/* HEADER */}
          <div className="ai-panel-header">
            <div className="ai-title">
              <div className="ai-bot-icon">
                <img src="/coaches/aria.png" alt="AI" />
              </div>
              <h2>AI Trainer Shahzad Panel</h2>
            </div>

            <div className="coach-selector">
              <button
                className={coach === "aria" ? "active" : ""}
                onClick={() => setCoach("aria")}
              >
                <img src="/coaches/aria.png" alt="Aria" />
                <span>Aria</span>
              </button>

              <button
                className={coach === "atlas" ? "active" : ""}
                onClick={() => setCoach("atlas")}
              >
                <img src="/coaches/atlas.png" alt="Atlas" />
                <span>Atlas</span>
              </button>
            </div>
          </div>

          <p className="ai-panel-subtitle">
            Smart guidance based on your generated workout
          </p>

          {/* TABS */}
          <div className="ai-tabs">
            <span className={`ai-tab ${currentSection === "warmup" ? "active" : ""}`}>
              Warm-up
            </span>
            <span className={`ai-tab ${currentSection === "workout" ? "active" : ""}`}>
              Workout
            </span>
            <span className={`ai-tab ${currentSection === "recovery" ? "active" : ""}`}>
              Recovery
            </span>
          </div>

          {/* CHAT */}
          <div className="ai-chat" ref={chatRef}>
            {!generated && !loading && (
              <div className="ai-message">
                <div className="ai-avatar">
                  <img
                    src={
                      coach === "aria"
                        ? "/coaches/aria.png"
                        : "/coaches/atlas.png"
                    }
                    alt="Coach"
                  />
                </div>
                <div className="ai-message-bubble">
                  Hey! Let’s get your body ready for a great workout 🚀 I’m{" "}
                  {coach === "aria" ? "Aria" : "Atlas"}, your AI coach.
                </div>
              </div>
            )}

            {error && (
              <div className="ai-message system">
                <div className="ai-message-bubble error">{error}</div>
              </div>
            )}

            {displayedTips.map((line, idx) => (
              <div className="ai-message" key={idx}>
                <div className="ai-avatar">
                  <img
                    src={
                      coach === "aria"
                        ? "/coaches/aria.png"
                        : "/coaches/atlas.png"
                    }
                    alt="Coach"
                  />
                </div>
                <div className="ai-message-bubble">
                  {line}
                  {isTyping && idx === displayedTips.length - 1 && (
                    <span className="typing-cursor">▍</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {loading && <div className="ai-loading">🤖 AI is thinking…</div>}

          {/* ACTION BAR */}
          <div className="ai-actions three">
            <button className="ai-btn" onClick={handleGenerateTips}>
              🚀 Generate Tips
            </button>

            <button className="ai-btn icon" onClick={handleRefresh}>
              🔄
            </button>

            <button
              className="ai-btn"
              onClick={handleSaveTips}
              disabled={saving || saved}
            >
              {saved ? "Saved ✅" : saving ? "Saving..." : "💾 Save Tips"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
