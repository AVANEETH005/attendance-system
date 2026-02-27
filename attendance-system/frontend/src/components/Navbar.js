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

        {/* LOGO */}
        <Link to="/dashboard" className="logo">
          Attendance System
        </Link>

        {/* NAV LINKS */}
        <div className="nav-links">

          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          {user && (
            <>

              {/* Dashboard visible for all */}
              <Link to="/dashboard">Dashboard</Link>

              {/* Teacher Only Links */}
              {user.role === "teacher" && (
                <>
                  <Link to="/students">Students</Link>
                  <Link to="/attendance">Attendance</Link>
                </>
              )}

              {/* Reports for both */}
              <Link to="/reports">Reports</Link>

              {/* User Info */}
              <span style={{ marginLeft: "10px", fontWeight: "600" }}>
                {user.name} ({user.role})
              </span>

              {/* Logout */}
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