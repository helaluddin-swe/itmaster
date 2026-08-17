import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard, FileText, BookOpen, CheckCircle,
  Menu, X, Search, Zap, Target, LogOut,
  Trophy, Database, PenTool, Layers, BookMarked,
  Sun, Moon
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Leaderboard from './LeaderBoard';
import QuestionSolveStats from './QuestionSolveStats';
import Overview from './Overview';
import DailyTestLeaderBoard from './DailyTestLeaderBoard';
import ArticleUpdate from './ArticleUpdate';
// import TextLogo from '../../components/navbar/Logo';
import UserProfile from '../../components/UserProfile';
import { useTheme } from '../../context/ThemeContext';
import LogoUpdated from '../../components/navbar/LogoUpdated';
import BookmarkedQuestions from './BookMarkedQuestion';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  
  // Get Auth and Theme data from Context
  const { userData, isLoggedIn, logout, loading } = useAppContext();

  // Redirect Guard: If not logged in and not loading, go to login
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, loading, navigate]);

  // Load History from LocalStorage
  const history = useMemo(() => {
    return JSON.parse(localStorage.getItem('bcs_exam_history') || '[]');
  }, []);

  // SECTION 1: Local Dashboard Tabs
  const DASHBOARD_TABS = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'question-solve', label: 'Question History', icon: <CheckCircle size={20} /> },
    { id: 'blog-reading', label: 'Analysis Article', icon: <BookOpen size={20} /> },
    { id: 'daily-test', label: 'Daily/Weekly Test', icon: <FileText size={20} /> },
    { id: 'leaderboard', label: 'LeaderBoard', icon: <Trophy size={20} /> },
    { id: 'bookmarked', label: 'Bookmarked', icon: <BookOpen size={20} /> },
    
  ];

  // SECTION 2: External App Routes (Mapped from App.jsx)
  const STUDY_HUBS = [
    { path: '/mcq-hub', label: 'MCQ Hub', icon: <Database size={20} /> },
    { path: '/test-hub', label: 'Model Tests', icon: <Target size={20} /> },
    { path: '/written-hub', label: 'Written Hub', icon: <PenTool size={20} /> },
    { path: '/previous-exam-questions', label: 'Previous Exams', icon: <Layers size={20} /> },
    { path: '/blog', label: 'Blogs & Articles', icon: <BookMarked size={20} /> },
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview': return <Overview  />;
      case 'question-solve': return <QuestionSolveStats />;
      case 'blog-reading': return <ArticleUpdate />;
      case 'daily-test': return <DailyTestLeaderBoard />;
      case 'leaderboard': return <Leaderboard  />;
      case 'bookmarked': return <BookmarkedQuestions  />;
      default: return <Overview  />;
    }
  };

  // While checking auth, show a clean loader
  if (loading) return (
    <div className={`h-screen flex items-center justify-center ${darkMode ? 'bg-[#020617]' : 'bg-white'}`}>
        <Zap className="text-indigo-500 animate-pulse" size={48} />
    </div>
  );

  return (
    <div className={`flex h-screen font-sans overflow-hidden ${darkMode ? 'bg-[#020617] text-slate-200' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r transform transition-transform md:relative md:translate-x-0 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${darkMode ? 'bg-[#0b0f1a] border-white/5' : 'bg-white border-gray-200'}`}>
        
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsSidebarOpen(false)} 
          className={`absolute top-6 right-6 md:hidden ${darkMode ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <X size={24} />
        </button>

        <div className="p-8 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <LogoUpdated/>
        </div>
          
        {/* Scrollable Navigation Area */}
        <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-8 custom-scrollbar">
          
          {/* Analytics Section */}
          <div>
            <h3 className={`px-4 text-[11px] font-black uppercase tracking-widest mb-3 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>Analytics</h3>
            <div className="space-y-1">
              {DASHBOARD_TABS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold ${
                    activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : darkMode 
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.icon} <span className="text-[15px]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Study Hubs Section (Routes to App.jsx pages) */}
          <div>
            <h3 className={`px-4 text-[11px] font-black uppercase tracking-widest mb-3 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>Study Hubs</h3>
            <div className="space-y-1">
              {STUDY_HUBS.map((item) => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold ${darkMode ? 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}`}
                >
                  {item.icon} <span className="text-[15px]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer (Theme Toggle & Logout) */}
        <div className={`p-4 border-t space-y-2 ${darkMode ? 'border-white/5 bg-[#0b0f1a]' : 'border-gray-200 bg-white'}`}>
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-colors ${darkMode ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <span className="text-[15px] flex items-center gap-3">
              {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-600" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          {/* Logout Button */}
          <button 
            onClick={logout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-colors ${darkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'}`}
          >
            <LogOut size={20} /> <span className="text-[15px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className={`h-20 border-b flex items-center justify-between px-6 md:px-8 backdrop-blur-xl ${darkMode ? 'border-white/5 bg-[#0b0f1a]/50' : 'border-gray-200 bg-white/80'}`}>
          <button onClick={() => setIsSidebarOpen(true)} className={`md:hidden p-2 transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
            <Menu size={24} />
          </button>
          
          <div className="flex-1 max-w-xl hidden lg:block ml-4 md:ml-0">
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`} size={18} />
              <input 
                type="text" 
                placeholder="Search your progress..." 
                className={`w-full border rounded-2xl py-2.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-slate-500' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400'}`} 
              />
            </div>
          </div>
          <div className="ml-auto">
            <UserProfile/>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 animate-in fade-in slide-in-from-left-4">
            
              <p className={`font-bold mt-1 uppercase text-[11px] tracking-widest ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                {DASHBOARD_TABS.find(tab => tab.id === activeTab)?.label || 'Overview'} Statistics
              </p>
            </div>
            {renderActiveView()}
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;