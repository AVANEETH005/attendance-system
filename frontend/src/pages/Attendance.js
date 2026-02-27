import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

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
      FETCH STUDENTS WHEN SUBJECT CHANGES
  ============================== */
  useEffect(() => {
    if (selectedSubject) {
      fetchStudents();
    } else {
      setStudents([]);
      setAttendanceData({});
    }
  }, [selectedSubject]);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");

      const filtered = res.data.filter(student =>
        student.subjects?.includes(selectedSubject)
      );

      setStudents(filtered);

      // 🔥 DO NOT SET DEFAULT ABSENT
      setAttendanceData({});

    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

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

    // 🔥 VALIDATE: ensure all students are marked
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

      // DO NOT RESET DATE
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

      {/* DATE */}
      <div className="form-group">
        <label>Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* SUBJECT DROPDOWN */}
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

      {/* STUDENTS TABLE */}
      {selectedSubject && students.length > 0 && (
        <>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>
                    <label>
                      <input
                        type="radio"
                        name={student._id}
                        checked={attendanceData[student._id] === "present"}
                        onChange={() =>
                          handleAttendance(student._id, "present")
                        }
                      />
                      Present
                    </label>

                    <label style={{ marginLeft: "20px" }}>
                      <input
                        type="radio"
                        name={student._id}
                        checked={attendanceData[student._id] === "absent"}
                        onChange={() =>
                          handleAttendance(student._id, "absent")
                        }
                      />
                      Absent
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleSubmit}>
            Save Attendance
          </button>
        </>
      )}
    </div>
  );
};

export default Attendance;