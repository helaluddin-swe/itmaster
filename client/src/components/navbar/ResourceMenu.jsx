import React, { useRef, useState, useEffect } from 'react';
import { FolderOpen, History, Database, PenTool, ChevronDown } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function ResourcesMenu({ handleActionClick, onNavigate }) {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const resourcesRef = useRef(null);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (actionId, path) => {
    setResourcesOpen(false);
    if (handleActionClick) {
      handleActionClick(actionId, path);
    } else if (path) {
      onNavigate(path);
    }
  };

  return (
    <div className="relative" ref={resourcesRef}>
      <button
        onClick={() => setResourcesOpen(!resourcesOpen)}
        className={`px-4 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap shadow-sm border ${
          darkMode 
            ? 'bg-slate-800/80 text-slate-200 border-slate-700/80 hover:bg-slate-700/80' 
            : 'bg-slate-100 text-slate-700 border-slate-200/80 hover:bg-slate-200'
        } ${resourcesOpen ? "ring-2 ring-indigo-500/50 " + (darkMode ? "bg-slate-700" : "bg-slate-200") : ""}`}
      >
        <FolderOpen size={16} className="text-amber-500 shrink-0" />
        <span>Resources</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${resourcesOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      <div className={`absolute right-0 mt-3 w-72 rounded-2xl shadow-2xl border p-2 space-y-1 z-50 transition-all duration-200 origin-top-right ${
        darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      } ${resourcesOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}>
        
        <div className={`px-3 py-2 border-b ${darkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">Study Materials & Exams</p>
        </div>
        
        <button 
          onClick={() => handleMenuClick(null, '/previous-exam-questions')} 
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left group ${
            darkMode ? 'hover:bg-amber-950/30 text-slate-200 hover:text-amber-400' : 'hover:bg-amber-50 text-slate-700 hover:text-amber-600'
          }`}
        >
          <History size={18} className="text-amber-500 shrink-0" />
          <div>
            <p className="text-xs font-bold">Previous Questions</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">BCS & Bank solved papers</p>
          </div>
        </button>
        {/* article hub */}
           <button 
          onClick={() => handleMenuClick(null, '/article-hub')} 
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left group ${
            darkMode ? 'hover:bg-amber-950/30 text-slate-200 hover:text-amber-400' : 'hover:bg-amber-50 text-slate-700 hover:text-amber-600'
          }`}
        >
          <History size={18} className="text-amber-500 shrink-0" />
          <div>
            <p className="text-xs font-bold">Article Hub</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">All Subjective Blog Articles</p>
          </div>
        </button>

        {/*  */}

        <button 
          onClick={() => handleMenuClick('mcq', null)} 
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left group ${
            darkMode ? 'hover:bg-indigo-950/40 text-slate-200 hover:text-indigo-400' : 'hover:bg-indigo-50 text-slate-700 hover:text-indigo-600'
          }`}
        >
          <Database size={18} className="text-indigo-500 shrink-0" />
          <div>
            <p className="text-xs font-bold">MCQ Question Bank</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Topic-wise practice</p>
          </div>
        </button>

        <button 
          onClick={() => handleMenuClick('written', null)} 
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left group ${
            darkMode ? 'hover:bg-rose-950/30 text-slate-200 hover:text-rose-400' : 'hover:bg-rose-50 text-slate-700 hover:text-rose-600'
          }`}
        >
          <PenTool size={18} className="text-rose-500 shrink-0" />
          <div>
            <p className="text-xs font-bold">Written Hub</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Written exam preparation</p>
          </div>
        </button>
      </div>
    </div>
  );
}