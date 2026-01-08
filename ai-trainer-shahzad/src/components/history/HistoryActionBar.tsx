import "./HistoryActionBar.css";

/* ===============================
   PROPS (UPGRADED – BACKWARD SAFE)
================================ */

interface Props {
  selectedCount: number;

  onSelectAll?: () => void;
  onClear?: () => void;
  onDelete?: () => void;

  /* 🔑 NEW (optional, safe) */
  loading?: boolean;
}

/* ===============================
   COMPONENT
================================ */

export default function HistoryActionBar({
  selectedCount,
  onSelectAll,
  onClear,
  onDelete,
  loading = false,
}: Props) {
  // ✅ Float only when something is selected
  if (selectedCount === 0) return null;

  return (
    <div className="history-action-bar">
      {/* ===============================
         LEFT — SELECTION INFO
      ============================== */}
      <div className="hab-info">
        <span className="hab-count">{selectedCount}</span>
        <span className="hab-text">
          {selectedCount === 1 ? "Item Selected" : "Items Selected"}
        </span>
      </div>

      {/* ===============================
         RIGHT — ACTION BUTTONS
      ============================== */}
      <div className="hab-actions">
        <button
          className="hab-btn ghost"
          onClick={onSelectAll}
          disabled={loading}
        >
          Select All
        </button>

        <button
          className="hab-btn ghost"
          onClick={onClear}
          disabled={loading}
        >
          Clear
        </button>

        <button
          className="hab-btn danger"
          onClick={onDelete}
          disabled={loading}
        >
          {loading ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
