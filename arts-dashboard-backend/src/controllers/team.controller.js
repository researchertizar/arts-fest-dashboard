const db = require("../database/db");

exports.createTeam = (req, res) => {
  const { name, color, code } = req.body;

  if (!name || !color || !code) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.run(
    `
    INSERT INTO teams (name, color, code)
    VALUES (?, ?, ?)
    `,
    [name, color, code],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Team created", id: this.lastID });
    }
  );
};

exports.getTeams = (req, res) => {
  db.all(`SELECT * FROM teams`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};
