import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast'; // Ensure this is imported
import { ShieldAlert, User, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const SignUpPage = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    role: 'user', 
    adminSecret: '' 
  });
  
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {darkMode}=useTheme()
  
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, setUserData, setIsAdminAuthenticated } = useAppContext();

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdminMode && !formData.adminSecret.trim()) {
      return toast.error("Master Secret Key is required for Admin enrollment.");
    }

    setIsSubmitting(true);
    


    try {
      const payload = {
        ...formData,
        role: isAdminMode ? 'admin' : 'user',
        adminSecret: isAdminMode ? formData.adminSecret : undefined
      };

      const response = await axios.post(`${backendUrl}/api/signup`, payload);
      
      if (response.data.success) {
        const { token, user, message } = response.data;

        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setUserData(user);

        // FIX: Replaced alert with toast
        toast.success(message || "Registration Successful!");

        if (user.role === 'admin') {
          setIsAdminAuthenticated(true); 
          navigate('/admin-control-center');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      // Improved error logging for debugging
      const errorMsg = error.response?.data?.message || "Registration failed";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 font-sans">
      <div className="max-w-md w-full bg-[#0b0f1a] p-8 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
        
        <div className={`absolute top-0 left-0 w-full h-1 transition-colors duration-500 ${isAdminMode ? 'bg-amber-500' : 'bg-indigo-600'}`} />

        <div className="text-center mb-8">
           <h2 className="text-3xl font-black text-white tracking-tight">
            {isAdminMode ? 'Staff Enrollment' : 'Create Account'}
           </h2>
           <p className="text-slate-400 text-sm mt-2">
            {isAdminMode ? 'Elevated Access Registration' : 'Join the BackendMASTER platform'}
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1 mb-1">
                <User size={14} /> Full Name
            </label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:ring-2 focus:ring-indigo-600 outline-none transition"
              placeholder="Helal Uddin"
              value={formData.name}
              onChange={(e) => updateForm('name', e.target.value)}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1 mb-1">
                <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              required
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:ring-2 focus:ring-indigo-600 outline-none transition"
              placeholder="helal@dev.com"
              value={formData.email}
              onChange={(e) => updateForm('email', e.target.value)}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1 mb-1">
                <Lock size={14} /> Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:ring-2 focus:ring-indigo-600 outline-none transition"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => updateForm('password', e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button 
              type="button"
              onClick={() => {
                const nextMode = !isAdminMode;
                setIsAdminMode(nextMode);
                if (!nextMode) updateForm('adminSecret', '');
              }}
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${isAdminMode ? 'text-amber-500' : 'text-indigo-400'}`}
            >
              {isAdminMode ? <User size={14}/> : <ShieldAlert size={14}/>}
              {isAdminMode ? "Register as standard user" : "Register as Admin / Instructor?"}
            </button>
          </div>

          {isAdminMode && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase ml-1 mb-1">
                  <ShieldCheck size={14} /> Master Admin Secret
              </label>
              <input
                type="password"
                required={isAdminMode}
                className="w-full bg-amber-500/5 border border-amber-500/20 px-4 py-3 rounded-xl text-amber-400 focus:ring-2 focus:ring-amber-500 outline-none transition placeholder:text-amber-900/50"
                placeholder="Enter root secret key"
                value={formData.adminSecret}
                onChange={(e) => updateForm('adminSecret', e.target.value)}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest text-white transition-all duration-200 shadow-lg mt-4 ${
                isSubmitting 
                ? 'bg-slate-700 cursor-not-allowed' 
                : isAdminMode 
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20' 
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
            } active:scale-95`}
          >
            {isSubmitting ? 'Registering...' : isAdminMode ? 'Initialize Admin' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?
          <button onClick={() => navigate('/login')} className="ml-2 text-indigo-400 font-bold hover:underline">Log In</button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;