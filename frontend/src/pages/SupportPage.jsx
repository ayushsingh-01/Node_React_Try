import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "../api/axiosClient";
import {
  FiMessageSquare,
  FiSend,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import SupportRequestForm from "../components/SupportRequestForm";

const SupportPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("/support/my");
      setRequests(response.data);
    } catch (err) {
      console.error("Failed to fetch support requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const handleRequestSubmit = () => {
    fetchRequests();
  };

  if (!user) {
    return (
      <div className="alert alert-warning">
        Please log in to access support.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1" style={{ gap: "1.5rem" }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FiSend /> Submit a Support Request
            </h3>
          </div>
          <SupportRequestForm onRequestSubmit={handleRequestSubmit} />
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FiMessageSquare /> Your Support Requests
            </h3>
            <p className="card-subtitle">{requests.length} total requests</p>
          </div>
          {loading ? (
            <div className="text-center" style={{ padding: "2rem" }}>
              <div
                className="loading-spinner"
                style={{ margin: "0 auto" }}
              ></div>
            </div>
          ) : requests.length > 0 ? (
            <div className="support-requests">
              {requests.map((request) => (
                <div key={request._id} className="support-request-item">
                  <div className="support-request-header">
                    <div>
                      <h3 className="support-request-title">{request.topic}</h3>
                      <div className="support-request-meta">
                        <span
                          className={`badge badge-${
                            request.status === "resolved"
                              ? "success"
                              : request.status === "in_progress"
                              ? "warning"
                              : "info"
                          }`}
                        >
                          {request.status === "in_progress" && (
                            <FiClock style={{ marginRight: "0.25rem" }} />
                          )}
                          {request.status === "resolved" && (
                            <FiCheckCircle style={{ marginRight: "0.25rem" }} />
                          )}
                          {request.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="support-request-description">
                    {request.description}
                  </p>
                  {request.counselorNote && (
                    <div className="support-request-response">
                      <strong>Counselor Response:</strong>
                      <p>{request.counselorNote}</p>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      fontSize: "0.75rem",
                      color: "var(--text-tertiary)",
                      marginTop: "1rem",
                    }}
                  >
                    <span>Preferred Mode: {request.preferredMode}</span>
                    <span>
                      Submitted:{" "}
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-center"
              style={{ padding: "2rem", color: "var(--text-secondary)" }}
            >
              <FiMessageSquare
                style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}
              />
              <p>You haven't submitted any support requests yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SupportPage;
