// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },

  role: {
    type: String,
    enum: ["SUPER_ADMIN", "MANAGER", "SUB_MANAGER"],
    required: true
  },

  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Building",
  },

  parentManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }

}, { timestamps: true });

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);
