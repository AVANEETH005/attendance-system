import React, { useState, useEffect } from "react";
import api from "../utils/api";

const Students = () => {

  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showSubjects, setShowSubjects] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    className: "",
    subjects: []
  });

  const subjectsList = [
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubjectChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => {
      const exists = prev.subjects.includes(value);
      return {
        ...prev,
        subjects: exists
          ? prev.subjects.filter((s) => s !== value)
          : [...prev.subjects, value]
      };
    });
  };

  /* =========================
     ADD / UPDATE
  ========================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (editingStudent) {
        await api.put(`/students/${editingStudent._id}`, formData);
      } else {
        await api.post("/students", formData);
      }

      resetForm();
      fetchStudents();

    } catch (error) {
      console.error(error);
      alert("Error saving student");
    }
  };

  /* =========================
     EDIT
  ========================== */

  const handleEdit = (student) => {
    setEditingStudent(student);

    setFormData({
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber,
      className: student.className,
      subjects: student.subjects || []
    });

    setShowForm(true);
  };

  /* =========================
     DELETE
  ========================== */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error(error);
      alert("Error deleting student");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      rollNumber: "",
      className: "",
      subjects: []
    });

    setEditingStudent(null);
    setShowForm(false);
    setShowSubjects(false);
  };

  return (
    <div className="students-container">

      {/* Header */}
      <div className="students-header">
        <div>
          <h1>Students Management</h1>
          <p>Manage and organize all your students efficiently.</p>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Student
        </button>
      </div>

      {/* Stats */}
      <div className="students-stats">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{students.length}</p>
        </div>
      </div>

      {/* Student List */}
      {students.length === 0 ? (
        <div className="empty-state">
          <h3>No Students Added Yet</h3>
          <p>Add your first student to begin tracking attendance.</p>
        </div>
      ) : (
        <div className="students-list">
          {students.map((student) => (
            <div key={student._id} className="student-card">

              <div>
                <h4>{student.name}</h4>
                <p>{student.email}</p>
                <p>Roll: {student.rollNumber}</p>
                <p>Class: {student.className}</p>
              </div>

              <div className="student-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(student)}
                >
                  Edit
                </button>

                <button
                  className="btn-delete"
                  onClick={() => handleDelete(student._id)}
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-card">

            <h3>{editingStudent ? "Edit Student" : "Add New Student"}</h3>

            <form onSubmit={handleSubmit}>

              <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                name="rollNumber"
                placeholder="Roll Number"
                value={formData.rollNumber}
                onChange={handleChange}
                required
              />

              <input
                name="className"
                placeholder="Class"
                value={formData.className}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowSubjects(!showSubjects)}
              >
                Select Subjects
              </button>

              {showSubjects && (
                <div className="subjects-grid">
                  {subjectsList.map((subject) => (
                    <label key={subject} className="subject-chip">
                      <input
                        type="checkbox"
                        value={subject}
                        checked={formData.subjects.includes(subject)}
                        onChange={handleSubjectChange}
                      />
                      {subject}
                    </label>
                  ))}
                </div>
              )}

              <div className="form-actions">
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>

                <button type="submit" className="btn-primary">
                  {editingStudent ? "Update Student" : "Add Student"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Students;