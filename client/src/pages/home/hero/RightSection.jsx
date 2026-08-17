import React from "react";
import { useTheme } from "../../../context/ThemeContext";

const RightSection = () => {
  const { darkMode } = useTheme();

  return (
    <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center justify-center space-y-6 pt-2 pb-6">
      
      {/* --- HIGH-IMPACT HEADLINE --- */}
      <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] ${
        darkMode ? "text-white" : "text-slate-900"
      }`}>
        <span>Mastering </span>
        
        {/* Gradient Text with Organic Underline SVG */}
        <span className="relative inline-block bg-linear-to-r from-emerald-500 via-teal-400 to-sky-500 bg-clip-text text-transparent pb-1">
          BACKEND
          <svg
            className="absolute -bottom-1 left-0 w-full h-3 text-emerald-400/80 pointer-events-none"
            viewBox="0 0 250 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M2 7C70 2 180 2 248 6"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>
        
        <br />
        <span>Software Engineering</span>
      </h1>

      {/* --- SUBTITLE WITH BOLD HIGHLIGHTS --- */}
      <p className={`max-w-2xl text-base sm:text-lg md:text-xl font-normal leading-relaxed ${
        darkMode ? "text-slate-400" : "text-slate-600"
      }`}>
        The modern way to prepare for backend engineering roles at top-tier tech companies Worldwide.
        <strong className={`font-bold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
         Build production-ready applications, develop problem-solving skills an 
        </strong>{" "}
        and{" "}
        <strong className={`font-bold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
          engineering mindset.
        </strong>.
      </p>

      {/* --- TRUST & SOCIAL PROOF STATS BAR --- */}
      <div className={`pt-6 mt-2 flex flex-wrap items-center justify-center gap-6 sm:gap-10 border-t w-full max-w-2xl ${
        darkMode ? "border-slate-800/80" : "border-slate-200/80"
      }`}>
        <div className="group cursor-default text-center">
          <p className={`text-2xl sm:text-3xl font-black transition-colors ${
            darkMode ? "text-white group-hover:text-emerald-400" : "text-slate-900 group-hover:text-emerald-600"
          }`}>
            50K+
          </p>
          <p className={`text-[10px] uppercase font-bold tracking-[0.2em] mt-1 ${
            darkMode ? "text-slate-500" : "text-slate-400"
          }`}>
            Active Learners
          </p>
        </div>

        <div className={`w-px h-8 rotate-12 ${darkMode ? "bg-slate-800" : "bg-slate-200"}`} />

        <div className="group cursor-default text-center">
          <p className={`text-2xl sm:text-3xl font-black transition-colors ${
            darkMode ? "text-white group-hover:text-teal-400" : "text-slate-900 group-hover:text-teal-600"
          }`}>
            4.9/5
          </p>
          <p className={`text-[10px] uppercase font-bold tracking-[0.2em] mt-1 ${
            darkMode ? "text-slate-500" : "text-slate-400"
          }`}>
            User Rating
          </p>
        </div>

        <div className={`w-px h-8 rotate-12 hidden sm:block ${darkMode ? "bg-slate-800" : "bg-slate-200"}`} />

        <div className="hidden sm:block group cursor-default text-center">
          <p className={`text-2xl sm:text-3xl font-black transition-colors ${
            darkMode ? "text-white group-hover:text-sky-400" : "text-slate-900 group-hover:text-sky-600"
          }`}>
            100%
          </p>
          <p className={`text-[10px] uppercase font-bold tracking-[0.2em] mt-1 ${
            darkMode ? "text-slate-500" : "text-slate-400"
          }`}>
            Curated Syllabus
          </p>
        </div>
      </div>

    </div>
  );
};

export default RightSection;