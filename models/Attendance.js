const mongoose = require("mongoose");

/* ==============================
   Attendance Record Schema
============================== */
const attendanceRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    required: true
  }
}, { _id: false });

/* ==============================
   Main Attendance Schema
============================== */
const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    set: (d) => new Date(new Date(d).setHours(0, 0, 0, 0))
  },
  subject: {
    type: String,
    enum: [
      "Cloud Computing",
      "Machine Learning",
      "Advanced Java",
      "Project Management",
      "Indian Knowledge Systems"
    ],
    required: true
  },
  records: {
    type: [attendanceRecordSchema],
    default: []
  }
}, { timestamps: true });

/* ==============================
   Prevent duplicate date + subject
============================== */
attendanceSchema.index({ date: 1, subject: 1 }, { unique: true });

/* ===================================================
   STUDENT SUBJECT SUMMARY
   (Always returns all 5 subjects)
=================================================== */
attendanceSchema.statics.getStudentSubjectReport = async function (studentId) {

  const subjectsList = [
    "Cloud Computing",
    "Machine Learning",
    "Advanced Java",
    "Project Management",
    "Indian Knowledge Systems"
  ];

  const attendances = await this.find({
    "records.student": studentId
  });

  // Initialize all subjects with zero
  const subjectStats = {};

  subjectsList.forEach(subject => {
    subjectStats[subject] = {
      totalClasses: 0,
      present: 0,
      absent: 0,
      percentage: "0.00"
    };
  });

  // Fill actual attendance
  attendances.forEach(attendance => {

    const subjectName = attendance.subject;

    const studentRecord = attendance.records.find(
      r => r.student.toString() === studentId.toString()
    );

    if (!studentRecord) return;

    subjectStats[subjectName].totalClasses += 1;

    if (studentRecord.status === "present") {
      subjectStats[subjectName].present += 1;
    } else {
      subjectStats[subjectName].absent += 1;
    }
  });

  // Calculate percentage
  subjectsList.forEach(subject => {
    const { totalClasses, present } = subjectStats[subject];

    subjectStats[subject].percentage =
      totalClasses > 0
        ? ((present / totalClasses) * 100).toFixed(2)
        : "0.00";
  });

  return subjectStats;
};

/* ===================================================
   STUDENT DATE REPORT
   (Returns attendance for all subjects on selected date)
=================================================== */
attendanceSchema.statics.getStudentDateReport = async function (studentId, date) {

  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  const subjectsList = [
    "Cloud Computing",
    "Machine Learning",
    "Advanced Java",
    "Project Management",
    "Indian Knowledge Systems"
  ];

  const attendances = await this.find({
    date: selectedDate,
    "records.student": studentId
  });

  const result = {};

  // Initialize all subjects
  subjectsList.forEach(subject => {
    result[subject] = "Not Marked";
  });

  attendances.forEach(attendance => {

    const studentRecord = attendance.records.find(
      r => r.student.toString() === studentId.toString()
    );

    if (!studentRecord) return;

    result[attendance.subject] = studentRecord.status;
  });

  return result;
};

module.exports = mongoose.model("Attendance", attendanceSchema);