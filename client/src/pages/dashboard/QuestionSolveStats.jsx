import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle, AlertCircle, Zap, BarChart3, 
  Calendar, ExternalLink, ChevronDown, Loader2 
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

export const QuestionSolveStats = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(10);
  const { userData, getUserHistory } = useAppContext();

  // --- Fetch History from Context/API ---
  useEffect(() => {
    const fetchHistoryData = async () => {
      if (!userData?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getUserHistory(userData._id);
        const historyArray = Array.isArray(response) 
          ? response 
          : response?.history || response?.data || [];
          
        setHistory(historyArray);
      } catch (err) {
        console.error("Failed to fetch solve history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, [userData?._id, getUserHistory]);

  // --- Stats Calculation ---
  const totals = useMemo(() => {
    return history.reduce((acc, curr) => ({
      correct: acc.correct + (curr.correct || 0),
      incorrect: acc.incorrect + (curr.incorrect || 0),
      unanswered: acc.unanswered + (curr.unanswered || 0),
      totalSeconds: acc.totalSeconds + (curr.timeSpentSeconds || 0),
      totalSolved: acc.totalSolved + (curr.total || 0)
    }), { correct: 0, incorrect: 0, unanswered: 0, totalSeconds: 0, totalSolved: 0 });
  }, [history]);

  // Strike Rate Calculation (Questions per hour)
  const strikeRate = useMemo(() => {
    const hoursSpent = totals.totalSeconds / 3600;
    return hoursSpent > 0 ? Math.round(totals.totalSolved / hoursSpent) : 0;
  }, [totals]);

  // --- Sorting & Pagination ---
  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => 
      new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp)
    );
  }, [history]);

  const visibleHistory = sortedHistory.slice(0, displayLimit);

  // --- Centralized Dynamic Theme Engine ---
  const theme = {
    // Loader text
    loaderText: darkMode ? "text-slate-500" : "text-gray-400",
    
    // Cards Backgrounds & Borders
    cardCorrect: darkMode 
      ? "bg-emerald-950/20 border-emerald-500/20 hover:bg-emerald-950/30" 
      : "bg-emerald-50 border-emerald-100 hover:bg-emerald-100/80",
    cardIncorrect: darkMode 
      ? "bg-rose-950/20 border-rose-500/20 hover:bg-rose-950/30" 
      : "bg-rose-50 border-rose-100 hover:bg-rose-100/80",
    cardPerformance: darkMode 
      ? "bg-indigo-950/20 border-indigo-500/20 hover:bg-indigo-950/30" 
      : "bg-indigo-50 border-indigo-100 hover:bg-indigo-100/80",
      
    cardTitleText: darkMode ? "text-slate-400" : "text-gray-500",
    cardValueText: darkMode ? "text-white" : "text-gray-900",
    cardSubText: darkMode ? "text-slate-500" : "text-gray-400",

    // Main History Section Container
    mainContainer: darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-gray-200",
    headerBorder: darkMode ? "border-slate-800" : "border-gray-100",
    headerTitle: darkMode ? "text-white" : "text-gray-900",
    headerSubtitle: darkMode ? "text-slate-400" : "text-gray-500",

    // Badges in Header
    badgeTotal: darkMode ? "bg-slate-800/80 text-slate-300 border-slate-700" : "bg-gray-100 text-gray-600 border-gray-200",
    badgeSessions: darkMode ? "bg-indigo-950/50 text-indigo-400 border-indigo-500/30" : "bg-indigo-50 text-indigo-600 border-indigo-100",

    // Table Styles
    tableHeader: darkMode ? "text-slate-400 bg-slate-800/40" : "text-gray-500 bg-gray-50/50",
    tableDivide: darkMode ? "divide-slate-800" : "divide-gray-100",
    rowHover: darkMode ? "hover:bg-slate-800/50" : "hover:bg-gray-50",
    topicText: darkMode ? "text-white group-hover:text-indigo-400" : "text-gray-900 group-hover:text-indigo-600",
    dateText: darkMode ? "text-slate-400" : "text-gray-500",
    progressTrack: darkMode ? "bg-slate-800" : "bg-gray-200",

    // Correct/Wrong/Skip Badges in Table
    correctBadge: darkMode ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border-emerald-200",
    wrongBadge: darkMode ? "bg-rose-950/40 text-rose-400 border-rose-500/20" : "bg-rose-50 text-rose-600 border-rose-200",
    skipBadge: darkMode ? "bg-slate-800/50 text-slate-400 border-slate-700" : "bg-gray-100 text-gray-500 border-gray-200",
    badgeVal: darkMode ? "text-white" : "text-gray-900",

    // Empty State
    emptyIconBox: darkMode ? "bg-slate-800 text-slate-500" : "bg-gray-100 text-gray-400",
    emptyTitle: darkMode ? "text-slate-400" : "text-gray-500",
    emptySub: darkMode ? "text-slate-500" : "text-gray-400",

    // Show More Button
    showMoreBtn: darkMode 
      ? "text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800" 
      : "text-gray-600 hover:text-gray-900 border-gray-200 hover:bg-gray-50"
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 md:py-32 space-y-6 w-full">
        <div className="relative">
            <Loader2 className="text-indigo-500 animate-spin" size={40} />
            <div className="absolute inset-0 blur-xl bg-indigo-500/20 animate-pulse"></div>
        </div>
        <p className={`${theme.loaderText} font-black uppercase text-[10px] tracking-[0.4em] text-center px-4`}>
          Syncing Progress...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full space-y-4 md:space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Metrics Row */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        
        {/* Correct Card */}
        <div className={`p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex items-center gap-4 md:gap-5 group transition-all duration-300 min-w-0 border ${theme.cardCorrect}`}>
          <div className="bg-emerald-500/20 p-3 md:p-4 rounded-xl md:rounded-2xl text-emerald-500 group-hover:scale-110 group-hover:rotate-6 transition-transform shrink-0">
            <CheckCircle size={20} className="md:w-6 md:h-6" />
          </div>
          <div className="min-w-0 truncate">
            <p className={`${theme.cardTitleText} text-[9px] md:text-[10px] font-black uppercase tracking-wider md:tracking-widest truncate`}>Correct Answers</p>
            <h4 className={`text-xl md:text-2xl font-black mt-0.5 md:mt-1 truncate ${theme.cardValueText}`}>{totals.correct.toLocaleString()}</h4>
          </div>
        </div>

        {/* Errors Card */}
        <div className={`p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex items-center gap-4 md:gap-5 group transition-all duration-300 min-w-0 border ${theme.cardIncorrect}`}>
          <div className="bg-rose-500/20 p-3 md:p-4 rounded-xl md:rounded-2xl text-rose-500 group-hover:scale-110 group-hover:-rotate-6 transition-transform shrink-0">
            <AlertCircle size={20} className="md:w-6 md:h-6" />
          </div>
          <div className="min-w-0 truncate">
            <p className={`${theme.cardTitleText} text-[9px] md:text-[10px] font-black uppercase tracking-wider md:tracking-widest truncate`}>Wrong / Skipped</p>
            <h4 className={`text-xl md:text-2xl font-black mt-0.5 md:mt-1 truncate ${theme.cardValueText}`}>
              {totals.incorrect} <span className={`${theme.cardSubText} text-base md:text-lg mx-1 font-medium`}>/</span> {totals.unanswered}
            </h4>
          </div>
        </div>

        {/* Efficiency Card */}
        <div className={`p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex items-center gap-4 md:gap-5 group transition-all duration-300 min-w-0 border sm:col-span-2 lg:col-span-1 ${theme.cardPerformance}`}>
          <div className="bg-indigo-500/20 p-3 md:p-4 rounded-xl md:rounded-2xl text-indigo-500 group-hover:scale-110 transition-transform shrink-0">
            <Zap size={20} className="md:w-6 md:h-6" />
          </div>
          <div className="min-w-0 truncate">
            <p className={`${theme.cardTitleText} text-[9px] md:text-[10px] font-black uppercase tracking-wider md:tracking-widest truncate`}>Performance</p>
            <h4 className={`text-xl md:text-2xl font-black mt-0.5 md:mt-1 flex items-baseline gap-1.5 truncate ${theme.cardValueText}`}>
              {strikeRate > 0 ? strikeRate : totals.totalSolved} 
              <span className={`text-[10px] md:text-xs ${theme.cardTitleText} font-bold tracking-normal lowercase`}>
                {strikeRate > 0 ? 'ques/hr' : 'total'}
              </span>
            </h4>
          </div>
        </div>

      </div>

      {/* History Table Container (Using flex/grid column layout for mobile/desktop to completely avoid overflow-x scrolling issues) */}
      <div className={`w-full max-w-full rounded-2xl md:rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl border ${theme.mainContainer}`}>
        
        {/* Header */}
        <div className={`p-4 md:p-8 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${theme.headerBorder}`}>
          <div className="w-full md:w-auto">
            <h3 className={`font-bold text-base md:text-lg flex items-center gap-2.5 ${theme.headerTitle}`}>
              <BarChart3 size={20} className="text-indigo-500 shrink-0 md:w-[22px] md:h-[22px]" /> 
              Recent Exam History
            </h3>
            <p className={`${theme.headerSubtitle} text-[11px] md:text-xs mt-1 font-medium`}>Your progress across different topics</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
             <span className={`text-[9px] md:text-[10px] px-3 md:px-4 py-1.5 rounded-full font-black uppercase tracking-wider md:tracking-widest border ${theme.badgeTotal}`}>
               {totals.totalSolved} Total
             </span>
             <span className={`text-[9px] md:text-[10px] px-3 md:px-4 py-1.5 rounded-full font-black uppercase tracking-wider md:tracking-widest border ${theme.badgeSessions}`}>
               {history.length} Sessions
             </span>
          </div>
        </div>

        {/* Data List Container (Responsive Stack layout instead of table to eliminate horizontal scrolling completely) */}
        <div className="w-full p-3 sm:p-4 md:p-6 space-y-3 md:space-y-4">
          {history.length > 0 ? (
            <div className="w-full space-y-3">
              {visibleHistory.map((entry, idx) => {
                const percentage = entry.percentage || (entry.total > 0 ? (entry.correct / entry.total) * 100 : 0);
                
                return (
                  <div 
                    key={entry._id || idx} 
                    className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 group flex flex-col md:flex-row md:items-center justify-between gap-4 ${theme.rowHover} ${darkMode ? 'border-slate-800 bg-slate-900/60' : 'border-gray-100 bg-white shadow-xs'}`}
                  >
                    {/* Left: Topic & Date */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs sm:text-sm font-black transition-colors line-clamp-2 ${theme.topicText}`}>
                        {entry.topic || "Practice Session"}
                      </div>
                      <div className={`text-[10px] flex items-center gap-1.5 mt-1.5 font-bold uppercase tracking-wider ${theme.dateText}`}>
                        <Calendar size={12} className="text-indigo-500 shrink-0" /> 
                        <span>
                          {new Date(entry.createdAt || entry.timestamp).toLocaleDateString('bn-BD', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Outcome stats & Progress Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6 shrink-0">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className={`text-xs sm:text-sm font-black w-10 shrink-0 ${percentage >= 80 ? 'text-emerald-500' : percentage >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                          {Math.round(percentage)}%
                        </span>
                        <div className={`w-full sm:w-32 md:w-40 h-2 rounded-full overflow-hidden shrink-0 ${theme.progressTrack}`}>
                          <div 
                            className={`h-full transition-all duration-1000 ease-out ${percentage >= 80 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : percentage >= 50 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-rose-500 to-rose-400'}`} 
                            style={{ width: `${percentage}%` }} 
                          />
                        </div>
                      </div>

                      {/* Right: Badges for Correct / Wrong / Skip */}
                      <div className="flex items-center gap-2 text-[10px] font-black">
                        <div className={`flex flex-col items-center px-2.5 py-1 rounded-xl border min-w-[50px] ${theme.correctBadge}`}>
                           <span className="text-[9px] opacity-75">CORRECT</span>
                           <span className={`text-xs mt-0.5 ${theme.badgeVal}`}>{entry.correct}</span>
                        </div>
                        <div className={`flex flex-col items-center px-2.5 py-1 rounded-xl border min-w-[50px] ${theme.wrongBadge}`}>
                           <span className="text-[9px] opacity-75">WRONG</span>
                           <span className={`text-xs mt-0.5 ${theme.badgeVal}`}>{entry.incorrect}</span>
                        </div>
                        <div className={`flex flex-col items-center px-2.5 py-1 rounded-xl border min-w-[50px] ${theme.skipBadge}`}>
                           <span className="text-[9px] opacity-75">SKIP</span>
                           <span className={`text-xs mt-0.5 ${theme.badgeVal}`}>{entry.unanswered}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 md:p-20 text-center w-full">
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-3 md:mb-4 ${theme.emptyIconBox}`}>
                <BarChart3 size={24} className="md:w-8 md:h-8" />
              </div>
              <p className={`font-bold uppercase text-[10px] md:text-xs tracking-wider md:tracking-widest ${theme.emptyTitle}`}>No history found</p>
              <p className={`text-[10px] mt-1.5 md:mt-2 font-medium ${theme.emptySub} px-4`}>Complete a test to see your performance logs here.</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {history.length > displayLimit && (
          <div className={`w-full p-4 md:p-6 text-center border-t ${theme.headerBorder}`}>
            <button
              onClick={() => setDisplayLimit(prev => prev + 10)}
              className={`group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all px-6 py-3 rounded-2xl border active:scale-95 shadow-md w-full sm:w-auto justify-center ${theme.showMoreBtn}`}
            >
              Show More Records
              <ChevronDown size={14} className="group-hover:translate-y-1 transition-transform shrink-0" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default QuestionSolveStats;