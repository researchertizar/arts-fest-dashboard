const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");

const scoreboardController = require("../controllers/scoreboard.controller");

router.get("/", verifyToken, scoreboardController.getTeamScores);

module.exports = router;
