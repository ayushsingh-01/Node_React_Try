import { useState } from "react";
import axios from "../api/axiosClient";
import { FiFrown, FiMeh, FiSmile, FiCheckCircle, FiSave } from "react-icons/fi";

const MoodForm = ({ onMoodSubmit }) => {
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const moodOptions = [
    { value: 1, icon: FiFrown, label: "Very Sad", color: "#ff6b6b" },
    { value: 2, icon: FiFrown, label: "Sad", color: "#ffa502" },
    { value: 3, icon: FiMeh, label: "Okay", color: "#4facfe" },
    { value: 4, icon: FiSmile, label: "Good", color: "#43e97b" },
    { value: 5, icon: FiSmile, label: "Great", color: "#f093fb" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await axios.post("/mood", { mood: Number(mood), note });
      setNote("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      if (onMoodSubmit) onMoodSubmit();
    } catch (err) {
      console.error("Failed to save mood entry", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mood-form">
      {success && (
        <div className="alert alert-success">
          <FiCheckCircle /> Mood entry saved successfully!
        </div>
      )}

      <div className="mood-selector">
        <label>
          How are you feeling today?
          <div className="mood-options">
            {moodOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <label key={option.value} className="mood-option">
                  <input
                    type="radio"
                    name="mood"
                    value={option.value}
                    checked={Number(mood) === option.value}
                    onChange={() => setMood(option.value)}
                  />
                  <span className="mood-label">
                    <span className="mood-emoji" style={{ fontSize: "2rem" }}>
                      <IconComponent />
                    </span>
                    <span className="mood-text">{option.label}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="note" className="form-label">
          How are you feeling? (optional)
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Share your thoughts, what's on your mind, or what made you feel this way..."
          rows="4"
          className="form-textarea"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-large"
        disabled={loading}
      >
        <FiSave /> {loading ? "Saving..." : "Save Mood Entry"}
      </button>
    </form>
  );
};

export default MoodForm;
