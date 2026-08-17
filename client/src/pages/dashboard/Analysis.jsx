import React, { useState,useMemo } from 'react';
import { Target, Zap, Clock, BookOpen, CheckCircle, AlertCircle, TrendingUp, ExternalLink, Calendar, BarChart3,ChevronDown , ChevronRight, BarChart,Award} from 'lucide-react';




export const ModelTestView = ({ history }) => {
  // 1. Calculate Topic-wise Mastery
  const topicMastery = useMemo(() => {
    const topics = {};
    history.forEach(test => {
      if (!topics[test.topic]) {
        topics[test.topic] = { totalPct: 0, count: 0 };
      }
      topics[test.topic].totalPct += test.percentage;
      topics[test.topic].count += 1;
    });

    return Object.keys(topics).map(name => ({
      name,
      avg: Math.round(topics[name].totalPct / topics[name].count),
      count: topics[name].count
    })).sort((a, b) => b.avg - a.avg);
  }, [history]);

  const strongest = topicMastery[0];
  const weakest = topicMastery[topicMastery.length - 1];

  // 2. Stats calculation
  const totalPercentage = history.reduce((acc, curr) => acc + curr.percentage, 0);
  const avgScore = history.length > 0 ? Math.round(totalPercentage / history.length) : 0;
  const latestScore = history.length > 0 ? history[history.length - 1].percentage : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* SECTION 1: TOPIC INSIGHTS (STRENGTHS vs WEAKNESSES) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strongest Topic Card */}
        <div className="bg-linear-to-br from-emerald-500/10 to-transparent border border-emerald-500/10 p-6 rounded-4xl relative overflow-hidden group">
           <Award className="absolute -right-4 -top-4 text-emerald-500/10 w-24 h-24 group-hover:rotate-12 transition-transform" />
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><TrendingUp size={18}/></div>
              <h3 className="text-white font-bold uppercase text-xs tracking-widest">Strongest Subject</h3>
           </div>
           {strongest ? (
             <>
               <h4 className="text-2xl font-black text-white mb-1">{strongest.name}</h4>
               <p className="text-emerald-400 font-bold text-sm">{strongest.avg}% Accuracy average</p>
             </>
           ) : <p className="text-slate-500">Solve more to see data</p>}
        </div>

        {/* Weakest Topic Card */}
        <div className="bg-linear-to-br from-rose-500/10 to-transparent border border-rose-500/10 p-6 rounded-4xl relative overflow-hidden group">
           <AlertCircle className="absolute -right-4 -top-4 text-rose-500/10 w-24 h-24 group-hover:rotate-12 transition-transform" />
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400"><Target size={18}/></div>
              <h3 className="text-white font-bold uppercase text-xs tracking-widest">Focus Required</h3>
           </div>
           {weakest ? (
             <>
               <h4 className="text-2xl font-black text-white mb-1">{weakest.name}</h4>
               <p className="text-rose-400 font-bold text-sm">Targeting below {weakest.avg}%</p>
             </>
           ) : <p className="text-slate-500">Solve more to see data</p>}
        </div>
      </div>

      {/* SECTION 2: CHARTS & CONSISTENCY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Latest Performance Bar Chart */}
        <div className="lg:col-span-2 bg-white/3 border border-white/5 p-8 rounded-[2.5rem]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-slate-400 text-sm font-bold uppercase flex items-center gap-2">
              <BarChart size={16}/> Benchmarking
            </h3>
            <span className="text-[10px] text-slate-500">Comparing last session vs lifetime avg</span>
          </div>

          <div className="flex items-end gap-6 h-48 px-4">
            <div className="flex-1 flex flex-col items-center gap-4">
              <div className="w-full bg-indigo-500/10 border border-indigo-500/20 rounded-t-2xl relative group flex items-end overflow-hidden" style={{ height: '100%' }}>
                <div className="w-full bg-indigo-500/40 transition-all duration-1000" style={{ height: `${avgScore}%` }}></div>
                <div className="absolute top-4 left-0 w-full text-center text-xs font-black text-indigo-400">{avgScore}%</div>
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Lifetime Avg</span>
            </div>

            <div className="flex-1 flex flex-col items-center gap-4">
              <div className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded-t-2xl relative group flex items-end overflow-hidden" style={{ height: '100%' }}>
                <div className="w-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_30px_rgba(16,185,129,0.2)]" style={{ height: `${latestScore}%` }}></div>
                <div className="absolute top-4 left-0 w-full text-center text-xs font-black text-emerald-400">{latestScore}%</div>
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Latest Session</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              {latestScore >= avgScore ? '🚀 Outperforming Average' : '📉 Below Average Score'}
            </p>
            <div className={`px-4 py-1 rounded-full text-xs font-black ${latestScore >= avgScore ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {latestScore >= avgScore ? '+' : '-'}{Math.abs(latestScore - avgScore)}% Difference
            </div>
          </div>
        </div>

        {/* Consistency Timeline */}
        <div className="bg-white/3 border border-white/5 p-8 rounded-[2.5rem]">
          <h3 className="text-slate-400 text-sm font-bold uppercase mb-6">Subject Pulse</h3>
          <div className="space-y-6">
            {topicMastery.slice(0, 4).map((topic, i) => (
              <div key={i} className="group cursor-default">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300 font-medium">{topic.name}</span>
                  <span className={`font-bold ${topic.avg > 75 ? 'text-emerald-400' : 'text-indigo-400'}`}>{topic.avg}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 ${topic.avg > 75 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                    style={{ width: `${topic.avg}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest transition-all flex items-center justify-center gap-2">
            View All Subjects <ChevronRight size={14}/>
          </button>
        </div>

      </div>
    </div>
  );
};









 

// --- 3. BLOG ANALYSIS VIEW ---
