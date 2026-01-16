const express = require("express");
const router = express.Router();

const { authenticateAdmin } = require("../middleware/auth.middleware");
const participantController = require("../controllers/participant.controller");

console.log("PARTICIPANT CONTROLLER:", participantController);

router.post(
  "/",
  authenticateAdmin,
  participantController.createParticipant
);

router.get(
  "/event/:eventId",
  authenticateAdmin,
  participantController.getParticipantsByEvent
);

module.exports = router;
