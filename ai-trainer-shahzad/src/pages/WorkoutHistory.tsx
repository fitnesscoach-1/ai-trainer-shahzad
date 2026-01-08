import { useState, useCallback } from "react";

import HistoryHeader from "../components/history/HistoryHeader";
import HistoryTabs from "../components/history/HistoryTabs";
import WorkoutMemory from "../components/history/WorkoutMemory";
import CoachingMemory from "../components/history/CoachingMemory";

import "./WorkoutHistory.css";

/* ===============================
   TYPES (EXPLICIT & SAFE)
================================ */
type HistoryTab = "workout" | "coaching";

export default function WorkoutHistory() {
  /* ===============================
     EXISTING STATE (PRESERVED)
  =============================== */
  const [activeTab, setActiveTab] =
    useState<HistoryTab>("workout");

  const [coachingRefreshKey, setCoachingRefreshKey] =
    useState<number>(0);

  /* ===============================
     SELECTED WORKOUT STATE
     (Already correct – just clarified)
  =============================== */
  const [selectedWorkoutId, setSelectedWorkoutId] =
    useState<string | null>(null);

  /* ===============================
     HANDLERS (MEMOIZED – SAFE)
  =============================== */
  const handleTabChange = useCallback(
    (tab: HistoryTab) => {
      setActiveTab(tab);

      // Reset workout selection when leaving workout tab
      if (tab !== "workout") {
        setSelectedWorkoutId(null);
      }
    },
    []
  );

  const handleTipsSaved = useCallback(() => {
    // Force refresh coaching memory when workout tips are saved
    setCoachingRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="history-page">
      {/* HEADER */}
      <HistoryHeader />

      {/* STICKY TABS */}
      <div className="history-sticky-bar">
        <div className="history-tabs-row">
          <HistoryTabs
            activeTab={activeTab}
            onChange={handleTabChange}
          />
        </div>
      </div>

      {/* ===============================
          WORKOUT HISTORY
      =============================== */}
      {activeTab === "workout" && (
        <WorkoutMemory
          selectedWorkoutId={selectedWorkoutId}
          onSelectWorkout={setSelectedWorkoutId}
          onTipsSaved={handleTipsSaved}
        />
      )}

      {/* ===============================
          COACHING HISTORY
      =============================== */}
      {activeTab === "coaching" && (
        <CoachingMemory refreshKey={coachingRefreshKey} />
      )}
    </div>
  );
}
