import React from 'react';
import { LayoutDashboard, Zap, TrendingUp, Info, Target, Timer, Award } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const PerformanceAnalysis = ({ score = 0, total = 0, timeSpent = 0 }) => {
  const { darkMode, toggleTheme } = useTheme();

  // 1. Calculate Core Metrics
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  
  // Simulated or calculated sub-metrics based on the score
  const accuracy = percentage;
  const speed = Math.min(100, Math.max(20, 100 - (timeSpent / 60))); // Simple speed logic
  const focus = percentage > 80 ? 95 : percentage > 50 ? 75 : 40;

  const metrics = [
    { label: 'Accuracy', value: accuracy, icon: <Target size={14} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Speed', value: speed, icon: <Timer size={14} />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Focus', value: focus, icon: <Zap size={14} />, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Subject Knowledge', value: percentage, icon: <Award size={14} />, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  const getStrengthLabel = (avg) => {
    if (avg >= 90) return { text: "Expert", color: "text-emerald-500", bg: "bg-emerald-500/20" };
    if (avg >= 75) return { text: "Strong", color: "text-blue-500", bg: "bg-blue-500/20" };
    if (avg >= 50) return { text: "Improving", color: "text-amber-500", bg: "bg-amber-500/20" };
    return { text: "Beginner", color: "text-rose-500", bg: "bg-rose-500/20" };
  };

  const strength = getStrengthLabel(percentage);

  // --- Centralized Dynamic Theme Engine ---
  const theme = {
    cardBg: darkMode 
      ? "bg-slate-900/60 border-slate-800 text-slate-200 shadow-xl shadow-slate-950/50 backdrop-blur-md" 
      : "bg-white border-slate-200/80 text-slate-700 shadow-md shadow-slate-200/50",
    
    headerTitle: darkMode ? "text-white" : "text-slate-900",
    headerSubtitle: darkMode ? "text-slate-400" : "text-slate-500",
    dashboardIconBg: darkMode ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-50 text-indigo-600",
    
    metricCardBg: darkMode 
      ? "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80" 
      : "bg-slate-50 border-slate-200/70 hover:bg-slate-100/70",
    metricLabel: darkMode ? "text-slate-400" : "text-slate-500",
    metricTrack: darkMode ? "bg-slate-800" : "bg-slate-200",

    progressBoxBg: darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200",
    progressBarTrack: darkMode ? "bg-slate-800" : "bg-slate-200",
    infoText: darkMode ? "text-slate-300" : "text-slate-600"
  };

  return (
    <div className={`w-full mt-6 rounded-3xl sm:rounded-4xl p-5 sm:p-6 md:p-8 font-sans border transition-colors duration-300 ${theme.cardBg}`}>
      
      {/* Header Info */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 pb-5 border-b border-inherit">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${theme.dashboardIconBg}`}>
            <LayoutDashboard size={20} className="shrink-0" />
          </div>
          <div>
            <h3 className={`text-xs sm:text-sm font-black uppercase tracking-wider ${theme.headerTitle}`}>
              Performance Breakdown
            </h3>
            <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${strength.bg} ${strength.color}`}>
              {strength.text} Rank
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-xl sm:text-2xl font-black ${theme.headerTitle}`}>{percentage}%</div>
          <div className={`text-[10px] uppercase font-bold tracking-tighter ${theme.headerSubtitle}`}>Total Score</div>
        </div>
      </div>

      {/* Radial/Bar Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {metrics.map((m, i) => (
          <div key={i} className={`border p-3.5 sm:p-4 rounded-2xl flex flex-col items-center text-center group transition-all duration-200 ${theme.metricCardBg}`}>
            <div className={`p-2 rounded-xl mb-2 sm:mb-3 ${m.bg} ${m.color}`}>
              {m.icon}
            </div>
            <span className={`text-[10px] font-bold uppercase mb-0.5 tracking-wider ${theme.metricLabel}`}>
              {m.label}
            </span>
            <span className={`text-base sm:text-lg font-black ${m.color}`}>
              {Math.round(m.value)}%
            </span>
            
            {/* Tiny progress bar under each metric */}
            <div className={`w-full h-1 rounded-full mt-2.5 sm:mt-3 overflow-hidden ${theme.metricTrack}`}>
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${m.color.replace('text', 'bg')}`}
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Strength Indicator Bar */}
      <div className={`p-4 sm:p-5 rounded-2xl border ${theme.progressBoxBg}`}>
        <div className="flex justify-between text-[10px] sm:text-xs font-black uppercase mb-3">
          <span className={theme.headerSubtitle}>Accuracy Progress</span>
          <span className={strength.color}>{percentage}% Achieved</span>
        </div>
        
        <div className={`h-2 w-full rounded-full overflow-hidden flex ${theme.progressBarTrack}`}>
          <div 
            className="h-full rounded-full bg-linear-to-r from-rose-500 via-amber-400 to-emerald-500 transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="mt-4 flex items-start gap-2.5 sm:gap-3">
          <Info size={16} className="text-indigo-500 shrink-0 mt-0.5" />
          <p className={`text-xs sm:text-sm leading-relaxed italic font-medium ${theme.infoText}`}>
             {percentage > 80 
              ? "দুর্দান্ত! আপনি এই বিষয়টি ভালোভাবে আয়ত্ত করেছেন। নিয়মিত প্র্যাকটিস চালিয়ে যান।" 
              : percentage > 50 
              ? "ভালো উন্নতি হচ্ছে। ভুল করা প্রশ্নগুলো আবার রিভিশন দিন।" 
              : "আপনাকে আরও মনোযোগ দিতে হবে। টপিকগুলো মূল বই থেকে আরেকবার দেখে নিন।"
            }
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default PerformanceAnalysis;