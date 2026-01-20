const Floor = require("../models/Floor");
const Room = require("../models/Room");
const Person = require("../models/Person");
const Building = require("../models/Building");
const User = require("../models/User");
const ActionRequest = require("../models/ActionRequest");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// --- HELPER: HELO BUILDING-KA USER-KA ---
const getBuildingForUser = async (user) => {
  try {
    if (!user) return null;
    if (user.role === "MANAGER") {
      return await Building.findOne({ manager: user.id || user._id });
    }
    if (user.role === "SUB_MANAGER") {
      const bId = user.building || user.buildingId;
      if (!bId) return null;
      return await Building.findById(bId);
    }
    return null;
  } catch (err) {
    console.error("Helper Error:", err);
    return null;
  }
};

// --- HELPER: MAAMULIDDA CODSIYADA (SUB-MANAGER ONLY) ---
const handleAction = async (req, res, targetType, actionType, targetId, payload = null) => {
  const user = req.user;
  if (user.role === "SUB_MANAGER" && (actionType === "UPDATE" || actionType === "DELETE")) {
    const building = await getBuildingForUser(user);
    if (!building) return res.status(400).json({ message: "Building configuration missing" });

    const request = new ActionRequest({
      requestedBy: user.id,
      building: building._id,
      actionType,
      targetType,
      targetId,
      payload,
      status: "PENDING"
    });

    await request.save();
    return res.status(202).json({
      message: "Codsigan wuxuu u baahan yahay ansixin Manager",
      isPending: true
    });
  }
  return false;
};

// --- SUB-MANAGER CONTROLLERS ---
exports.createSubManager = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const building = await getBuildingForUser(req.user);
    if (!building) return res.status(400).json({ message: "Manager building not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const subManager = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "SUB_MANAGER",
      building: building._id,
      parentManager: req.user.id
    });
    await subManager.save();
    res.status(201).json({ message: "Sub-manager created", subManager });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getSubManagers = async (req, res) => {
  try {
    const subManagers = await User.find({ parentManager: req.user.id }).select("-password");
    res.json(subManagers);
  } catch (err) { res.status(500).json({ message: "Error fetching sub-managers" }); }
};


exports.updateSubManager = async (req, res) => {
  const { subManagerId } = req.params;
  const { name, email, password } = req.body;

  try {
    // 1. Hel Sub-manager-ka oo hubi inuu jiro
    const subManager = await User.findById(subManagerId);
    if (!subManager || subManager.role !== "SUB_MANAGER") {
      return res.status(404).json({ message: "Sub-manager not found" });
    }

    // 2. Hubi in Manager-ka codsanaya uu isagu leeyahay Sub-manager-kan
    if (subManager.parentManager.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this sub-manager" });
    }

    // 3. Cusboonaysii xogta
    if (name) subManager.name = name.trim();
    if (email) {
      const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: subManagerId } });
      if (existing) return res.status(400).json({ message: "Email already in use by another user" });
      subManager.email = email.toLowerCase().trim();
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      subManager.password = await bcrypt.hash(password, salt);
    }

    await subManager.save();
    res.json({ message: "Sub-manager updated successfully", subManager: { name: subManager.name, email: subManager.email } });
  } catch (err) {
    res.status(500).json({ message: "Server error during update", error: err.message });
  }
};



exports.deleteSubManager = async (req, res) => {
  const { subManagerId } = req.params;

  try {
    const subManager = await User.findById(subManagerId);

    if (!subManager || subManager.role !== "SUB_MANAGER") {
      return res.status(404).json({ message: "Sub-manager not found" });
    }

    // Hubi in Manager-ka codsanaya uu yahay kii abuuray
    if (subManager.parentManager.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this sub-manager" });
    }

    await User.findByIdAndDelete(subManagerId);
    res.json({ message: "Sub-manager deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error during deletion", error: err.message });
  }
};
// --- FLOOR CONTROLLERS ---
exports.getFloors = async (req, res) => {
  try {
    const building = await getBuildingForUser(req.user);
    if (!building) return res.status(404).json({ message: "Building not found" });
    const floors = await Floor.find({ building: building._id }).sort({ floorNumber: 1 });
    res.json(floors);
  } catch (err) { res.status(500).json({ message: "Internal Server Error" }); }
};

exports.addFloor = async (req, res) => {
  try {
    const building = await getBuildingForUser(req.user);
    if (!building) return res.status(400).json({ message: "Building missing" });
    const floor = new Floor({ floorNumber: req.body.floorNumber, building: building._id });
    await floor.save();
    res.status(201).json(floor);
  } catch (err) { res.status(500).json({ message: "Error adding floor" }); }
};

exports.updateFloor = async (req, res) => {
  const { floorId } = req.params;
  try {
    const isPending = await handleAction(req, res, "FLOOR", "UPDATE", floorId, req.body);
    if (isPending) return;
    const floor = await Floor.findByIdAndUpdate(floorId, req.body, { new: true });
    res.json(floor);
  } catch (err) { res.status(500).json({ message: "Error updating floor" }); }
};

exports.deleteFloor = async (req, res) => {
  const { floorId } = req.params;
  try {
    const isPending = await handleAction(req, res, "FLOOR", "DELETE", floorId);
    if (isPending) return;
    await Floor.findByIdAndDelete(floorId);
    res.json({ message: "Floor deleted" });
  } catch (err) { res.status(500).json({ message: "Error deleting floor" }); }
};

