import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * LoadingOverlay Component
 * Used during API fetches to prevent user interaction and show progress.
 */
const LoadingOverlay = ({ message = "প্রশ্নপত্র তৈরি হচ্ছে..." }) => {
  const { darkMode, toggleTheme } = useTheme();

  // --- Centralized Dynamic Theme Engine ---
  const theme = {
    // Backdrop Surface
    backdrop: darkMode 
      ? "bg-slate-950/70 backdrop-blur-md" 
      : "bg-indigo-950/40 backdrop-blur-md",
    
    // Modal Box Card
    card: darkMode 
      ? "bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl shadow-slate-950/80" 
      : "bg-white border border-slate-100 text-slate-900 shadow-2xl shadow-indigo-950/20",
    
    // Spinner Colors
    spinnerBg: darkMode ? "border-slate-800" : "border-indigo-50",
    spinnerActive: darkMode ? "border-indigo-400 border-t-transparent" : "border-indigo-600 border-t-transparent",
    spinnerDot: darkMode ? "bg-indigo-500" : "bg-indigo-400",
    
    // Typography
    messageText: darkMode ? "text-slate-100" : "text-indigo-900",
    subText: darkMode ? "text-slate-400" : "text-slate-400"
  };

  return (
    <div className={`fixed inset-0 z-10003 flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 ${theme.backdrop}`}>
      <div className={`w-full max-w-xs sm:max-w-sm p-6 sm:p-8 md:p-12 rounded-4xl sm:rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col items-center gap-5 sm:gap-6 animate-in zoom-in-90 duration-300 ${theme.card}`}>
        
        {/* Animated Spinner Container */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0">
          {/* Static Background Ring */}
          <div className={`w-full h-full border-4 rounded-full ${theme.spinnerBg}`}></div>
          
          {/* Active Spinning Ring */}
          <div className={`w-full h-full border-4 rounded-full animate-spin absolute top-0 left-0 ${theme.spinnerActive}`}></div>
          
          {/* Center Pulse Dot */}
          <div className={`absolute inset-0 m-auto w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-pulse ${theme.spinnerDot}`}></div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-1">
          <p className={`font-black text-base sm:text-lg md:text-xl tracking-tight leading-snug ${theme.messageText}`}>
            {message}
          </p>
          <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest animate-pulse ${theme.subText}`}>
            Please Wait
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoadingOverlay;