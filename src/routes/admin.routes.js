const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { createManager, createBuilding } = require("../controllers/admin.controller");

// Only SUPER_ADMIN can create managers and buildings
router.post("/create-manager", auth, role("SUPER_ADMIN"), createManager);
router.post("/create-building", auth, role("SUPER_ADMIN"), createBuilding);

module.exports = router;
