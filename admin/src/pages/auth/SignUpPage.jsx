import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldAlert, User, Mail, Lock, ShieldCheck, KeyRound } from 'lucide-react';

const SignUpPage = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    role: 'admin', // Default to admin
    adminSecret: '' 
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, setUserData, setIsAdminAuthenticated } = useAppContext();

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.adminSecret.trim()) {
      return toast.error("Staff Secret Key is required for registration.");
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        // Role is strictly locked to admin or moderator
        role: formData.role
      };

      const response = await axios.post(`${backendUrl}/api/signup`, payload);
      
      if (response.data.success) {
        const { token, user, message } = response.data;

        const userRole = user?.role?.toLowerCase();
        if (userRole !== 'admin' && userRole !== 'moderator') {
          toast.error("Access Denied: Standard candidate registrations are disabled.");
          setIsSubmitting(false);
          return;
        }

        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setUserDaas ? setUserDaas(user) : setUserData(user);

        toast.success(message || "Staff Registration Successful!");

        if (userRole === 'admin') {
          setIsAdminAuthenticated(true); 
        }
        
        navigate('/admin-control-center');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Staff registration failed";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 font-sans select-none">
      <div className="max-w-md w-full bg-[#0b0f1a] p-8 rounded-[2.5rem] shadow-2xl border border-amber-500/10 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />

        <div className="text-center mb-8">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-lg">
              <ShieldAlert size={24} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
             Staff Enrollment
            </h2>
            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mt-2 text-amber-500/80">
             Admin & Moderator Registration Portal
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-2xl border border-white/5 mb-4">
            <button
              type="button"
              onClick={() => updateForm('role', 'admin')}
              className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                formData.role === 'admin' 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => updateForm('role', 'moderator')}
              className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                formData.role === 'moderator' 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Moderator
            </button>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1 mb-1">
                <User size={14} /> Full Name
            </label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none transition"
              placeholder="Staff Name"
              value={formData.name}
              onChange={(e) => updateForm('name', e.target.value)}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1 mb-1">
                <Mail size={14} /> Staff Email Address
            </label>
            <input
              type="email"
              required
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none transition"
              placeholder="staff@example.com"
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
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none transition"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => updateForm('password', e.target.value)}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase ml-1 mb-1">
                <KeyRound size={14} /> {formData.role === 'admin' ? 'Master Admin Secret Key' : 'Moderator Security Token'}
            </label>
            <input
              type="password"
              required
              className="w-full bg-amber-500/5 border border-amber-500/20 px-4 py-3 rounded-xl text-amber-400 focus:ring-2 focus:ring-amber-500 outline-none transition placeholder:text-amber-900/50"
              placeholder="Enter security key"
              value={formData.adminSecret}
              onChange={(e) => updateForm('adminSecret', e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 mt-4"
          >
            {isSubmitting ? 'Initializing Staff...' : `Register as ${formData.role}`}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already a staff member?
          <button onClick={() => navigate('/login')} className="ml-2 text-amber-400 font-bold hover:underline">Staff Log In</button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;