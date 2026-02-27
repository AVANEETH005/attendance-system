import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Dashboard = () => {

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAttendanceRecords: 0,
    recentAttendance: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const studentsRes = await api.get('/students');
        const attendanceRes = await api.get('/attendance');

        setStats({
          totalStudents: studentsRes.data.length,
          totalAttendanceRecords: attendanceRes.data.length,
          recentAttendance: attendanceRes.data.slice(0,5)
        });

      } catch(err){
        console.log(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard">

      <h2 className="dashboard-title">Dashboard</h2>

      {/* STATS CARDS */}
      <div className="dashboard-grid">

        <div className="card">
          <h3>Total Students</h3>
          <p className="stat-number">{stats.totalStudents}</p>
        </div>

        <div className="card">
          <h3>Attendance Records</h3>
          <p className="stat-number">{stats.totalAttendanceRecords}</p>
        </div>

        {/* ACTIONS CARD */}
        <div className="card">
          <h3>Actions</h3>

          <Link to="/students" className="btn">
            Manage Students
          </Link>

          <Link to="/attendance" className="btn green">
            Mark Attendance
          </Link>

          {/* ✅ NEW REPORTS BUTTON */}
          <Link to="/reports" className="btn">
            View Reports
          </Link>

        </div>

      </div>


      {/* RECENT TABLE */}

      <div className="card">
        <h3>Recent Attendance Records</h3>

        {stats.recentAttendance.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (

          <table className="table">

            <thead>
              <tr>
                <th>Date</th>
                <th>Total</th>
                <th>Present</th>
                <th>Absent</th>
              </tr>
            </thead>

            <tbody>
              {stats.recentAttendance.map((record,index)=>{

                const present = record.records.filter(r=>r.status==="present").length;
                const total = record.records.length;

                return(
                  <tr key={index}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{total}</td>
                    <td>{present}</td>
                    <td>{total-present}</td>
                  </tr>
                )
              })}
            </tbody>

          </table>
        )}

      </div>

    </div>
  );
};

export default Dashboard;