import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

import RightSection from './hero/RightSection'

import { allCategories } from '../../context/data'

const HeroSection = () => {
  const { darkMode } = useTheme()

  return (
    <section 
      className={`relative pt-8 md:pt-12 pb-16 md:pb-24 overflow-hidden border-b transition-colors duration-300 ${
        darkMode 
          ? "bg-slate-950 border-slate-800/80 text-white" 
          : "bg-slate-50/60 border-slate-200/80 text-slate-900"
      }`}
    >
      {/* --- AMBIENT GLOWS --- */}
      {darkMode ? (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-emerald-600/10 via-indigo-600/10 to-teal-500/10 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/40 via-teal-100/30 to-transparent blur-[80px] pointer-events-none" />
          <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-sky-100/60 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-emerald-100/50 rounded-full blur-[100px] pointer-events-none" />
        </>
      )}

      {/* Subtle Dot Overlay Pattern */}
      <div 
        className={`absolute inset-0 pointer-events-none bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] ${
          darkMode ? "opacity-25" : "opacity-40"
        }`} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. HERO HEADLINE & STATS */}
        <div className="w-full mb-12">
          <RightSection />
        </div>

        {/* 2. CATEGORIES HIGHLIGHT SECTION */}
        <div className={`pt-10 border-t ${darkMode ? "border-slate-800/80" : "border-slate-200/80"}`}>
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider mb-1 text-emerald-500">
                <Sparkles size={14} />
                <span>Be Strong</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${
                darkMode ? "text-white" : "text-slate-900"
              }`}>
               Most Popular
              </h2>
            </div>
            <p className={`text-xs sm:text-sm max-w-sm font-medium ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}>
              Choose and Start your Journey
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCategories.slice(0, 6).map((cat, index) => {
              const IconComponent = cat.icon;
              return (
                <div 
                  key={index}
                  className={`group relative rounded-3xl p-6 border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm ${
                    darkMode 
                      ? "bg-slate-900/80 border-slate-800/80 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/20 hover:-translate-y-1" 
                      : "bg-white/80 border-slate-200/80 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1"
                  }`}
                >
                  {/* Ambient Glow on Hover */}
                  <div className={`absolute -right-10 -bottom-10 w-32 h-32 bg-gradient-to-br ${cat.color || 'from-emerald-500 to-teal-500'} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500 pointer-events-none`} />

                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 duration-300 ${
                      darkMode 
                        ? "bg-slate-800 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white" 
                        : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
                    }`}>
                      <IconComponent size={22} />
                    </div>
                    
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                      darkMode 
                        ? "bg-slate-800/80 text-slate-300 border border-slate-700/50" 
                        : "bg-slate-100 text-slate-600 border border-slate-200/60"
                    }`}>
                      {cat.count}
                    </span>
                  </div>

                  <h3 className={`text-base font-bold mb-2 transition-colors ${
                    darkMode ? "text-white group-hover:text-emerald-400" : "text-slate-900 group-hover:text-emerald-600"
                  }`}>
                    {cat.name}
                  </h3>
                  
                  <div className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                    darkMode ? "text-slate-400 group-hover:text-slate-200" : "text-slate-500 group-hover:text-slate-800"
                  }`}>
                    <span>টেস্ট শুরু করুন</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. LIVE TEST BANNER CONTAINER */}
        <div className="mt-14 max-w-4xl mx-auto relative group">
          <div className={`absolute -inset-2 rounded-[3rem] blur-xl transition-all duration-500 opacity-60 group-hover:opacity-100 ${
            darkMode 
              ? "bg-linear-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10" 
              : "bg-linear-to-r from-emerald-200/60 via-teal-200/50 to-sky-200/60"
          }`} />
          
          <div className="relative z-10 w-full">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider mb-1 text-emerald-500">
                <Sparkles size={14} />
                <span>Live Test</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${
                darkMode ? "text-white" : "text-slate-900"
              }`}>
               Participate Live Exam
              </h2>
            </div>
            <p className={`text-xs sm:text-sm max-w-sm font-medium ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}>
             Test Your Probability
            </p>
          </div>
           
          </div>
        </div>

      </div>
    </section>
  )
}

export default HeroSection