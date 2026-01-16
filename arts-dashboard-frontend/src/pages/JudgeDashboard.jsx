import { useEffect, useState } from "react";
import { getActiveEventParticipants } from "../services/participantService";
import { submitScore } from "../services/scoreService";

export default function JudgeDashboard() {
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [marks, setMarks] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getActiveEventParticipants();
    setEvent(data.event);
    setParticipants(data.participants);
  };

  const handleScoreChange = (pid, value) => {
    setMarks({ ...marks, [pid]: value });
  };

  const handleSubmit = async (participantId) => {
    await submitScore({
      event_id: event.id,
      participant_id: participantId,
      judge_index: 0,
      marks: Number(marks[participantId]),
    });
    alert("Score submitted");
  };

  if (!event) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">
          No active event
        </h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">
        Judge Panel
      </h1>
      <p className="text-gray-600 mb-4">
        Event: {event.name}
      </p>

      <div className="grid gap-4">
        {participants.map((p) => (
          <div
            key={p.id}
            className="border p-4 rounded flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-500">
                Team: {p.team_name}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <input
                type="number"
                className="border p-1 w-20"
                onChange={(e) =>
                  handleScoreChange(p.id, e.target.value)
                }
              />
              <button
                onClick={() => handleSubmit(p.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
