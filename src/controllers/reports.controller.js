const Building = require("../models/Building");
const Floor = require("../models/Floor");
const Room = require("../models/Room");
const Person = require("../models/Person");

// Manager Dashboard Report
exports.getManagerReport = async (req, res) => {
  const managerId = req.user.id;

  try {
    //  Find building managed by this manager
    const building = await Building.findOne({ manager: managerId });
    if (!building) return res.status(400).json({ message: "Building not found" });

    //  Get all floors in the building
    const floors = await Floor.find({ building: building._id });
    const floorIds = floors.map(f => f._id);

    //  Get all rooms in these floors
    const rooms = await Room.find({ floor: { $in: floorIds } });
    const totalRooms = rooms.length;

    //  Count occupied rooms
    const occupiedRooms = await Person.countDocuments({
      room: { $in: rooms.map(r => r._id) }
    });

    //  Count total people stored for this building
    const totalPeople = await Person.countDocuments({ building: building._id });

    //  Optionally, separate by type if needed
    const tenants = await Person.countDocuments({ building: building._id, type: "TENANT" });
    const staff = await Person.countDocuments({ building: building._id, type: "STAFF" });

    //  Return report
    res.json({
      building: building.name,
      totalFloors: floors.length,
      totalRooms,
      occupiedRooms,
      totalPeople,
      tenants,
      staff
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
