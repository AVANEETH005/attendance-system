import React, { useEffect, useState } from "react";
import api from "../utils/api";

const StudentDashboard = () => {

  const [report, setReport] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.studentId) {
      fetchReport();
    }
  }, []);

  const fetchReport = async () => {
    try {
      const res = await api.get(`/attendance/student/${user.studentId}`);
      setReport(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!report) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <h2>My Attendance Report</h2>

      <div className="card">
        <p>Total Classes: {report.totalDays}</p>
        <p>Present: {report.presentDays}</p>
        <p>Absent: {report.absentDays}</p>
        <p>Attendance %: {report.percentage}%</p>
      </div>

      {report.percentage < 75 && (
        <p style={{ color: "red" }}>
          ⚠ Attendance below 75%
        </p>
      )}
    </div>
  );
};

export default StudentDashboard;