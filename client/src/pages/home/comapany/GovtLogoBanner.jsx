import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { 
  generalCadres, 
  technicalCadres, 
  bankJobs, 
  otherGovtJobs, 
  // nonGovtJobs 
} from './data';

const GovtLogosBanner = () => {
  const { darkMode } = useTheme();

  // Category Configuration Array with Bengali & English Titles
  const categorySections = [
    {
      id: "general_cadre",
      title: "🏛️ বিসিএস জেনারেল ক্যাডার (General Cadres)",
      data: generalCadres,
      direction: "animate-marquee-left-to-right",
    },
    {
      id: "technical_cadre",
      title: "⚙️ বিসিএস টেকনিক্যাল ক্যাডার (Technical & Professional Cadres)",
      data: technicalCadres,
      direction: "animate-marquee-right-to-left",
    },
    {
      id: "bank",
      title: "🏦 ব্যাংক ও আর্থিক প্রতিষ্ঠান (Bank & Financial Sector)",
      data: bankJobs,
      direction: "animate-marquee-left-to-right",
    },
    {
      id: "other_govt",
      title: "📋 অন্যান্য সরকারি সংস্থা ও কমিশন (Other Govt Jobs)",
      data: otherGovtJobs,
      direction: "animate-marquee-right-to-left",
    },
    // {
    //   id: "non_govt",
    //   title: "🏢 বেসরকারি, টেলিকম ও বহুজাতিক সংস্থা (Non-Govt & Corporate)",
    //   data: nonGovtJobs,
    //   direction: "animate-marquee-left-to-right",
    // },
  ];

  // Helper function to duplicate items for seamless 100% infinite marquee loop
  const getDuplicatedLogos = (items) => {
    if (!items || items.length === 0) return [];
    // Ensure we have enough duplicated items for smooth continuous loop
    return [...items, ...items, ...items, ...items];
  };

  return (
    <div className={`w-full py-8 px-2 md:px-12 border-y transition-colors duration-300 relative overflow-hidden ${
      darkMode 
        ? "bg-slate-950/70 border-slate-800/80" 
        : "bg-slate-100/60 border-slate-200/80"
    }`}>
      
      {/* Inline Keyframes for Infinite Smooth Marquee Animations */}
      <style>{`
        @keyframes scrollLeftToRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes scrollRightToLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-left-to-right {
          display: flex;
          width: max-content;
          animation: scrollLeftToRight 200s linear infinite;
        }
        .animate-marquee-right-to-left {
          display: flex;
          width: max-content;
          animation: scrollRightToLeft 200s linear infinite;
        }
        .animate-marquee-left-to-right:hover,
        .animate-marquee-right-to-left:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Side Fade Gradient Mask Overlays */}
      <div className={`absolute top-0 bottom-0 left-0 w-16 md:w-36 z-20 pointer-events-none bg-linear-to-r ${
        darkMode ? "from-slate-950 to-transparent" : "from-slate-100/90 to-transparent"
      }`} />
      <div className={`absolute top-0 bottom-0 right-0 w-16 md:w-36 z-20 pointer-events-none bg-linear-to-l ${
        darkMode ? "from-slate-950 to-transparent" : "from-slate-100/90 to-transparent"
      }`} />

      {/* Main Layout Container */}
      <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6">
        
        {categorySections.map((section) => {
          const duplicatedList = getDuplicatedLogos(section.data);
          
          if (duplicatedList.length === 0) return null;

          return (
            <div key={section.id} className="flex flex-col gap-2">
              
              {/* Category Title Header */}
              <div className="px-2 flex items-center justify-between">
                <h3 className={`text-xs md:text-sm font-bold tracking-wide ${
                  darkMode ? "text-emerald-400" : "text-emerald-700"
                }`}>
                  {section.title}
                </h3>
                
              </div>

              {/* Infinite Continuous Marquee Row */}
              <div className="overflow-hidden w-full py-1">
                <div className={`${section.direction} flex gap-3.5 items-center`}>
                  {duplicatedList.map((org, index) => (
                    <div 
                      key={`${section.id}-${index}`}
                      className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border transition-all duration-300 shrink-0 ${
                        darkMode 
                          ? "bg-slate-900/90 border-slate-800/90 hover:border-emerald-500/50 hover:bg-slate-800/80" 
                          : "bg-white border-slate-200 hover:border-emerald-400 hover:shadow-md"
                      }`}
                    >
                      {/* Original Logo Image */}
                      <div className="h-9 w-9 flex items-center justify-center shrink-0">
                        <img 
                          src={org.logo} 
                          alt={org.name}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Institutional Details */}
                      <div className="flex flex-col text-left">
                        <span className={`text-xs font-bold line-clamp-1 ${
                          darkMode ? "text-slate-100" : "text-slate-800"
                        }`}>
                          {org.bengaliName}
                        </span>
                        <span className={`text-[10px] font-medium tracking-tight ${
                          darkMode ? "text-slate-400" : "text-slate-500"
                        }`}>
                          {org.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
};

export default GovtLogosBanner;