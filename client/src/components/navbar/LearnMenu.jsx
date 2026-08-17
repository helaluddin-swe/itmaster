import React, { useRef, useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

import {
  Code2,
  Server,
  Database,
  Globe,
  Shield,
  Network,
  Boxes,
  Cloud,
  Brain,
  Briefcase,
  ChevronDown,
  BookOpen,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";
import { subjectCourses } from '../../utils/data.js';



export default function LearnMenu({ onNavigate, handleActionClick }) {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [learnOpen, setLearnOpen] = useState(false);
  const learnRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (learnRef.current && !learnRef.current.contains(event.target)) {
        setLearnOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCourseClick = (slug) => {
    setLearnOpen(false);
    const targetPath = `/courses/${slug}`;
    if (handleActionClick) {
      handleActionClick(null, targetPath);
    } else {
      navigate(targetPath);
    }
  };

  return (
    <div className="relative" ref={learnRef}>
      <button
        onClick={() => setLearnOpen(!learnOpen)}
        className={`px-4 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap shadow-sm border ${
          darkMode 
            ? 'bg-slate-800/80 text-slate-200 border-slate-700/80 hover:bg-slate-700/80' 
            : 'bg-slate-100 text-slate-700 border-slate-200/80 hover:bg-slate-200'
        } ${learnOpen ? "ring-2 ring-indigo-500/50 " + (darkMode ? "bg-slate-700" : "bg-slate-200") : ""}`}
      >
        <BookOpen size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
        <span>Learn</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${learnOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      <div className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl border p-2 space-y-1 z-50 transition-all duration-200 origin-top-right ${
        darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      } ${learnOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}>
        
        <div className={`px-3 py-2 border-b flex justify-between items-center gap-2 ${
          darkMode ? 'border-slate-800/80' : 'border-slate-100'
        }`}>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Subject Courses</p>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => {
                setLearnOpen(false);
                if (handleActionClick) handleActionClick(null, '/courses');
                else navigate('/courses');
              }} 
              className={`text-[10px] font-bold flex items-center gap-1 transition-colors ${
                darkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-500 hover:text-indigo-600'
              }`}
            >
              <LayoutGrid size={11} /> All Courses
            </button>
            <button 
              onClick={() => {
                setLearnOpen(false);
                if (handleActionClick) handleActionClick('article');
              }} 
              className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
            >
              View Articles
            </button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {subjectCourses.map((subject, index) => {
            const Icon = subject.icon;
            return (
              <button
                key={index}
                onClick={() => handleCourseClick(subject.slug)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left group ${
                  darkMode 
                    ? 'hover:bg-indigo-950/40 text-slate-200 hover:text-indigo-400' 
                    : 'hover:bg-indigo-50 text-slate-700 hover:text-indigo-600'
                }`}
              >
                <div className={`p-2 rounded-lg transition-colors duration-200 group-hover:bg-indigo-600 group-hover:text-white ${
                  darkMode ? 'bg-slate-800 text-indigo-400' : 'bg-slate-100 text-indigo-600'
                }`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 truncate">
                  <p className="text-xs font-bold truncate">{subject.name}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{subject.desc}</p>
                </div>
                <ChevronRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}