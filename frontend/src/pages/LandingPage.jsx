import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  FiActivity,
  FiBookOpen,
  FiMessageSquare,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "700",
          }}
        >
          <FiActivity /> MindWell
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          {!user ? (
            <>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn"
                style={{ background: "white", color: "#667eea" }}
              >
                Get Started
              </Link>
            </>
          ) : (
            <Link
              to="/dashboard"
              className="btn"
              style={{ background: "white", color: "#667eea" }}
            >
              Dashboard
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div
        style={{
          padding: "4rem 2rem",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "800",
            marginBottom: "1rem",
            lineHeight: "1.2",
          }}
        >
          Mental Health Support Platform
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            marginBottom: "2rem",
            opacity: 0.9,
            maxWidth: "600px",
            margin: "0 auto 2rem",
          }}
        >
          Your well-being matters. Track your mood, access resources, and get
          support when you need it.
        </p>
        {!user ? (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/register"
              className="btn"
              style={{
                background: "white",
                color: "#667eea",
                padding: "1rem 2rem",
                fontSize: "1.125rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Get Started <FiArrowRight />
            </Link>
            <Link
              to="/login"
              className="btn"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                padding: "1rem 2rem",
                fontSize: "1.125rem",
                backdropFilter: "blur(10px)",
              }}
            >
              Sign In
            </Link>
          </div>
        ) : (
          <Link
            to="/dashboard"
            className="btn"
            style={{
              background: "white",
              color: "#667eea",
              padding: "1rem 2rem",
              fontSize: "1.125rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            Go to Dashboard <FiArrowRight />
          </Link>
        )}
      </div>

      {/* Features Section */}
      <div
        style={{
          padding: "4rem 2rem",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "2.5rem",
              fontWeight: "700",
              marginBottom: "3rem",
              color: "var(--text-primary)",
            }}
          >
            How It Works
          </h2>
          <div className="grid grid-cols-3" style={{ gap: "2rem" }}>
            <div
              className="card"
              style={{ textAlign: "center", padding: "2rem" }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 1.5rem",
                  background:
                    "linear-gradient(135deg, var(--primary-500), var(--primary-600))",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "2rem",
                }}
              >
                <FiActivity />
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  marginBottom: "1rem",
                }}
              >
                Mood Tracking
              </h3>
              <p style={{ color: "var(--text-secondary)" }}>
                Monitor your emotional well-being with our simple daily mood
                tracker.
              </p>
            </div>
            <div
              className="card"
              style={{ textAlign: "center", padding: "2rem" }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 1.5rem",
                  background:
                    "linear-gradient(135deg, var(--success), var(--success-dark))",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "2rem",
                }}
              >
                <FiBookOpen />
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  marginBottom: "1rem",
                }}
              >
                Resources
              </h3>
              <p style={{ color: "var(--text-secondary)" }}>
                Access curated articles, videos, and guides on mental health
                topics.
              </p>
            </div>
            <div
              className="card"
              style={{ textAlign: "center", padding: "2rem" }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 1.5rem",
                  background:
                    "linear-gradient(135deg, var(--secondary-500), var(--secondary-600))",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "2rem",
                }}
              >
                <FiMessageSquare />
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  marginBottom: "1rem",
                }}
              >
                Get Support
              </h3>
              <p style={{ color: "var(--text-secondary)" }}>
                Connect with counselors and get personalized support when you
                need it.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "white",
          opacity: 0.8,
        }}
      >
        <p>&copy; 2024 MindWell. Your mental health matters.</p>
      </div>
    </div>
  );
};

export default LandingPage;
