import { useEffect, useState } from "react";
import api from "../services/api";

export default function OnStageScreen() {
  const [participants, setParticipants] = useState([]);

  const loadParticipants = async () => {
    const events = await api.get("/events");
    const active = events.data.find(e => e.is_active);
    if (!active) return;

    const res = await api.get(`/participants/event/${active.id}`);
    setParticipants(res.data);
  };

  useEffect(() => {
    loadParticipants();
    const interval = setInterval(loadParticipants, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        On-Stage Participants
      </h1>

      <div className="max-w-3xl mx-auto space-y-3">
        {participants.map((p, i) => (
          <div
            key={p.id}
            className="p-4 rounded text-xl"
            style={{ backgroundColor: p.color || "#374151" }}
          >
            {i + 1}. {p.name} — {p.team_name}
          </div>
        ))}
      </div>
    </div>
  );
}
