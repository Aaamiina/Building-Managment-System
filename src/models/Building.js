const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // Approval policy for critical actions
    approvalPolicy: {
      type: String,
      enum: ["MANAGER_ONLY", "MANAGER_AND_SUPERADMIN"],
      default: "MANAGER_ONLY"
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Building", buildingSchema);
