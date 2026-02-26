const express = require('express');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all students
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add a new student
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, rollNumber, className } = req.body;

    const newStudent = new Student({
      name,
      email,
      rollNumber,
      className
    });

    const student = await newStudent.save();
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a student
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email, rollNumber, className } = req.body;
    
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, rollNumber, className },
      { new: true }
    );

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a student
router.delete('/:id', auth, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Student removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
/* ======================
   UPDATE STUDENT
====================== */

router.put("/:id", auth, async (req, res) => {
  try {

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


/* ======================
   DELETE STUDENT
====================== */

router.delete("/:id", auth, async (req, res) => {
  try {

    await Student.findByIdAndDelete(req.params.id);

    res.json({ msg: "Student deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
module.exports = router;