import "./HistoryTabs.css";

interface HistoryTabsProps {
  activeTab: "workout" | "coaching";
  onChange: (tab: "workout" | "coaching") => void;
}

export default function HistoryTabs({
  activeTab,
  onChange,
}: HistoryTabsProps) {
  return (
    <div className="history-tabs">
      <button
        className={`history-tab ${
          activeTab === "workout" ? "active" : ""
        }`}
        onClick={() => onChange("workout")}
      >
        <img
          src="/coaches/aria.png"
          alt="Aria"
          className="tab-avatar"
        />
        Workout Memory
      </button>

      <button
        className={`history-tab ${
          activeTab === "coaching" ? "active" : ""
        }`}
        onClick={() => onChange("coaching")}
      >
        <img
          src="/coaches/atlas.png"
          alt="Atlas"
          className="tab-avatar"
        />
        Coaching Intelligence
      </button>
    </div>
  );
}
