const express = require('express');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

const router = express.Router();

/* ==========================================
   GET STUDENTS (WITH OPTIONAL SUBJECT FILTER)
   ========================================== */
router.get('/', auth, async (req, res) => {
  try {
    const { subject } = req.query;
    let query = {};

    // If a subject is provided in the query params (?subject=Cloud Computing),
    // the database will do the filtering work for you.
    if (subject) {
      query.subjects = { $in: [subject] };
    }

    const students = await Student.find(query).sort({ name: 1 }); // Sorted by name for easier attendance taking
    res.json(students);
  } catch (err) {
    console.error("Fetch Error:", err.message);
    res.status(500).send('Server error');
  }
});

/* ======================
   ADD NEW STUDENT
   ====================== */
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, rollNumber, className, subjects } = req.body;

    // Check if student with this roll number already exists
    let existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(400).json({ msg: 'Student with this Roll Number already exists' });
    }

    const newStudent = new Student({
      name,
      email,
      rollNumber,
      className,
      subjects: subjects || [] 
    });

    const student = await newStudent.save();
    res.json(student);

  } catch (err) {
    console.error("Add Error:", err.message);
    res.status(500).send('Server error');
  }
});

/* ======================
   UPDATE STUDENT
   ====================== */
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email, rollNumber, className, subjects } = req.body;

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        rollNumber,
        className,
        subjects
      },
      { new: true, runValidators: true } // runValidators ensures the new data follows your Model rules
    );

    if (!updated) return res.status(404).json({ msg: "Student not found" });

    res.json(updated);

  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ======================
   DELETE STUDENT
   ====================== */
router.delete('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    res.json({ msg: 'Student removed' });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;