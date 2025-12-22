import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "../api/axiosClient";
import { 
  FiActivity, 
  FiTrendingUp, 
  FiAward, 
  FiEdit3,
  FiBarChart2,
  FiCalendar,
  FiFileText,
  FiBookOpen,
  FiMessageSquare,
  FiMessageCircle
} from "react-icons/fi";
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

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-6">
        <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Welcome back, {user?.name}!
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Track your emotional wellbeing and earn achievements
        </p>
      </div>

      {/* Stats Overview */}
      {!loading && allMoods.length > 0 && (
        <div className="mb-6">
          <MoodStats entries={allMoods} />
        </div>
      )}

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '1.5rem',
        borderBottom: '2px solid var(--gray-200)',
        overflowX: 'auto'
      }}>
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === "overview" ? '3px solid var(--primary-600)' : '3px solid transparent',
            color: activeTab === "overview" ? 'var(--primary-600)' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.875rem',
            transition: 'all 0.2s'
          }}
        >
          <FiBarChart2 /> Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === "analytics" ? '3px solid var(--primary-600)' : '3px solid transparent',
            color: activeTab === "analytics" ? 'var(--primary-600)' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.875rem',
            transition: 'all 0.2s'
          }}
        >
          <FiTrendingUp /> Analytics
        </button>
        <button
          className={`tab-btn ${activeTab === "achievements" ? "active" : ""}`}
          onClick={() => setActiveTab("achievements")}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === "achievements" ? '3px solid var(--primary-600)' : '3px solid transparent',
            color: activeTab === "achievements" ? 'var(--primary-600)' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.875rem',
            transition: 'all 0.2s'
          }}
        >
          <FiAward /> Achievements
        </button>
        <button
          className={`tab-btn ${activeTab === "track" ? "active" : ""}`}
          onClick={() => setActiveTab("track")}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === "track" ? '3px solid var(--primary-600)' : '3px solid transparent',
            color: activeTab === "track" ? 'var(--primary-600)' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.875rem',
            transition: 'all 0.2s'
          }}
        >
          <FiEdit3 /> Track Mood
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1" style={{ gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <FiTrendingUp /> 30-Day Mood Trend
              </h3>
              <p className="card-subtitle">
                Your mood patterns over the last month
              </p>
            </div>
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <MoodTrendChart entries={allMoods} />
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <FiActivity /> Quick Actions
              </h3>
            </div>
            <div className="grid grid-cols-2 grid-cols-4" style={{ gap: '1rem' }}>
              <Link 
                to="/mood" 
                className="card"
                style={{
                  textAlign: 'center',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  transition: 'all 0.2s'
                }}
              >
                <FiFileText style={{ fontSize: '2rem', color: 'var(--primary-600)', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Full History</div>
              </Link>
              <Link 
                to="/resources" 
                className="card"
                style={{
                  textAlign: 'center',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  transition: 'all 0.2s'
                }}
              >
                <FiBookOpen style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Resources</div>
              </Link>
              <Link 
                to="/support" 
                className="card"
                style={{
                  textAlign: 'center',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  transition: 'all 0.2s'
                }}
              >
                <FiMessageSquare style={{ fontSize: '2rem', color: 'var(--warning)', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Get Support</div>
              </Link>
              <Link 
                to="/ai-chat" 
                className="card"
                style={{
                  textAlign: 'center',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  transition: 'all 0.2s'
                }}
              >
                <FiMessageCircle style={{ fontSize: '2rem', color: 'var(--secondary-600)', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>AI Chat</div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="grid grid-cols-1" style={{ gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <FiCalendar /> Mood Heatmap
              </h3>
              <p className="card-subtitle">12-week mood calendar view</p>
            </div>
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <MoodHeatmap entries={allMoods} />
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <FiBarChart2 /> Detailed Trends
              </h3>
              <p className="card-subtitle">Track your emotional journey</p>
            </div>
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <MoodTrendChart entries={allMoods} />
            )}
          </div>
        </div>
      )}

      {activeTab === "achievements" && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FiAward /> Your Achievements
            </h3>
            <p className="card-subtitle">
              Earn badges by tracking your mood consistently
            </p>
          </div>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <AchievementBadges entries={allMoods} />
          )}
        </div>
      )}

      {activeTab === "track" && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FiEdit3 /> How are you feeling today?
            </h3>
            <p className="card-subtitle">
              Take a moment to check in with yourself
            </p>
          </div>
          <MoodForm onMoodSubmit={refreshMoods} />
        </div>
      )}
    </>
  );
};

export default DashboardPage;
