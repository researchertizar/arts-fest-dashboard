const db = require("../database/db");

exports.submitScore = (req, res) => {
  const { event_id, participant_id, judge_index, marks } = req.body;

  if (
    !event_id ||
    !participant_id ||
    judge_index === undefined ||
    marks === undefined
  ) {
    return res.status(400).json({ message: "All fields required" });
  }

  // Check if score is locked
  db.get(
  `SELECT is_locked FROM events WHERE id = ?`,
  [event_id],
  (err, event) => {
    if (event && event.is_locked) {
      return res.status(403).json({ message: "Event is locked" });
    }

      // Insert or update score
      db.run(
        `
        INSERT INTO scores (event_id, participant_id, judge_index, marks)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(event_id, participant_id, judge_index)
        DO UPDATE SET marks = excluded.marks
        `,
        [event_id, participant_id, judge_index, marks],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: "Score submitted" });
        }
      );
    }
  );
};

exports.getScoresByEvent = (req, res) => {
  const eventId = req.params.eventId;

  db.all(
    `
    SELECT 
      participants.name AS participant_name,
      teams.name AS team_name,
      scores.judge_index,
      scores.marks
    FROM scores
    JOIN participants ON scores.participant_id = participants.id
    JOIN teams ON participants.team_id = teams.id
    WHERE scores.event_id = ?
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

exports.lockEventScores = (req, res) => {
  const eventId = req.params.eventId;

  db.serialize(() => {
    db.run(
      `UPDATE events SET is_locked = 1 WHERE id = ?`,
      [eventId]
    );

    db.run(
      `UPDATE scores SET locked = 1 WHERE event_id = ?`,
      [eventId],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Event scores locked" });
      }
    );
  });
};

