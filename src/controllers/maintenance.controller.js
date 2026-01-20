const Maintenance = require("../models/Maintenance");
const Building = require("../models/Building");
const User = require("../models/User");

// Create a maintenance request (Manager / Sub Manager)
exports.createRequest = async (req, res) => {
  const { title, description, building, floor, room, reportedByName } = req.body;
  const user = req.user; // Manager or Sub Manager creating the request

  try {
    // Use user's building if not provided in request
    const buildingId = building || user.building;
    if (!buildingId) {
      return res.status(400).json({ message: "Building is required" });
    }

    const newRequest = new Maintenance({
      title,
      description,
      building: buildingId,
      floor,
      room,
      reportedBy: user.id // Store user ID instead of name to match schema
    });

    await newRequest.save();
    res.status(201).json({ message: "Maintenance request created", request: newRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//  Get all maintenance requests (Manager / Sub Manager)
exports.getRequests = async (req, res) => {
  const user = req.user;

  try {
    // Only show requests for the manager's building
    const query = { building: user.building };

    const requests = await Maintenance.find(query)
      .populate("assignedTo", "name") // assigned staff info if stored
      .populate("building", "name")
      .populate("floor", "floorNumber")
      .populate("room", "roomNumber type")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//  Update maintenance request (Manager / Sub Manager)
exports.updateRequest = async (req, res) => {
  const { requestId } = req.params;
  const { status, assignedToName } = req.body;
  const user = req.user;

  // Only Manager or Sub Manager can update
  if (!["MANAGER", "SUB_MANAGER"].includes(user.role)) {
    return res.status(403).json({ message: "Not authorized" });
  }

  try {
    const request = await Maintenance.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Validate status if provided
    if (status) {
      const validStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      request.status = status;
    }
    // assignedTo should be ObjectId, not name
    if (assignedToName) {
      // Try to find user by name or use as ObjectId if valid
      const assignedUser = await User.findOne({ name: assignedToName });
      if (assignedUser) {
        request.assignedTo = assignedUser._id;
      } else {
        return res.status(404).json({ message: "Assigned user not found" });
      }
    }

    await request.save();
    res.json({ message: "Maintenance request updated", request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//  Get a single maintenance request by ID
exports.getRequestById = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await Maintenance.findById(requestId)
      .populate("building", "name")
      .populate("floor", "floorNumber")
      .populate("room", "roomNumber type");

    if (!request) return res.status(404).json({ message: "Request not found" });

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
