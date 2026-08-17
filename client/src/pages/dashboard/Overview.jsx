import React, { useMemo, useEffect, useState } from 'react';
import { Target, TrendingUp, Zap, Activity, AlertCircle, PieChart as PieIcon, BarChart } from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

export const Overview = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();
  const { userData, getUserHistory } = useAppContext();
  
  // Theme Colors
  const CATEGORY_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
  const STATUS_COLORS = {
    correct: '#10b981',   // Emerald
    incorrect: '#f43f5e', // Rose
    unanswered: '#64748b' // Slate
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userData?._id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getUserHistory(userData._id);
        // Standardizing the input as an array
        setHistory(Array.isArray(data) ? data : data?.history || []);
      } catch (err) {
        console.error("Failed to fetch overview data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userData?._id, getUserHistory]);

  // --- 1. Line Chart: Solve Momentum (Last 10 Sessions) ---
  const solveFlowData = useMemo(() => {
    return [...history]
      .sort((a, b) => new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp))
      .slice(-10)
      .map(session => ({
        date: new Date(session.createdAt || session.timestamp).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' }),
        correct: session.correct || 0,
        wrong: (session.incorrect || 0) + (session.unanswered || 0),
      }));
  }, [history]);

  // --- 2. Pie Chart: Category Focus ---
  const categoryData = useMemo(() => {
    const categories = history.reduce((acc, curr) => {
      const cat = curr.topic || 'General';
      acc[cat] = (acc[cat] || 0) + (curr.total || 0);
      return acc;
    }, {});
    return Object.keys(categories)
      .map(name => ({ name, value: categories[name] }))
      .sort((a, b) => b.value - a.value);
  }, [history]);

  // --- 3. Accuracy Breakdown ---
  const accuracyBreakdownData = useMemo(() => {
    const totals = history.reduce((acc, curr) => {
      acc.correct += (curr.correct || 0);
      acc.incorrect += (curr.incorrect || 0);
      acc.unanswered += (curr.unanswered || 0);
      return acc;
    }, { correct: 0, incorrect: 0, unanswered: 0 });

    return [
      { name: 'Right', value: totals.correct, fill: STATUS_COLORS.correct },
      { name: 'Wrong', value: totals.incorrect, fill: STATUS_COLORS.incorrect },
      { name: 'Skipped', value: totals.unanswered, fill: STATUS_COLORS.unanswered },
    ];
  }, [history, STATUS_COLORS.correct, STATUS_COLORS.incorrect, STATUS_COLORS.unanswered]);

  // --- 4. Weak Subject Logic ---
  const weakSubject = useMemo(() => {
    if (history.length === 0) return null;
    const stats = history.reduce((acc, curr) => {
      const cat = curr.topic || 'General';
      if (!acc[cat]) acc[cat] = { wrong: 0 };
      acc[cat].wrong += (curr.incorrect || 0);
      return acc;
    }, {});

    const sorted = Object.keys(stats).sort((a, b) => stats[b].wrong - stats[a].wrong);
    return stats[sorted[0]]?.wrong > 0 ? { name: sorted[0], wrong: stats[sorted[0]].wrong } : null;
  }, [history]);

  const totals = useMemo(() => {
    return history.reduce((acc, curr) => ({
      correct: acc.correct + (curr.correct || 0),
      total: acc.total + (curr.total || 0)
    }), { correct: 0, total: 0 });
  }, [history]);

  const accuracyScore = totals.total > 0 ? ((totals.correct / totals.total) * 100).toFixed(1) : "0.0";

  // Shared Recharts Styles conditionally driven by context
  const tooltipStyle = {
    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
    borderColor: darkMode ? '#334155' : '#cbd5e1',
    color: darkMode ? '#f8fafc' : '#0f172a',
    borderRadius: '16px',
    boxShadow: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };
  
  const tooltipItemStyle = {
    color: darkMode ? '#e2e8f0' : '#334155',
    fontSize: '12px',
    fontWeight: 'bold'
  };
  
  const tooltipLabelStyle = {
    color: darkMode ? '#94a3b8' : '#64748b',
    fontSize: '12px'
  };

  const chartBackgroundStroke = darkMode ? '#0f172a' : '#ffffff';

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4">
      <div className={`w-10 h-10 border-4 rounded-full animate-spin ${darkMode ? 'border-indigo-900 border-t-indigo-400' : 'border-indigo-200 border-t-indigo-500'}`}></div>
      <p className={`font-bold uppercase text-[10px] tracking-[0.3em] ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>বিশ্লেষণ লোড হচ্ছে...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 transition-colors">
      
      {/* Top Section: Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Momentum Line Chart */}
        <div className={`lg:col-span-2 border rounded-[2.5rem] p-8 shadow-sm transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <div className="mb-6">
            <h3 className={`font-bold text-lg flex items-center gap-2 ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>
              <Activity size={20} className={darkMode ? 'text-indigo-400' : 'text-indigo-600'} /> Solve Momentum
            </h3>
            <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>গত ১০টি সেশনের অগ্রগতি</p>
          </div>
          <div className="h-70 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={solveFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 10 }} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={tooltipStyle}
                  itemStyle={tooltipItemStyle}
                  labelStyle={tooltipLabelStyle}
                />
                <Legend 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} 
                  formatter={(value) => <span className={darkMode ? 'text-slate-300' : 'text-gray-600'}>{value}</span>} 
                />
                <Line type="monotone" dataKey="correct" name="সঠিক" stroke={STATUS_COLORS.correct} strokeWidth={4} dot={false} activeDot={{ r: 6, fill: STATUS_COLORS.correct, stroke: chartBackgroundStroke, strokeWidth: 2 }} />
                <Line type="monotone" dataKey="wrong" name="ভুল" stroke={STATUS_COLORS.incorrect} strokeWidth={4} dot={false} activeDot={{ r: 6, fill: STATUS_COLORS.incorrect, stroke: chartBackgroundStroke, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Focus Distribution Pie */}
        <div className={`border rounded-[2.5rem] p-8 shadow-sm transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <h3 className={`font-bold text-sm mb-4 flex items-center gap-2 ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>
            <PieIcon size={18} className={darkMode ? 'text-purple-400' : 'text-purple-600'} /> Topic Focus
          </h3>
          <div className="h-45 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value" stroke={chartBackgroundStroke} strokeWidth={2}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  cornerRadius={12} 
                  contentStyle={tooltipStyle} 
                  itemStyle={tooltipItemStyle} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.slice(0, 3).map((item, i) => (
              <div key={i} className={`flex justify-between items-center text-[10px] uppercase font-black tracking-widest ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                <span className="truncate max-w-25">{item.name}</span>
                <span className={darkMode ? 'text-slate-100' : 'text-gray-900'}>{item.value} Qs</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accuracy Breakdown Pie */}
        <div className={`border rounded-[2.5rem] p-8 shadow-sm transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <h3 className={`font-bold text-sm mb-4 flex items-center gap-2 ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>
            <BarChart size={18} className={darkMode ? 'text-emerald-400' : 'text-emerald-600'} /> Precision
          </h3>
          <div className="h-45 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={accuracyBreakdownData} 
                  innerRadius={0} 
                  outerRadius={75} 
                  dataKey="value" 
                  stroke={chartBackgroundStroke} 
                  strokeWidth={2}
                >
                  {accuracyBreakdownData.map((entry, index) => (
                    <Cell key={`status-cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  cornerRadius={12} 
                  contentStyle={tooltipStyle} 
                  itemStyle={tooltipItemStyle}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
             <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className={darkMode ? 'text-emerald-400' : 'text-emerald-600'}>সঠিক</span>
                <span className={darkMode ? 'text-slate-100' : 'text-gray-900'}>{accuracyBreakdownData[0].value}</span>
             </div>
             <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className={darkMode ? 'text-rose-400' : 'text-rose-600'}>ভুল</span>
                <span className={darkMode ? 'text-slate-100' : 'text-gray-900'}>{accuracyBreakdownData[1].value}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard icon={<Target size={24} />} label="গড় নির্ভুলতা" value={`${accuracyScore}%`} color={darkMode ? 'text-emerald-400' : 'text-emerald-600'} darkMode={darkMode} />
        <MetricCard icon={<TrendingUp size={24} />} label="মোট সমাধান" value={totals.total.toLocaleString()} color={darkMode ? 'text-purple-400' : 'text-purple-600'} darkMode={darkMode} />
        <MetricCard icon={<Zap size={24} />} label="স্কিল লেভেল" value={parseFloat(accuracyScore) > 80 ? "মাস্টার" : "শিক্ষার্থী"} color={darkMode ? 'text-amber-400' : 'text-amber-600'} darkMode={darkMode} />
      </div>

      {/* Weak Subject Alert */}
      {weakSubject && (
        <div className={`group border rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all shadow-sm ${darkMode ? 'bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20' : 'bg-rose-50 border-rose-200 hover:bg-rose-100/60'}`}>
          <div className="flex items-center gap-6">
            <div className={`p-4 rounded-3xl shadow-lg shadow-rose-500/10 group-hover:scale-110 transition-transform ${darkMode ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600'}`}>
              <AlertCircle size={32} />
            </div>
            <div>
              <h4 className={`font-black text-sm uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-50' : 'text-gray-900'}`}>সতর্কতা: দুর্বলতা চিহ্নিত</h4>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                আপনি <span className={`font-bold mx-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>"{weakSubject.name}"</span> বিষয়ে 
                <span className={`font-bold ml-1 ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>{weakSubject.wrong}টি প্রশ্নে</span> ভুল করেছেন। 
                এই বিষয়টি আরও মনোযোগ দিয়ে পড়া প্রয়োজন।
              </p>
            </div>
          </div>
          <button className={`whitespace-nowrap px-8 py-4 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-lg shadow-rose-500/20 ${darkMode ? 'bg-rose-500 hover:bg-rose-400' : 'bg-rose-600 hover:bg-rose-700'}`}>
            রিভিউ শুরু করুন
          </button>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ icon, label, value, color, darkMode }) => (
  <div className={`border p-8 rounded-[2.5rem] group transition-all shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800/80' : 'bg-white border-gray-200 hover:bg-gray-50/50'}`}>
    <div className={`${color} mb-6 w-14 h-14 flex items-center justify-center rounded-2xl group-hover:rotate-6 transition-transform duration-300 ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
      {icon}
    </div>
    <p className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{label}</p>
    <h3 className={`text-3xl font-black mt-2 ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>{value}</h3>
  </div>
);

export default Overview;