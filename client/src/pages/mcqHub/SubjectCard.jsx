
import { useTheme } from "../../context/ThemeContext";

const SubjectCard = ({ 
  subject, 
  onClick, 
  totalQuestions = 0, 
  answeredCount = 0, 
  performance 
}) => {
  const { darkMode } = useTheme();
  
  // 1. Progress Calculation
  const progress = totalQuestions > 0 
    ? Math.min(Math.round((answeredCount / totalQuestions) * 100), 100) 
    : 0;

  // 2. Performance Data
  const correctCount = performance?.correct || 0;

  // 3. Centralized Dynamic Theme Engine (Replaces Tailwind 'dark:' prefix classes)
  const theme = {
    cardBg: darkMode ? "bg-slate-900/90 shadow-slate-950/50" : "bg-white shadow-slate-200/50",
    cardBorder: darkMode ? "border-slate-800 hover:border-indigo-500/40" : "border-slate-100 hover:border-indigo-200",
    titleText: darkMode ? "text-slate-100 group-hover:text-indigo-400" : "text-slate-800 group-hover:text-indigo-700",
    metaText: darkMode ? "text-slate-400" : "text-slate-400",
    tagBg: darkMode ? "bg-slate-800/80 text-slate-300 border-slate-700/80 group-hover:bg-slate-800 group-hover:border-indigo-500/30" : "bg-slate-50 text-slate-500 border-slate-100 group-hover:bg-white group-hover:border-indigo-100",
    tagOverflow: darkMode ? "text-slate-500" : "text-slate-300",
    divider: darkMode ? "border-slate-800" : "border-slate-100",
    progressTrack: darkMode ? "bg-slate-800" : "bg-slate-100",
    defaultIconBg: darkMode ? "bg-indigo-500/15 text-indigo-400" : "bg-indigo-50 text-indigo-600",
  };

  return (
    <button 
      onClick={onClick} 
      className={`group relative p-4 sm:p-6 rounded-4xl sm:rounded-[2.5rem] border-2 shadow-sm hover:shadow-xl transition-all duration-300 text-left active:scale-95 flex flex-col justify-between h-full overflow-hidden ${theme.cardBg} ${theme.cardBorder}`}
    >
      {/* Background Decorative Watermark - Hidden on small screens to preserve reading space */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-15 transition-opacity pointer-events-none select-none hidden sm:block">
        <span className="text-6xl lg:text-7xl grayscale group-hover:grayscale-0 transition-all duration-700 block transform group-hover:scale-110 group-hover:-rotate-12">
          {subject.icon}
        </span>
      </div>

      <div className="relative z-10 w-full">
        {/* Header: Icon & Subject Title */}
        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl shrink-0 flex items-center justify-center text-2xl sm:text-3xl shadow-inner transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 ${subject.color || theme.defaultIconBg}`}>
            {subject.icon}
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className={`font-black text-base sm:text-lg leading-tight transition-colors truncate ${theme.titleText}`}>
              {subject.name}
            </h3>
            <p className={`text-[9px] sm:text-[10px] font-bold  tracking-widest mt-0.5 sm:mt-1 ${theme.metaText}`}>
              {totalQuestions > 0 ? `${totalQuestions.toLocaleString()} Questions` : totalQuestions === 0 ? '0 Questions' : 'লোড হচ্ছে...'}
            </p>
          </div>
        </div>

  
      </div>

      {/* Footer: Progress Statistics & Bar */}
      <div className={`relative z-10 mt-auto pt-3 sm:pt-4 border-t w-full ${theme.divider}`}>
        <div className="flex justify-between items-end mb-2 gap-2">
          
          <div className="flex flex-col min-w-0">
            <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider ${theme.metaText}`}>
              Progress
            </span>
            
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-0.5">
              <span className="text-[10px] sm:text-[11px] font-bold text-indigo-500 dark:text-indigo-400 whitespace-nowrap">
                {answeredCount} Completed
              </span>
              {correctCount > 0 && (
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-500 whitespace-nowrap">
                  • {correctCount} Right
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-xs sm:text-sm font-black text-indigo-500 dark:text-indigo-400 font-mono">
              {progress}%
            </span>
          </div>
        </div>
        
        {/* Progress Bar Track */}
        <div className={`w-full h-2 sm:h-2.5 rounded-full overflow-hidden shadow-inner ${theme.progressTrack}`}>
          <div 
            className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </button>
  );
};

export default SubjectCard;