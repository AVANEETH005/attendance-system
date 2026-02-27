import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAttendanceRecords: 0,
    recentAttendance: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {

        // ===========================
        // TEACHER DASHBOARD
        // ===========================
        if (user?.role === "teacher") {
          const studentsRes = await api.get("/students");
          const attendanceRes = await api.get("/attendance");

          setStats({
            totalStudents: studentsRes.data.length,
            totalAttendanceRecords: attendanceRes.data.length,
            recentAttendance: attendanceRes.data.slice(0, 5),
          });
        }

        // ===========================
        // STUDENT DASHBOARD
        // ===========================
        if (user?.role === "student") {
          const summaryRes = await api.get("/attendance/summary");

          const recent = Object.entries(summaryRes.data).map(
            ([subject, data]) => ({
              subject,
              total: data.totalClasses,
              present: data.present,
              absent: data.absent,
              percentage: data.percentage,
            })
          );

          setStats({
            totalStudents: 0,
            totalAttendanceRecords: 0,
            recentAttendance: recent,
          });
        }

      } catch (err) {
        console.log(err);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>

      <div className="dashboard-grid">

        {/* ===========================
           TEACHER STATS
        =========================== */}
        {user?.role === "teacher" && (
          <>
            <div className="card">
              <h3>Total Students</h3>
              <p className="stat-number">{stats.totalStudents}</p>
            </div>

            <div className="card">
              <h3>Attendance Records</h3>
              <p className="stat-number">
                {stats.totalAttendanceRecords}
              </p>
            </div>
          </>
        )}

        {/* ===========================
           ACTIONS
        =========================== */}
        <div className="card">
          <h3>Actions</h3>

          {user?.role === "teacher" && (
            <>
              <Link to="/students" className="btn">
                Manage Students
              </Link>

              <Link to="/attendance" className="btn green">
                Mark Attendance
              </Link>
            </>
          )}

          <Link to="/reports" className="btn">
            View Reports
          </Link>
        </div>
      </div>

      {/* ===========================
         RECENT ATTENDANCE
      =========================== */}
      <div className="card">
        <h3>
          {user?.role === "teacher"
            ? "Recent Attendance Records"
            : "Your Attendance Summary"}
        </h3>

        {stats.recentAttendance.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          <table className="table">
            <thead>
              {user?.role === "teacher" ? (
                <tr>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Present</th>
                  <th>Absent</th>
                </tr>
              ) : (
                <tr>
                  <th>Subject</th>
                  <th>Total</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Percentage</th>
                </tr>
              )}
            </thead>

            <tbody>
              {user?.role === "teacher"
                ? stats.recentAttendance.map((record, index) => {
                    const present = record.records.filter(
                      (r) => r.status === "present"
                    ).length;

                    const total = record.records.length;

                    return (
                      <tr key={index}>
                        <td>
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td>{total}</td>
                        <td>{present}</td>
                        <td>{total - present}</td>
                      </tr>
                    );
                  })
                : stats.recentAttendance.map((record, index) => (
                    <tr key={index}>
                      <td>{record.subject}</td>
                      <td>{record.total}</td>
                      <td>{record.present}</td>
                      <td>{record.absent}</td>
                      <td>{record.percentage}%</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;