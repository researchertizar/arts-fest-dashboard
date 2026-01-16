const express = require("express");
const router = express.Router();
const {
  verifyToken,
  allowAdminOnly
} = require("../middleware/auth.middleware");

const announcementController = require("../controllers/announcement.controller");

router.post("/", verifyToken, allowAdminOnly, announcementController.create);
router.get("/", verifyToken, announcementController.getActive);

module.exports = router;
