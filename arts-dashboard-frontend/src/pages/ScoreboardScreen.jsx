import { useEffect, useState } from "react";
import { getScoreboard } from "../services/scoreboardService";

export default function ScoreboardScreen() {
  const [scores, setScores] = useState([]);

  const loadScores = async () => {
    const data = await getScoreboard();
    setScores(data);
  };

  useEffect(() => {
    loadScores();
    const interval = setInterval(loadScores, 5000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-6">
        Live Scoreboard
      </h1>

      <div className="max-w-3xl mx-auto space-y-4">
        {scores.map((team, index) => (
          <div
            key={team.id}
            className="flex justify-between items-center p-4 rounded shadow"
            style={{ backgroundColor: team.color || "#1f2937" }}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold">
                #{index + 1}
              </span>
              <span className="text-xl font-semibold">
                {team.name}
              </span>
            </div>

            <span className="text-2xl font-bold">
              {team.total_score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
