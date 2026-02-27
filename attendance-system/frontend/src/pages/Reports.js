import React, { useState, useEffect } from "react";
import api from "../utils/api";

const Reports = () => {

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReport = async (studentId) => {
  try {
    console.log("Fetching report for:", studentId);

    const res = await api.get(`/attendance/student/${studentId}`);

    console.log("REPORT DATA:", res.data);

    setReport(res.data);

  } catch (err) {
    console.error("REPORT ERROR:", err);
  }
};

  return (
    <div className="reports-page">

      <h2 className="page-title">View Reports</h2>
      <p className="page-subtitle">
        Check attendance statistics and percentages
      </p>

      {/* Student Selector */}
      <div className="report-select">
        <select
          value={selectedStudent}
          onChange={(e) => {
            setSelectedStudent(e.target.value);
            fetchReport(e.target.value);
          }}
        >
          <option value="">Select Student</option>
          {students.map(student => (
            <option key={student._id} value={student._id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>

      {/* Report Card */}
      {report && (
        <div className="report-card">

          <div className="report-item">
            <h4>Total Days</h4>
            <p>{report.totalDays}</p>
          </div>

          <div className="report-item">
            <h4>Present Days</h4>
            <p>{report.presentDays}</p>
          </div>

          <div className="report-item">
            <h4>Absent Days</h4>
            <p>{report.absentDays}</p>
          </div>

          <div className="report-item percentage">
            <h4>Attendance %</h4>
            <p>{report.percentage}%</p>
          </div>

        </div>
      )}

    </div>
  );
};

export default Reports;