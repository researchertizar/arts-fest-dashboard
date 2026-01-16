const db = require("../database/db");

/**
 * Admin: Add participant
 */
exports.addParticipant = (req, res) => {
  const { name, team_id, event_id, order_no, image_url, video_url } = req.body;

  if (!name || !team_id || !event_id || !order_no) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.run(
    `
    INSERT INTO participants (name, team_id, event_id, order_no, image_url, video_url)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [name, team_id, event_id, order_no, image_url, video_url],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Participant added", id: this.lastID });
    }
  );
};

/**
 * Admin: List participants by event (query param)
 * /api/participants?eventId=1
 */
exports.getParticipants = (req, res) => {
  const eventId = req.query.eventId;

  if (!eventId) {
    return res.status(400).json({ message: "eventId required" });
  }

  db.all(
    `
    SELECT participants.*, teams.name AS team_name, teams.color
    FROM participants
    JOIN teams ON participants.team_id = teams.id
    WHERE event_id = ?
    ORDER BY order_no ASC
    `,
    [eventId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
};

/**
 * Judge: View participants for ACTIVE event
 */
exports.getParticipantsForJudge = (req, res) => {
  db.get(
    `SELECT id FROM events WHERE is_active = 1`,
    [],
    (err, event) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!event) {
        return res.json([]);
      }

      db.all(
        `
        SELECT participants.*, teams.name AS team_name, teams.color
        FROM participants
        JOIN teams ON participants.team_id = teams.id
        WHERE participants.event_id = ?
        ORDER BY order_no ASC
        `,
        [event.id],
        (err, rows) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json(rows);
        }
      );
    }
  );
};
