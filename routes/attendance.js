const express = require("express");
const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const auth = require("../middleware/auth");

const router = express.Router();

/* ===================================================
   MARK OR UPDATE ATTENDANCE (Teacher Only)
=================================================== */
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ msg: "Only teachers can mark attendance" });
    }

    const { date, subject, records } = req.body;

    if (!date || !subject || !records || records.length === 0) {
      return res.status(400).json({ msg: "Missing attendance data" });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const cleanedRecords = records.map(r => ({
      student: new mongoose.Types.ObjectId(r.student),
      status: r.status.toLowerCase()
    }));

    const existing = await Attendance.findOne({
      date: attendanceDate,
      subject
    });

    if (existing) {
      existing.records = cleanedRecords;
      await existing.save();
      return res.json({ msg: "Attendance updated successfully" });
    }

    await Attendance.create({
      date: attendanceDate,
      subject,
      records: cleanedRecords
    });

    res.json({ msg: "Attendance created successfully" });

  } catch (err) {
    console.error("Attendance Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


/* ===================================================
   STUDENT REPORT (Own Attendance Only)
=================================================== */
router.get("/overall", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ msg: "Only students allowed" });
    }

    const studentDoc = await Student.findOne({
      email: { $regex: new RegExp("^" + req.user.email + "$", "i") }
    });

    if (!studentDoc) {
      return res.status(404).json({ msg: "Student not found" });
    }

    const attendances = await Attendance.find({
      "records.student": studentDoc._id
    }).sort({ date: -1 });

    const result = buildStudentReport(attendances, studentDoc._id);

    res.json(result);

  } catch (err) {
    console.error("Student Report Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


/* ===================================================
   TEACHER REPORT (Selected Student)
=================================================== */
router.get("/overall/:studentId", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ msg: "Only teachers allowed" });
    }

    const studentId = req.params.studentId;

    const attendances = await Attendance.find({
      "records.student": studentId
    }).sort({ date: -1 });

    const result = buildStudentReport(attendances, studentId);

    res.json(result);

  } catch (err) {
    console.error("Teacher Student Report Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


/* ===================================================
   HELPER FUNCTION (Shared Report Builder)
=================================================== */
function buildStudentReport(attendances, studentId) {
  const result = {};

  attendances.forEach(att => {
    const dateKey = att.date.toISOString().split("T")[0];

    const studentRecord = att.records.find(
      r => r.student.toString() === studentId.toString()
    );

    if (!studentRecord) return;

    if (!result[dateKey]) {
      result[dateKey] = {
        subjects: [],
        total: 0,
        present: 0,
        absent: 0,
        percentage: "0.00"
      };
    }

    result[dateKey].subjects.push({
      subject: att.subject,
      status: studentRecord.status
    });

    result[dateKey].total += 1;

    if (studentRecord.status === "present") {
      result[dateKey].present += 1;
    } else {
      result[dateKey].absent += 1;
    }
  });

  Object.keys(result).forEach(date => {
    const { total, present } = result[date];
    result[date].percentage =
      total > 0 ? ((present / total) * 100).toFixed(2) : "0.00";
  });

  return result;
}


/* ===================================================
   TEACHER RAW VIEW (OPTIONAL)
=================================================== */
router.get("/all", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ msg: "Only teachers allowed" });
    }

    const attendances = await Attendance.find()
      .sort({ date: -1 })
      .populate("records.student");

    res.json(attendances);

  } catch (err) {
    console.error("Teacher Report Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;