import React, { useEffect, useState } from 'react';
import { Trophy, ArrowRight, Crown, Medal, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const LeaderboardCompact = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchGlobalLeaderboard } = useAppContext();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchGlobalLeaderboard();
        // Showing Top 4 to balance the height of the lg:col-span-8 card
        setUsers(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchGlobalLeaderboard]);

  if (loading) return (
    <div className="lg:col-span-4 bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl animate-pulse">
      <div className="h-6 w-32 bg-slate-100 rounded-full mb-8" />
      <div className="space-y-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-14 w-full bg-slate-50 rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="lg:col-span-4 bg-white rounded-[40px] border border-slate-100 shadow-2xl flex flex-col overflow-hidden group">
      {/* Header Section */}
      <div className="p-8 pb-4 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">লিডারবোর্ড</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Global Ranking</p>
        </div>
        <div className="p-3 bg-amber-50 rounded-2xl">
          <Trophy className="text-amber-500" size={20} />
        </div>
      </div>

      {/* List Section */}
      <div className="px-4 pb-4 space-y-1 flex-grow">
        {users.map((user, i) => (
          <div 
            key={user._id} 
            className={`flex items-center justify-between p-4 rounded-[2rem] transition-all duration-300 ${
              i === 0 
                ? 'bg-indigo-50/50 border border-indigo-100/30' 
                : 'hover:bg-slate-50 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Rank Position */}
              <div className="relative">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-transform group-hover:scale-105 ${
                  i === 0 ? 'bg-indigo-600 text-white shadow-lg' : 
                  i === 1 ? 'bg-slate-200 text-slate-600' : 
                  i === 2 ? 'bg-orange-100 text-orange-700' : 'text-slate-400 bg-slate-50'
                }`}>
                  {i + 1}
                </div>
                {i === 0 && (
                  <Crown className="absolute -top-2 -right-2 text-amber-400 rotate-12 drop-shadow-sm" size={16} fill="currentColor" />
                )}
              </div>

              {/* User Info */}
              <div className="max-w-[120px]">
                <p className="font-bold text-slate-800 text-sm truncate leading-tight">
                  {user.name}
                </p>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                   {user.stats?.totalPoints?.toFixed(0) || 0} Points
                </span>
              </div>
            </div>

            {/* Micro Stats */}
            <div className="flex items-center gap-2">
               <div className="h-8 w-[1px] bg-slate-100 mx-1" />
               <div className="text-right">
                  <span className="block text-xs font-black text-indigo-600 italic">
                    #{i + 1}
                  </span>
                  <TrendingUp size={12} className="text-emerald-500 ml-auto" />
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer / CTA */}
      <Link 
        to="/leaderboard" 
        className="mx-8 mb-8 p-4 bg-slate-900 rounded-2xl flex items-center justify-between text-white hover:bg-indigo-600 transition-all group/btn"
      >
        <span className="text-xs font-black uppercase tracking-widest">সকল র‍্যাঙ্কিং দেখুন</span>
        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default LeaderboardCompact;