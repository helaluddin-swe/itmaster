import React, { useState, useEffect } from 'react';
import { ChevronRight, X, ArrowLeft, Eye, BookOpen, Clock, Sparkles } from 'lucide-react';
import { MENU_DATA } from './data';
import LoadMore from '../../components/LoadMore';
import { blog_details_data } from '../../assets/assest';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useTheme } from '../../context/ThemeContext';

const ArticleMenu = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState(MENU_DATA[0]);
  const [displayLimit, setDisplayLimit] = useState(6);
  const [showMobileArticles, setShowMobileArticles] = useState(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);
  
  const handleGoBack = () => {
    window.history.back();
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setDisplayLimit(10);
    setShowMobileArticles(true);
  };

  // Safe handler that falls back to history back if onClose is not passed
  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    } else {
      handleGoBack();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-9999 flex items-center justify-center p-0 md:p-8">
      {/* Modal Container */}
      <div className={`flex flex-col md:flex-row w-full h-full max-w-7xl md:h-[90vh] md:rounded-[2.5rem] shadow-2xl overflow-hidden border transition-colors duration-300 ${
        darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-gray-100 text-gray-900'
      }`}>
        
        {/* --- Sidebar: Category Navigation --- */}
        <div className={`${showMobileArticles ? 'hidden' : 'flex'} md:flex w-full md:w-80 border-r flex-col h-full transition-colors duration-300 ${
          darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-gray-100 bg-gray-50/50'
        }`}>
          <div className="p-8 flex justify-between items-center">
            <div>
              <h1 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Library</h1>
              <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest mt-1">Resource Hub</p>
            </div>
            
            {/* Mobile Close Button */}
            <button 
              type="button"
              onClick={handleClose} 
              className={`md:hidden p-2 rounded-full transition-colors cursor-pointer ${
                darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-1.5 custom-scrollbar">
            {MENU_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${
                  activeCategory.id === cat.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : darkMode 
                      ? 'text-slate-400 hover:bg-slate-800/60 hover:text-indigo-400' 
                      : 'text-gray-500 hover:bg-white hover:text-indigo-600'
                }`}
              >
                <span className="flex items-center gap-4">
                  <span className={`text-xl transition-transform group-hover:scale-110 ${activeCategory.id === cat.id ? 'grayscale-0' : 'grayscale'}`}>
                    {cat.icon}
                  </span>
                  <span className="text-sm font-bold tracking-tight">{cat.label}</span>
                </span>
                <ChevronRight size={16} className={`${activeCategory.id === cat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity'}`} />
              </button>
            ))}
          </nav>
        </div>

        {/* --- Main Content Area --- */}
        <div className={`${!showMobileArticles ? 'hidden' : 'flex'} md:flex flex-1 flex-col h-full relative transition-colors duration-300 ${
          darkMode ? 'bg-slate-900' : 'bg-white'
        }`}>
          {/* Header Actions */}
          <div className={`flex items-center justify-between p-6 md:px-10 border-b transition-colors duration-300 ${
            darkMode ? 'border-slate-800' : 'border-gray-50'
          }`}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMobileArticles(false)}
                className={`md:hidden p-2 rounded-xl ${
                  darkMode ? 'text-indigo-400 bg-indigo-950/50' : 'text-indigo-600 bg-indigo-50'
                }`}
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <span className="hidden md:block text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">
                  Categorized Learning
                </span> 
                <h2 className={`text-xl md:text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {activeCategory.label} <span className="text-indigo-600">প্রস্তুতি</span>
                </h2>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <Breadcrumbs category="article-hub" customTitle="" />
              
              {/* Desktop Close Button */}
              <button 
                type="button"
                onClick={handleClose} 
                className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold text-sm cursor-pointer ${
                  darkMode 
                    ? 'text-slate-400 bg-slate-800/50 hover:bg-rose-500/10 hover:text-rose-400 border border-slate-700/50' 
                    : 'text-gray-500 bg-gray-100/80 hover:bg-rose-50 hover:text-rose-600 border border-gray-200/60'
                }`}
              >
                <span>ESC</span>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* --- DYNAMIC CONTENT AREA --- */}
          <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar">
            {activeCategory.component ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <activeCategory.component data={blog_details_data} mainTitle="Blog MCQ" />
              </div>
            ) : (
              /* DEFAULT: Article Grid */
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {activeCategory.articles.length > 0 ? (
                    activeCategory.articles.slice(0, displayLimit).map((article) => (
                      <a
                        key={article._id}
                        href={`/blog/${article._id}`}
                        className={`group relative p-6 rounded-4xl border transition-all duration-300 flex flex-col ${
                          darkMode 
                            ? 'bg-slate-800/40 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 shadow-lg' 
                            : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-2.5 rounded-xl transition-colors ${
                            darkMode 
                              ? 'bg-indigo-950/60 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white' 
                              : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                          }`}>
                            <BookOpen size={18} />
                          </div>
                          {article.views > 1000 && (
                            <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${
                              darkMode ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-100 text-amber-700'
                            }`}>
                              <Sparkles size={10} /> POPULAR
                            </span>
                          )}
                        </div>
                        
                        <h3 className={`font-bold leading-tight mb-4 transition-colors line-clamp-2 ${
                          darkMode ? 'text-slate-100 group-hover:text-indigo-400' : 'text-gray-900 group-hover:text-indigo-600'
                        }`}>
                          {article.title}
                        </h3>

                        <div className={`mt-auto pt-4 border-t flex items-center justify-between ${
                          darkMode ? 'border-slate-800 text-slate-400' : 'border-gray-50 text-gray-400'
                        }`}>
                          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1"><Clock size={12}/> 5 Min</span>
                          
                          </div>
                          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="col-span-full py-20 flex flex-col items-center text-gray-400">
                      <div className={`p-6 rounded-full mb-4 ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                        <BookOpen size={40} className="opacity-20" />
                      </div>
                      <p className="italic font-medium">এই বিভাগে বর্তমানে কোনো নিবন্ধ নেই।</p>
                    </div>
                  )}
                </div>

                <div className="mt-12 flex justify-center">
                  <LoadMore
                    totalItems={activeCategory.articles.length}
                    displayLimit={displayLimit}
                    setDisplayLimit={setDisplayLimit}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleMenu;