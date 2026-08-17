import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, TrendingUp, Zap, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

export const ArticleUpdate = () => {
  const { darkMode } = useTheme();
  const { backendUrl } = useAppContext();
  const [stats, setStats] = useState({ totalViews: 0, totalSecondsSpent: 0, totalArticles: 0 });
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Stats Summary
        const statsRes = await axios.get(`${backendUrl}/api/articles/stats/summary`);
        setStats(statsRes.data);

        // 2. Fetch Latest Articles (for the bottom list)
        const articlesRes = await axios.get(`${backendUrl}/api/articles`);
        setArticles(articlesRes.data.slice(0, 4)); // Show only latest 4
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [backendUrl]);

  // Logic to convert seconds to formatted hours/minutes
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}.${Math.floor(minutes / 6)} Hours` : `${minutes} Minutes`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 md:py-32 space-y-4">
        <Loader2 className="text-indigo-500 animate-spin" size={40} />
        <p className={`${darkMode ? 'text-slate-500' : 'text-gray-400'} font-black uppercase text-[10px] tracking-[0.4em]`}>
          Loading Stats...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-in slide-in-from-right-4 duration-500 w-full">
      {/* Main Stats Card */}
      <div className={`p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-xl relative overflow-hidden border transition-colors ${
        darkMode 
          ? 'bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border-white/10 text-white' 
          : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 text-gray-900'
      }`}>
        <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl ${darkMode ? 'bg-white/5' : 'bg-indigo-200/40'}`} />
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-5 mb-6 md:mb-8 relative z-10">
          <div className={`p-3.5 md:p-4 rounded-2xl md:rounded-3xl backdrop-blur-md border inline-flex w-fit ${
            darkMode ? 'bg-white/10 border-white/10 text-indigo-300' : 'bg-white border-indigo-100 text-indigo-600 shadow-sm'
          }`}>
            <Clock size={28} className="md:w-8 md:h-8" />
          </div>
          <div>
            <h3 className={`font-black text-2xl md:text-3xl tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatTime(stats.totalSecondsSpent)} Spent
            </h3>
            <p className={`text-xs md:text-sm font-semibold uppercase tracking-wider mt-0.5 ${
              darkMode ? 'text-indigo-200/60' : 'text-indigo-600/70'
            }`}>
              You read {stats.totalArticles} articles total
            </p>
          </div>
        </div>

        {/* Dynamic Progress Bar (Subject Distribution) */}
        <div className="space-y-2.5 relative z-10">
          <div className={`flex justify-between text-[10px] font-black uppercase tracking-widest ${
            darkMode ? 'text-indigo-200/50' : 'text-indigo-900/60'
          }`}>
            <span>Subject Analysis</span>
            <TrendingUp size={12} />
          </div>
          <div className={`flex gap-1 h-3 w-full rounded-full overflow-hidden p-0.5 border ${
            darkMode ? 'bg-black/20 border-white/5' : 'bg-white border-indigo-100 shadow-inner'
          }`}>
            <div className="bg-indigo-500 w-[45%] rounded-full transition-all duration-1000" title="Engineering" />
            <div className="bg-purple-500 w-[30%] rounded-full transition-all duration-1000" title="English" />
            <div className="bg-emerald-500 w-[15%] rounded-full transition-all duration-1000" title="GK" />
            <div className={`w-[10%] rounded-full transition-all duration-1000 ${darkMode ? 'bg-slate-500' : 'bg-gray-400'}`} title="Others" />
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-5 md:mt-6 relative z-10">
          <div className={`flex items-center gap-2 text-[10px] uppercase font-bold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            <div className="w-2 h-2 rounded-full bg-indigo-500" /> Engineering
          </div>
          <div className={`flex items-center gap-2 text-[10px] uppercase font-bold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            <div className="w-2 h-2 rounded-full bg-purple-500" /> English
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {articles.map((art, i) => (
          <div 
            key={i} 
            className={`group p-4 md:p-5 rounded-2xl md:rounded-[2rem] flex items-center justify-between transition-all border ${
              darkMode 
                ? 'bg-slate-900/40 border-white/5 hover:border-white/10 hover:bg-white/[0.03]' 
                : 'bg-white border-gray-200 hover:border-indigo-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-3.5 md:gap-4 min-w-0">
              <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl transition-colors flex-shrink-0 ${
                darkMode ? 'bg-indigo-500/10 text-indigo-300 group-hover:bg-indigo-500 group-hover:text-white' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
              }`}>
                <BookOpen size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className={`text-xs md:text-sm font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {art.seo_metadata?.title_tag || "New Lesson"}
                </span>
                <span className={`text-[10px] font-medium truncate mt-0.5 ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                   {art.views || 0} views • {art.content_header?.subject || 'General'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 pl-2">
               <Zap size={12} className="text-amber-500 flex-shrink-0" />
               <span className={`text-[9px] md:text-[10px] font-black px-2.5 md:px-3 py-1.5 rounded-xl border ${
                 darkMode ? 'bg-white/5 border-white/5 text-slate-300' : 'bg-gray-50 border-gray-200 text-gray-700'
               }`}>
                 DONE
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleUpdate;