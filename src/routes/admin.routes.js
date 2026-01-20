const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const adminCtrl = require("../controllers/admin.controller");

// All routes here require SUPER_ADMIN role
router.use(auth, role("SUPER_ADMIN"));

// Manager Routes
router.get("/managers", adminCtrl.getAllManagers);
router.post("/create-manager", adminCtrl.createManager);
router.put("/manager/:id", adminCtrl.updateManager);
router.delete("/manager/:id", adminCtrl.deleteManager);

// Building Routes
router.get("/buildings", adminCtrl.getAllBuildings);
router.post("/create-building", adminCtrl.createBuilding);
router.put("/building/:id", adminCtrl.updateBuilding);
router.delete("/building/:id", adminCtrl.deleteBuilding);

module.exports = router;