import { Database, ShieldAlert, Users, Zap } from "lucide-react";

const Overview = () => {
  const stats = [
    { label: 'Active Users', value: '1,284', icon: <Users className="text-blue-400" />, trend: '+12%' },
    { label: 'Total Questions', value: '4,502', icon: <Database className="text-indigo-400" />, trend: '+5%' },
    { label: 'Exams Hosted', value: '89', icon: <Zap className="text-amber-400" />, trend: '+24%' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0b0f1a] border border-white/5 p-6 rounded-[2rem] shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-2xl">{stat.icon}</div>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
                {stat.trend}
              </span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-[#0b0f1a] border border-white/5 rounded-[2.5rem] p-8">
        <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
          <ShieldAlert size={20} className="text-indigo-500" /> System Integrity
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <p className="text-sm font-bold text-slate-300">Database Connection</p>
            </div>
            <span className="text-[10px] font-black text-emerald-500 uppercase">Operational</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-sm font-bold text-slate-300">API Gateway</p>
            </div>
            <span className="text-[10px] font-black text-emerald-500 uppercase">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Overview