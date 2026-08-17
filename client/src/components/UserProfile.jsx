import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, Shield, LogOut, ChevronDown, Award, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const UserProfile = () => {
    const { darkMode } = useTheme();
    const { userData, logout, navigate } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userInitial = userData?.name?.charAt(0).toUpperCase() || 'U';
    const isAdmin = userData?.role === 'admin';

    return (
        <div className="relative" ref={dropdownRef}>
            {/* --- Trigger Avatar --- */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 p-1 sm:p-1.5 rounded-2xl transition-all duration-300 focus:outline-none border ${
                    darkMode 
                        ? 'hover:bg-white/10 hover:border-white/25 border-transparent' 
                        : 'hover:bg-slate-200/60 hover:border-slate-300 border-transparent'
                }`}
            >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-fuchsia-600 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-lg shadow-pink-500/20">
                    {userInitial}
                </div>
               
                <ChevronDown 
                    size={14} 
                    className={`transition-transform duration-500 ${
                        darkMode ? 'text-white/50' : 'text-slate-500'
                    } ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} 
                />
            </button>

            {/* --- Premium Profile Card (Fully Responsive for Mobile/Desktop) --- */}
            {isOpen && (
                <div 
                    className={`absolute right-0 mt-3 w-72 sm:w-80 rounded-[2rem] z-[10000] overflow-hidden transition-colors duration-300 animate-in fade-in zoom-in-95 slide-in-from-top-4 ${
                        darkMode 
                            ? 'bg-[#0F172A] border border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)]' 
                            : 'bg-white border border-slate-200 text-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.15)]'
                    }`}
                >
                    {/* Header Section with Gradient */}
                    <div className={`relative p-5 sm:p-6 pb-4 ${
                        darkMode 
                            ? 'bg-gradient-to-br from-indigo-600/20 via-transparent to-pink-500/10' 
                            : 'bg-gradient-to-br from-indigo-50/80 via-transparent to-pink-50/50'
                    }`}>
                        <div className="flex items-center gap-3.5 sm:gap-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-fuchsia-600 flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-xl border-2 border-white/20 shrink-0">
                                {userInitial}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className={`font-black text-base sm:text-lg truncate leading-tight ${
                                    darkMode ? 'text-white' : 'text-slate-900'
                                }`}>
                                    {userData?.name || 'Explorer'}
                                </h3>
                                <p className={`text-xs truncate mt-0.5 ${
                                    darkMode ? 'text-slate-400' : 'text-slate-500'
                                }`}>
                                    {userData?.email || 'user@qspace.com'}
                                </p>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="mt-4 flex items-center gap-2">
                            {isAdmin ? (
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                                    darkMode 
                                        ? 'bg-indigo-500/20 border-indigo-500/30' 
                                        : 'bg-indigo-50 border-indigo-200'
                                }`}>
                                    <Shield size={12} className={darkMode ? 'text-indigo-400' : 'text-indigo-600'} />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                                        darkMode ? 'text-indigo-400' : 'text-indigo-600'
                                    }`}>
                                        Admin Access
                                    </span>
                                </div>
                            ) : (
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                                    darkMode 
                                        ? 'bg-pink-500/20 border-pink-500/30' 
                                        : 'bg-pink-50 border-pink-200'
                                }`}>
                                    <Award size={12} className={darkMode ? 'text-pink-400' : 'text-pink-600'} />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                                        darkMode ? 'text-pink-400' : 'text-pink-600'
                                    }`}>
                                        BCS Aspirant
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats/Quick Actions Area */}
                    <div className="px-5 sm:px-6 py-2 grid grid-cols-2 gap-2">
                        <div className={`p-2 sm:p-2.5 rounded-xl border flex flex-col items-center ${
                            darkMode 
                                ? 'bg-white/5 border-white/5' 
                                : 'bg-slate-100/70 border-slate-200/60'
                        }`}>
                            <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                                45%
                            </span>
                            <span className={`text-[9px] uppercase font-bold mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Progress</span>
                        </div>
                        <div className={`p-2 sm:p-2.5 rounded-xl border flex flex-col items-center ${
                            darkMode 
                                ? 'bg-white/5 border-white/5' 
                                : 'bg-slate-100/70 border-slate-200/60'
                        }`}>
                            <Zap size={14} className="text-amber-500 fill-amber-500/20 mb-0.5" />
                            <span className={`text-[9px] uppercase font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Day Streak</span>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="p-3 space-y-1">
                        <MenuButton 
                            icon={User} 
                            label="Dashboard" 
                            darkMode={darkMode}
                            onClick={() => { navigate('/dashboard'); setIsOpen(false); }} 
                        />
                        
                        {isAdmin && (
                            <MenuButton 
                                icon={Shield} 
                                label="Admin Center" 
                                darkMode={darkMode}
                                onClick={() => { navigate('/admin-control-center'); setIsOpen(false); }}
                                variant="admin"
                            />
                        )}
                        
                        <MenuButton 
                            icon={Settings} 
                            label="Account Settings" 
                            darkMode={darkMode}
                            onClick={() => setIsOpen(false)} 
                        />
                    </div>

                    {/* Logout Section */}
                    <div className={`p-3 border-t ${
                        darkMode 
                            ? 'bg-black/20 border-white/5' 
                            : 'bg-slate-50 border-slate-100'
                    }`}>
                        <button 
                            onClick={() => { logout(); setIsOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${
                                darkMode 
                                    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' 
                                    : 'bg-red-50 hover:bg-red-100/80 text-red-600'
                            }`}
                        >
                            <span className="flex items-center gap-3 font-bold text-sm">
                                <LogOut size={18} />
                                Sign Out
                            </span>
                            <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const MenuButton = ({ icon: Icon, label, onClick, darkMode, variant = "default" }) => {
    const getStyles = () => {
        if (variant === "admin") {
            return darkMode 
                ? "text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300" 
                : "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700";
        }
        return darkMode 
            ? "text-slate-300 hover:bg-white/5 hover:text-white" 
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900";
    };

    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${getStyles()}`}
        >
            <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-slate-200/50'}`}>
                <Icon size={18} />
            </div>
            {label}
        </button>
    );
};

export default UserProfile;