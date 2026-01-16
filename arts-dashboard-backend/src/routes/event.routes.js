const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { authenticateAdmin } = require("../middleware/auth.middleware");

// ACTIVATE EVENT (ONLY ONE AT A TIME)
router.post("/activate/:id", authenticateAdmin, (req, res) => {
  const eventId = req.params.id;

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.run("UPDATE events SET is_active = 0", (err) => {
      if (err) {
        db.run("ROLLBACK");
        return res.status(500).json({ error: err.message });
      }
    });

    db.run(
      "UPDATE events SET is_active = 1 WHERE id = ?",
      [eventId],
      (err) => {
        if (err) {
          db.run("ROLLBACK");
          return res.status(500).json({ error: err.message });
        }

        db.run("COMMIT");
        return res.json({ success: true, activeEventId: eventId });
      }
    );
  });
});

module.exports = router;
