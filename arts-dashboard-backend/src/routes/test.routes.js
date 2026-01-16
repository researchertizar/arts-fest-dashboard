const express = require("express");
const router = express.Router();

const {
  authenticateAdmin,
  authenticateJudge
} = require("../middleware/auth.middleware");

router.get("/admin-test", authenticateAdmin, (req, res) => {
  res.json({ message: "Admin access confirmed" });
});

router.get("/judge-test", authenticateJudge, (req, res) => {
  res.json({ message: "Judge access confirmed" });
});

module.exports = router;
