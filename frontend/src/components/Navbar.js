import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/dashboard" className="logo">
          Attendance System
        </Link>

        <div className="nav-links">
          {user && (
            <>
              {/* STUDENT VIEW */}
              {user.role === "student" && (
                <>
                  <Link to="/dashboard">Dashboard</Link>
                  <Link to="/reports">Reports</Link>
                </>
              )}

              {/* TEACHER VIEW */}
              {user.role === "teacher" && (
                <>
                  <Link to="/dashboard">Dashboard</Link>
                  <Link to="/students">Students</Link>
                  <Link to="/attendance">Attendance</Link>
                  <Link to="/reports">Reports</Link>
                </>
              )}

              {/* User Info */}
              <span style={{ marginLeft: "10px", fontWeight: "600" }}>
                {user.name} ({user.role})
              </span>

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;