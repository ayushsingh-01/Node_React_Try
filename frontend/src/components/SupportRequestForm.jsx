import { useState } from "react";
import axios from "../api/axiosClient";

const SupportRequestForm = ({ onRequestSubmit }) => {
  const [formData, setFormData] = useState({
    topic: "",
    preferredMode: "email",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await axios.post("/support", formData);
      setSuccess(true);
      setFormData({
        topic: "",
        preferredMode: "email",
        description: "",
      });

      if (onRequestSubmit) {
        onRequestSubmit();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="support-form">
      {success && (
        <div className="alert alert-success">
          Your support request has been submitted successfully!
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="topic" className="form-label">
          Topic
        </label>
        <select
          id="topic"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="">Select a topic</option>
          <option value="Exam stress">Exam stress</option>
          <option value="Relationship">Relationship</option>
          <option value="Family">Family</option>
          <option value="Anxiety">Anxiety</option>
          <option value="Depression">Depression</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="preferredMode" className="form-label">
          Preferred Mode of Contact
        </label>
        <select
          id="preferredMode"
          name="preferredMode"
          value={formData.preferredMode}
          onChange={handleChange}
          className="form-select"
        >
          <option value="email">Email</option>
          <option value="call">Call</option>
          <option value="in_person">In-person</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Please describe your situation in detail..."
          className="form-textarea"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
};

export default SupportRequestForm;
