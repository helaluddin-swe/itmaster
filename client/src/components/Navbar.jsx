import React, { useState, useEffect } from 'react';
import {
    Menu, X, GraduationCap,
    LayoutDashboard, LogOut, LogIn, Sparkles,
    Sun, Moon, LayoutGrid
} from 'lucide-react';

import { useAppContext } from '../context/AppContext';

import { useTheme } from '../context/ThemeContext';
import UserProfile from './UserProfile';
import LearnMenu from './navbar/LearnMenu';
import LogoUpdated from './navbar/LogoUpdated';
import { subjectCourses } from '../utils/data';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
    const { navigate, isLoggedIn, userData, logout } = useAppContext();
    const [open, setOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const { darkMode, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const onNavigate = (to) => {
        setOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(to);
    };

    const handleActionClick = (id, navPath = null) => {
        if (id) setActiveMenu(id);
        if (navPath) onNavigate(navPath);
        setOpen(false);
    };

    const ActionButton = ({ label, onClick, variant = "primary", icon: Icon, id }) => {
        const isActive = activeMenu === id;
        const baseStyles = "px-4 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all duration-300 ease-in-out flex items-center gap-2 group whitespace-nowrap shadow-sm active:scale-95";
        
        let variantStyles = "";
        if (isActive) {
            variantStyles = darkMode 
                ? "bg-indigo-500 text-white shadow-indigo-500/25" 
                : "bg-indigo-600 text-white shadow-indigo-500/25";
        } else if (variant === "primary") {
            variantStyles = darkMode 
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20" 
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20";
        } else {
            variantStyles = darkMode 
                ? "bg-slate-800/80 text-slate-200 border border-slate-700/80 hover:bg-slate-700/80" 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80";
        }

        return (
            <button onClick={onClick} className={`${baseStyles} ${variantStyles}`}>
                {Icon && <Icon size={16} className={`${isActive ? "animate-pulse" : "group-hover:rotate-12"} transition-transform duration-300`} />}
                {label}
            </button>
        );
    };

    return (
        <nav className={`fixed top-0 w-full px-4 sm:px-6 z-[9999] transition-all duration-300 ease-in-out ${
            scrolled 
                ? (darkMode 
                    ? "bg-[#0b0f1a]/90 backdrop-blur-md border-b border-slate-800/80 py-2.5 shadow-lg" 
                    : "bg-white/90 backdrop-blur-md border-b border-slate-200/80 py-2.5 shadow-lg")
                : (darkMode 
                    ? "bg-[#020617] border-b border-slate-800/40 py-4 shadow-sm" 
                    : "bg-white border-b border-slate-100 py-4 shadow-sm")
        }`}>
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                <div className="flex items-center justify-between h-12">

                    {/* Logo Section */}
                    <LogoUpdated onNavigate={onNavigate}/>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-2">
                        <LearnMenu handleActionClick={handleActionClick} onNavigate={onNavigate} />
                        <ActionButton id="mcq" label="Practise" variant="secondary" icon={Sparkles} onClick={() => handleActionClick('mcq')} />
                        <ActionButton id="model" label="Model Test" icon={GraduationCap} onClick={() => handleActionClick('model')} />

                        <div className={`h-6 w-px mx-1 ${darkMode ? "bg-slate-800" : "bg-slate-200"}`} />

                        {isLoggedIn ? <UserProfile /> : (
                            <ActionButton label="Login" variant="secondary" icon={LogIn} onClick={() => onNavigate('/login')} />
                        )}

                        <button
                            onClick={toggleTheme}
                            className={`p-2.5 rounded-2xl border transition-all duration-300 ml-1 active:scale-95 ${
                                darkMode 
                                    ? "bg-slate-800/80 text-slate-200 border-slate-700/80 hover:bg-slate-700" 
                                    : "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200"
                            }`}
                            title="Toggle Theme"
                        >
                            {darkMode ? <Sun size={18} className="text-amber-400 transition-transform duration-500 hover:rotate-90" /> : <Moon size={18} className="text-indigo-600 transition-transform duration-500 hover:-rotate-12" />}
                        </button>
                        <div>
                           {isLoggedIn && <LanguageSwitcher/>}  
                        </div>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <button 
                            onClick={toggleTheme} 
                            className={`p-2 rounded-xl border ${
                                darkMode 
                                    ? "bg-slate-800/80 text-slate-200 border-slate-700" 
                                    : "bg-slate-100 text-slate-800 border-slate-200"
                            }`}
                        >
                            {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
                        </button>
                        <button 
                            onClick={() => setOpen(!open)} 
                            className={`p-2 rounded-xl border ${
                                darkMode 
                                    ? "bg-slate-800/80 text-slate-200 border-slate-700" 
                                    : "bg-slate-100 text-slate-800 border-slate-200"
                            }`}
                        >
                            {open ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            <div className={`lg:hidden fixed inset-x-4 top-18 transition-all duration-300 ease-in-out ${
                open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
            }`}>
                <div className={`rounded-3xl shadow-2xl border p-5 space-y-4 max-h-[82vh] overflow-y-auto ${
                    darkMode 
                        ? "bg-[#0f172a] border-slate-800 text-slate-100" 
                        : "bg-white border-slate-200 text-slate-900"
                }`}>
                    {isLoggedIn && (
                        <div className={`flex items-center gap-3 p-3.5 rounded-2xl border ${
                            darkMode 
                                ? "bg-slate-800/50 border-slate-700/50" 
                                : "bg-slate-50 border-slate-200/60"
                        }`}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black bg-indigo-600">
                                {userData?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className={`font-bold text-sm truncate ${darkMode ? "text-white" : "text-slate-900"}`}>{userData?.name}</p>
                                <p className={`text-xs truncate ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{userData?.email}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2.5">
                        {isLoggedIn && <MobileMenuBtn icon={LayoutDashboard} label="Dashboard" color="indigo" onClick={() => onNavigate('/dashboard')} darkMode={darkMode} />}
                        <MobileMenuBtn icon={Sparkles} label="Practise" color="indigo" onClick={() => handleActionClick('mcq')} darkMode={darkMode} />
                        <MobileMenuBtn icon={GraduationCap} label="Model Test" color="blue" onClick={() => handleActionClick('model')} darkMode={darkMode} />
                    </div>

                    <div className={`pt-2 border-t ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
                        <div className="flex items-center justify-between mb-2 px-1">
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Courses</p>
                            <button 
                                onClick={() => handleActionClick(null, '/courses')} 
                                className={`text-[10px] font-bold flex items-center gap-1 ${
                                    darkMode ? "text-indigo-400" : "text-indigo-600"
                                }`}
                            >
                                <LayoutGrid size={11} /> All Courses
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                            {subjectCourses.map((subj, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleActionClick(null, `/courses/${subj.slug}`)}
                                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                                        darkMode 
                                            ? "bg-slate-800/40 text-slate-200 hover:bg-slate-800" 
                                            : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                                    }`}
                                >
                                    <span>{subj.name}</span>
                                    <span className={`text-[10px] font-semibold ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>Explore →</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={`pt-2 border-t ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
                        {isLoggedIn ? (
                            <button 
                                onClick={() => { logout(); setOpen(false); }} 
                                className={`w-full p-3.5 flex items-center justify-center gap-2 font-bold text-sm border rounded-2xl ${
                                    darkMode 
                                        ? "text-rose-400 border-rose-900/40 bg-rose-950/20" 
                                        : "text-red-600 border-red-200 bg-red-50"
                                }`}
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => onNavigate('/login')} 
                                    className={`flex-1 p-3 rounded-2xl font-bold text-sm ${
                                        darkMode ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-900"
                                    }`}
                                >
                                    Login
                                </button>
                                <button onClick={() => onNavigate('/signup')} className="flex-1 p-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm">Join Now</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {activeMenu === 'model' && <BcsModelTest onClose={() => setActiveMenu(null)} />}
            {activeMenu === 'mcq' && <QuestionBankPage onClose={() => setActiveMenu(null)} />}
        </nav>
    );
};

const MobileMenuBtn = ({ icon: Icon, label, color, onClick, darkMode }) => {
    const getColors = () => {
        if (color === 'indigo') return "bg-indigo-600 text-white shadow-indigo-500/20";
        if (color === 'amber') return "bg-amber-500 text-white shadow-amber-500/20";
        if (color === 'blue') {
            return darkMode 
                ? "bg-blue-950/30 text-blue-400 border border-blue-900/40" 
                : "bg-blue-50 text-blue-600 border border-blue-200";
        }
        return "";
    };

    return (
        <button onClick={onClick} className={`p-3.5 ${getColors()} rounded-2xl font-bold text-[11px] uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-all text-center`}>
            <Icon size={20} />
            <span>{label}</span>
        </button>
    );
};

export default Navbar;