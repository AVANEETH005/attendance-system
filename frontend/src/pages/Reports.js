import React, { useEffect, useState, useCallback } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Reports = () => {
  const { user } = useAuth();

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [data, setData] = useState({});

  /* ===============================
     FETCH STUDENTS (Teacher)
  =============================== */
  const fetchStudents = useCallback(async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Student fetch error:", err);
    }
  }, []);

  /* ===============================
     FETCH OWN REPORT (Student)
  =============================== */
  const fetchOwnReport = useCallback(async () => {
    try {
      const res = await api.get("/attendance/overall");
      setData(res.data);
    } catch (err) {
      console.error("Report error:", err);
    }
  }, []);

  /* ===============================
     FETCH SELECTED STUDENT REPORT
  =============================== */
  const fetchStudentReport = useCallback(async (studentId) => {
    try {
      const res = await api.get(`/attendance/overall/${studentId}`);
      setData(res.data);
    } catch (err) {
      console.error("Report error:", err);
    }
  }, []);

  /* ===============================
     RUN WHEN ROLE CHANGES
  =============================== */
  useEffect(() => {
    if (!user) return;

    if (user.role === "teacher") {
      fetchStudents();
    } else {
      fetchOwnReport();
    }
  }, [user, fetchStudents, fetchOwnReport]);

  /* ===============================
     RUN WHEN STUDENT SELECTED
  =============================== */
  useEffect(() => {
    if (selectedStudent) {
      fetchStudentReport(selectedStudent);
    }
  }, [selectedStudent, fetchStudentReport]);

  const getColor = (percentage) => {
    const value = parseFloat(percentage);
    if (value >= 85) return "#16a34a";
    if (value >= 50) return "#f59e0b";
    return "#dc2626";
  };

  return (
    <div className="report-container">
      <h2 className="report-title">Attendance Report</h2>

      {user?.role === "teacher" && (
        <div style={{ marginBottom: "20px" }}>
          <label>Select Student: </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">-- Select Student --</option>
            {students.map((stu) => (
              <option key={stu._id} value={stu._id}>
                {stu.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {Object.keys(data).length === 0 ? (
        <p className="no-data">No attendance records found.</p>
      ) : (
        Object.entries(data).map(([date, info]) => (
          <div key={date} className="date-card">
            <div className="date-header">
              <h3>{date}</h3>
              <div className="summary">
                <span>Total: {info.total}</span>
                <span>Attended: {info.present}</span>
                <span>Leaves: {info.absent}</span>
                <span
                  className="percentage"
                  style={{ color: getColor(info.percentage) }}
                >
                  {info.percentage}%
                </span>
              </div>
            </div>

            <table className="subjects-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {info.subjects.map((sub, index) => (
                  <tr key={index}>
                    <td>{sub.subject}</td>
                    <td
                      className={
                        sub.status === "present"
                          ? "status-present"
                          : "status-absent"
                      }
                    >
                      {sub.status.toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default Reports;