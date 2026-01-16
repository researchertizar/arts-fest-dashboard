const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.get("/scores", (req, res) => {
  db.all(`SELECT * FROM scores`, [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

router.get("/participants", (req, res) => {
  db.all(`
    SELECT 
      p.id AS participant_id,
      p.name AS participant_name,
      p.team_id,
      t.name AS team_name
    FROM participants p
    LEFT JOIN teams t ON p.team_id = t.id
  `, [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

module.exports = router;
