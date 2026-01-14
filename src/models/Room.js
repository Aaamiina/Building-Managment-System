const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: String,
  type: String,
  capacity: Number,
  status: { type: String, default: "AVAILABLE" },
  floor: { type: mongoose.Schema.Types.ObjectId, ref: "Floor" }
});

module.exports = mongoose.model("Room", roomSchema);
