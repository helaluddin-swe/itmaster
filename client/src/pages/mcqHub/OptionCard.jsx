import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const OptionCard = ({ opt, index, i, answered, correctAnswer, onOptionSelect }) => {
  const { darkMode } = useTheme();
  
  const isSelected = answered === opt;
  const isCorrect = opt === correctAnswer;
  
  let style = darkMode 
    ? "border-slate-800 text-slate-300 hover:bg-slate-800/60" 
    : "border-gray-100 text-gray-700 hover:bg-slate-50";
  let icon = null;

  if (answered) {
    if (isCorrect) {
      style = darkMode 
        ? "border-green-500/50 bg-green-950/30 text-green-300 font-bold" 
        : "border-green-500 bg-green-50 text-green-700 font-bold";
      icon = <CheckCircle2 size={18} className="text-green-500 ml-auto shrink-0" />;
    } else if (isSelected) {
      style = darkMode 
        ? "border-red-500/50 bg-red-950/30 text-red-300" 
        : "border-red-400 bg-red-50 text-red-600";
      icon = <XCircle size={18} className="text-red-500 ml-auto shrink-0" />;
    } else {
      style = darkMode 
        ? "border-slate-800/50 text-slate-600 opacity-40" 
        : "border-gray-50 text-gray-300 opacity-50";
    }
  }

  return (
    <button 
      disabled={!!answered} 
      onClick={() => onOptionSelect(index, opt, correctAnswer)}
      className={`w-full p-3 sm:p-4 text-left rounded-2xl border-2 transition-all flex items-center gap-3 sm:gap-4 ${style}`}
    >
      <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        isSelected 
          ? 'bg-indigo-600 text-white' 
          : darkMode 
            ? 'bg-slate-800 text-slate-400' 
            : 'bg-gray-100 text-gray-500'
      }`}>
        {String.fromCharCode(65 + i)}
      </span>
      <span className="flex-1 text-sm sm:text-base leading-normal">{opt}</span>
      {icon}
    </button>
  );
};

export default OptionCard;