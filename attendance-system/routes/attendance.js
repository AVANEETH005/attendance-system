const express = require("express");
const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const auth = require("../middleware/auth");

const router = express.Router();

/* ===========================
   MARK OR UPDATE ATTENDANCE
=========================== */

router.post("/", auth, async (req, res) => {
  try {

    const { date, records } = req.body;

    if (!date || !records || records.length === 0) {
      return res.status(400).json({ msg: "Missing attendance data" });
    }

    // Normalize date (remove time)
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Clean records
    const cleanedRecords = records.map(r => ({
      student: new mongoose.Types.ObjectId(r.student),
      subject: r.subject,
      status: (r.status || "absent").toLowerCase()
    }));

    // Check if attendance already exists for date
    let attendance = await Attendance.findOne({
      date: attendanceDate
    });

    if (attendance) {
      // UPDATE existing
      attendance.records = cleanedRecords;
      await attendance.save();
      return res.json({ msg: "Attendance updated successfully" });
    }

    // CREATE new
    const newAttendance = new Attendance({
      date: attendanceDate,
      records: cleanedRecords
    });

    await newAttendance.save();

    res.json({ msg: "Attendance saved successfully" });

  } catch (err) {
    console.error("Attendance Save Error:", err);
    res.status(500).json({ msg: err.message });
  }
});

/* ===========================
   GET ALL ATTENDANCE
=========================== */

router.get("/", auth, async (req, res) => {
  try {

    const attendances = await Attendance.find()
      .sort({ date: -1 })
      .populate("records.student");

    res.json(attendances);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/* ===========================
   GET BY DATE
=========================== */

router.get("/date/:date", auth, async (req, res) => {
  try {

    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({ date })
      .populate("records.student");

    res.json(attendance);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/* ===========================
   GET STUDENT REPORT
=========================== */

router.get("/student/:studentId", auth, async (req, res) => {

  try {

    const studentId = req.params.studentId;

    const attendances = await Attendance.find({
      "records.student": new mongoose.Types.ObjectId(studentId)
    });

    let totalSubjects = 0;
    let presentCount = 0;

    attendances.forEach(attendance => {

      attendance.records.forEach(record => {

        if (record.student.toString() === studentId) {

          totalSubjects++;

          if (record.status === "present") {
            presentCount++;
          }

        }

      });

    });

    const percentage =
      totalSubjects > 0
        ? Math.round((presentCount / totalSubjects) * 100)
        : 0;

    res.json({
      totalDays: totalSubjects,
      presentDays: presentCount,
      absentDays: totalSubjects - presentCount,
      percentage
    });

  } catch (err) {
    console.error("Report Error:", err);
    res.status(500).send("Server error");
  }

});

module.exports = router;