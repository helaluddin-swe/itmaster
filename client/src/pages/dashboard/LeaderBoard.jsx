import React, { useEffect, useState } from 'react';
import { Trophy, Search, Medal, Loader2, ChevronDown } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

const Leaderboard = () => {
  const { darkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayLimit, setDisplayLimit] = useState(5);
  
  const { userData, fetchGlobalLeaderboard } = useAppContext();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchGlobalLeaderboard();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch leaderboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchGlobalLeaderboard]);

  const filteredUsers = users.filter(user => {
    const displayName = user.name || user.email || "";
    return displayName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const visibleUsers = filteredUsers.slice(0, displayLimit);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 md:py-32 space-y-4">
        <Loader2 className="text-indigo-500 animate-spin" size={40} />
        <p className={`${darkMode ? 'text-slate-400' : 'text-gray-500'} font-black uppercase text-[10px] tracking-[0.4em]`}>
          লিডারবোর্ড লোড হচ্ছে...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-in slide-in-from-bottom-2 duration-700 w-full">
      
      {/* Top 3 Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {filteredUsers.slice(0, 3).map((user, i) => (
          <div key={user._id} className={`relative p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border transition-all duration-300 hover:shadow-xl group overflow-hidden ${
            i === 0 
              ? darkMode 
                ? 'bg-indigo-950/40 border-indigo-500/20 shadow-md md:scale-105 z-10' 
                : 'bg-indigo-50/80 border-indigo-100 shadow-md md:scale-105 z-10'
              : darkMode 
                ? 'bg-slate-900/40 border-white/5' 
                : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 font-black text-base md:text-xl ${
              i === 0 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                : darkMode 
                  ? 'bg-white/5 text-slate-300 border border-white/5' 
                  : 'bg-gray-100 text-gray-700'
            }`}>
              {i + 1}
            </div> 
            <h3 className={`text-base md:text-lg font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</h3>
            <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider md:tracking-widest mb-2 ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                {user.role === 'admin' ? '🛡️ Staff' : '🎓 Candidate'}
            </p>
            <div className="flex items-baseline gap-1">
              <span className={`font-black text-2xl md:text-3xl ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                {user.stats?.totalPoints ? user.stats.totalPoints.toFixed(1) : "0.0"}
              </span>
              <span className={`text-[10px] md:text-xs font-bold italic ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>pts</span>
            </div>
            <Trophy className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none ${darkMode ? 'text-white' : 'text-gray-900'}`} size={120} />
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className={`rounded-2xl md:rounded-[2.5rem] border shadow-2xl overflow-hidden backdrop-blur-md w-full ${darkMode ? 'bg-slate-900/40 border-white/5' : 'bg-white border-gray-200'}`}>
        
        {/* Header Section */}
        <div className={`p-5 md:p-8 border-b flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3.5 md:gap-4">
            <div className={`p-3 rounded-2xl border ${darkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
              <Medal size={22} className="md:w-6 md:h-6" />
            </div>
            <div>
              <h2 className={`font-bold text-base md:text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ranking</h2>
              <p className={`text-[11px] md:text-xs font-medium mt-0.5 ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>Top Solved Question by students </p>
            </div>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`} size={18} />
            <input 
              type="text"
              placeholder="Search by name..."
              className={`w-full border rounded-xl py-3 pl-12 pr-4 text-xs md:text-sm outline-none transition-all ${
                darkMode 
                  ? 'bg-white/[0.02] border-white/5 text-white placeholder-slate-600 focus:bg-white/[0.05] focus:border-indigo-500/50' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-indigo-300'
              }`}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setDisplayLimit(10);
              }}
            />
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className={`text-[9px] md:text-[10px] uppercase font-black tracking-[0.2em] ${darkMode ? 'text-slate-500 bg-white/[0.02]' : 'text-gray-500 bg-gray-50/50'}`}>
                <th className="px-8 py-4 md:py-5 text-center">Rank</th>
                <th className="px-6 py-4 md:py-5">Candidate</th>
                <th className="px-6 py-4 md:py-5 text-center">Solved</th>
                <th className="px-6 py-4 md:py-5 text-center">Correct</th>
                <th className="px-6 py-4 md:py-5 text-center">Points</th>
                <th className="px-8 py-4 md:py-5 text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
              {visibleUsers.map((user, index) => (
                <DesktopRow key={user._id} user={user} index={index} currentUserId={userData?._id} darkMode={darkMode} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className={`lg:hidden divide-y ${darkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
          {visibleUsers.map((user, index) => (
            <MobileCard key={user._id} user={user} index={index} currentUserId={userData?._id} darkMode={darkMode} />
          ))}
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
      </div>
    </div>
  );
};

// Internal Component: Desktop Row
const DesktopRow = ({ user, index, currentUserId, darkMode }) => {
  const isCurrentUser = user._id === currentUserId;
  const stats = user.stats || {};
  const accuracy = stats.totalSolved > 0 
    ? ((stats.totalCorrect / stats.totalSolved) * 100).toFixed(1) 
    : "0.0";

  return (
    <tr className={`transition-colors ${
      isCurrentUser 
        ? darkMode ? 'bg-indigo-500/10' : 'bg-indigo-50/50' 
        : darkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-gray-50'
    }`}>
      <td className="px-8 py-5">
        <RankBadge index={index} isCurrentUser={isCurrentUser} darkMode={darkMode} />
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className={`font-bold text-sm ${isCurrentUser ? darkMode ? 'text-indigo-400' : 'text-indigo-600' : darkMode ? 'text-white' : 'text-gray-900'}`}>
            {user.name}
          </span>
          <span className={`text-[10px] font-medium lowercase ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
            {user.email?.split('@')[0]}
          </span>
        </div>
      </td>
      <td className={`px-6 py-5 text-center text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{stats.totalSolved || 0}</td>
      <td className={`px-6 py-5 text-center font-bold text-sm ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{stats.totalCorrect || 0}</td>
      <td className={`px-6 py-5 text-center font-black text-base ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
        {stats.totalPoints ? stats.totalPoints.toFixed(1) : "0.0"}
      </td>
      <td className={`px-8 py-5 text-right font-black ${darkMode ? 'text-white' : 'text-gray-800'}`}>{accuracy}%</td>
    </tr>
  );
};

// Internal Component: Mobile Card
const MobileCard = ({ user, index, currentUserId, darkMode }) => {
  const isCurrentUser = user._id === currentUserId;
  const stats = user.stats || {};
  const accuracy = stats.totalSolved > 0 
    ? ((stats.totalCorrect / stats.totalSolved) * 100).toFixed(1) 
    : "0.0";

  return (
    <div className={`p-4 sm:p-5 space-y-3.5 ${isCurrentUser ? darkMode ? 'bg-indigo-500/10' : 'bg-indigo-50/30' : ''}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <RankBadge index={index} isCurrentUser={isCurrentUser} small darkMode={darkMode} />
          <div>
            <div className={`font-bold text-xs sm:text-sm ${isCurrentUser ? darkMode ? 'text-indigo-400' : 'text-indigo-600' : darkMode ? 'text-white' : 'text-gray-900'}`}>
              {user.name}
            </div>
            <div className={`text-[10px] font-medium ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>Rank #{index + 1}</div>
          </div>
        </div>
        <div className={`text-xs sm:text-sm font-black ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
            {stats.totalPoints ? stats.totalPoints.toFixed(1) : "0.0"} pts
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className={`p-2 rounded-xl text-center border ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
          <div className={`text-[9px] font-black uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>Solved</div>
          <div className={`font-bold text-xs mt-0.5 ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>{stats.totalSolved || 0}</div>
        </div>
        <div className={`p-2 rounded-xl text-center border ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
          <div className={`text-[9px] font-black uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>Correct</div>
          <div className={`font-bold text-xs mt-0.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{stats.totalCorrect || 0}</div>
        </div>
        <div className={`p-2 rounded-xl text-center border ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
          <div className={`text-[9px] font-black uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>Accuracy</div>
          <div className={`font-bold text-xs mt-0.5 ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>{accuracy}%</div>
        </div>
      </div>
    </div>
  );
};

const RankBadge = ({ index, isCurrentUser, small, darkMode }) => (
  <div className={`${small ? 'w-7 h-7 text-[11px]' : 'w-10 h-10 mx-auto text-sm'} rounded-xl flex items-center justify-center font-black ${
    index === 0 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 
    index === 1 ? darkMode ? 'bg-white/10 text-slate-200 border border-white/5' : 'bg-gray-200 text-gray-700' : 
    index === 2 ? darkMode ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-orange-100 text-orange-700' :
    isCurrentUser ? 'bg-indigo-500 text-white' : darkMode ? 'bg-white/[0.02] text-slate-400 border border-white/5' : 'bg-gray-50 text-gray-500 border border-gray-200'
  }`}>
    {index + 1}
  </div>
);

export default Leaderboard;