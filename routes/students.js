const express = require('express');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

const router = express.Router();

/* ==========================================
   GET STUDENTS (OPTIONAL SUBJECT FILTER)
========================================== */
router.get('/', auth, async (req, res) => {
  try {
    const { subject } = req.query;
    let query = {};

    // If subject filter is provided
    if (subject) {
      query.subjects = { $in: [subject] };
    }

    const students = await Student.find(query).sort({ name: 1 });
    res.json(students);

  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ msg: 'Server error while fetching students' });
  }
});


/* ======================
   ADD NEW STUDENT
====================== */
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, rollNumber, className, subjects } = req.body;

    // Basic validation
    if (!name || !email || !rollNumber || !className) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check duplicate roll number
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(400).json({
        msg: "Student with this Roll Number already exists"
      });
    }

    const newStudent = new Student({
      name,
      email,
      rollNumber,
      className,
      subjects: subjects || [],
      user: null   // 🔥 Important: manual student has no linked user
    });

    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);

  } catch (err) {
    console.error("Add Error:", err);
    res.status(500).json({ msg: "Server error while adding student" });
  }
});


/* ======================
   UPDATE STUDENT
====================== */
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email, rollNumber, className, subjects } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        rollNumber,
        className,
        subjects
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({ msg: "Student not found" });
    }

    res.json(updatedStudent);

  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ msg: "Server error while updating student" });
  }
});


/* ======================
   DELETE STUDENT
====================== */
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ msg: "Student not found" });
    }

    res.json({ msg: "Student removed successfully" });

  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ msg: "Server error while deleting student" });
  }
});

module.exports = router;