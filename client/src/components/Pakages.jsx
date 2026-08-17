import React from 'react';
import { Star, CheckCircle, ArrowRight, Zap, ShieldCheck, Crown } from 'lucide-react';
import Navbar from './Navbar';

const Packages = () => {
  const packages = [
    { 
      name: 'Free', 
      price: '০', 
      features: ['Daily 20 MCQs', 'Public Leaderboard', 'Basic Analysis', 'Community Support'], 
      popular: false,
      icon: <Zap size={20} className="text-slate-400" />
    },
    { 
      name: 'Standard', 
      price: '৪৯৯', 
      features: ['Unlimited MCQs', 'Weekly Mega Test', 'Subject-wise PDF', 'Detailed Solution', 'Performance History'], 
      popular: true,
      icon: <ShieldCheck size={20} className="text-indigo-400" />
    },
    { 
      name: 'Premium', 
      price: '৯৯৯', 
      features: ['All Standard Features', 'Personal Mentor', 'Exclusive Live Classes', 'Hardcopy Notes', 'Ads Free Experience'], 
      popular: false,
      icon: <Crown size={20} className="text-amber-500" />
    },
  ];

  return (
    <>
    <Navbar/>
  
    <section className="relative bg-white -mx-4 px-4 py-24">
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-indigo-50/30 blur-[100px] -z-10 rounded-full" />

      <div className="text-center mb-16 space-y-4">
        <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em]">
          Pricing Plans
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          আপনার পছন্দের <span className="text-indigo-600">প্যাকেজ</span>
        </h2>
        <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
          আপনার স্বপ্ন পূরণের যাত্রাকে আরও সহজ ও গতিশীল করতে বেছে নিন আমাদের সঠিক প্ল্যান।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
        {packages.map((pkg, i) => (
          <div 
            key={i} 
            className={`relative p-8 rounded-[40px] border transition-all duration-500 group
              ${pkg.popular 
                ? 'bg-[#0F172A] text-white border-slate-900 scale-105 shadow-[0_30px_60px_-15px_rgba(99,102,241,0.3)]' 
                : 'bg-white border-slate-100 text-slate-900 shadow-sm hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1'
              }`}
          >
            {/* Popular Badge */}
            {pkg.popular && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Star size={12} fill="currentColor" className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Most Popular</span>
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl ${pkg.popular ? 'bg-white/10' : 'bg-slate-50'}`}>
                {pkg.icon}
              </div>
              {pkg.popular && <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Best Value</span>}
            </div>

            <h4 className="text-2xl font-black mb-2 tracking-tight">{pkg.name}</h4>
            
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-black tracking-tighter">৳{pkg.price}</span>
              <span className={`text-xs font-bold ${pkg.popular ? 'text-slate-400' : 'text-slate-500'}`}>/lifetime</span>
            </div>

            {/* Feature List */}
            <div className={`h-[1px] w-full mb-8 ${pkg.popular ? 'bg-white/10' : 'bg-slate-100'}`} />
            
            <ul className="space-y-4 mb-10">
              {pkg.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-bold group-hover:translate-x-1 transition-transform">
                  <CheckCircle 
                    size={18} 
                    className={`${pkg.popular ? 'text-indigo-400' : 'text-indigo-500'}`} 
                    strokeWidth={3}
                  />
                  <span className={pkg.popular ? 'text-slate-300' : 'text-slate-600'}>{feat}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95
              ${pkg.popular 
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              Get Started <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
      </>
  );
};

export default Packages;