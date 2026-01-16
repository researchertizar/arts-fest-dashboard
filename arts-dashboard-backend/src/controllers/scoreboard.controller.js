const db = require("../database/db");

exports.getTeamScores = (req, res) => {
  db.all(
    `
    SELECT 
      teams.id,
      teams.name,
      teams.color,
      SUM(scores.marks) AS total_score
    FROM scores
    JOIN participants ON scores.participant_id = participants.id
    JOIN teams ON participants.team_id = teams.id
    WHERE scores.locked = 1
    GROUP BY teams.id
    ORDER BY total_score DESC
    `,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
};
