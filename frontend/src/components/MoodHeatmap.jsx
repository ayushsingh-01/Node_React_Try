import { format, startOfWeek, addDays, subWeeks, isSameDay } from "date-fns";
import { FiCalendar, FiFrown, FiMeh, FiSmile } from "react-icons/fi";

const MoodHeatmap = ({ entries }) => {
  if (!entries || entries.length === 0) {
    return (
      <div className="empty-state">
        <FiCalendar className="empty-state-icon" />
        <p>No mood data yet</p>
        <p>Track your mood to see patterns!</p>
      </div>
    );
  }

  const getHeatmapData = () => {
    const weeks = [];
    const today = new Date();

    for (let i = 11; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(today, i), { weekStartsOn: 1 });
      const week = [];

      for (let j = 0; j < 7; j++) {
        const day = addDays(weekStart, j);
        const dayEntries = entries.filter((entry) =>
          isSameDay(new Date(entry.date), day)
        );

        const avgMood =
          dayEntries.length > 0
            ? dayEntries.reduce((sum, entry) => sum + entry.mood, 0) /
              dayEntries.length
            : null;

        week.push({
          date: day,
          mood: avgMood,
          count: dayEntries.length,
        });
      }

      weeks.push(week);
    }

    return weeks;
  };

  const getMoodColor = (mood) => {
    if (mood === null) return "#f5f5f5";
    if (mood >= 4.5) return "#43e97b";
    if (mood >= 3.5) return "#4facfe";
    if (mood >= 2.5) return "#ffa502";
    if (mood >= 1.5) return "#ff6b6b";
    return "#ee5a6f";
  };

  const getMoodIcon = (mood) => {
    if (mood === null) return null;
    if (mood >= 4.5) return FiSmile;
    if (mood >= 3.5) return FiSmile;
    if (mood >= 2.5) return FiMeh;
    if (mood >= 1.5) return FiFrown;
    return FiFrown;
  };

  const weeks = getHeatmapData();
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="mood-heatmap">
      <div className="heatmap-container">
        <div className="heatmap-days">
          {dayLabels.map((day) => (
            <div key={day} className="day-label">
              {day}
            </div>
          ))}
        </div>
        <div className="heatmap-grid">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="heatmap-week">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="heatmap-cell"
                  style={{ backgroundColor: getMoodColor(day.mood) }}
                  title={`${format(day.date, "MMM dd, yyyy")}\n${
                    day.mood !== null
                      ? `Mood: ${day.mood.toFixed(1)} (${day.count} ${
                          day.count === 1 ? "entry" : "entries"
                        })`
                      : "No data"
                  }`}
                >
                  {day.mood !== null &&
                    (() => {
                      const MoodIcon = getMoodIcon(day.mood);
                      return MoodIcon ? (
                        <span className="heatmap-icon">
                          <MoodIcon />
                        </span>
                      ) : null;
                    })()}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="heatmap-legend">
        <span className="legend-label">Mood Scale:</span>
        <div className="legend-items">
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#ee5a6f" }}
            ></div>
            <span>
              <FiFrown style={{ marginRight: "0.25rem" }} /> Very Sad
            </span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#ff6b6b" }}
            ></div>
            <span>
              <FiFrown style={{ marginRight: "0.25rem" }} /> Sad
            </span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#ffa502" }}
            ></div>
            <span>
              <FiMeh style={{ marginRight: "0.25rem" }} /> Okay
            </span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#4facfe" }}
            ></div>
            <span>
              <FiSmile style={{ marginRight: "0.25rem" }} /> Good
            </span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#43e97b" }}
            ></div>
            <span>
              <FiSmile style={{ marginRight: "0.25rem" }} /> Great
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodHeatmap;
