import React, { useState, useEffect } from 'react';
import { Megaphone, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';


const NoticeBoard = () => {
  const [currentNotice, setCurrentNotice] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Pulling theme state from AppContext
  const { darkMode } = useAppContext();

  const notices = [
    { text: "51তম বিসিএস স্পেশাল লাইভ মডেল টেস্ট আগামী শুক্রবার রাত ৯টায়!", tag: "LIVE TEST" },
    { text: "নতুন ব্যাংক জবস সলিউশন প্যাকেজ এখন উন্মুক্ত করা হয়েছে।", tag: "NEW" },
    { text: "গত সপ্তাহের মেগা টেস্টের রেজাল্ট প্রকাশিত হয়েছে। আপনার র‍্যাঙ্ক চেক করুন।", tag: "RESULT" },
    { text: "প্রিমিয়াম মেম্বারশিপে ২০% ছাড় পেতে ব্যবহার করুন কোড: QSPACE20", tag: "OFFER" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentNotice]);

  const handleNext = () => {
    setIsExiting(true);
    setTimeout(() => {
      setCurrentNotice((prev) => (prev + 1) % notices.length);
      setIsExiting(false);
    }, 400);
  };

  const handlePrev = () => {
    setIsExiting(true);
    setTimeout(() => {
      setCurrentNotice((prev) => (prev - 1 + notices.length) % notices.length);
      setIsExiting(false);
    }, 400);
  };

  return (
    <div className={`fixed top-20 left-0 w-full z-40 select-none transition-colors ${darkMode ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Glassmorphic Container with Light/Dark Theme Support */}
        <div className="bg-white/80 dark:bg-[#0B0F1A]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl px-3 py-2.5 flex items-center shadow-sm dark:shadow-2xl dark:shadow-pink-500/5 transition-colors">
          
          {/* Label Section */}
          <div className="flex items-center gap-2 pr-4 border-r border-gray-200 dark:border-white/10 shrink-0">
            <div className="relative">
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full animate-ping" />
                <div className="relative bg-gradient-to-tr from-indigo-600 to-pink-500 p-1.5 rounded-lg shadow-lg">
                    <Megaphone size={14} className="text-white" />
                </div>
            </div>
            <span className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em] text-pink-600 dark:text-pink-300">
                Notice <span className="text-gray-900 dark:text-white">Center</span>
            </span>
          </div>

          {/* Text Slider Section */}
          <div className="flex-1 flex items-center px-4 overflow-hidden relative min-w-0">
            <div 
                key={currentNotice}
                className={`flex items-center gap-3 transition-all duration-500 ease-in-out w-full
                    ${isExiting ? "opacity-0 translate-x-10 scale-95" : "opacity-100 translate-x-0 scale-100"}
                `}
            >
                {/* Dynamic Tag */}
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-[9px] font-bold text-pink-600 dark:text-pink-400 whitespace-nowrap uppercase">
                    {notices[currentNotice].tag}
                </span>

                <p className="text-[11px] sm:text-sm font-medium text-gray-800 dark:text-slate-100 truncate">
                    {notices[currentNotice].text}
                </p>
                
                <Sparkles size={14} className="text-yellow-500 dark:text-yellow-400 shrink-0 animate-pulse hidden md:block" />
            </div>
          </div>

          {/* Navigation & Controls */}
          <div className="flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-white/10 shrink-0">
            {/* Dots - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-1.5 mr-2">
                {notices.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => { setIsExiting(true); setTimeout(() => { setCurrentNotice(idx); setIsExiting(false); }, 400); }}
                        className={`h-1 rounded-full transition-all duration-300 ${
                            idx === currentNotice ? "w-4 bg-pink-500" : "w-1.5 bg-gray-300 dark:bg-white/20 hover:bg-gray-400 dark:hover:bg-white/40"
                        }`}
                    />
                ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-1">
                <button onClick={handlePrev} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <ChevronLeft size={16} />
                </button>
                <button onClick={handleNext} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <ChevronRight size={16} />
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;