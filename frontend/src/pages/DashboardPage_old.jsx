import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "../api/axiosClient";
import MoodForm from "../components/MoodForm";
import MoodTrendChart from "../components/MoodTrendChart";
import MoodHeatmap from "../components/MoodHeatmap";
import AchievementBadges from "../components/AchievementBadges";
import MoodStats from "../components/MoodStats";

const DashboardPage = () => {
  const { user } = useAuth();
  const [allMoods, setAllMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await axios.get("/mood");
        setAllMoods(response.data);
      } catch (err) {
        console.error("Failed to fetch mood entries", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMoods();
    }
  }, [user]);

  const refreshMoods = async () => {
    try {
      const response = await axios.get("/mood");
      setAllMoods(response.data);
    } catch (err) {
      console.error("Failed to refresh mood entries", err);
    }
  };

  if (!user) {
    return (
      <div className="loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome back, {user.name}! 👋</h1>
          <p>Track your emotional wellbeing and earn achievements</p>
        </div>
      </div>

      {}
      {!loading && allMoods.length > 0 && <MoodStats entries={allMoods} />}

      {}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          📈 Analytics
        </button>
        <button
          className={`tab-btn ${activeTab === "achievements" ? "active" : ""}`}
          onClick={() => setActiveTab("achievements")}
        >
          🏆 Achievements
        </button>
        <button
          className={`tab-btn ${activeTab === "track" ? "active" : ""}`}
          onClick={() => setActiveTab("track")}
        >
          ✍️ Track Mood
        </button>
      </div>

      {}
      <div className="dashboard-tab-content">
        {activeTab === "overview" && (
          <div className="overview-section">
            <div className="dashboard-grid">
              <div className="card chart-card">
                <div className="card-header">
                  <h2>📈 30-Day Mood Trend</h2>
                  <p className="card-subtitle">
                    Your mood patterns over the last month
                  </p>
                </div>
                {loading ? (
                  <div className="loading">Loading chart...</div>
                ) : (
                  <MoodTrendChart entries={allMoods} />
                )}
              </div>

              <div className="card quick-actions-card">
                <div className="card-header">
                  <h2>⚡ Quick Actions</h2>
                </div>
                <div className="action-buttons-grid">
                  <Link to="/mood" className="action-card">
                    <span className="action-icon">📝</span>
                    <span className="action-label">Full History</span>
                  </Link>
                  <Link to="/resources" className="action-card">
                    <span className="action-icon">📚</span>
                    <span className="action-label">Resources</span>
                  </Link>
                  <Link to="/support" className="action-card">
                    <span className="action-icon">💬</span>
                    <span className="action-label">Get Support</span>
                  </Link>
                  <Link to="/ai-chat" className="action-card">
                    <span className="action-icon">🤖</span>
                    <span className="action-label">AI Chat</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="analytics-section">
            <div className="card">
              <div className="card-header">
                <h2>🗓️ Mood Heatmap</h2>
                <p className="card-subtitle">12-week mood calendar view</p>
              </div>
              {loading ? (
                <div className="loading">Loading heatmap...</div>
              ) : (
                <MoodHeatmap entries={allMoods} />
              )}
            </div>

            <div className="card chart-card">
              <div className="card-header">
                <h2>📊 Detailed Trends</h2>
                <p className="card-subtitle">Track your emotional journey</p>
              </div>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : (
                <MoodTrendChart entries={allMoods} />
              )}
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="achievements-section">
            <div className="card">
              <div className="card-header">
                <h2>🏆 Your Achievements</h2>
                <p className="card-subtitle">
                  Earn badges by tracking your mood consistently
                </p>
              </div>
              {loading ? (
                <div className="loading">Loading achievements...</div>
              ) : (
                <AchievementBadges entries={allMoods} />
              )}
            </div>
          </div>
        )}

        {activeTab === "track" && (
          <div className="track-section">
            <div className="card mood-entry-card">
              <div className="card-header">
                <h2>✍️ How are you feeling today?</h2>
                <p className="card-subtitle">
                  Take a moment to check in with yourself
                </p>
              </div>
              <MoodForm onMoodSubmit={refreshMoods} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
