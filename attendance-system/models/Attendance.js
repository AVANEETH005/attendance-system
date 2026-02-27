const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema({

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["present", "absent"],
    required: true
  }

});

const attendanceSchema = new mongoose.Schema({

  date: {
    type: Date,
    required: true
  },

  records: [attendanceRecordSchema]

}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);