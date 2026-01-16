import { useEffect, useState } from "react";
import { getActiveEventParticipants } from "../services/participantService";
import { submitScore } from "../services/scoreService";
import { socket } from "../services/socket";
import { CheckCircle, AlertCircle, Save, User } from "lucide-react";
import MediaDisplay from "../components/MediaDisplay";

export default function JudgeDashboard() {
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [marks, setMarks] = useState({});
  const [status, setStatus] = useState({}); // { pid: 'idle' | 'saving' | 'saved' | 'error' }

  const loadData = async () => {
    try {
      const data = await getActiveEventParticipants();
      setEvent(data.event);
      setParticipants(data.participants);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    
    socket.on("eventActivated", () => {
      loadData();
    });

    return () => {
      socket.off("eventActivated");
    };
  }, []);

  const handleScoreChange = (pid, value) => {
    setMarks({ ...marks, [pid]: value });
    setStatus({ ...status, [pid]: 'idle' });
  };

  const handleSubmit = async (participantId) => {
    const mark = marks[participantId];
    if (mark === undefined || mark === "") return;

    setStatus({ ...status, [participantId]: 'saving' });
    try {
      await submitScore({
        event_id: event.id,
        participant_id: participantId,
        judge_index: 0, // In a real app, this would be the judge's assigned index
        marks: Number(mark),
      });
      setStatus({ ...status, [participantId]: 'saved' });
      setTimeout(() => {
        setStatus(prev => ({ ...prev, [participantId]: 'idle' }));
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus({ ...status, [participantId]: 'error' });
    }
  };

  const filteredParticipants = participants.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.team_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-white p-12 rounded-3xl shadow-xl">
          <AlertCircle size={64} className="mx-auto text-amber-500 mb-4" />
          <h1 className="text-2xl font-black text-gray-900 mb-2">No Active Event</h1>
          <p className="text-gray-500">Please wait for the administrator to activate an event for judging.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Bar */}
      <div className="bg-white border-b sticky top-0 z-20 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">Judging Panel</h1>
            <div className="flex items-center gap-2 mt-1">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{event.name}</span>
            </div>
          </div>
          <div className="hidden md:block text-right">
             <p className="text-xs font-bold text-gray-400 uppercase">Max Points</p>
             <p className="text-lg font-black text-blue-600">{event.max_marks}</p>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto p-6">
        <div className="mb-8 flex gap-4">
          <input 
            type="text" 
            placeholder="Search participants or teams..." 
            className="flex-1 bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid gap-6">
          {filteredParticipants.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row items-stretch">
                {/* Participant Media/Icon */}
                <div className="w-full md:w-48 bg-gray-100 flex-shrink-0 relative">
                   {p.image_url || p.video_url ? (
                      <MediaDisplay 
                        imageUrl={p.image_url} 
                        videoUrl={p.video_url} 
                        className="w-full h-full md:h-full aspect-video md:aspect-square object-cover"
                      />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 py-8">
                         <User size={48} />
                      </div>
                   )}
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-gray-900 border border-gray-100">
                      ORDER #{p.order_no}
                   </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></div>
                      <span className="text-gray-500 font-bold uppercase text-sm tracking-wide">{p.team_name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="00"
                        max={event.max_marks}
                        min="0"
                        className="bg-gray-50 border-2 border-gray-200 rounded-2xl px-6 py-4 w-32 text-2xl font-black text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        value={marks[p.id] || ""}
                        onChange={(e) => handleScoreChange(p.id, e.target.value)}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">/ {event.max_marks}</span>
                    </div>

                    <button
                      onClick={() => handleSubmit(p.id)}
                      disabled={status[p.id] === 'saving'}
                      className={`
                        flex items-center gap-2 px-8 py-4 rounded-2xl font-black transition-all
                        ${status[p.id] === 'saved' 
                          ? 'bg-green-100 text-green-600' 
                          : status[p.id] === 'error'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                        }
                      `}
                    >
                      {status[p.id] === 'saving' ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : status[p.id] === 'saved' ? (
                        <CheckCircle size={24} />
                      ) : status[p.id] === 'error' ? (
                        <AlertCircle size={24} />
                      ) : (
                        <Save size={24} />
                      )}
                      <span>{status[p.id] === 'saved' ? 'Saved' : 'Submit'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Stats Floating Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-8 backdrop-blur-xl bg-opacity-90">
         <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Participants</span>
            <span className="text-xl font-black">{participants.length}</span>
         </div>
         <div className="w-px h-6 bg-gray-700"></div>
         <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Graded</span>
            <span className="text-xl font-black text-green-400">
               {Object.keys(marks).filter(k => marks[k] !== "").length}
            </span>
         </div>
      </div>
    </div>
  );
}
