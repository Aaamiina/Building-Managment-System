const express = require("express");
const router = express.Router();

const {
  createRequest,
  getRequests,
  updateRequest,
  getRequestById
} = require("../controllers/maintenance.controller");

const auth = require("../middleware/auth");
const role = require("../middleware/role");

//  Manager / Super Manager creates a maintenance request
router.post(
  "/",
  auth,
  role("MANAGER", "SUPER_MANAGER"), // only managers can create
  createRequest
);

//  Manager / Super Manager get all maintenance requests for their building
router.get(
  "/",
  auth,
  role("MANAGER", "SUPER_MANAGER"),
  getRequests
);

// Manager / Super Manager update a request (status / assign someone)
router.patch(
  "/:requestId",
  auth,
  role("MANAGER", "SUPER_MANAGER"),
  updateRequest
);

//  Get a single request by ID (Manager/Super Manager)
router.get(
  "/:requestId",
  auth,
  role("MANAGER", "SUPER_MANAGER"),
  getRequestById
);

module.exports = router;
