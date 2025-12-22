import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "../api/axiosClient";
import { FiActivity, FiPlusCircle, FiClock } from "react-icons/fi";
import MoodForm from "../components/MoodForm";
import MoodList from "../components/MoodList";

const MoodPage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = async () => {
    try {
      const response = await axios.get("/mood");
      setEntries(response.data);
    } catch (err) {
      console.error("Failed to fetch mood entries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="alert alert-warning">
        Please log in to track your mood.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1" style={{ gap: "1.5rem" }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FiPlusCircle /> Add New Entry
            </h3>
            <p className="card-subtitle">Track how you're feeling today</p>
          </div>
          <MoodForm onMoodSubmit={loadEntries} />
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FiClock /> Your Mood History
            </h3>
            <p className="card-subtitle">{entries.length} total entries</p>
          </div>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : entries.length > 0 ? (
            <MoodList entries={entries} showAll={true} />
          ) : (
            <div
              className="text-center"
              style={{ padding: "2rem", color: "var(--text-secondary)" }}
            >
              <FiActivity
                style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}
              />
              <p>No mood entries yet. Add your first entry above!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MoodPage;
