const express = require("express");
const router = express.Router();
const approvalCtrl = require("../controllers/manager/approval.controller");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.get("/pending", auth, role("MANAGER"), approvalCtrl.getPending);
router.patch("/:id", auth, role("MANAGER"), approvalCtrl.review);

module.exports = router;
