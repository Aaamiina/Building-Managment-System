const Floor = require("../models/Floor");
const Room = require("../models/Room");
const Person = require("../models/Person");
const Building = require("../models/Building");
const User = require("../models/User");   
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");



const getBuildingForUser = async (user) => {
  if (user.role === "MANAGER") {
    return await Building.findOne({ manager: user.id });
  }

  if (user.role === "SUB_MANAGER") {
    return await Building.findById(user.building);
  }

  return null;
};

const canUpdate = (user) =>
  user.role === "MANAGER" || user.role === "SUPER_MANAGER";

const canDelete = (user) =>
  user.role === "MANAGER";

// ---------------------- SUB-MANAGER ----------------------

// Create Sub-Manager
exports.createSubManager = async (req, res) => {
  const { name, email, password } = req.body;
  const managerId = req.user.id;

  try {
    if (req.user.role !== "MANAGER") {
      return res.status(403).json({ message: "Only managers can create sub-managers" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const building = await getBuildingForUser(req.user);
    if (!building) return res.status(400).json({ message: "Manager has no building assigned" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const subManager = new User({
      name,
      email,
      password: hashedPassword,
      role: "SUB_MANAGER",
      building: building._id,
      parentManager: managerId
    });

    await subManager.save();

    res.status(201).json({ message: "Sub-manager created", subManager });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET Sub-Managers
exports.getSubManagers = async (req, res) => {
  try {
    if (req.user.role !== "MANAGER") {
      return res.status(403).json({ message: "Only manager can view sub-managers" });
    }

    const subManagers = await User.find({ parentManager: req.user.id, role: "SUB_MANAGER" })
      .select("name email createdAt")
      .sort({ createdAt: -1 });

    res.json(subManagers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


//update sub manager
exports.updateSubManager = async (req, res) => {
  const { subManagerId } = req.params;
  const { name, email, password } = req.body;
  const manager = req.user;

  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(subManagerId)) {
      return res.status(400).json({ message: "Invalid sub-manager ID" });
    }

    // Only MANAGER can update
    if (manager.role !== "MANAGER") {
      return res.status(403).json({ message: "Only managers can update sub-managers" });
    }

    const subManager = await User.findById(subManagerId);

    if (!subManager || subManager.role !== "SUB_MANAGER") {
      return res.status(404).json({ message: "Sub-manager not found" });
    }

    // Ensure ownership
    if (subManager.parentManager.toString() !== manager.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update fields
    if (name !== undefined) subManager.name = name;
    if (email !== undefined) subManager.email = email;

    if (password) {
      subManager.password = await bcrypt.hash(password, 10);
    }

    await subManager.save();

    res.json({
      message: "Sub-manager updated successfully",
      subManager
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// DELETE sub-manager
exports.deleteSubManager = async (req, res) => {
  const { subManagerId } = req.params;
  const manager = req.user;

  try {
    if (!mongoose.Types.ObjectId.isValid(subManagerId)) {
      return res.status(400).json({ message: "Invalid sub-manager ID" });
    }

    if (manager.role !== "MANAGER") {
      return res.status(403).json({ message: "Only managers can delete sub-managers" });
    }

    const subManager = await User.findById(subManagerId);

    if (!subManager || subManager.role !== "SUB_MANAGER") {
      return res.status(404).json({ message: "Sub-manager not found" });
    }

    // Ownership check
    if (subManager.parentManager.toString() !== manager.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await subManager.deleteOne();

    res.json({ message: "Sub-manager deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


////////////// FLOORS //////////////////

//add floor
exports.addFloor = async (req, res) => {
  const { floorNumber } = req.body;

  try {
    const building = await getBuildingForUser(req.user);
    if (!building) {
      return res.status(400).json({ message: "Building not found" });
    }

    const floor = new Floor({
      floorNumber,
      building: building._id
    });

    await floor.save();
    res.status(201).json({ message: "Floor added", floor });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


//get floor
exports.getFloors = async (req, res) => {
  try {
    const building = await getBuildingForUser(req.user);
    if (!building) return res.status(404).json({ message: "Building not found" });

    const floors = await Floor.find({ building: building._id }).sort({ floorNumber: 1 });
    res.json(floors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// update floor
exports.updateFloor = async (req, res) => {
  const { floorId } = req.params;
  const { floorNumber } = req.body;
  const user = req.user;

  try {
    if (!canUpdate(user))
      return res.status(403).json({ message: "Update not allowed" });

    const floor = await Floor.findById(floorId).populate("building");
    if (!floor) return res.status(404).json({ message: "Floor not found" });

    if (!floor.building) {
      return res.status(400).json({ message: "Floor does not belong to a valid building" });
    }

    if (floor.building.manager.toString() !== user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    floor.floorNumber = floorNumber ?? floor.floorNumber;
    await floor.save();

    res.json({ message: "Floor updated", floor });
  } catch (err) {
    console.error("Update floor error:", err); // <-- log the real error
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



//delete floor
exports.deleteFloor = async (req, res) => {
  const { floorId } = req.params;
  const user = req.user;

  try {
    if (!canDelete(user))
      return res.status(403).json({ message: "Only manager can delete" });

    const floor = await Floor.findById(floorId).populate("building");
    if (!floor) return res.status(404).json({ message: "Floor not found" });

    if (floor.building.manager.toString() !== user.id)
      return res.status(403).json({ message: "Not authorized" });

    const rooms = await Room.countDocuments({ floor: floorId });
    if (rooms > 0)
      return res.status(400).json({ message: "Delete rooms first" });

    await floor.deleteOne();
    res.json({ message: "Floor deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/////////////////// ROOMS //////////////////////

// Add Room
exports.addRoom = async (req, res) => {
  const { floorId, roomNumber, type, capacity } = req.body;

  try {
    const floor = await Floor.findById(floorId).populate("building");
    if (!floor) {
      return res.status(400).json({ message: "Floor not found" });
    }

    const building = await getBuildingForUser(req.user);
    if (!building || floor.building._id.toString() !== building._id.toString()) {
      return res.status(403).json({ message: "You cannot add room to this floor" });
    }

    const room = new Room({
      roomNumber,
      type,
      capacity,
      floor: floorId
    });

    await room.save();
    res.status(201).json({ message: "Room added", room });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// GET Rooms
exports.getRooms = async (req, res) => {
  try {
    const building = await getBuildingForUser(req.user);
    if (!building) return res.status(404).json({ message: "Building not found" });

    const floors = await Floor.find({ building: building._id });
    const floorIds = floors.map(f => f._id);

    const rooms = await Room.find({ floor: { $in: floorIds } })
      .populate("floor", "floorNumber")
      .sort({ roomNumber: 1 });

    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


//update room
exports.updateRoom = async (req, res) => {
  const { roomId } = req.params;
  const { roomNumber, type, capacity } = req.body;
  const user = req.user;

  try {
    if (!canUpdate(user))
      return res.status(403).json({ message: "Update not allowed" });

    const room = await Room.findById(roomId).populate({
      path: "floor",
      populate: { path: "building" }
    });

    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.floor.building.manager.toString() !== user.id)
      return res.status(403).json({ message: "Not authorized" });

    room.roomNumber = roomNumber ?? room.roomNumber;
    room.type = type ?? room.type;
    room.capacity = capacity ?? room.capacity;

    await room.save();
    res.json({ message: "Room updated", room });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


//delete room
exports.deleteRoom = async (req, res) => {
  const { roomId } = req.params;
  const user = req.user;

  try {
    if (!canDelete(user))
      return res.status(403).json({ message: "Only manager can delete" });

    const room = await Room.findById(roomId).populate({
      path: "floor",
      populate: { path: "building" }
    });

    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.floor.building.manager.toString() !== user.id)
      return res.status(403).json({ message: "Not authorized" });

    await Person.deleteMany({ room: roomId });
    await room.deleteOne();

    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


////////////////////// PERSON /////////////////////////////////
//assign person
exports.assignPerson = async (req, res) => {
  const { name, phone, type, roomId } = req.body;

  try {
    const room = await Room.findById(roomId).populate({
      path: "floor",
      populate: { path: "building" }
    });

    if (!room) {
      return res.status(400).json({ message: "Room not found" });
    }

    const building = await getBuildingForUser(req.user);
    if (!building || room.floor.building._id.toString() !== building._id.toString()) {
      return res.status(403).json({ message: "You cannot assign person to this room" });
    }

    const person = new Person({
      name,
      phone,
      type,
      room: roomId,
      building: building._id
    });

    await person.save();
    res.status(201).json({ message: "Person assigned", person });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


//get peaple
exports.getPeople = async (req, res) => {
  try {
    const building = await getBuildingForUser(req.user);
    if (!building) return res.status(404).json({ message: "Building not found" });

    const people = await Person.find({ building: building._id })
      .populate("room", "roomNumber type")
      .sort({ name: 1 });

    res.json(people);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


//update person
exports.updatePerson = async (req, res) => {
  const { personId } = req.params;
  const { name, phone, type } = req.body;
  const user = req.user;

  try {
    if (!mongoose.Types.ObjectId.isValid(personId)) {
      return res.status(400).json({ message: "Invalid person ID" });
    }

    if (!canUpdate(user)) {
      return res.status(403).json({ message: "Update not allowed" });
    }

    const person = await Person.findById(personId);
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    //  Load building separately
    const building = await Building.findById(person.building);
    if (!building) {
      return res.status(400).json({ message: "Building not found" });
    }

    if (building.manager.toString() !== user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update fields
    if (name !== undefined) person.name = name;
    if (phone !== undefined) person.phone = phone;
    if (type !== undefined) person.type = type;

    await person.save();

    res.json({ message: "Person updated", person });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



//delete person
exports.deletePerson = async (req, res) => {
  const { personId } = req.params;
  const user = req.user;

  try {
    if (!canDelete(user))
      return res.status(403).json({ message: "Only manager can delete" });

    const person = await Person.findById(personId).populate("building");
    if (!person) return res.status(404).json({ message: "Person not found" });

    if (person.building.manager.toString() !== user.id)
      return res.status(403).json({ message: "Not authorized" });

    await person.deleteOne();
    res.json({ message: "Person removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

