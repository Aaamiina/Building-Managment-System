const User = require("../models/User");
const Building = require("../models/Building");
const bcrypt = require("bcrypt");

// -----------------------
// Create Manager
// -----------------------
exports.createManager = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const manager = new User({
      name,
      email,
      password: hashedPassword,
      role: "MANAGER"
    });

    await manager.save();
    res.status(201).json({ message: "Manager created successfully", manager });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------
// Create Building and assign to Manager
// -----------------------
exports.createBuilding = async (req, res) => {
  const { name, location, managerId, approvalPolicy } = req.body;

  try {
    // Check if manager exists and is MANAGER
    const manager = await User.findById(managerId);
    if (!manager || manager.role !== "MANAGER")
      return res.status(400).json({ message: "Invalid manager" });

    // Create building
    const building = new Building({
      name,
      location,
      manager: managerId,
      approvalPolicy: approvalPolicy || "MANAGER_ONLY" // default if not provided
    });

    await building.save();

    res.status(201).json({
      message: "Building created successfully",
      building
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
