import { useMemo } from "react";
import { differenceInDays } from "date-fns";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiActivity,
  FiSmile,
  FiZap,
  FiBarChart2,
} from "react-icons/fi";

const MoodStats = ({ entries }) => {
  const stats = useMemo(() => {
    if (!entries || entries.length === 0) {
      return {
        totalEntries: 0,
        avgMood: 0,
        currentStreak: 0,
        bestMood: 0,
        moodTrend: "neutral",
      };
    }

    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const calculateStreak = () => {
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = sortedEntries.length - 1; i >= 0; i--) {
        const entryDate = new Date(sortedEntries[i].date);
        entryDate.setHours(0, 0, 0, 0);
        const daysDiff = differenceInDays(today, entryDate);

        if (daysDiff === streak) {
          streak++;
        } else if (daysDiff > streak) {
          break;
        }
      }

      return streak;
    };

    const avgMood =
      entries.reduce((sum, e) => sum + e.mood, 0) / entries.length;

    const last7Days = entries.slice(-7);
    const previous7Days = entries.slice(-14, -7);

    let moodTrend = "neutral";
    if (last7Days.length > 0 && previous7Days.length > 0) {
      const avgLast7 =
        last7Days.reduce((sum, e) => sum + e.mood, 0) / last7Days.length;
      const avgPrev7 =
        previous7Days.reduce((sum, e) => sum + e.mood, 0) /
        previous7Days.length;

      if (avgLast7 > avgPrev7 + 0.3) moodTrend = "improving";
      else if (avgLast7 < avgPrev7 - 0.3) moodTrend = "declining";
    }

    const bestMood = Math.max(...entries.map((e) => e.mood));

    return {
      totalEntries: entries.length,
      avgMood: avgMood.toFixed(1),
      currentStreak: calculateStreak(),
      bestMood,
      moodTrend,
    };
  }, [entries]);

  const getTrendIcon = (trend) => {
    if (trend === "improving") return <FiTrendingUp />;
    if (trend === "declining") return <FiTrendingDown />;
    return <FiMinus />;
  };

  const getTrendColor = (trend) => {
    if (trend === "improving") return "#43e97b";
    if (trend === "declining") return "#ff6b6b";
    return "#4facfe";
  };

  const getMoodIcon = (avg) => {
    const num = parseFloat(avg);
    if (num >= 4.5) return FiSmile;
    if (num >= 3.5) return FiSmile;
    if (num >= 2.5) return FiActivity;
    if (num >= 1.5) return FiActivity;
    return FiActivity;
  };

  const MoodIconComponent = getMoodIcon(stats.avgMood);
  const TrendIconComponent = getTrendIcon(stats.moodTrend);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon" style={{ color: "var(--primary-600)" }}>
            <FiBarChart2 />
          </div>
        </div>
        <div className="stat-value">{stats.totalEntries}</div>
        <div className="stat-label">Total Entries</div>
      </div>

      <div className="stat-card success">
        <div className="stat-header">
          <div className="stat-icon">
            <MoodIconComponent />
          </div>
        </div>
        <div className="stat-value">{stats.avgMood} / 5.0</div>
        <div className="stat-label">Average Mood</div>
      </div>

      <div className="stat-card warning">
        <div className="stat-header">
          <div className="stat-icon">
            <FiZap />
          </div>
        </div>
        <div className="stat-value">
          {stats.currentStreak} {stats.currentStreak === 1 ? "day" : "days"}
        </div>
        <div className="stat-label">Current Streak</div>
      </div>

      <div className="stat-card info">
        <div className="stat-header">
          <div className="stat-icon">{TrendIconComponent}</div>
        </div>
        <div className="stat-value" style={{ textTransform: "capitalize" }}>
          {stats.moodTrend}
        </div>
        <div className="stat-label">7-Day Trend</div>
      </div>
    </div>
  );
};

export default MoodStats;
