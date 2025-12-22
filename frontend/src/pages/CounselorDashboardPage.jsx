import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "../api/axiosClient";
import {
  FiUsers,
  FiBookOpen,
  FiFilter,
  FiTrash2,
  FiEdit,
} from "react-icons/fi";
import ResourceForm from "../components/ResourceForm";

const CounselorDashboardPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [resources, setResources] = useState([]);
  const [filterStatus, setFilterStatus] = useState("open");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`/support?status=${filterStatus}`);
      setRequests(response.data);
    } catch (err) {
      console.error("Failed to fetch support requests", err);
    }
  };

  const fetchResources = async () => {
    try {
      const response = await axios.get("/resources");
      setResources(response.data);
    } catch (err) {
      console.error("Failed to fetch resources", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRequests();
      fetchResources();
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [filterStatus, user]);

  const handleStatusChange = async (requestId, newStatus, counselorNote) => {
    try {
      const response = await axios.put(`/support/${requestId}`, {
        status: newStatus,
        counselorNote,
      });

      setRequests(
        requests.map((req) => (req._id === requestId ? response.data : req))
      );
    } catch (err) {
      console.error("Failed to update request status", err);
    }
  };

  const handleResourceSubmit = () => {
    fetchResources();
  };

  const handleResourceDelete = async (resourceId) => {
    try {
      await axios.delete(`/resources/${resourceId}`);
      setResources(resources.filter((resource) => resource._id !== resourceId));
    } catch (err) {
      console.error("Failed to delete resource", err);
    }
  };

  if (!user) {
    return <div>Please log in as a counselor.</div>;
  }

  if (user.role !== "counselor") {
    return <div>Access denied. This page is for counselors only.</div>;
  }

  return (
    <>
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          borderBottom: "2px solid var(--gray-200)",
          overflowX: "auto",
        }}
      >
        <button
          onClick={() => setActiveTab("requests")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            background: "none",
            border: "none",
            borderBottom:
              activeTab === "requests"
                ? "3px solid var(--primary-600)"
                : "3px solid transparent",
            color:
              activeTab === "requests"
                ? "var(--primary-600)"
                : "var(--text-secondary)",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.875rem",
            transition: "all 0.2s",
          }}
        >
          <FiUsers /> Support Requests
        </button>
        <button
          onClick={() => setActiveTab("resources")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            background: "none",
            border: "none",
            borderBottom:
              activeTab === "resources"
                ? "3px solid var(--primary-600)"
                : "3px solid transparent",
            color:
              activeTab === "resources"
                ? "var(--primary-600)"
                : "var(--text-secondary)",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.875rem",
            transition: "all 0.2s",
          }}
        >
          <FiBookOpen /> Manage Resources
        </button>
      </div>

      {activeTab === "requests" ? (
        <div className="grid grid-cols-1" style={{ gap: "1.5rem" }}>
          <div className="card" style={{ padding: "1rem" }}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <FiFilter />
              <label style={{ fontWeight: "600", marginRight: "1rem" }}>
                Filter by status:
              </label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ maxWidth: "200px" }}
              >
                <option value="">All</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <FiUsers /> Support Requests
              </h3>
              <p className="card-subtitle">{requests.length} requests</p>
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
                        <h3 className="support-request-title">
                          {request.topic}
                        </h3>
                        <p className="support-request-meta">
                          <strong>Student:</strong> {request.student.name} (
                          {request.student.email})
                        </p>
                      </div>
                      <span
                        className={`badge badge-${
                          request.status === "closed"
                            ? "success"
                            : request.status === "in_progress"
                            ? "warning"
                            : "info"
                        }`}
                      >
                        {request.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="support-request-description">
                      <strong>Description:</strong> {request.description}
                    </p>

                    <div style={{ marginTop: "1rem" }}>
                      <textarea
                        className="form-textarea"
                        placeholder="Counselor notes..."
                        defaultValue={request.counselorNote || ""}
                        id={`note-${request._id}`}
                        style={{ marginBottom: "0.75rem" }}
                      />
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: "0.875rem" }}
                          onClick={() =>
                            handleStatusChange(
                              request._id,
                              "in_progress",
                              document.getElementById(`note-${request._id}`)
                                .value
                            )
                          }
                        >
                          <FiEdit /> In Progress
                        </button>
                        <button
                          className="btn btn-success"
                          style={{ fontSize: "0.875rem" }}
                          onClick={() =>
                            handleStatusChange(
                              request._id,
                              "closed",
                              document.getElementById(`note-${request._id}`)
                                .value
                            )
                          }
                        >
                          Close
                        </button>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        fontSize: "0.75rem",
                        color: "var(--text-tertiary)",
                        marginTop: "1rem",
                      }}
                    >
                      <span>
                        Preferred Mode:{" "}
                        {request.preferredMode.replace("_", " ")}
                      </span>
                      <span>
                        Submitted:{" "}
                        {new Date(request.createdAt).toLocaleString()}
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
                <FiUsers
                  style={{
                    fontSize: "3rem",
                    marginBottom: "1rem",
                    opacity: 0.5,
                  }}
                />
                <p>No support requests found.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1" style={{ gap: "1.5rem" }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <FiBookOpen /> Add New Resource
              </h3>
            </div>
            <ResourceForm onResourceSubmit={handleResourceSubmit} />
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <FiBookOpen /> Existing Resources
              </h3>
              <p className="card-subtitle">{resources.length} resources</p>
            </div>
            {loading ? (
              <div className="text-center" style={{ padding: "2rem" }}>
                <div
                  className="loading-spinner"
                  style={{ margin: "0 auto" }}
                ></div>
              </div>
            ) : resources.length > 0 ? (
              <div className="grid grid-cols-2" style={{ gap: "1rem" }}>
                {resources.map((resource) => (
                  <div key={resource._id} className="resource-card">
                    <h3>{resource.title}</h3>
                    <span className="resource-category">
                      {resource.category}
                    </span>
                    <p className="resource-description">
                      {resource.description}
                    </p>
                    {resource.link && (
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}
                      >
                        View Resource
                      </a>
                    )}
                    <button
                      className="btn btn-danger"
                      style={{
                        fontSize: "0.875rem",
                        marginTop: "0.5rem",
                        width: "100%",
                      }}
                      onClick={() => handleResourceDelete(resource._id)}
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="text-center"
                style={{ padding: "2rem", color: "var(--text-secondary)" }}
              >
                <FiBookOpen
                  style={{
                    fontSize: "3rem",
                    marginBottom: "1rem",
                    opacity: 0.5,
                  }}
                />
                <p>No resources found.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CounselorDashboardPage;
