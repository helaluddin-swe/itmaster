import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { Send, Globe, ShieldCheck, Star, Facebook, Twitter, Linkedin, Youtube, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import LogoUpdated from './navbar/LogoUpdated'

const Footer = () => {
    const [email, setEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)
    const { navigate } = useAppContext()
    const { darkMode } = useTheme()

    // Mapped exactly to your App.js routes
    const footerLinks = {
        learning: [
            { name: 'Packages', path: '/pakages' },
            { name: 'Question Bank', path: '/mcq-hub' },
            { name: 'Daily Test', path: '/daily-test' },
            { name: 'Written Hub', path: '/written-hub' },
            { name: 'Leaderboard', path: '/leaderboard' }
        ],
        explore: [
            { name: 'Previous Exams', path: '/previous-exam' },
            { name: 'Subject Tests', path: '/model-test-subject' },
            { name: 'Article Hub', path: '/article-hub' },
            { name: 'Projects', path: '/projects' }
        ],
        company: [
            { name: 'About Us', path: '/blog' },
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Privacy Policy', path: '#' },
            { name: 'Choose Packages', path: '/pakages' }
        ]
    }

    return (
        <footer className={`transition-colors duration-300 pt-16 pb-8 border-t ${
            darkMode 
                ? "bg-[#0B0F1A] text-slate-300 border-white/5" 
                : "bg-white text-slate-600 border-slate-200 shadow-sm"
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-12">
                    
                    {/* Brand Section */}
                    <div className="lg:col-span-4 flex flex-col items-start">
                        <div className="mb-4 transform hover:scale-105 transition-transform duration-300 inline-block">
                            <LogoUpdated />
                        </div>
                        <p className={`text-sm leading-relaxed mb-6 max-w-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Master the BCS and beyond. The most advanced ecosystem for civil service aspirants in Bangladesh.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                                <a 
                                    key={i} 
                                    href="#" 
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300 ${
                                        darkMode 
                                            ? "bg-white/5 border-white/10 text-slate-400 hover:text-pink-400 hover:border-pink-400/50 hover:bg-pink-400/5" 
                                            : "bg-slate-100 border-slate-200 text-slate-600 hover:text-pink-600 hover:border-pink-300 hover:bg-pink-50"
                                    }`}
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Links Section */}
                    <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
                        {Object.entries(footerLinks).map(([title, links]) => (
                            <div key={title}>
                                <h4 className={`font-bold text-sm mb-4 sm:mb-6 uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {title}
                                </h4>
                                <ul className="space-y-3 sm:space-y-4">
                                    {links.map((link) => (
                                        <li key={link.name}>
                                            <Link 
                                                to={link.path} 
                                                className={`text-sm flex items-center group transition-all ${
                                                    darkMode 
                                                        ? "text-slate-400 hover:text-pink-300" 
                                                        : "text-slate-600 hover:text-pink-600"
                                                }`}
                                            >
                                                <ArrowRight size={12} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 shrink-0" />
                                                <span className="truncate">{link.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Premium Newsletter Card */}
                    <div className="lg:col-span-3">
                        <div className={`relative overflow-hidden p-1 rounded-3xl border ${
                            darkMode 
                                ? "bg-gradient-to-br from-indigo-900/40 to-fuchsia-900/40 border-white/10" 
                                : "bg-gradient-to-br from-indigo-100 to-fuchsia-100 border-slate-200"
                        }`}>
                            <div className={`p-5 sm:p-6 rounded-[calc(1.5rem-1px)] ${darkMode ? 'bg-[#0B0F1A]' : 'bg-white'}`}>
                                <h4 className={`font-bold mb-2 flex items-center gap-2 text-sm sm:text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                    <Send size={16} className="text-pink-500" /> Weekly Insights
                                </h4>
                                <p className={`text-xs mb-4 sm:mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Join 5,000+ students getting exam strategies weekly.
                                </p>
                                <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }} className="space-y-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email address"
                                        className={`w-full border rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all ${
                                            darkMode 
                                                ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500" 
                                                : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                                        }`}
                                        required
                                    />
                                    <button 
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white py-2.5 sm:py-3 rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-pink-500/20 cursor-pointer"
                                    >
                                        {subscribed ? 'Joined!' : 'Subscribe Now'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Trust Bar */}
                <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${darkMode ? 'bg-white/5 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                            <Globe size={12} className="text-blue-400"/> 50K+ Learners
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${darkMode ? 'bg-white/5 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                            <Star size={12} className="text-yellow-400"/> 4.9 Rating
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${darkMode ? 'bg-white/5 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                            <ShieldCheck size={12} className="text-green-400"/> ISO Certified Prep
                        </div>
                    </div>
                    <p className={`text-xs font-medium text-center ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        &copy; 2026 <span className={darkMode ? 'text-white font-bold' : 'text-slate-900 font-bold'}>Q</span><span className="text-pink-500">SPACE</span>. Created for Excellence.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer