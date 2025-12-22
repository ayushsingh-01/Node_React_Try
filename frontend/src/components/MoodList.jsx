import {
  FiFrown,
  FiMeh,
  FiSmile,
  FiMessageCircle,
  FiTrendingUp,
} from "react-icons/fi";

const MoodList = ({ entries, showAll = false }) => {
  if (!entries || entries.length === 0) {
    return (
      <div className="text-center" style={{ padding: "3rem" }}>
        <FiTrendingUp
          style={{
            fontSize: "3rem",
            color: "var(--text-tertiary)",
            marginBottom: "1rem",
          }}
        />
        <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
          No mood entries recorded yet.
        </p>
        <p style={{ color: "var(--text-tertiary)", fontSize: "0.875rem" }}>
          Start tracking your emotional wellbeing today!
        </p>
      </div>
    );
  }

  const displayEntries = showAll ? entries : entries.slice(0, 5);

  const getMoodData = (mood) => {
    const moodMap = {
      1: { icon: FiFrown, label: "Very Sad", color: "#ff6b6b" },
      2: { icon: FiFrown, label: "Sad", color: "#ffa502" },
      3: { icon: FiMeh, label: "Okay", color: "#4facfe" },
      4: { icon: FiSmile, label: "Good", color: "#43e97b" },
      5: { icon: FiSmile, label: "Great", color: "#f093fb" },
    };
    return moodMap[mood] || { icon: FiMeh, label: "Unknown", color: "#gray" };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="mood-list">
      {displayEntries.map((entry) => {
        const moodData = getMoodData(entry.mood);
        const MoodIcon = moodData.icon;
        return (
          <div key={entry._id} className="mood-entry">
            <div className="mood-header">
              <span
                className={`mood-badge mood-${entry.mood}`}
                style={{
                  backgroundColor: moodData.color + "20",
                  color: moodData.color,
                  border: `2px solid ${moodData.color}`,
                }}
              >
                <MoodIcon style={{ fontSize: "1.2rem" }} />
                {moodData.label}
              </span>
              <span className="mood-date">{formatDate(entry.date)}</span>
            </div>
            {entry.note && (
              <p className="mood-note">
                <FiMessageCircle style={{ marginRight: "0.5rem" }} />
                {entry.note}
              </p>
            )}
          </div>
        );
      })}
      {!showAll && entries.length > 5 && (
        <p className="more-entries">
          <FiTrendingUp style={{ marginRight: "0.25rem" }} />
          {entries.length - 5} more{" "}
          {entries.length - 5 === 1 ? "entry" : "entries"} available
        </p>
      )}
    </div>
  );
};

export default MoodList;
