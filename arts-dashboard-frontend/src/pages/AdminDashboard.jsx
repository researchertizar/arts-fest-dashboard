import { useEffect, useState } from "react";
import { getEvents, activateEvent } from "../services/eventService";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  const handleActivate = async (id) => {
    await activateEvent(id);
    loadEvents();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid gap-4">
        {events.map((e) => (
          <div
            key={e.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{e.name}</h2>
              <p className="text-sm text-gray-500">Judges: {e.judge_count}</p>
            </div>

            <button
              onClick={() => !e.is_active && handleActivate(e.id)}
              disabled={e.is_active}
              className={`px-4 py-1 rounded text-white ${
                e.is_active
                  ? "bg-green-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {e.is_active ? "Active" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
