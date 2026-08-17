import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard, FileText, BookOpen, CheckCircle,
  Menu, Zap, Users, Database, ShieldAlert, Home, ShieldCheck, 
  LogOut, Lock, Loader2, MessageSquare, Layers,
  X, PanelLeftClose, PanelLeftOpen, Sun, Moon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

import AddNewQuestion from './AddNewQuestion';
import AdminQuestionList from './AdminQuestionList';
import AddExamQuestion from './AddExamQuestion';
import Overview from './OverView';

import CommentSection from './CommentSection';
import AdminTopicManager from './AdminTopicManager';
import { useTheme } from '../../context/ThemeContext';

const AdminDashboard = () => {
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { userData, isLoggedIn, logout, isAdminAuthenticated, isLoading } = useAppContext(); 
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse
  
  // State to manage which target/part ID comments are currently being viewed
  const [targetPartId, setTargetPartId] = useState('global-discussions');

  // Normalize role to lowercase to prevent string comparison errors
  const userRole = useMemo(() => userData?.role?.toLowerCase() || '', [userData]);

  const MENU_ITEMS = useMemo(() => {
    if (!userRole) return [];
    const items = [
      { id: 'overview', label: 'Admin Overview', icon: <LayoutDashboard size={20} />, roles: ['admin', 'moderator'] },
      { id: 'topic-manager', label: 'Topic & Syllabus', icon: <Layers size={20} />, roles: ['admin', 'moderator'] },
      { id: 'add-question', label: 'Add Question', icon: <Zap size={20} />, roles: ['admin'] },
      { id: 'list-all-questions', label: 'Manage Database', icon: <CheckCircle size={20} />, roles: ['admin'] },
      { id: 'add-new-blog', label: 'Blog Manager', icon: <BookOpen size={20} />, roles: ['admin', 'moderator'] },
      { id: 'add-exam-question', label: 'Add Exam Question', icon: <FileText size={20} />, roles: ['admin'] },
      { id: 'comments', label: 'Comments Manager', icon: <MessageSquare size={20} />, roles: ['admin', 'moderator'] },
    ];
    return items.filter(item => item.roles.includes(userRole));
  }, [userRole]);

  // Security Guard Logic
  const isModerator = userRole === 'moderator';
  const isAdminVerified = userRole === 'admin' && isAdminAuthenticated;
  const hasAccess = isLoggedIn && (isModerator || isAdminVerified);

  // 1. Handle Loading
  if (isLoading) {
    return (
      <div className={`h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className={`font-bold text-[10px] uppercase tracking-[0.3em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Syncing Terminal...
          </p>
        </div>
      </div>
    );
  }

  // 2. Handle Access Denied
  if (!hasAccess) {
    return (
      <div className={`h-screen flex flex-col items-center justify-center p-6 text-center ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className={`p-10 rounded-[3rem] mb-8 border shadow-2xl ${darkMode ? 'bg-red-500/5 border-red-500/10' : 'bg-red-50 border-red-100'}`}>
          <Lock size={64} className="text-red-500" />
        </div>
        <h1 className={`text-3xl font-black mb-4 italic ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          ACCESS_RESTRICTED
        </h1>
        <p className={`max-w-sm mb-10 text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          {userRole === 'admin' 
            ? "Administrative bypass requires valid Master Key authentication. Please verify your secondary credentials." 
            : "Unauthorized Access Detected. Your identity does not match the required clearance level for this terminal."}
        </p>
        <button 
          onClick={() => navigate('/login')} 
          className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${darkMode ? 'bg-white text-slate-950 hover:bg-indigo-500 hover:text-white' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}
        >
          Return to Login
        </button>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview': 
        return <Overview />;
      case 'topic-manager': 
        return <AdminTopicManager />;
      case 'add-question': 
        return <AddNewQuestion />;
      case 'list-all-questions': 
        return <AdminQuestionList />;
   
      case 'add-exam-question': 
        return <AddExamQuestion />;
      case 'comments': 
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div>
                <h3 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>System Comments Moderation</h3>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage and oversee discussions across modules.</p>
              </div>
              <div className="w-full sm:w-auto">
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Target Resource / Part ID
                </label>
                <input 
                  type="text" 
                  value={targetPartId} 
                  onChange={(e) => setTargetPartId(e.target.value)}
                  placeholder="Enter Part ID..."
                  className={`border text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full sm:w-64 transition-all ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
              </div>
            </div>
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <CommentSection partId={targetPartId} />
            </div>
          </div>
        );
      default: 
        return <Overview />;
    }
  };

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 shadow-2xl md:shadow-none
        ${isCollapsed ? 'md:w-20' : 'md:w-72'} w-72
        ${darkMode ? 'bg-slate-950 border-r border-slate-800/80' : 'bg-white border-r border-slate-200'}
        md:translate-x-0 md:relative
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-5 h-full flex flex-col">
          
          {/* Sidebar Header */}
          <div className={`flex items-center mb-10 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && (
              <div className="flex items-center gap-4 cursor-pointer truncate" onClick={() => navigate('/')}>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                  <ShieldCheck className="text-white" size={20} />
                </div>
                <div className="truncate">
                    <h1 className={`text-xl font-black tracking-tighter leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>Admin</h1>
                    <p className="text-[9px] text-indigo-500 font-black uppercase tracking-widest">OS v2.4.0</p>
                </div>
              </div>
            )}

            {isCollapsed && (
              <div className="cursor-pointer shrink-0" onClick={() => navigate('/')}>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <ShieldCheck className="text-white" size={20} />
                </div>
              </div>
            )}

            <div className="flex items-center">
              {/* Desktop Collapse Toggle */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`hidden md:flex p-1.5 rounded-lg transition-colors ${darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                title={isCollapsed ? "Expand Sidebar" : "Minimize Sidebar"}
              >
                {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
              </button>

              {/* Mobile Close */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className={`md:hidden p-1.5 rounded-lg transition-colors ${darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Sidebar Navigation */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar">
            {MENU_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                  title={isCollapsed ? item.label : ""}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm
                    ${isCollapsed ? 'justify-center' : ''}
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                      : darkMode 
                        ? 'text-slate-400 hover:bg-slate-900 hover:text-slate-200' 
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }
                  `}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className={`pt-4 mt-4 border-t space-y-2 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <button 
              onClick={() => navigate('/')} 
              title={isCollapsed ? "Exit to Site" : ""}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-xs font-bold ${isCollapsed ? 'justify-center' : ''} ${darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
            >
                <Home size={16} className="shrink-0" /> 
                {!isCollapsed && <span>Exit to Site</span>}
            </button>
            
            {/* User & Controls Block */}
            <div className={`flex ${isCollapsed ? 'flex-col items-center space-y-3' : 'items-center justify-between'} p-3 rounded-2xl ${darkMode ? 'bg-slate-900/50' : 'bg-slate-100/50'}`}>
                {!isCollapsed && (
                  <div className="min-w-0 pr-2">
                      <p className={`text-[8px] uppercase font-black tracking-widest leading-none mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Active User</p>
                      <p className="text-xs font-black text-indigo-500 truncate">{userData?.name || 'Unknown'}</p>
                  </div>
                )}
                
                <div className={`flex ${isCollapsed ? 'flex-col space-y-2' : 'items-center gap-2'}`}>
                  <button 
                    onClick={toggleTheme} 
                    title={isCollapsed ? "Toggle Theme" : ""}
                    className={`p-2 rounded-xl border transition-colors ${
                        darkMode 
                            ? "bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700" 
                            : "bg-white text-slate-800 border-slate-200 shadow-sm hover:bg-slate-50"
                    }`}
                  >
                      {darkMode ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-indigo-600" />}
                  </button>
                  <button 
                    onClick={logout} 
                    title={isCollapsed ? "Logout" : ""}
                    className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  >
                      <LogOut size={14} />
                  </button>
                </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Main Header */}
        <header className={`h-20 flex items-center justify-between px-6 md:px-10 z-40 backdrop-blur-md border-b ${darkMode ? 'bg-slate-950/80 border-slate-800/80' : 'bg-white/80 border-slate-200'}`}>
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className={`md:hidden p-2 rounded-lg ${darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden md:block">
            <h2 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {MENU_ITEMS.find(i => i.id === activeTab)?.label || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Secure Connection</p>
              <p className={`text-sm font-bold capitalize ${darkMode ? 'text-white' : 'text-slate-800'}`}>{userRole}</p>
            </div>
            <div className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl border flex items-center justify-center font-black text-indigo-500 text-lg shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              {userData?.name?.charAt(0) || '?'}
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-10 py-6 md:py-8 custom-scrollbar">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;