// --- ROOM CONTROLLERS ---
exports.getRooms = async (req, res) => {
  try {
    const building = await getBuildingForUser(req.user);
    if (!building) return res.status(404).json({ message: "Building not found" });
    const floors = await Floor.find({ building: building._id });
    const floorIds = floors.map(f => f._id);
    const rooms = await Room.find({ floor: { $in: floorIds } }).populate("floor", "floorNumber");
    res.json(rooms);
  } catch (err) { res.status(500).json({ message: "Error fetching rooms" }); }
};

exports.addRoom = async (req, res) => {
  try {
    const { roomNumber, type, capacity, floorId } = req.body;

    // 1. Hubi in xogta muhiimka ah ay timid
    if (!roomNumber || !floorId) {
      return res.status(400).json({ message: "roomNumber iyo floorId waa khasab" });
    }

    // 2. Hubi in Floor-ku uu jiro
    const floorExists = await Floor.findById(floorId);
    if (!floorExists) {
      return res.status(404).json({ message: "Dabaqa la doonayo lama helin" });
    }

    // 3. Abuur qolka
    const room = new Room({
      roomNumber,
      type,
      capacity,
      floor: floorId, // Hubi in magaca field-ka uu yahay 'floor' sida Model-kaagu yahay
      status: "AVAILABLE"
    });

    await room.save();
    res.status(201).json(room);

  } catch (err) {
    console.error("ADD ROOM ERROR:", err); // Tani waxay ku tusaysaa Terminal-ka ciladda dhabta ah
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const isPending = await handleAction(req, res, "ROOM", "UPDATE", req.params.roomId, req.body);
    if (isPending) return;
    const room = await Room.findByIdAndUpdate(req.params.roomId, req.body, { new: true });
    res.json(room);
  } catch (err) { res.status(500).json({ message: "Error updating room" }); }
};

exports.deleteRoom = async (req, res) => {
  try {
    const isPending = await handleAction(req, res, "ROOM", "DELETE", req.params.roomId);
    if (isPending) return;
    await Room.findByIdAndDelete(req.params.roomId);
    res.json({ message: "Room deleted" });
  } catch (err) { res.status(500).json({ message: "Error deleting room" }); }
};

// --- PERSON CONTROLLERS ---
exports.getPeople = async (req, res) => {
  try {
    const building = await getBuildingForUser(req.user);
    if (!building) return res.status(404).json({ message: "Building missing" });

    // Waxaan soo qaadaynaa dadka, waxaana soo raacinaynaa xogta qolka (Room Data)
    const people = await Person.find({ building: building._id })
      .populate({
        path: 'room',         // Field-ka ku jira Person model
        select: 'roomNumber'  // Kaliya soo qaad nambarka qolka
      });

    console.log("People Found:", people); // Ka eeg terminal-ka haddii 'room' uu yahay null
    res.json(people);
  } catch (err) {
    console.error("Error in getPeople:", err);
    res.status(500).json({ message: "Error fetching people" });
  }
};
exports.assignPerson = async (req, res) => {
  // Hubi in 'room' uu yahay magaca aad ka soo dirayso Frontend-ka
  const { name, phone, type, room, buildingId } = req.body; 

  try {
    const person = new Person({
      name,
      phone,
      type,
      room, // Halkan waa inuu ahaadaa ObjectId-ga qolka
      building: buildingId
    });

    await person.save();

    // Marka qofka la deajiyo, qolka xaaladiisa beddel
    if (room) {
      const Room = require("../models/Room");
      await Room.findByIdAndUpdate(room, { status: "OCCUPIED" });
    }

    res.status(201).json(person);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePerson = async (req, res) => {
  try {
    const isPending = await handleAction(req, res, "PERSON", "UPDATE", req.params.personId, req.body);
    if (isPending) return;
    const person = await Person.findByIdAndUpdate(req.params.personId, req.body, { new: true });
    res.json(person);
  } catch (err) { res.status(500).json({ message: "Error" }); }
};

exports.deletePerson = async (req, res) => {
  try {
    const isPending = await handleAction(req, res, "PERSON", "DELETE", req.params.personId);
    if (isPending) return;
    const person = await Person.findById(req.params.personId);
    if (person && person.room) await Room.findByIdAndUpdate(person.room, { status: "AVAILABLE" });
    await Person.findByIdAndDelete(req.params.personId);
    res.json({ message: "Person record deleted" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
};

// --- APPROVALS (MANAGER ONLY) ---
exports.getPendingRequests = async (req, res) => {
  try {
    const building = await getBuildingForUser(req.user);
    const requests = await ActionRequest.find({
      building: building._id,
      status: "PENDING"
    }).populate("requestedBy", "name email");
    res.json(requests);
  } catch (err) { res.status(500).json({ message: "Error fetching requests" }); }
};

exports.reviewRequest = async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;
  try {
    const request = await ActionRequest.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (status === "APPROVED") {
      const { targetType, targetId, actionType, payload } = request;
      let Model;
      if (targetType === "FLOOR") Model = Floor;
      else if (targetType === "ROOM") Model = Room;
      else if (targetType === "PERSON") Model = Person;

      if (actionType === "UPDATE") await Model.findByIdAndUpdate(targetId, payload);
      else if (actionType === "DELETE") await Model.findByIdAndDelete(targetId);
    }
    request.status = status;
    request.reason = reason;
    await request.save();
    res.json({ message: `Request ${status}` });
  } catch (err) { res.status(500).json({ message: "Error processing request" }); }
};