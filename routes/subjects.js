const express = require("express");
const Subject = require("../models/Subject");
const auth = require("../middleware/auth");

const router = express.Router();

/* ==========================
   CREATE SUBJECT (Teacher Only)
========================== */
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "Name and Code are required" });
    }

    const trimmedName = name.trim();
    const trimmedCode = code.trim().toUpperCase();

    const existingSubject = await Subject.findOne({
      teacher: req.user.id,
      $or: [{ name: trimmedName }, { code: trimmedCode }]
    });

    if (existingSubject) {
      return res.status(400).json({ message: "Subject already exists" });
    }

    const subject = new Subject({
      name: trimmedName,
      code: trimmedCode,
      teacher: req.user.id
    });

    await subject.save();

    res.status(201).json(subject);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});


/* ==========================
   GET SUBJECTS (Auto Insert 5 If Empty)
========================== */
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    let subjects = await Subject.find({
      teacher: req.user.id
    });

    // If no subjects exist, create default 5
    if (subjects.length === 0) {
      const defaultSubjects = [
        { name: "Cloud Computing", code: "CC101" },
        { name: "Machine Learning", code: "ML101" },
        { name: "Advanced Java", code: "AJ101" },
        { name: "Project Management", code: "PM101" },
        { name: "Indian Knowledge System", code: "IKS101" }
      ];

      const subjectsToInsert = defaultSubjects.map(sub => ({
        ...sub,
        teacher: req.user.id
      }));

      await Subject.insertMany(subjectsToInsert);

      subjects = await Subject.find({ teacher: req.user.id });
    }

    res.json(subjects);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});


/* ==========================
   DELETE SUBJECT
========================== */
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    const subject = await Subject.findOneAndDelete({
      _id: req.params.id,
      teacher: req.user.id
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json({ message: "Subject deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;