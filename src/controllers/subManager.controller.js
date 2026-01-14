const Floor = require("../models/Floor");
const Room = require("../models/Room");
const Person = require("../models/Person");


const ActionRequest = require("../models/ActionRequest");

// CREATE FLOOR (allowed)
exports.createFloor = async (req, res) => {
  const floor = await Floor.create({
    name: req.body.name,
    building: req.user.building
  });

  res.status(201).json(floor);
};

// UPDATE FLOOR (approval)
exports.updateFloor = async (req, res) => {
  try {
    const { floorId } = req.params;
    const { floorNumber } = req.body;

    const floor = await Floor.findById(floorId);
    if (!floor)
      return res.status(404).json({ message: "Floor not found" });

    // CREATE APPROVAL REQUEST
    await ActionRequest.create({
      action: "UPDATE_FLOOR",
      targetId: floor._id,
      building: floor.building,     // ✅ REQUIRED FIELD
      payload: { floorNumber },
      requestedBy: req.user.id,
      role: "SUB_MANAGER",
      status: "PENDING"
    });

    res.json({
      message: "Floor update request sent for approval"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// DELETE FLOOR (approval only)
exports.deleteFloor = async (req, res) => {
  await ActionRequest.create({
    requestedBy: req.user.id,
    building: req.user.building,
    actionType: "DELETE",
    targetType: "FLOOR",
    targetId: req.params.id
  });

  res.json({ message: "Floor delete request sent for approval" });
};


//rooms

// CREATE ROOM
exports.createRoom = async (req, res) => {
  const room = await Room.create({
    ...req.body,
    building: req.user.building
  });

  res.status(201).json(room);
};

// UPDATE ROOM (approval)
exports.updateRoom = async (req, res) => {
  await ActionRequest.create({
    requestedBy: req.user.id,
    building: req.user.building,
    actionType: "UPDATE",
    targetType: "ROOM",
    targetId: req.params.id,
    payload: req.body
  });

  res.json({ message: "Room update request sent for approval" });
};

// DELETE ROOM (approval)
exports.deleteRoom = async (req, res) => {
  await ActionRequest.create({
    requestedBy: req.user.id,
    building: req.user.building,
    actionType: "DELETE",
    targetType: "ROOM",
    targetId: req.params.id
  });

  res.json({ message: "Room delete request sent for approval" });
};


//person

// ASSIGN PERSON
exports.createPerson = async (req, res) => {
  const person = await Person.create({
    ...req.body,
    building: req.user.building
  });

  res.status(201).json(person);
};

// UPDATE PERSON (approval)
exports.updatePerson = async (req, res) => {
  await ActionRequest.create({
    requestedBy: req.user.id,
    building: req.user.building,
    actionType: "UPDATE",
    targetType: "PERSON",
    targetId: req.params.id,
    payload: req.body
  });

  res.json({ message: "Person update request sent for approval" });
};

// DELETE PERSON (approval)
exports.deletePerson = async (req, res) => {
  await ActionRequest.create({
    requestedBy: req.user.id,
    building: req.user.building,
    actionType: "DELETE",
    targetType: "PERSON",
    targetId: req.params.id
  });

  res.json({ message: "Person delete request sent for approval" });
};
