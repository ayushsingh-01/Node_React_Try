import { useMemo } from "react";
import { differenceInDays, parseISO } from "date-fns";
import {
  FiTarget,
  FiZap,
  FiStar,
  FiAward,
  FiSun,
  FiEdit,
  FiHeart,
  FiLock,
  FiCheckCircle,
} from "react-icons/fi";

const AchievementBadges = ({ entries }) => {
  const achievements = useMemo(() => {
    if (!entries || entries.length === 0) return [];

    const badges = [];
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

    const currentStreak = calculateStreak();
    const totalEntries = entries.length;
    const avgMood = entries.reduce((sum, e) => sum + e.mood, 0) / totalEntries;
    const highMoodCount = entries.filter((e) => e.mood >= 4).length;
    const hasNotes = entries.filter(
      (e) => e.note && e.note.trim().length > 0
    ).length;

    const allBadges = [
      {
        id: "first-step",
        name: "First Step",
        icon: FiTarget,
        description: "Logged your first mood entry",
        earned: totalEntries >= 1,
        progress: totalEntries >= 1 ? 100 : 0,
        category: "milestone",
      },
      {
        id: "week-warrior",
        name: "7-Day Streak",
        icon: FiZap,
        description: "Tracked mood for 7 days straight",
        earned: currentStreak >= 7,
        progress: Math.min((currentStreak / 7) * 100, 100),
        category: "streak",
      },
      {
        id: "dedicated",
        name: "Dedicated",
        icon: FiStar,
        description: "30-day tracking streak",
        earned: currentStreak >= 30,
        progress: Math.min((currentStreak / 30) * 100, 100),
        category: "streak",
      },
      {
        id: "consistent",
        name: "Consistency Champion",
        icon: FiAward,
        description: "50 total mood entries",
        earned: totalEntries >= 50,
        progress: Math.min((totalEntries / 50) * 100, 100),
        category: "milestone",
      },
      {
        id: "mood-master",
        name: "Mood Master",
        icon: FiAward,
        description: "100 total mood entries",
        earned: totalEntries >= 100,
        progress: Math.min((totalEntries / 100) * 100, 100),
        category: "milestone",
      },
      {
        id: "positive-vibes",
        name: "Positive Vibes",
        icon: FiSun,
        description: "20 entries with mood ≥ 4",
        earned: highMoodCount >= 20,
        progress: Math.min((highMoodCount / 20) * 100, 100),
        category: "mood",
      },
      {
        id: "thoughtful",
        name: "Thoughtful",
        icon: FiEdit,
        description: "Added notes to 10 entries",
        earned: hasNotes >= 10,
        progress: Math.min((hasNotes / 10) * 100, 100),
        category: "engagement",
      },
      {
        id: "self-aware",
        name: "Self-Aware",
        icon: FiHeart,
        description: "Maintained average mood above 3.5",
        earned: avgMood >= 3.5,
        progress: Math.min((avgMood / 3.5) * 100, 100),
        category: "wellbeing",
      },
    ];

    return allBadges;
  }, [entries]);

  const earnedBadges = achievements.filter((a) => a.earned);
  const inProgressBadges = achievements.filter(
    (a) => !a.earned && a.progress > 0
  );
  const lockedBadges = achievements.filter(
    (a) => !a.earned && a.progress === 0
  );

  const getCategoryColor = (category) => {
    const colors = {
      streak: "#ff6b6b",
      milestone: "#4facfe",
      mood: "#43e97b",
      engagement: "#f093fb",
      wellbeing: "#ffa502",
    };
    return colors[category] || "#9e9e9e";
  };

  return (
    <div className="achievement-badges">
      {earnedBadges.length > 0 && (
        <div className="badge-section">
          <h3 className="badge-section-title">
            <FiAward style={{ marginRight: "0.5rem" }} /> Earned Badges (
            {earnedBadges.length})
          </h3>
          <div className="badge-grid">
            {earnedBadges.map((badge) => {
              const BadgeIcon = badge.icon;
              return (
                <div key={badge.id} className="badge-card earned">
                  <div
                    className="badge-icon"
                    style={{ borderColor: getCategoryColor(badge.category) }}
                  >
                    <BadgeIcon className="badge-icon-svg" />
                  </div>
                  <div className="badge-info">
                    <h4 className="badge-name">{badge.name}</h4>
                    <p className="badge-description">{badge.description}</p>
                  </div>
                  <div className="badge-earned-indicator">
                    <FiCheckCircle />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {inProgressBadges.length > 0 && (
        <div className="badge-section">
          <h3 className="badge-section-title">
            <FiTarget style={{ marginRight: "0.5rem" }} /> In Progress (
            {inProgressBadges.length})
          </h3>
          <div className="badge-grid">
            {inProgressBadges.map((badge) => {
              const BadgeIcon = badge.icon;
              return (
                <div key={badge.id} className="badge-card in-progress">
                  <div
                    className="badge-icon"
                    style={{ borderColor: getCategoryColor(badge.category) }}
                  >
                    <BadgeIcon className="badge-icon-svg" />
                  </div>
                  <div className="badge-info">
                    <h4 className="badge-name">{badge.name}</h4>
                    <p className="badge-description">{badge.description}</p>
                    <div className="badge-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${badge.progress}%`,
                            backgroundColor: getCategoryColor(badge.category),
                          }}
                        ></div>
                      </div>
                      <span className="progress-text">
                        {Math.round(badge.progress)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {lockedBadges.length > 0 && (
        <div className="badge-section">
          <h3 className="badge-section-title">
            <FiLock style={{ marginRight: "0.5rem" }} /> Locked (
            {lockedBadges.length})
          </h3>
          <div className="badge-grid">
            {lockedBadges.map((badge) => (
              <div key={badge.id} className="badge-card locked">
                <div className="badge-icon">
                  <FiLock className="badge-icon-svg locked-icon" />
                </div>
                <div className="badge-info">
                  <h4 className="badge-name">{badge.name}</h4>
                  <p className="badge-description">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {earnedBadges.length === 0 && inProgressBadges.length === 0 && (
        <div className="empty-state">
          <FiAward className="empty-state-icon" />
          <p>Start tracking your mood to earn badges!</p>
        </div>
      )}
    </div>
  );
};

export default AchievementBadges;
