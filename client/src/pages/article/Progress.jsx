import React from 'react';
import { History, TrendingUp, Activity } from 'lucide-react';

const ProgressChart = ({ history = [] }) => {
  const defaultHistory = [
    { day: 'Sat', percentage: 40, color: 'from-cyan-500 to-blue-500' },
    { day: 'Sun', percentage: 60, color: 'from-purple-500 to-pink-500' },
    { day: 'Mon', percentage: 35, color: 'from-amber-400 to-orange-600' },
    { day: 'Tue', percentage: 90, color: 'from-emerald-400 to-teal-600' },
    { day: 'Wed', percentage: 55, color: 'from-rose-500 to-red-600' },
    { day: 'Thu', percentage: 75, color: 'from-indigo-500 to-purple-600' },
    { day: 'Fri', percentage: 80, color: 'from-lime-400 to-green-600' },
  ];

  const chartData = history.length > 0 ? history : defaultHistory;

  // Generate SVG Path for the Line Chart
  const getLinePath = () => {
    const points = chartData.map((h, i) => {
      const x = (i / (chartData.length - 1)) * 100;
      const y = 100 - h.percentage; // SVG Y-axis is inverted
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="mt-8 pt-6 border-t border-white/10 w-full bg-gray-400/50 backdrop-blur-md p-6 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-xs font-black text-white/90 uppercase tracking-[0.2em] flex items-center gap-2">
            <Activity size={16} className="text-cyan-400" /> 
            Result Analysis
          </h3>
          <p className="text-[10px] text-white/40 mt-1">Weekly Growth & Performance Trend</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
            <span className="text-[9px] font-bold text-white/60 tracking-tighter">LIVE TREND</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-48 w-full group">
        
        {/* SVG Line Overlay */}
        <svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 w-full h-[80%] z-20 pointer-events-none overflow-visible px-4"
          preserveAspectRatio="none"
        >
          {/* Shadow Path for the line */}
          <path
            d={getLinePath()}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
            strokeLinecap="round"
            className="blur-sm"
          />
          {/* Main White Trend Line */}
          <path
            d={getLinePath()}
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="200"
            className="opacity-60 transition-all duration-1000"
          />
          {/* Data Nodes (Circles) */}
          {chartData.map((h, i) => (
            <circle 
              key={i} 
              cx={(i / (chartData.length - 1)) * 100} 
              cy={100 - h.percentage} 
              r="1.5" 
              fill="white" 
              className="drop-shadow-[0_0_5px_white]"
            />
          ))}
        </svg>

        {/* Bar Section */}
        <div className="flex items-end justify-between gap-4 h-full relative z-10 px-4">
          {chartData.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group/item relative">
              
              {/* Tooltip on Hover */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover/item:scale-100 transition-all duration-200 z-30 pointer-events-none">
                <div className="bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded-md shadow-lg border-b-2 border-slate-300">
                  {h.percentage}%
                </div>
              </div>

              {/* Bar Track Background */}
              <div className="absolute bottom-7 w-3 h-[75%] bg-white/5 rounded-full z-0"></div>

              {/* Individual Bar */}
              <div 
                className={`w-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden bg-linear-to-t ${h.color} group-hover/item:brightness-125 group-hover/item:w-4`}
                style={{ height: `${h.percentage}%` }}
              >
                <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/40"></div>
              </div>

              {/* Label */}
              <span className="mt-4 text-[10px] font-bold text-white/30 group-hover/item:text-white transition-colors">
                {h.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;

 