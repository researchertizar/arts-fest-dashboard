import { useEffect, useState } from "react";
import { getScoreboard } from "../services/scoreboardService";
import { socket } from "../services/socket";
import { Trophy, TrendingUp, Medal, Star } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

export default function ScoreboardScreen() {
  const [scores, setScores] = useState([]);

  const loadScores = async () => {
    try {
      const data = await getScoreboard();
      // Sort scores to determine rankings
      const sortedData = [...data].sort((a, b) => b.total_score - a.total_score);
      setScores(sortedData);
    } catch (err) {
      console.error("Failed to load scores", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadScores();
    
    socket.on("scoreUpdated", () => {
      loadScores();
    });

    return () => {
      socket.off("scoreUpdated");
    };
  }, []);

  const topPerformer = scores[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-black italic tracking-tighter text-white">
              LEADERBOARD
            </h1>
            <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2 mt-2">
              <TrendingUp size={18} className="text-green-400" />
              Real-time standing updates
            </p>
          </div>
          
          {topPerformer && (
            <div className="bg-gradient-to-br from-yellow-500/20 to-amber-600/10 border border-yellow-500/30 p-6 rounded-3xl flex items-center gap-6 backdrop-blur-sm">
              <div className="bg-yellow-500 p-4 rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                <Trophy size={32} className="text-slate-900" />
              </div>
              <div>
                <p className="text-yellow-500 font-bold text-sm uppercase tracking-widest">Current Leader</p>
                <p className="text-3xl font-black text-white">{topPerformer.name}</p>
                <p className="text-slate-400 font-bold">{topPerformer.total_score} Points</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Rankings List */}
          <div className="lg:col-span-2 space-y-4">
            {scores.map((team, index) => (
              <div
                key={team.id}
                className="group relative flex items-center gap-4 p-1 rounded-[2rem] transition-all duration-300 hover:translate-x-2"
              >
                <div 
                   className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity rounded-[2rem]"
                   style={{ backgroundColor: team.color || "#1f2937" }}
                ></div>
                
                {/* Rank */}
                <div className="relative z-10 w-16 h-16 flex items-center justify-center">
                  {index === 0 ? (
                    <Medal size={40} className="text-yellow-500" />
                  ) : index === 1 ? (
                    <Medal size={36} className="text-slate-300" />
                  ) : index === 2 ? (
                    <Medal size={32} className="text-amber-700" />
                  ) : (
                    <span className="text-2xl font-black text-slate-700">0{index + 1}</span>
                  )}
                </div>

                {/* Team Info Card */}
                <div className="relative z-10 flex-1 bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl p-6 rounded-[1.75rem] flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-4 h-12 rounded-full" 
                      style={{ backgroundColor: team.color }}
                    ></div>
                    <div>
                      <h3 className="text-xl font-bold text-white uppercase tracking-tight">{team.name}</h3>
                      <p className="text-slate-500 text-sm font-bold">TEAM CODE: {team.code || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-black text-white">{team.total_score}</div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">Points</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar: Analytics & Top Performer */}
          <div className="space-y-8">
             {/* Chart Card */}
             <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Star size={20} className="text-purple-500" />
                  Score Distribution
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scores}>
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                        itemStyle={{ color: '#f8fafc' }}
                      />
                      <Bar dataKey="total_score" radius={[10, 10, 10, 10]}>
                        {scores.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>

             {/* Live Updates Ticker */}
             <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[2.5rem]">
                <h3 className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-4">Live Activity</h3>
                <div className="space-y-4">
                   <div className="flex gap-3 text-sm">
                      <div className="w-1 h-auto bg-indigo-500 rounded-full"></div>
                      <p className="text-slate-300">New scores submitted for <span className="text-white font-bold">Group Dance</span></p>
                   </div>
                   <div className="flex gap-3 text-sm opacity-60">
                      <div className="w-1 h-auto bg-slate-500 rounded-full"></div>
                      <p className="text-slate-300">Judging completed for <span className="text-white font-bold">Solo Song</span></p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
