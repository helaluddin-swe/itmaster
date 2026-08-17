import React, { useState, useMemo } from 'react';
import { BookOpen, Search, ChevronDown, ChevronRight, CheckCircle2, Circle, X, Sparkles, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { subjectCourses } from '../../utils/data';

export default function LeftSidebar({
  courseData,
  currentSubjectSlug,
  currentSubtopic,
  setCurrentSubtopic,
  mobileOpen,
  setMobileOpen
}) {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState({ "ch-1": true, "ch-2": true });
  const [expandedTopics, setExpandedTopics] = useState({});

  const toggleChapter = (id) => {
    setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTopic = (id) => {
    setExpandedTopics(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter chapters/topics/subtopics based on search query
  const filteredChapters = useMemo(() => {
    if (!courseData?.chapters) return [];
    if (!searchQuery.trim()) return courseData.chapters;

    const query = searchQuery.toLowerCase();
    return courseData.chapters.map(chapter => {
      const matchingTopics = chapter.topics.map(topic => {
        const matchingSubtopics = topic.subtopics.filter(sub =>
          sub.title.toLowerCase().includes(query) || sub.content?.toLowerCase().includes(query)
        );
        if (topic.title.toLowerCase().includes(query) || matchingSubtopics.length > 0) {
          return {
            ...topic,
            subtopics: matchingSubtopics.length > 0 ? matchingSubtopics : topic.subtopics
          };
        }
        return null;
      }).filter(Boolean);

      if (chapter.title.toLowerCase().includes(query) || matchingTopics.length > 0) {
        return {
          ...chapter,
          topics: matchingTopics.length > 0 ? matchingTopics : chapter.topics
        };
      }
      return null;
    }).filter(Boolean);
  }, [courseData, searchQuery]);

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none border-r
      ${isCollapsed ? 'lg:w-20' : 'lg:w-80'} w-80
      ${darkMode ? 'bg-slate-950 border-slate-800/60 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'}
      lg:translate-x-0 lg:static
      ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Header & Brand Title */}
      <div className={`p-4 border-b flex mt-20 md:mt-0 items-center justify-between shrink-0 ${darkMode ? 'border-slate-800/60 bg-slate-950/80' : 'border-slate-200 bg-white'}`}>
        {!isCollapsed && (
          <div className="flex items-center space-x-3 truncate">
            <div className={`p-2 rounded-xl shadow-sm ${darkMode ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
              <BookOpen className="w-4 h-4 shrink-0" />
            </div>
            <div className="truncate">
              <h1 className={`font-bold text-sm tracking-wide truncate ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                {courseData?.title || "Learning Hub"}
              </h1>
              <p className={`text-[11px] font-medium uppercase tracking-wider mt-0.5 ${darkMode ? 'text-indigo-400/80' : 'text-indigo-600/80'}`}>
                Interactive Curriculum
              </p>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mx-auto">
            <div className={`p-2 rounded-xl shadow-sm ${darkMode ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
              <BookOpen className="w-4 h-4 shrink-0" />
            </div>
          </div>
        )}

        <div className="flex items-center space-x-1">
          {/* Desktop Minimize / Expand Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Minimize Sidebar"}
            className={`hidden lg:flex p-1.5 rounded-lg transition-all ${darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4.5 h-4.5" /> : <PanelLeftClose className="w-4.5 h-4.5" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className={`lg:hidden p-1.5 rounded-lg transition-all ${darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="shrink-0">
          {/* Subject Swapper Selector */}
          <div className={`p-4 border-b ${darkMode ? 'border-slate-800/60 bg-slate-900/20' : 'border-slate-200 bg-white/50'}`}>
            <label className={`text-[10px] font-bold uppercase tracking-wider block mb-2 px-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Subject Domain
            </label>
            <div className="relative group">
              <select
                value={currentSubjectSlug}
                onChange={(e) => navigate(`/courses/${e.target.value}`)}
                className={`w-full appearance-none rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer outline-none ring-2 ring-transparent focus:ring-indigo-500/30 ${
                  darkMode
                    ? 'bg-slate-900 text-indigo-300 border-slate-700 hover:bg-slate-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'
                    : 'bg-white text-indigo-900 border-slate-200 hover:border-slate-300 shadow-sm'
                } border`}
              >
                {subjectCourses.map((subject) => (
                  <option key={subject.slug} value={subject.slug}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <ChevronDown className={`w-4 h-4 absolute right-3 top-3 pointer-events-none transition-colors ${darkMode ? 'text-indigo-400/50 group-hover:text-indigo-400' : 'text-indigo-900/50 group-hover:text-indigo-900'}`} />
            </div>
          </div>

          {/* Live Search Input */}
          <div className={`p-4 border-b ${darkMode ? 'border-slate-800/60' : 'border-slate-200'}`}>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                className={`w-full rounded-xl pl-9 pr-8 py-2 text-xs font-medium transition-all outline-none ring-2 ring-transparent focus:ring-indigo-500/30 ${
                  darkMode
                    ? 'bg-slate-900 text-slate-200 border-slate-800 placeholder-slate-500 focus:bg-slate-950'
                    : 'bg-white text-slate-800 border-slate-200 placeholder-slate-400 focus:bg-white shadow-sm'
                } border`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-2 p-0.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chapters & Curriculum Tree List */}
      <div className={`flex-1 overflow-y-auto p-3.5 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isCollapsed ? 'items-center flex flex-col pt-6' : ''}`}>
        {isCollapsed ? (
          <div className="text-center h-full flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block [writing-mode:vertical-lr] mx-auto rotate-180">
              Curriculum
            </span>
          </div>
        ) : filteredChapters.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center px-4">
            <Search className={`w-8 h-8 mb-3 opacity-20 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>No modules found for<br/><span className="text-slate-300 italic">&quot;{searchQuery}&quot;</span></p>
          </div>
        ) : (
          filteredChapters.map((chapter) => {
            const isChExp = searchQuery ? true : expandedChapters[chapter.id];
            return (
              <div key={chapter.id} className="space-y-1.5">
                {/* Chapter Header */}
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className={`w-full flex items-center justify-between text-xs font-bold py-2.5 px-3 rounded-xl transition-all group ${
                    darkMode
                      ? 'text-slate-200 bg-slate-900/30 hover:bg-slate-900 border border-transparent hover:border-slate-800'
                      : 'text-slate-800 bg-white hover:bg-slate-100 border border-transparent hover:border-slate-200'
                  }`}
                >
                  <span className="truncate text-left flex items-center space-x-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${darkMode ? 'bg-indigo-400 shadow-indigo-400/50' : 'bg-indigo-500 shadow-indigo-500/40'}`}></span>
                    <span className="truncate">{chapter.title}</span>
                  </span>
                  <div className={`p-1 rounded-md transition-colors ${darkMode ? 'group-hover:bg-slate-800' : 'group-hover:bg-slate-200'}`}>
                    {isChExp ? <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  </div>
                </button>

                {/* Topics Container */}
                {isChExp && (
                  <div className={`pl-3 space-y-1.5 border-l-2 ml-3.5 mt-2 mb-4 ${darkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
                    {chapter.topics.map((topic) => {
                      const isTopExp = searchQuery ? true : expandedTopics[topic.id];
                      return (
                        <div key={topic.id} className="space-y-1">
                          <button
                            onClick={() => toggleTopic(topic.id)}
                            className={`w-full flex items-center justify-between text-[11px] font-semibold py-1.5 px-2.5 rounded-lg transition-colors group ${
                              darkMode
                                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                          >
                            <span className="truncate text-left uppercase tracking-wider">{topic.title}</span>
                            {isTopExp ? <ChevronDown className="w-3 h-3 text-slate-500 shrink-0 group-hover:text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-500 shrink-0 group-hover:text-slate-400" />}
                          </button>

                          {/* Subtopics Container */}
                          {isTopExp && (
                            <div className="pl-1 space-y-0.5 mt-1">
                              {topic.subtopics.map((sub) => {
                                const isSelected = currentSubtopic?.id === sub.id;
                                return (
                                  <button
                                    key={sub.id}
                                    onClick={() => {
                                      setCurrentSubtopic(sub);
                                      setMobileOpen(false);
                                      // Dynamic URL update
                                      navigate(`/courses/${currentSubjectSlug}/${topic.id}/${sub.id}`);
                                    }}
                                    className={`w-full flex items-center space-x-3 text-xs py-2 px-3 rounded-xl transition-all duration-200 text-left group ${
                                      isSelected
                                        ? darkMode
                                          ? 'bg-indigo-500/10 text-indigo-300 font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] ring-1 ring-indigo-500/30'
                                          : 'bg-indigo-50 text-indigo-700 font-semibold ring-1 ring-indigo-200/60 shadow-sm'
                                        : darkMode
                                          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                                          : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                                    }`}
                                  >
                                    {sub.completed ? (
                                      <CheckCircle2 className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? 'text-emerald-400' : 'text-emerald-500/70 group-hover:text-emerald-500'}`} />
                                    ) : (
                                      <Circle className={`w-4 h-4 shrink-0 transition-colors ${
                                        isSelected 
                                          ? 'text-indigo-400 fill-indigo-400/10' 
                                          : darkMode 
                                            ? 'text-slate-700 group-hover:text-slate-500' 
                                            : 'text-slate-300 group-hover:text-slate-400'
                                      }`} />
                                    )}
                                    <span className="truncate leading-relaxed">{sub.title}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Branding or Progress Summary */}
      {!isCollapsed && (
        <div className={`p-4 border-t mt-auto shrink-0 ${darkMode ? 'border-slate-800/60 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center justify-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-indigo-500/80">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Keep Building</span>
          </div>
        </div>
      )}
    </aside>
  );
}