import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../index.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">

      <h1 className="home-title">
        Attendance Monitoring System
      </h1>

      <p className="home-subtitle">
        A simple and efficient system to manage student attendance records.
        Teachers and administrators can easily add students, mark attendance,
        and view attendance statistics.
      </p>

      {!user && (
        <div className="home-buttons">
          <Link to="/login" className="btn-primary">Login</Link>
          <Link to="/register" className="btn-secondary">Register</Link>
        </div>
      )}

      {user && (
        <div className="home-welcome">
          <h2>Welcome, {user.name}!</h2>
          <p>You are logged in as {user.role}</p>
          <Link to="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      )}

      <div className="feature-grid">
        <div className="feature-card">
          <h3>Manage Students</h3>
          <p>Add, edit, and delete student records</p>
        </div>

        <div className="feature-card">
          <h3>Mark Attendance</h3>
          <p>Quickly mark daily attendance for students</p>
        </div>

        <div className="feature-card">
          <h3>View Reports</h3>
          <p>Check attendance statistics and percentages</p>
        </div>
      </div>

    </div>
  );
};

export default Home;