import React from 'react';
import { History } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ExamAppearance = ({ examAppearances = [], className = "" }) => {
  const { darkMode } = useTheme();

  // If there are no exam appearances, don't render anything
  if (!examAppearances?.length) return null;

  return (
    <div 
      className={`mt-6 pt-5 border-t border-dashed ${
        darkMode ? 'border-slate-700' : 'border-slate-300'
      } ${className}`}
    >
      <h4 
        className={`text-sm font-bold mb-3 flex items-center gap-2 ${
          darkMode ? 'text-slate-400' : 'text-slate-500'
        }`}
      >
        <History size={16} /> যেসব পরীক্ষায় এসেছে 
      </h4>
      
      <div className="flex flex-wrap gap-2.5">
        {examAppearances.map((exam, idx) => (
          <span 
            key={exam._id || idx}
            className={`inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-lg border ${
              darkMode 
                ? 'bg-slate-800 border-slate-700 text-slate-300' 
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            {exam.specificExam} {exam.year ? `(${exam.year})` : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ExamAppearance