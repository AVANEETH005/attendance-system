import React, { useState, useEffect } from "react";
import api from "../utils/api";

const Attendance = () => {

  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});

  const subjects = [
    "Cloud Computing",
    "Machine Learning",
    "Advanced Java",
    "Project Management",
    "Indian Knowledge Systems"
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubjectAttendance = (studentId, subject, status) => {

    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subject]: status
      }
    }));

  };

  const handleSubmit = async () => {

    try {

      // ✅ FIXED PAYLOAD STRUCTURE
      const payload = [];

      students.forEach(student => {

        subjects.forEach(sub => {

          payload.push({
            student: student._id,
            subject: sub,
            status: attendanceData[student._id]?.[sub] || "absent"
          });

        });

      });

      console.log("Sending payload:", payload);

      await api.post("/attendance", {
        date: new Date(),
        records: payload
      });

      alert("Attendance submitted successfully");

    } catch(err){
  console.log("FULL ERROR:", err.response?.data || err);
  alert(JSON.stringify(err.response?.data));
}

  };

  return (

    <div className="attendance-page">

      <h2 className="page-title">Mark Attendance</h2>

      <div className="attendance-card">

        <table className="attendance-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Roll</th>
              <th>Class</th>
              <th>Subjects Attendance</th>
            </tr>
          </thead>

          <tbody>

            {students.map(student => (

              <tr key={student._id}>

                <td>{student.name}</td>
                <td>{student.rollNumber}</td>
                <td>{student.className}</td>

                <td>

                  {subjects.map(subject => (

                    <div key={subject} className="subject-row">

                      <span className="subject-name">{subject}</span>

                      <label>
  <input
    type="radio"
    name={`${student._id}-${subject}`}
    checked={
      attendanceData[student._id]?.[subject] === "present"
    }
    onChange={() =>
      handleSubjectAttendance(
        student._id,
        subject,
        "present"
      )
    }
  />
  Present
</label>

<label>
  <input
    type="radio"
    name={`${student._id}-${subject}`}
    checked={
      attendanceData[student._id]?.[subject] === "absent"
    }
    onChange={() =>
      handleSubjectAttendance(
        student._id,
        subject,
        "absent"
      )
    }
  />
  Absent
</label>
                    </div>

                  ))}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <button
          onClick={handleSubmit}
          className="btn-submit"
        >
          Submit Attendance
        </button>

      </div>

    </div>

  );
};

export default Attendance;