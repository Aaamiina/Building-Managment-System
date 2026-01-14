// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  role: {
    type: String,
    enum: ["SUPER_ADMIN", "MANAGER", "SUB_MANAGER"],
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

module.exports = mongoose.model("User", userSchema);
