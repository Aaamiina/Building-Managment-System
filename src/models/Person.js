const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
  type: { type: String, enum: ["STAFF", "TENANT"] },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  building: { type: mongoose.Schema.Types.ObjectId, ref: "Building" }
});

module.exports = mongoose.model("Person", personSchema);
