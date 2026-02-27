const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // 🔥 LINK TO USER LOGIN ACCOUNT
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },

    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      unique: true,
      trim: true,
      uppercase: true
    },

    className: {
      type: String,
      required: [true, "Class name is required"],
      trim: true
    },

    subjects: {
      type: [String],
      default: [],
      set: (subs) => subs.map((s) => s.trim())
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Student", studentSchema);