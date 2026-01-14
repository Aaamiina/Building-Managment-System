const mongoose = require("mongoose");

const floorSchema = new mongoose.Schema({
  floorNumber: Number,
  building: { type: mongoose.Schema.Types.ObjectId, ref: "Building" }
});

module.exports = mongoose.model("Floor", floorSchema);
