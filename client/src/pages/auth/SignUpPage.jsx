import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import LogoUpdated from '../../components/navbar/LogoUpdated';
import { useAppContext } from '../../context/AppContext';


const SignUpPage = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, setUserData } = useAppContext();
  const { darkMode } = useTheme();

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${backendUrl}/api/signup`, formData);
      
      if (response.data.success) {
        const { token, user, message } = response.data;

        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setUserData(user);

        toast.success(message || "Registration Successful!");
        navigate('/');
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center relative px-4 py-12 font-sans transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Go Home Button */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10">
        <button
          onClick={handleGoHome}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border cursor-pointer ${
            darkMode 
              ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800 shadow-md' 
              : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200 shadow-sm'
          }`}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Signup Card */}
      <div className={`max-w-md w-full p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border transition-all duration-300 ${
        darkMode 
          ? 'bg-slate-900/90 border-slate-800/80 shadow-slate-950/50' 
          : 'bg-white border-slate-200/80 shadow-slate-200/50'
      }`}>
        
        {/* Company Logo & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <LogoUpdated />
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Create Account
          </h2>
          <p className={`text-xs sm:text-sm mt-2 ${
            darkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Join the ITMaster platform
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`flex items-center gap-2 text-xs font-bold uppercase ml-1 mb-1.5 ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <User size={14} className="text-indigo-500" /> Full Name
            </label>
            <input
              type="text"
              required
              className={`w-full px-4 py-3 rounded-xl text-sm transition outline-none border focus:ring-2 focus:ring-indigo-500/50 ${
                darkMode 
                  ? 'bg-slate-800/60 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-600'
              }`}
              placeholder="Jhon Doe"
              value={formData.name}
              onChange={(e) => updateForm('name', e.target.value)}
            />
          </div>

          <div>
            <label className={`flex items-center gap-2 text-xs font-bold uppercase ml-1 mb-1.5 ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <Mail size={14} className="text-indigo-500" /> Email Address
            </label>
            <input
              type="email"
              required
              className={`w-full px-4 py-3 rounded-xl text-sm transition outline-none border focus:ring-2 focus:ring-indigo-500/50 ${
                darkMode 
                  ? 'bg-slate-800/60 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-600'
              }`}
              placeholder="helal@dev.com"
              value={formData.email}
              onChange={(e) => updateForm('email', e.target.value)}
            />
          </div>

          <div>
            <label className={`flex items-center gap-2 text-xs font-bold uppercase ml-1 mb-1.5 ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <Lock size={14} className="text-indigo-500" /> Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              className={`w-full px-4 py-3 rounded-xl text-sm transition outline-none border focus:ring-2 focus:ring-indigo-500/50 ${
                darkMode 
                  ? 'bg-slate-800/60 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-600'
              }`}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => updateForm('password', e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3.5 mt-2 rounded-xl font-bold text-sm uppercase tracking-wider text-white transition-all duration-200 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <p className={`mt-8 text-center text-xs sm:text-sm ${
          darkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Already have an account? 
          <button 
            onClick={() => navigate('/login')} 
            className="ml-1.5 text-indigo-500 font-bold hover:underline cursor-pointer"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;