import { useEffect, useState } from "react";
import api from "../services/api";
import { socket } from "../services/socket";
import { User, PlayCircle, Clock } from "lucide-react";
import MediaDisplay from "../components/MediaDisplay";

export default function OnStageScreen() {
  const [participants, setParticipants] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);

  const loadParticipants = async () => {
    try {
      const eventsRes = await api.get("/events");
      const active = eventsRes.data.find(e => e.is_active);
      setActiveEvent(active);
      if (!active) {
        setParticipants([]);
        return;
      }

      const res = await api.get(`/participants?eventId=${active.id}`);
      setParticipants(res.data);
    } catch (err) {
      console.error("Failed to load participants", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadParticipants();
    
    socket.on("eventActivated", () => {
      loadParticipants();
    });

    return () => {
      socket.off("eventActivated");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 p-6 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Arts Fest 2025
            </h1>
            <p className="text-gray-400 mt-1 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Live On Stage
            </p>
          </div>
          {activeEvent && (
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-100">{activeEvent.name}</div>
              <div className="text-gray-400">{activeEvent.category}</div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-12">
        {!activeEvent ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
            <Clock size={64} className="mb-4 animate-pulse" />
            <h2 className="text-2xl font-medium">Waiting for next event to start...</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {participants.map((p, i) => (
              <div
                key={p.id}
                className="group relative bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
              >
                {/* Media Section */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-800 relative">
                  {p.image_url || p.video_url ? (
                    <MediaDisplay 
                      imageUrl={p.image_url} 
                      videoUrl={p.video_url} 
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                      <User size={80} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1 rounded-full text-sm font-bold border border-white/10">
                    Order #{p.order_no}
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold truncate pr-2">{p.name}</h3>
                  </div>
                  <div 
                    className="inline-block px-3 py-1 rounded-lg text-sm font-semibold mb-4"
                    style={{ backgroundColor: `${p.color}22`, color: p.color, border: `1px solid ${p.color}44` }}
                  >
                    {p.team_name}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2">
                     <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000"
                          style={{ width: i === 0 ? '100%' : '0%' }}
                        ></div>
                     </div>
                     {i === 0 && <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Performing</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer Info */}
      {activeEvent && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-950 to-transparent p-8 pointer-events-none">
          <div className="max-w-7xl mx-auto flex justify-between items-end">
             <div className="bg-blue-600/20 backdrop-blur-xl border border-blue-500/30 p-4 rounded-2xl max-w-sm">
                <p className="text-blue-400 text-sm font-bold uppercase mb-1">Coming Up Next</p>
                <p className="text-white text-lg font-bold">
                  {participants[1] ? participants[1].name : "Stay tuned"}
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
