import React, { useEffect, useState } from 'react';
import { Trophy, Search, Medal, Clock, Calendar, Award, Loader2, Sparkles, RefreshCw, ChevronDown } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

const DailyTestLeaderBoard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("daily"); 
  const [searchTerm, setSearchTerm] = useState("");
  const [displayLimit, setDisplayLimit] = useState(10);
  
  const { darkMode } = useTheme();
  
  const { 
    userData, 
    fetchGlobalLeaderboard, 
    fetchTimeframeLeaderboard, 
    syncClick 
  } = useAppContext();

  useEffect(() => {
    const getLeaderboardData = async () => {
      setLoading(true);
      try {
        let data;
        if (timeframe === "global") {
          data = await fetchGlobalLeaderboard();
        } else {
          data = await fetchTimeframeLeaderboard(timeframe);
        }

        const leaderboardArray = Array.isArray(data) ? data : data?.leaderboard || [];
        setUsers(leaderboardArray);
      } catch (err) {
        console.error(`Leaderboard fetch error [${timeframe}]:`, err);
        setUsers([]); 
      } finally {
        setLoading(false);
      }
    };

    getLeaderboardData();
  }, [timeframe, fetchGlobalLeaderboard, fetchTimeframeLeaderboard]);

  const handleManualSync = async () => {
    await syncClick();
    const data = await fetchTimeframeLeaderboard(timeframe);
    setUsers(Array.isArray(data) ? data : data?.leaderboard || []);
  };

  const filteredUsers = users.filter(user => {
    const displayName = user.name || "";
    return displayName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const visibleUsers = filteredUsers.slice(0, displayLimit);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 md:py-40 space-y-4 md:space-y-6">
      <div className="relative">
        <Loader2 className="text-indigo-600 animate-spin" size={40} />
        <div className="absolute inset-0 blur-xl bg-indigo-500/20 animate-pulse"></div>
      </div>
      <p className={`font-black uppercase text-[10px] tracking-[0.4em] ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
        ফলাফল যাচাই করা হচ্ছে...
      </p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full px-2 sm:px-4 lg:px-0">
      
      {/* Header & Toggle Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6">
        <div>
          <h1 className={`text-2xl md:text-3xl font-black flex items-center gap-2.5 md:gap-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Trophy className="text-amber-500" size={30} /> মডেল টেস্ট লিডারবোর্ড
          </h1>
          <p className={`font-bold text-[11px] md:text-xs uppercase tracking-widest mt-1.5 md:mt-2 flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            <Sparkles size={14} className="text-indigo-600" /> সর্বোচ্চ পয়েন্ট ও নির্ভুলতার ভিত্তিতে সেরা তালিকা
          </p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          {/* Manual Sync Button */}
          <button 
            onClick={handleManualSync}
            className={`p-3 md:p-3.5 rounded-2xl border transition-all active:scale-95 shadow-sm ${
              darkMode 
                ? 'bg-slate-900/50 border-white/5 text-slate-400 hover:text-indigo-400' 
                : 'bg-white border-gray-200 text-gray-500 hover:text-indigo-600'
            }`}
            title="Refresh Leaderboard"
          >
            <RefreshCw size={18} className="md:w-5 md:h-5" />
          </button>

          <div className={`p-1.5 rounded-[1.5rem] flex items-center gap-1 border backdrop-blur-md shadow-sm ${
            darkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-gray-200'
          }`}>
            <button 
              onClick={() => { setTimeframe("daily"); setDisplayLimit(10); }}
              className={`flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all ${
                timeframe === "daily" 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : darkMode ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Clock size={14} className="md:w-4 md:h-4" /> আজকের সেরা
            </button>
            <button 
              onClick={() => { setTimeframe("weekly"); setDisplayLimit(10); }}
              className={`flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all ${
                timeframe === "weekly" 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : darkMode ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Calendar size={14} className="md:w-4 md:h-4" /> এই সপ্তাহের সেরা
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {filteredUsers.slice(0, 3).map((user, i) => {
          const isFirst = i === 0;
          return (
            <div key={user._id} className={`relative p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border transition-all duration-500 group overflow-hidden ${
              isFirst 
                ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-400/50 text-white shadow-2xl shadow-indigo-500/30 md:scale-105 z-10' 
                : darkMode 
                  ? 'bg-slate-900/40 border-white/5 hover:border-white/10 shadow-sm' 
                  : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
            }`}>
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 font-black text-xl md:text-2xl shadow-inner ${
                isFirst 
                  ? 'bg-white/20 text-white' 
                  : i === 1 
                    ? darkMode ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-gray-700' 
                    : darkMode ? 'bg-orange-950/40 text-orange-400' : 'bg-amber-100 text-amber-700'
              }`}>
                {i + 1}
              </div> 
              <h3 className={`text-lg md:text-xl font-black truncate mb-1 ${isFirst ? 'text-white' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user.name || "Anonymous"}
              </h3>
              <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-3 md:mb-4 ${isFirst ? 'text-indigo-200' : darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                  Elite Performer
              </p>
              <div className="flex items-baseline gap-1">
                <span className={`font-black text-3xl md:text-4xl ${isFirst ? 'text-white' : darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  {user.stats?.totalPoints?.toFixed(2) || 0}
                </span>
                <span className={`text-[10px] md:text-xs font-bold uppercase ${isFirst ? 'text-indigo-200' : darkMode ? 'text-slate-600' : 'text-gray-400'}`}>pts</span>
              </div>
              <Award className={`absolute -right-6 -bottom-6 opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-transform pointer-events-none ${isFirst ? 'text-white' : darkMode ? 'text-indigo-500' : 'text-indigo-600'}`} size={160} />
            </div>
          );
        })}
      </div>

      {/* Main Ranking Table Container */}
      <div className={`rounded-2xl md:rounded-[3rem] border shadow-sm md:shadow-2xl overflow-hidden backdrop-blur-xl w-full ${
        darkMode ? 'bg-slate-900/40 border-white/5' : 'bg-white border-gray-200'
      }`}>
        <div className={`p-5 md:p-8 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 ${
          darkMode ? 'border-white/5' : 'border-gray-100'
        }`}>
          <div className="flex items-center gap-3.5 md:gap-4">
            <div className={`p-3.5 md:p-4 rounded-2xl border ${
              darkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'
            }`}>
              <Medal size={22} className="md:w-6 md:h-6" />
            </div>
            <div>
              <h2 className={`text-lg md:text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>র‍্যাঙ্কিং লিস্ট</h2>
              <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 md:mt-1 ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>কম সময়ে সঠিক উত্তরের ভিত্তিতে তালিকা</p>
            </div>
          </div>

          <div className="relative w-full md:w-96">
            <Search className={`absolute left-4 md:left-5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`} size={18} />
            <input 
              type="text"
              placeholder="নাম দিয়ে খুঁজুন..."
              className={`w-full border rounded-2xl py-3.5 md:py-4 pl-12 md:pl-14 pr-4 md:pr-6 text-xs md:text-sm outline-none transition-all font-medium ${
                darkMode 
                  ? 'bg-white/5 border-white/5 text-white placeholder:text-slate-600 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/40' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/40'
              }`}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setDisplayLimit(10);
              }}
            />
          </div>
        </div>

        {/* Desktop View Table */}
        <div className="hidden lg:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] border-b ${
                darkMode ? 'text-slate-500 border-white/5 bg-white/[0.02]' : 'text-gray-400 border-gray-100 bg-gray-50/50'
              }`}>
                <th className="px-8 py-5 text-center">Rank</th>
                <th className="px-6 py-5">Candidate</th>
                <th className="px-6 py-5 text-center">Solved</th>
                <th className="px-6 py-5 text-center">Points</th>
                <th className="px-8 py-5 text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
              {visibleUsers.map((user, index) => {
                const isCurrentUser = user._id === userData?._id;
                const accuracy = user.stats?.accuracy || 0;
                
                return (
                  <tr key={user._id} className={`transition-all group ${
                    isCurrentUser 
                      ? darkMode ? 'bg-indigo-500/10' : 'bg-indigo-50/60' 
                      : darkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-gray-50/50'
                  }`}>
                    <td className="px-8 py-5">
                       <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center font-black text-xs transition-transform group-hover:scale-110 border ${
                        index === 0 ? darkMode ? 'bg-amber-400/20 text-amber-400 border-amber-400/20' : 'bg-amber-100 text-amber-700 border-amber-200' : 
                        index === 1 ? darkMode ? 'bg-slate-400/20 text-slate-300 border-slate-400/20' : 'bg-gray-100 text-gray-700 border-gray-200' : 
                        index === 2 ? darkMode ? 'bg-orange-500/20 text-orange-400 border-orange-500/20' : 'bg-orange-100 text-orange-700 border-orange-200' :
                        isCurrentUser ? 'bg-indigo-600 text-white shadow-lg border-transparent' : darkMode ? 'bg-white/5 text-slate-500 border-white/5' : 'bg-gray-100 text-gray-500 border-gray-200'
                       }`}>
                        {index + 1}
                       </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className={`font-black text-sm ${isCurrentUser ? darkMode ? 'text-indigo-400' : 'text-indigo-600' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {user.name}
                        </span>
                        <span className={`text-[10px] font-bold tracking-widest uppercase mt-0.5 ${darkMode ? 'text-slate-600' : 'text-gray-400'}`}>UID: {user._id?.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`font-black text-sm ${darkMode ? 'text-emerald-500' : 'text-emerald-600'}`}>{user.stats?.totalCorrect || 0}</span>
                        <span className={`text-xs ${darkMode ? 'text-slate-700' : 'text-gray-300'}`}>/</span>
                        <span className={`font-bold text-xs ${darkMode ? 'text-rose-500/70' : 'text-rose-500/80'}`}>{user.stats?.totalWrong || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`font-black text-base ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        {user.stats?.totalPoints?.toFixed(2) || 0}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border transition-colors ${
                        accuracy >= 80 ? darkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        accuracy >= 50 ? darkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200' :
                        darkMode ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-200'
                      }`}>
                        {accuracy.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View Cards */}
        <div className={`lg:hidden divide-y ${darkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
          {visibleUsers.map((user, index) => {
            const isCurrentUser = user._id === userData?._id;
            const accuracy = user.stats?.accuracy || 0;

            return (
              <div key={user._id} className={`p-4 sm:p-5 space-y-3.5 ${
                isCurrentUser 
                  ? darkMode ? 'bg-indigo-500/15' : 'bg-indigo-50/50' 
                  : ''
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs border ${
                      index === 0 ? darkMode ? 'bg-amber-400/20 text-amber-400 border-amber-400/20' : 'bg-amber-100 text-amber-700 border-amber-200' : 
                      index === 1 ? darkMode ? 'bg-slate-400/20 text-slate-300 border-slate-400/20' : 'bg-gray-100 text-gray-700 border-gray-200' : 
                      index === 2 ? darkMode ? 'bg-orange-500/20 text-orange-400 border-orange-500/20' : 'bg-orange-100 text-orange-700 border-orange-200' :
                      isCurrentUser ? 'bg-indigo-600 text-white shadow-md border-transparent' : darkMode ? 'bg-white/5 text-slate-400 border-white/5' : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className={`font-black text-xs sm:text-sm truncate ${isCurrentUser ? darkMode ? 'text-indigo-400' : 'text-indigo-600' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user.name}
                      </div>
                      <div className={`text-[10px] font-bold tracking-wider uppercase ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>UID: {user._id?.slice(-6)}</div>
                    </div>
                  </div>
                  <div className={`text-xs sm:text-sm font-black ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    {user.stats?.totalPoints?.toFixed(2) || 0} pts
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className={`p-2 rounded-xl text-center border ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`text-[9px] font-black uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>Solved</div>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <span className={`font-black text-xs ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{user.stats?.totalCorrect || 0}</span>
                      <span className={`text-[10px] ${darkMode ? 'text-slate-700' : 'text-gray-300'}`}>/</span>
                      <span className={`font-bold text-[10px] ${darkMode ? 'text-rose-400' : 'text-rose-500'}`}>{user.stats?.totalWrong || 0}</span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-xl text-center border ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`text-[9px] font-black uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>Points</div>
                    <div className={`font-bold text-xs mt-0.5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{user.stats?.totalPoints?.toFixed(2) || 0}</div>
                  </div>
                  <div className={`p-2 rounded-xl text-center border ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`text-[9px] font-black uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>Accuracy</div>
                    <div className={`font-bold text-xs mt-0.5 ${accuracy >= 80 ? darkMode ? 'text-emerald-400' : 'text-emerald-600' : accuracy >= 50 ? darkMode ? 'text-amber-400' : 'text-amber-600' : darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
                      {accuracy.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {filteredUsers.length > displayLimit && (
          <div className={`p-4 md:p-8 text-center border-t ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
            <button
              onClick={() => setDisplayLimit(prev => prev + 10)}
              className={`group inline-flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all px-6 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl border active:scale-95 shadow-md md:shadow-lg ${
                darkMode 
                ? 'text-slate-400 hover:text-white border-white/5 hover:bg-white/5' 
                : 'text-gray-600 hover:text-gray-900 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Show More Records
              <ChevronDown size={14} className="md:w-4 md:h-4 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        )}
        
        {filteredUsers.length === 0 && (
          <div className="py-24 text-center">
            <Trophy size={48} className={`mx-auto mb-4 opacity-20 ${darkMode ? 'text-slate-800' : 'text-gray-300'}`} />
            <p className={`font-bold uppercase text-xs tracking-widest ${darkMode ? 'text-slate-600' : 'text-gray-400'}`}>No candidates found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyTestLeaderBoard;