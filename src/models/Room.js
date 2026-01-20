const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, "Room number is required"],
    trim: true
  },
  type: {
    type: String,
    required: [true, "Room type is required"],
    trim: true
  },
  capacity: {
    type: Number,
    min: [1, "Capacity must be at least 1"]
  },
  status: {
    type: String,
    enum: ["AVAILABLE", "OCCUPIED", "MAINTENANCE", "UNAVAILABLE"],
    default: "AVAILABLE"
  },
  floor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Floor",
    required: [true, "Floor is required"]
  },
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Building"
  }
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);
