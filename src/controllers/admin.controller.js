const User = require("../models/User");
const Building = require("../models/Building");
const bcrypt = require("bcrypt");

// --- MANAGER CONTROLLERS ---

exports.getAllManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: "MANAGER" }).select("-password");
    res.json(managers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createManager = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const manager = new User({ name, email, password: hashedPassword, role: "MANAGER" });
    await manager.save();
    res.status(201).json({ message: "Manager created successfully", manager });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateManager = async (req, res) => {
  try {
    const { name, email } = req.body;
    const manager = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    ).select("-password");
    res.json({ message: "Manager updated", manager });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteManager = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Manager deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- BUILDING CONTROLLERS ---

exports.getAllBuildings = async (req, res) => {
  try {
    const buildings = await Building.find().populate("manager", "name email");
    res.json(buildings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createBuilding = async (req, res) => {
  const { name, location, managerId, approvalPolicy } = req.body;
  try {
    const manager = await User.findById(managerId);
    if (!manager || manager.role !== "MANAGER")
      return res.status(400).json({ message: "Invalid manager" });

    const building = new Building({
      name,
      location,
      manager: managerId,
      approvalPolicy: approvalPolicy || "MANAGER_ONLY"
    });
    await building.save();
    res.status(201).json({ message: "Building created", building });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateBuilding = async (req, res) => {
  try {
    const { name, location, managerId, approvalPolicy } = req.body;
    const building = await Building.findByIdAndUpdate(
      req.params.id,
      { name, location, manager: managerId, approvalPolicy },
      { new: true }
    );
    res.json({ message: "Building updated", building });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteBuilding = async (req, res) => {
  try {
    await Building.findByIdAndDelete(req.params.id);
    res.json({ message: "Building deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};