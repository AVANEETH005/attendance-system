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

    // 🔐 Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create User FIRST
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    // ✅ If student → create Student linked to user
    if (role === "student") {
      const newStudent = new Student({
        name,
        email,
        rollNumber: "AUTO-" + Date.now(),
        className: "Default Class",
        subjects: [],
        user: newUser._id   // 🔥 FIXED HERE
      });

      await newStudent.save();

      // 🔗 Link studentId back to user
      newUser.studentId = newStudent._id;
      await newUser.save();
    }

    // 🎟 Generate Token
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
        studentId: newUser.studentId
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});