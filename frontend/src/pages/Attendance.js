import React, { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./Attendance.css"; // make sure this is imported

const Attendance = () => {
  const { user } = useAuth();

  const subjectsList = [
    "Cloud Computing",
    "Machine Learning",
    "Advanced Java",
    "Project Management",
    "Indian Knowledge Systems"
  ];

  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [date, setDate] = useState("");

  /* ==============================
     FETCH STUDENTS
  ============================== */
  const fetchStudents = useCallback(async () => {
    try {
      const res = await api.get("/students");

      const filtered = res.data.filter(student =>
        student.subjects?.includes(selectedSubject)
      );

      setStudents(filtered);
      setAttendanceData({});
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  }, [selectedSubject]);

  /* ==============================
     FETCH WHEN SUBJECT CHANGES
  ============================== */
  useEffect(() => {
    if (selectedSubject) {
      fetchStudents();
    } else {
      setStudents([]);
      setAttendanceData({});
    }
  }, [selectedSubject, fetchStudents]);

  /* ==============================
     HANDLE ATTENDANCE CHANGE
  ============================== */
  const handleAttendance = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  /* ==============================
     SUBMIT ATTENDANCE
  ============================== */
  const handleSubmit = async () => {
    if (!date) return alert("Please select a date.");
    if (!selectedSubject) return alert("Please select subject.");

    for (let student of students) {
      if (!attendanceData[student._id]) {
        return alert(`Please mark attendance for ${student.name}`);
      }
    }

    try {
      const payload = students.map(student => ({
        student: student._id,
        status: attendanceData[student._id]
      }));

      await api.post("/attendance", {
        date,
        subject: selectedSubject,
        records: payload
      });

      alert(`${selectedSubject} saved for ${date}`);

      setSelectedSubject("");
      setStudents([]);
      setAttendanceData({});
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Error submitting attendance.");
    }
  };

  if (user?.role !== "teacher") {
    return <p>Access Denied</p>;
  }

  return (
    <div className="attendance-page">
      <h2>Mark Attendance</h2>

      {/* Date */}
      <div className="form-group">
        <label>Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Subject */}
      <div className="form-group">
        <label>Select Subject:</label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">-- Choose Subject --</option>
          {subjectsList.map((sub, index) => (
            <option key={index} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      {/* Students Table */}
      {selectedSubject && students.length > 0 && (
        <>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th className="status-header">Status</th>
              </tr>
            </thead>

            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td className="student-name">
                    {student.name}
                  </td>

                  <td className="status-cell">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name={student._id}
                        checked={attendanceData[student._id] === "present"}
                        onChange={() =>
                          handleAttendance(student._id, "present")
                        }
                      />
                      <span className="present-text">Present</span>
                    </label>

                    <label className="radio-option">
                      <input
                        type="radio"
                        name={student._id}
                        checked={attendanceData[student._id] === "absent"}
                        onChange={() =>
                          handleAttendance(student._id, "absent")
                        }
                      />
                      <span className="absent-text">Absent</span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="save-btn" onClick={handleSubmit}>
            Save Attendance
          </button>
        </>
      )}
    </div>
  );
};

export default Attendance;