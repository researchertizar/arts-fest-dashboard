import { useEffect, useState } from "react";
import { getEvents, activateEvent, createEvent } from "../services/eventService";
import { getTeams, createTeam } from "../services/teamService";
import { addParticipant } from "../services/participantService";
import { 
  Settings, 
  Users, 
  Layers, 
  Plus, 
  Check, 
  Video, 
  Image as ImageIcon,
  ChevronRight,
  Monitor
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  
  // Form States
  const [eventForm, setEventForm] = useState({ name: "", category: "", max_marks: 50, judge_count: 1, judge_names: ["Judge 1"], event_order: 1 });
  const [teamForm, setTeamForm] = useState({ name: "", color: "#3b82f6", code: "" });
  const [partForm, setPartForm] = useState({ name: "", team_id: "", event_id: "", order_no: 1, image_url: "", video_url: "" });

  const loadAll = async () => {
    try {
      const [eData, tData] = await Promise.all([getEvents(), getTeams()]);
      setEvents(eData);
      setTeams(tData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
  }, []);

  const handleActivate = async (id) => {
    await activateEvent(id);
    loadAll();
  };

  const onEventSubmit = async (e) => {
    e.preventDefault();
    await createEvent(eventForm);
    loadAll();
    setEventForm({ name: "", category: "", max_marks: 50, judge_count: 1, judge_names: ["Judge 1"], event_order: events.length + 1 });
  };

  const onTeamSubmit = async (e) => {
    e.preventDefault();
    await createTeam(teamForm);
    loadAll();
    setTeamForm({ name: "", color: "#3b82f6", code: "" });
  };

  const onPartSubmit = async (e) => {
    e.preventDefault();
    await addParticipant(partForm);
    alert("Participant added!");
    setPartForm({ ...partForm, name: "", order_no: Number(partForm.order_no) + 1 });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-8">
          <h1 className="text-2xl font-black text-blue-600 tracking-tighter uppercase">Admin Core</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <NavItem 
            active={activeTab === "events"} 
            onClick={() => setActiveTab("events")} 
            icon={<Layers size={20} />} 
            label="Events" 
          />
          <NavItem 
            active={activeTab === "teams"} 
            onClick={() => setActiveTab("teams")} 
            icon={<Users size={20} />} 
            label="Teams" 
          />
          <NavItem 
            active={activeTab === "participants"} 
            onClick={() => setActiveTab("participants")} 
            icon={<Settings size={20} />} 
            label="Participants" 
          />
          <div className="pt-8 pb-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Public Views</div>
          <a href="/scoreboard" target="_blank" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <Monitor size={20} />
            <span className="font-bold">Scoreboard</span>
          </a>
          <a href="/onstage" target="_blank" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <Video size={20} />
            <span className="font-bold">Stage View</span>
          </a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-12">
        {activeTab === "events" && (
          <div className="max-w-4xl space-y-12">
            <section>
              <h2 className="text-3xl font-black text-gray-900 mb-8">Manage Events</h2>
              <div className="grid gap-4">
                {events.map(e => (
                  <div key={e.id} className="bg-white p-6 rounded-3xl border border-gray-200 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{e.name}</h3>
                      <p className="text-gray-500 font-medium">{e.category} • Order #{e.event_order}</p>
                    </div>
                    <button
                      onClick={() => !e.is_active && handleActivate(e.id)}
                      className={`
                        flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all
                        ${e.is_active 
                          ? 'bg-green-100 text-green-600 cursor-default' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                        }
                      `}
                    >
                      {e.is_active ? <Check size={18} /> : null}
                      {e.is_active ? "Live Now" : "Activate"}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] border border-gray-200 shadow-xl shadow-gray-200/50">
               <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                 <Plus className="text-blue-600" /> New Event
               </h3>
               <form onSubmit={onEventSubmit} className="grid md:grid-cols-2 gap-6">
                  <Input label="Event Name" value={eventForm.name} onChange={v => setEventForm({...eventForm, name: v})} placeholder="e.g. Group Dance" />
                  <Input label="Category" value={eventForm.category} onChange={v => setEventForm({...eventForm, category: v})} placeholder="Stage / Non-stage" />
                  <Input label="Max Marks" type="number" value={eventForm.max_marks} onChange={v => setEventForm({...eventForm, max_marks: v})} />
                  <Input label="Order" type="number" value={eventForm.event_order} onChange={v => setEventForm({...eventForm, event_order: v})} />
                  <button className="md:col-span-2 bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-colors">Create Event</button>
               </form>
            </section>
          </div>
        )}

        {activeTab === "teams" && (
          <div className="max-w-4xl space-y-12">
            <section>
              <h2 className="text-3xl font-black text-gray-900 mb-8">Manage Teams</h2>
              <div className="grid grid-cols-2 gap-6">
                {teams.map(t => (
                  <div key={t.id} className="bg-white p-8 rounded-[2rem] border-2 border-transparent hover:border-gray-200 transition-all flex flex-col items-center text-center shadow-sm">
                    <div className="w-16 h-16 rounded-3xl mb-4 shadow-inner" style={{ backgroundColor: t.color }}></div>
                    <h3 className="text-xl font-black text-gray-900">{t.name}</h3>
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-1">{t.code}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] border border-gray-200 shadow-xl shadow-gray-200/50">
               <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                 <Plus className="text-blue-600" /> New Team
               </h3>
               <form onSubmit={onTeamSubmit} className="grid md:grid-cols-2 gap-6">
                  <Input label="Team Name" value={teamForm.name} onChange={v => setTeamForm({...teamForm, name: v})} placeholder="e.g. Red Dragons" />
                  <Input label="Code" value={teamForm.code} onChange={v => setTeamForm({...teamForm, code: v})} placeholder="RD-01" />
                  <div className="flex flex-col gap-2">
                     <label className="text-sm font-bold text-gray-500 uppercase">Brand Color</label>
                     <input type="color" className="w-full h-12 rounded-xl" value={teamForm.color} onChange={e => setTeamForm({...teamForm, color: e.target.value})} />
                  </div>
                  <div className="flex items-end">
                    <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-colors">Register Team</button>
                  </div>
               </form>
            </section>
          </div>
        )}

        {activeTab === "participants" && (
          <div className="max-w-4xl space-y-12">
            <section className="bg-white p-10 rounded-[2.5rem] border border-gray-200 shadow-xl shadow-gray-200/50">
               <h2 className="text-3xl font-black text-gray-900 mb-8">Add Participant</h2>
               <form onSubmit={onPartSubmit} className="grid md:grid-cols-2 gap-6">
                  <Input label="Full Name" value={partForm.name} onChange={v => setPartForm({...partForm, name: v})} placeholder="John Doe" />
                  <div className="flex flex-col gap-2">
                     <label className="text-sm font-bold text-gray-500 uppercase">Assigned Team</label>
                     <select 
                      className="bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500 transition-colors"
                      value={partForm.team_id} 
                      onChange={e => setPartForm({...partForm, team_id: e.target.value})}
                    >
                        <option value="">Select Team</option>
                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                     </select>
                  </div>
                  <div className="flex flex-col gap-2">
                     <label className="text-sm font-bold text-gray-500 uppercase">Assigned Event</label>
                     <select 
                      className="bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500 transition-colors"
                      value={partForm.event_id} 
                      onChange={e => setPartForm({...partForm, event_id: e.target.value})}
                    >
                        <option value="">Select Event</option>
                        {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                     </select>
                  </div>
                  <Input label="Performance Order" type="number" value={partForm.order_no} onChange={v => setPartForm({...partForm, order_no: v})} />
                  
                  <div className="md:col-span-2 grid md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                    <Input label="Image URL" icon={<ImageIcon size={18} />} value={partForm.image_url} onChange={v => setPartForm({...partForm, image_url: v})} placeholder="https://..." />
                    <Input label="Video URL (Loop)" icon={<Video size={18} />} value={partForm.video_url} onChange={v => setPartForm({...partForm, video_url: v})} placeholder="https://..." />
                  </div>

                  <button className="md:col-span-2 bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3">
                    <Plus size={24} />
                    Add Participant to Event
                  </button>
               </form>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all
        ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}
      `}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {active && <ChevronRight size={16} />}
    </button>
  );
}

function Input({ label, type = "text", value, onChange, placeholder, icon }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
        {icon}
        {label}
      </label>
      <input 
        type={type} 
        value={value} 
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500 transition-colors" 
      />
    </div>
  );
}
