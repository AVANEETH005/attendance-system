import React, { useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const AddSubject = () => {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  if (user?.role !== "teacher") {
    return <h3>Access Denied</h3>;
  }

  /* ==========================
     ADD SINGLE SUBJECT
  ========================== */
  const handleSubmit = async () => {
    if (!name.trim() || !code.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/subjects", {
        name: name.trim(),
        code: code.trim().toUpperCase()
      });

      alert("Subject added successfully");
      setName("");
      setCode("");
    } catch (err) {
      if (err.response?.status === 400) {
        alert("Subject already exists");
      } else {
        alert("Error adding subject");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ==========================
     ADD DEFAULT 5 SUBJECTS
  ========================== */
  const addDefaultSubjects = async () => {
    const subjects = [
      { name: "Cloud Computing", code: "CC101" },
      { name: "Machine Learning", code: "ML101" },
      { name: "Advanced Java", code: "AJ101" },
      { name: "Project Management", code: "PM101" },
      { name: "Indian Knowledge System", code: "IKS101" }
    ];

    try {
      setLoading(true);

      for (let sub of subjects) {
        try {
          await api.post("/subjects", sub);
        } catch (err) {
          // Ignore duplicates silently
          if (err.response?.status !== 400) {
            console.log(err);
          }
        }
      }

      alert("Default subjects added successfully");
    } catch (err) {
      alert("Error adding default subjects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-page">
      <h2 className="page-title">Add Subject</h2>

      <div className="attendance-card">
        <input
          type="text"
          placeholder="Subject Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Subject Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <br /><br />

        <button onClick={handleSubmit} className="btn-submit" disabled={loading}>
          {loading ? "Adding..." : "Add Subject"}
        </button>

        <br /><br />

        <button onClick={addDefaultSubjects} className="btn-submit" disabled={loading}>
          {loading ? "Adding..." : "Add Default 5 Subjects"}
        </button>
      </div>
    </div>
  );
};

export default AddSubject;