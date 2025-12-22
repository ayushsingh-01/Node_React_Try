import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiActivity,
  FiBookOpen,
  FiMessageSquare,
  FiMessageCircle,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX,
  FiSettings,
  FiUser,
} from "react-icons/fi";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const studentMenuItems = [
    { path: "/dashboard", label: "Dashboard", icon: FiHome },
    { path: "/mood", label: "Mood Tracker", icon: FiActivity },
    { path: "/resources", label: "Resources", icon: FiBookOpen },
    { path: "/support", label: "Support", icon: FiMessageSquare },
    { path: "/ai-chat", label: "AI Chat", icon: FiMessageCircle },
  ];

  const counselorMenuItems = [
    { path: "/admin", label: "Dashboard", icon: FiHome },
  ];

  const menuItems =
    user?.role === "counselor" ? counselorMenuItems : studentMenuItems;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarOpen ? "open" : "collapsed"} ${
          mobileMenuOpen ? "mobile-open" : ""
        }`}
      >
        <div className="sidebar-header">
          <div className="logo-container">
            <FiActivity className="logo-icon" />
            {sidebarOpen && <span className="logo-text">MindWell</span>}
          </div>
          <button
            className="sidebar-toggle desktop-only"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-item ${
                      isActive(item.path) ? "active" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="nav-icon" />
                    {sidebarOpen && (
                      <span className="nav-label">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <FiUser />
            </div>
            {sidebarOpen && (
              <div className="user-details">
                <p className="user-name">{user?.name}</p>
                <p className="user-role">{user?.role}</p>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <FiLogOut className="nav-icon" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div
        className={`main-wrapper ${
          sidebarOpen ? "sidebar-open" : "sidebar-collapsed"
        }`}
      >
        {/* Top bar */}
        <header className="top-bar">
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <FiMenu />
          </button>
          <div className="top-bar-content">
            <h1 className="page-title">
              {menuItems.find((item) => item.path === location.pathname)
                ?.label || "Dashboard"}
            </h1>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
