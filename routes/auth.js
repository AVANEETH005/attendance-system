const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');
const auth = require('../middleware/auth');


router.post('/register', async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    const allowedRoles = ['student', 'teacher'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ msg: 'Invalid role selected' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    let studentId = null;


    if (role === "student") {

      const newStudent = new Student({
        name: name,
        email: email,
        rollNumber: "AUTO-" + Date.now(),
        className: "Default Class",
        subjects: []
      });

      await newStudent.save();

      studentId = newStudent._id;   // 🔥 IMPORTANT
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user WITH studentId
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      studentId   // 🔥 Link Student here
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || 'defaultSecret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        studentId: newUser.studentId   // 🔥 RETURN THIS
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});



router.post('/login', async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'defaultSecret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId   // 🔥 VERY IMPORTANT
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});



router.get('/me', auth, async (req, res) => {
  try {

    const user = await User.findById(req.userId)
      .select('-password');

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;