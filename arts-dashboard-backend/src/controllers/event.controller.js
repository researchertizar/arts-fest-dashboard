const db = require("../database/db");

exports.createEvent = (req, res) => {
  const {
    name,
    category,
    max_marks,
    judge_count,
    judge_names,
    event_order
  } = req.body;

  if (
    !name ||
    !category ||
    !max_marks ||
    !judge_count ||
    !judge_names ||
    !event_order
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.run(
    `
    INSERT INTO events 
    (name, category, max_marks, judge_count, judge_names, event_order)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      name,
      category,
      max_marks,
      judge_count,
      JSON.stringify(judge_names),
      event_order
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Event created", id: this.lastID });
    }
  );
};

exports.getAllEvents = (req, res) => {
  db.all(
    `SELECT * FROM events ORDER BY event_order ASC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const formatted = rows.map(e => ({
        ...e,
        judge_names: JSON.parse(e.judge_names)
      }));

      res.json(formatted);
    }
  );
};

exports.activateEvent = (req, res) => {
  const eventId = req.params.id;

  db.serialize(() => {
    db.run(`UPDATE events SET is_active = 0`);
    db.run(
      `UPDATE events SET is_active = 1 WHERE id = ?`,
      [eventId],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Event activated" });
      }
    );
  });
};
