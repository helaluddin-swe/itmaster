import React from "react";
import { ArrowLeft, CheckCircle2, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const QuestionHeader = ({ stats, totalQuestions, answeredCount, topicName, onBack }) => {
  const { darkMode, toggleTheme } = useTheme();
  const progressPercentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  
  // Centralized theme lookup
  const theme = {
    bg: darkMode ? "bg-slate-900/95 border-slate-800 text-slate-100" : "bg-white/95 border-slate-200 text-slate-800",
    backBtn: darkMode ? "text-slate-300 hover:text-indigo-400" : "text-gray-600 hover:text-indigo-600",
    correctBadge: darkMode ? "bg-emerald-950/50 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border-emerald-100",
    wrongBadge: darkMode ? "bg-rose-950/50 text-rose-400 border-rose-500/20" : "bg-rose-50 text-rose-600 border-rose-100",
    progressBadge: darkMode ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/20" : "bg-indigo-50 text-indigo-600 border-indigo-100",
    toggleBtn: darkMode ? "bg-slate-800 hover:bg-slate-700 text-amber-400" : "bg-slate-100 hover:bg-slate-200 text-slate-700",
  };

  return (
    <header className={`absolute top-0 left-0 right-0 z-50 backdrop-blur-md border-b px-2 sm:px-6 py-2 sm:py-3 shadow-sm transition-colors duration-300 ${theme.bg}`}>
      <div className="max-w-4xl mx-auto flex flex-row items-center justify-around gap-1.5 sm:gap-4">
        
        {/* LEFT: Back Button & Topic Name */}
        <div className="flex items-center gap-1 sm:gap-2 min-w-0 shrink">
          <button 
            onClick={onBack} 
            className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold transition-all active:scale-95 py-1 pr-1 ${theme.backBtn}`}
            title="Go Back"
          >
            <ArrowLeft size={18} className="shrink-0" />
            <span className="truncate max-w-20 xs:max-w-[120px] sm:max-w-[200px]">
              {topicName || "Back"}
            </span>
          </button>
        </div>

        {/* RIGHT: Stats, Progress %, and Theme Toggle */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          
          {/* Correct & Wrong Stats Pills */}
          <div className="flex items-center gap-1">
            <div className={`px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black border flex items-center gap-1 ${theme.correctBadge}`}>
              <CheckCircle2 size={13} className="shrink-0 text-emerald-500" /> 
              <span>{stats?.correct || 0}</span>
            </div>
            <div className={`px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black border flex items-center gap-1 ${theme.wrongBadge}`}>
              <X size={13} className="shrink-0 text-rose-500" /> 
              <span>{stats?.wrong || 0}</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 sm:px-2.5 py-1 rounded-lg border ${theme.progressBadge}`}>
            <span className="hidden md:inline">Progress: </span>
            {progressPercentage}%
          </div>

          {/* Theme Toggle Button */}
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all active:scale-90 ml-0.5 ${theme.toggleBtn}`}
            >
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}

        </div>
      </div>
    </header>
  );
};

export default QuestionHeader;