const express = require("express");
const router = express.Router();

const { getManagerReport } = require("../controllers/reports.controller");

const auth = require("../middleware/auth");
const role = require("../middleware/role");

//  Manager / Super Manager dashboard report
router.get(
  "/manager",
  auth,
  role("MANAGER", "SUPER_MANAGER"),
  getManagerReport
);

module.exports = router;
