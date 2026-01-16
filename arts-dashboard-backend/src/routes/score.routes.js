const express = require("express");
const router = express.Router();

const {
  authenticateJudge,
  authenticateAdmin
} = require("../middleware/auth.middleware");

const scoreController = require("../controllers/score.controller");

router.post(
  "/submit",
  authenticateJudge,
  scoreController.submitScore
);

router.get(
  "/event/:eventId",
  authenticateAdmin,
  scoreController.getScoresByEvent
);

router.post(
  "/lock/event/:eventId",
  authenticateAdmin,
  scoreController.lockEventScores
);

module.exports = router;
