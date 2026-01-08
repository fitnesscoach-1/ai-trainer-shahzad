import { useEffect, useState } from "react";
import "./CoachingMemory.css";
import api from "../../api/axios";

/* ===============================
   PROPS (REQUIRED – PRESERVED)
================================ */
interface CoachingMemoryProps {
  refreshKey?: number;
}

/* ===============================
   TYPES (UPGRADED – SAFE)
================================ */
interface CoachingInsight {
  id: number;
  date: string;
  coach: "Aria" | "Atlas";
  title: string;

  warmup: string[];
  workout: string[];
  recovery: string[];
}

/* ===============================
   MOCK DATA (PRESERVED – FALLBACK)
================================ */
const MOCK_DATA: CoachingInsight[] = [
  {
    id: 1,
    date: "Today",
    coach: "Aria",
    title: "Warm-up Optimization",
    warmup: [
      "Increase shoulder mobility before pressing",
      "Add light band activation sets",
    ],
    workout: ["Maintain controlled tempo on compound lifts"],
    recovery: ["Keep rest intervals under 45s"],
  },
  {
    id: 2,
    date: "Jan 5, 2026",
    coach: "Atlas",
    title: "Recovery & Volume Control",
    warmup: ["Perform dynamic stretches post warm-up"],
    workout: ["Reduce triceps volume next session"],
    recovery: [
      "Prioritize sleep & hydration",
      "Add 5–10 min cooldown stretch",
    ],
  },
];

/* ===============================
   COMPONENT
================================ */
export default function CoachingMemory({
  refreshKey,
}: CoachingMemoryProps) {
  const [insights, setInsights] =
    useState<CoachingInsight[]>(MOCK_DATA);

  const [loading, setLoading] = useState(false);

  /* ===============================
     FETCH SAVED INSIGHTS
     (AUTO-REFRESH ENABLED)
  ============================== */
  useEffect(() => {
    const fetchInsightHistory = async () => {
      setLoading(true);

      try {
        const res = await api.get("/workout-tips/history");

        const mapped: CoachingInsight[] = res.data.map(
          (t: any) => ({
            id: t.id,
            date: formatDate(t.created_at),
            coach: t.tips?.recovery?.length ? "Atlas" : "Aria",
            title: t.tips?.title || "AI Training Insight",
            warmup: t.tips?.warmup || [],
            workout: t.tips?.workout || [],
            recovery: t.tips?.recovery || [],
          })
        );

        setInsights(mapped.length ? mapped : MOCK_DATA);
      } catch {
        setInsights(MOCK_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchInsightHistory();
  }, [refreshKey]); // ✅ underline-safe dependency

  /* ===============================
     GROUP BY DATE (PRESERVED)
  ============================== */
  const grouped = insights.reduce<
    Record<string, CoachingInsight[]>
  >((acc, item) => {
    acc[item.date] = acc[item.date] || [];
    acc[item.date].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="cm-loading">
        Analyzing your training history…
      </div>
    );
  }

  /* ===============================
     RENDER — AI INSIGHT TIMELINE
  ============================== */
  return (
    <section className="coaching-memory">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date} className="cm-group">
          {/* DATE HEADER */}
          <div className="cm-date-header">
            <span className="cm-date-dot" />
            {date}
          </div>

          {/* INSIGHT CARDS */}
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`coaching-card ${
                item.coach === "Atlas" ? "atlas" : "aria"
              }`}
              style={
                {
                  "--delay": `${index * 80}ms`,
                } as React.CSSProperties
              }
            >
              {/* AVATAR */}
              <div className="coaching-avatar">
                <img
                  src={
                    item.coach === "Aria"
                      ? "/coaches/aria.png"
                      : "/coaches/atlas.png"
                  }
                  alt={item.coach}
                />
              </div>

              {/* CONTENT */}
              <div className="coaching-content">
                <div className="coaching-meta">
                  <span className="coaching-badge">
                    {item.coach} AI
                  </span>
                </div>

                <h3 className="coaching-title">
                  {item.title}
                </h3>

                {item.warmup.length > 0 && (
                  <InsightSection
                    label="Warm-up"
                    items={item.warmup}
                  />
                )}

                {item.workout.length > 0 && (
                  <InsightSection
                    label="Workout"
                    items={item.workout}
                  />
                )}

                {item.recovery.length > 0 && (
                  <InsightSection
                    label="Recovery"
                    items={item.recovery}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

/* ===============================
   SUB-COMPONENT (SAFE)
================================ */
function InsightSection({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  return (
    <div className="cm-section">
      <h4>{label}</h4>
      <ul>
        {items.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

/* ===============================
   HELPERS (PRESERVED)
================================ */
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();

  if (d.toDateString() === today.toDateString()) {
    return "Today";
  }

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
