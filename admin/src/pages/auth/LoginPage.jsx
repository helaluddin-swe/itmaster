import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldAlert, Lock, Mail, KeyRound, UserCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [role, setRole] = useState('admin'); // Default to admin
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { 
    backendUrl, 
    setIsLoggedIn, 
    setUserDaas, 
    setUserData, 
    setIsAdminAuthenticated 
  } = useAppContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Restricting login payload strictly to admin or moderator roles
      const payload = {
        email,
        password,
        role, // 'admin' or 'moderator'
        adminSecret
      };

      const response = await axios.post(`${backendUrl}/api/login`, payload);

      if (response.data.success) {
        const { token, user } = response.data;

        // Double check user role on return to ensure no candidate/student slips through
        const userRole = user?.role?.toLowerCase();
        if (userRole !== 'admin' && userRole !== 'moderator') {
          toast.error("Access Denied: Candidates and students are not permitted here.");
          setIsSubmitting(false);
          return;
        }

        localStorage.setItem('token', token);
        
        if (userRole === 'admin') {
          setIsAdminAuthenticated(true); 
        }

        setUserData(user);
        setIsLoggedIn(true);

        toast.success("Staff Authentication Successful!");

        // Route strictly to the admin dashboard/control center
        navigate('/admin-dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Staff login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 font-sans select-none">
      <div className="max-w-md w-full bg-[#0b0f1a] p-8 rounded-[2.5rem] shadow-2xl border border-amber-500/10 relative overflow-hidden">
        
        {/* Decorative background glow for Staff Portal */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-600/10 blur-[80px] rounded-full" />

        <div className="text-center mb-8">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-lg">
              <ShieldAlert size={24} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Staff Portal
            </h2>
            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mt-2 text-amber-500/80">
              Admin & Moderator Restricted Area
            </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                role === 'admin' 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRole('moderator')}
              className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                role === 'moderator' 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Moderator
            </button>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1 mb-1">
              <Mail size={14} /> Staff Email
            </label>
            <input 
              type="email" 
              required
              value={email}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none transition"
              placeholder="admin@example.com"
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
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none transition"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase ml-1 mb-1">
              <KeyRound size={14} /> {role === 'admin' ? 'Admin Secret Key' : 'Moderator Access Token'}
            </label>
            <input 
              type="password" 
              required
              value={adminSecret}
              className="w-full bg-amber-500/5 border border-amber-500/20 px-4 py-3 rounded-xl text-amber-400 focus:ring-2 focus:ring-amber-500 outline-none transition"
              placeholder="Enter security key"
              onChange={(e) => setAdminSecret(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Authenticating Staff...' : 'Authorize Access'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5 font-medium">
            <UserCheck size={14} className="text-amber-500" /> Need a staff account? 
            <button 
              onClick={() => navigate('/signup')} 
              className="text-amber-400 font-bold hover:underline ml-1"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;