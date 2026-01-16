const express = require("express");
const router = express.Router();

const { authenticateAdmin } = require("../middleware/auth.middleware");
const teamController = require("../controllers/team.controller");

router.post("/", authenticateAdmin, teamController.createTeam);
router.get("/", authenticateAdmin, teamController.getTeams);

module.exports = router;
