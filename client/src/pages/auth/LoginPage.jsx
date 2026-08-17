import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldCheck, Lock, Mail, KeyRound } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [isStaffMode, setIsStaffMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {darkMode}=useTheme()
  
  const navigate = useNavigate();
  const { 
    backendUrl, 
    setIsLoggedIn, 
    setUserData, 
    setIsAdminAuthenticated 
  } = useAppContext();
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Based on your backend: Admin needs 'role' and 'adminSecret'
      const payload = {
        email,
        password,
        role: isStaffMode ? 'admin' : 'user',
        ...(isStaffMode && { adminSecret })
      };

      const response = await axios.post(`${backendUrl}/api/login`, payload);

      if (response.data.success) {
        const { token, user } = response.data;

        localStorage.setItem('token', token);

        setUserData(user);
        setIsLoggedIn(true);

        toast.success("Login Successful!");
        navigate("/")

      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 font-sans">
      <div className="max-w-md w-full bg-[#0b0f1a] p-8 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
        
        {/* Decorative background glow for Staff Mode */}
        {isStaffMode && (
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-600/10 blur-[80px] rounded-full" />
        )}

        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white tracking-tight">
              {isStaffMode ? 'Staff Login' : 'Welcome Back'}
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              {isStaffMode ? 'Authorized Personnel Only' : 'BackendMASTER: Access your account'}
            </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1 mb-1">
              <Mail size={14} /> Email
            </label>
            <input 
              type="email" 
              required
              value={email}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:ring-2 focus:ring-indigo-600 outline-none transition"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1 mb-1">
              <Lock size={14} /> Password
            </label>
            <input 
              type="password" 
              required
              value={password}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:ring-2 focus:ring-indigo-600 outline-none transition"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

         
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest text-white transition-all duration-200 shadow-lg active:scale-95 ${
              isStaffMode ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
            }`}
          >
            {isSubmitting ? 'Verifying...' : 'Sign In'}
          </button>

          <button 
            type="button"
            onClick={() => setIsStaffMode(!isStaffMode)}
            className="w-full text-[10px] text-slate-500 font-bold uppercase hover:text-white transition-colors flex items-center justify-center gap-1"
          >
            <ShieldCheck size={12}/> {isStaffMode ? "Switch to Student Login" : "Switch to Staff Login"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account? 
          <button onClick={() => navigate('/signup')} className="ml-2 text-indigo-400 font-bold hover:underline">Sign up for free</button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;