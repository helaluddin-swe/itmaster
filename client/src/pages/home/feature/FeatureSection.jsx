import React from "react";
import { ChevronRight } from "lucide-react";
import { mainFeatures } from "../../../context/data";
import { useTheme } from "../../../context/ThemeContext";

const FeatureSection = () => {
  const { darkMode } = useTheme();

  return (
    <section className="relative transition-colors duration-300">
      {/* Background Highlight */}
      <div 
        className={`absolute inset-0 -mx-4 py-24 -z-10 rounded-[4rem] transition-colors duration-300 ${
          darkMode ? "bg-slate-900/60" : "bg-slate-50"
        }`} 
      />

      <div className="grid lg:grid-cols-12 gap-16 items-center px-8 py-2">
        {/* Left Column: Heading & Paragraph */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className={`text-4xl md:text-5xl font-black leading-tight transition-colors duration-300 ${
            darkMode ? "text-slate-100" : "text-slate-900"
          }`}>
            Master{" "}
            <span className="relative inline-block bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500 bg-clip-text text-transparent pb-1">
              Patterns,
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
            </span>{" "}
            <br />
            <span>Not Just Questions</span>
          </h2>

          <p className={`text-lg leading-relaxed font-medium transition-colors duration-300 ${
            darkMode ? "text-slate-300" : "text-slate-600"
          }`}>
            Stop solving questions randomly. Learn the underlying patterns, recurring concepts, and core techniques that consistently show up across BCS, Bank, and Govt job exams.
          </p>
        </div>

        {/* Right Column: Feature Cards */}
        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
          {mainFeatures.map((f, i) => {
            const FeatureIcon = f.icon;
            return (
              <div 
                key={i} 
                className={`p-8 rounded-[2.5rem] border transition-all duration-500 group ${
                  darkMode 
                    ? "bg-slate-900/90 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/70 hover:shadow-2xl hover:shadow-emerald-500/5" 
                    : "bg-white border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200"
                }`}
              >
                {/* Feature Icon */}
                <div className={`${f.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-12 transition-transform shadow-lg`}>
                  <FeatureIcon size={24} />
                </div>

                {/* Feature Title */}
                <h4 className={`font-black text-xl mb-3 transition-colors duration-300 ${
                  darkMode ? "text-slate-100" : "text-slate-900"
                }`}>
                  {f.title}
                </h4>

                {/* Feature Description */}
                <p className={`text-sm leading-relaxed font-medium transition-colors duration-300 ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;