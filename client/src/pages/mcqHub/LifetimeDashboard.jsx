import { Award, Target, TrendingUp } from "lucide-react";

// Map colors explicitly so Tailwind compiles them reliably
const colorStyles = {
  indigo: {
    iconBg: "bg-indigo-50 text-indigo-600",
  },
  green: {
    iconBg: "bg-emerald-50 text-emerald-600",
  },
};

const LifetimeDashboard = ({ lifetimeStats = {} }) => {
  const { totalAnswered = 0, totalCorrect = 0 } = lifetimeStats;
  const accuracy = totalAnswered > 0 
    ? Math.round((totalCorrect / totalAnswered) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-4xl mx-auto">
      <StatBox 
        icon={<Target className="w-5 h-5 md:w-6 md:h-6" />} 
        value={totalAnswered.toLocaleString()} 
        label="Total Ans" 
        color="indigo" 
      />
      <StatBox 
        icon={<Award className="w-5 h-5 md:w-6 md:h-6" />} 
        value={totalCorrect.toLocaleString()} 
        label="Right Ans" 
        color="green" 
      />
      <StatBox 
        icon={<TrendingUp className="w-5 h-5 md:w-6 md:h-6" />} 
        value={`${accuracy}%`} 
        label="Success Rate" 
        highlight 
      />
    </div>
  );
};

const StatBox = ({ icon, value, label, color = "indigo", highlight = false }) => {
  const styles = colorStyles[color] || colorStyles.indigo;

  return (
    <div 
      className={`p-3 md:p-4 rounded-2xl md:rounded-3xl border transition-all duration-200 flex items-center gap-3 md:gap-4 ${
        highlight 
          ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" 
          : "bg-white border-slate-100 text-slate-900 shadow-sm"
      }`}
    >
      {/* Icon Wrapper: adapts size smoothly instead of completely disappearing */}
      <div 
        className={`w-9 h-9 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${
          highlight 
            ? "bg-white/20 text-white" 
            : styles.iconBg
        }`}
      >
        {icon}
      </div>

      {/* Label and Value */}
      <div className="min-w-0 flex-1">
        <h4 className="text-xl md:text-2xl font-extrabold tracking-tight truncate">
          {value}
        </h4>
        <p 
          className={`text-[11px] md:text-xs font-semibold uppercase tracking-wider truncate ${
            highlight ? "text-indigo-100" : "text-slate-400"
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

export default LifetimeDashboard;