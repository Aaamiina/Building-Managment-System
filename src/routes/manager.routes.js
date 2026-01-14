// src/routes/manager.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const {
  addFloor,
  updateFloor,
  deleteFloor,
  addRoom,
  updateRoom,
  deleteRoom,
  assignPerson,
  updatePerson,
  deletePerson,
  createSubManager,
  getFloors,
  getRooms,
  getPeople,
  getSubManagers,
  updateSubManager,
  deleteSubManager
} = require("../controllers/manager.controller");

// Floor routes
router.post("/add-floor", auth, role("MANAGER"), addFloor);
router.patch("/update-floor/:floorId", auth, role("MANAGER"), updateFloor);
router.delete("/delete-floor/:floorId", auth, role("MANAGER"), deleteFloor);
router.get("/floors", auth, role("MANAGER"), getFloors);

// Room routes
router.post("/add-room", auth, role("MANAGER"), addRoom);
router.patch("/update-room/:roomId", auth, role("MANAGER"), updateRoom);
router.delete("/delete-room/:roomId", auth, role("MANAGER"), deleteRoom);
router.get("/rooms", auth, role("MANAGER"), getRooms);

// Person routes
router.post("/assign-person", auth, role("MANAGER"), assignPerson);
router.patch("/update-person/:personId", auth, role("MANAGER"), updatePerson);
router.delete("/delete-person/:personId", auth, role("MANAGER"), deletePerson);
router.get("/people", auth, role("MANAGER"), getPeople);

// Sub-manager routes
router.post("/create-sub-manager", auth, role("MANAGER"), createSubManager);
router.get("/sub-managers", auth, role("MANAGER"), getSubManagers);
router.patch("/Update-sub-managers/:subManagerId", auth, role("MANAGER"), updateSubManager);
router.delete("/delete-sub-managers/:subManagerId", auth, role("MANAGER"), deleteSubManager);


module.exports = router;
