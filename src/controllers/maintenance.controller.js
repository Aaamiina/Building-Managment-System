const Maintenance = require("../models/Maintenance");
const Building = require("../models/Building");

// Create a maintenance request (Manager / Super Manager)
exports.createRequest = async (req, res) => {
  const { title, description, building, floor, room, reportedByName } = req.body;
  const user = req.user; // Manager or Super Manager creating the request

  try {
    const newRequest = new Maintenance({
      title,
      description,
      building,
      floor,
      room,
      reportedBy: reportedByName || user.name // store the name of the person reported
    });

    await newRequest.save();
    res.status(201).json({ message: "Maintenance request created", request: newRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//  Get all maintenance requests (Manager / Super Manager)
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

//  Update maintenance request (Manager / Super Manager)
exports.updateRequest = async (req, res) => {
  const { requestId } = req.params;
  const { status, assignedToName } = req.body;
  const user = req.user;

  // Only Manager or Super Manager can update
  if (!["MANAGER", "SUPER_MANAGER"].includes(user.role)) {
    return res.status(403).json({ message: "Not authorized" });
  }

  try {
    const request = await Maintenance.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (status) request.status = status; // Update status
    if (assignedToName) request.assignedTo = assignedToName; // Assign a person (stored only)

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
