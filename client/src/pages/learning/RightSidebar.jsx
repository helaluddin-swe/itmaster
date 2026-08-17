import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Promo1 from '../../components/promotion/Promo1';

const RightSidebar = ({
  currentSubtopic,
  courseData,
  isFocusMode,
  mobileRightOpen,
  setMobileRightOpen,
  setCourseData
}) => {
  const { darkMode } = useTheme();

  const totalSubtopics = courseData?.chapters?.reduce(
    (acc, ch) => acc + ch.topics.reduce((tAcc, top) => tAcc + top.subtopics.length, 0), 0
  ) || 1;

  const completedSubtopics = courseData?.chapters?.reduce(
    (acc, ch) => acc + ch.topics.reduce((tAcc, top) => tAcc + top.subtopics.filter(s => s.completed).length, 0), 0
  ) || 0;

  const progressPercentage = Math.round((completedSubtopics / totalSubtopics) * 100);

  const toggleComplete = () => {
    if (!currentSubtopic || !courseData) return;

    const updatedChapters = courseData.chapters.map(chapter => ({
      ...chapter,
      topics: chapter.topics.map(topic => ({
        ...topic,
        subtopics: topic.subtopics.map(sub => 
          sub.id === currentSubtopic.id 
            ? { ...sub, completed: !sub.completed } 
            : sub
        )
      }))
    }));

    const updatedCourseData = {
      ...courseData,
      chapters: updatedChapters
    };

    setCourseData(updatedCourseData);
  };

  return (
    <aside className={`
      fixed inset-y-0 right-0 z-50 w-80 mt-4 md:mt-4 flex flex-col transition-transform duration-300 shadow-xl xl:shadow-none
      ${darkMode ? 'bg-slate-950 border-l border-slate-800 text-slate-100' : 'bg-white border-l border-slate-200 text-slate-900'}
      xl:translate-x-0 xl:static
      ${isFocusMode ? 'hidden' : ''}
      ${mobileRightOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}
    `}>
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between ${
        darkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50/50'
      }`}>
        <Promo1 />
        
        <button 
          onClick={() => setMobileRightOpen(false)} 
          className={`xl:hidden p-1.5 rounded-lg transition-colors ${
            darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        {/* Progress Bar Widget */}
        <div className={`p-4 rounded-xl space-y-3 border ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50/70 border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Overall Progress</span>
            <span className="font-bold text-indigo-500">{progressPercentage}%</span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <p className={`text-[11px] ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            {completedSubtopics} of {totalSubtopics} completed.
          </p>
        </div>

        {/* Metadata */}
        <div className="space-y-3">
          <h4 className={`text-xs font-semibold uppercase tracking-wider ${
            darkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Metadata
          </h4>
          <div className={`p-3 rounded-xl space-y-2 text-xs border ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50/70 border-slate-200 shadow-sm'
          }`}>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-slate-500' : 'text-slate-500'}>Duration:</span>
              <span className={`font-medium ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                {currentSubtopic?.duration || "5 min read"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-slate-500' : 'text-slate-500'}>Database:</span>
              <span className="text-emerald-500 font-medium">MongoDB Connected</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={toggleComplete}
          className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium flex items-center justify-center space-x-2 shadow-sm transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{currentSubtopic?.completed ? 'Mark Incomplete' : 'Mark as Complete'}</span>
        </button>
      </div>
    </aside>
  );
};

export default RightSidebar;