const db = require("../database/db");

exports.create = (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message required" });
  }

  db.run(
    `INSERT INTO announcements (message) VALUES (?)`,
    [message],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const io = req.app.get("io");
      io.emit("announcementCreated", { message });
      
      res.json({ message: "Announcement created" });
    }
  );
};

exports.getActive = (req, res) => {
  db.all(
    `SELECT * FROM announcements WHERE active = 1 ORDER BY id DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
};
