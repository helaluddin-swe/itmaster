import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ExplanationCard = ({ explanation }) => {
  const { darkMode } = useTheme();

  return (
    <div className={`mt-5 sm:mt-6 p-4 sm:p-5 border-2 border-dashed rounded-3xl animate-in fade-in slide-in-from-top-2 ${
      darkMode 
        ? 'bg-indigo-950/20 border-indigo-500/30 text-slate-300' 
        : 'bg-indigo-50/50 border-indigo-200 text-slate-600'
    }`}>
      <p className={`text-xs font-black uppercase mb-1.5 sm:mb-2 flex items-center gap-1.5 ${
        darkMode ? 'text-indigo-400' : 'text-indigo-700'
      }`}>
        <HelpCircle size={14}/> ব্যাখ্যা (Explanation)
      </p>
      <p className="text-xs sm:text-sm leading-relaxed italic">
        {explanation || "এই প্রশ্নটির কোনো ব্যাখ্যা এখনো যুক্ত করা হয়নি। খুব শীঘ্রই এটি আপডেট করা হবে।"}
      </p>
    </div>
  );
};

export default ExplanationCard;