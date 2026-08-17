import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldAlert, Lock, Mail, KeyRound, UserCheck } from 'lucide-react';

import LogoUpdated from '../../components/LogoUpdated';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';



const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [role, setRole] = useState('admin'); // 'admin' or 'staff'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { darkMode } = useTheme();
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
      const payload = {
        email,
        password,
        role, // 'admin' or 'staff'
        adminSecret
      };

      const response = await axios.post(`${backendUrl}/api/admin/login`, payload);

      if (response.data.success) {
        const { token, user } = response.data;

        // Verify role eligibility
        const userRole = user?.role?.toLowerCase();
        if (userRole !== 'admin' && userRole !== 'staff') {
          toast.error("Access Denied: Standard users are not permitted here.");
          setIsSubmitting(false);
          return;
        }

        localStorage.setItem('token', token);
        
        if (userRole === 'admin' || userRole === 'staff') {
          setIsAdminAuthenticated(true); 
        }

        setUserData(user);
        setIsLoggedIn(true);

        toast.success(`${userRole.toUpperCase()} Authentication Successful!`);

        // Route to the admin control center
        navigate('/admin-dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Staff login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Color Palette Theme Definition
  const theme = {
    bg: darkMode ? '#020617' : '#f8fafc',
    cardBg: darkMode ? '#0b0f1a' : '#ffffff',
    cardBorder: darkMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(217, 119, 6, 0.2)',
    textPrimary: darkMode ? '#ffffff' : '#0f172a',
    textSecondary: darkMode ? '#94a3b8' : '#64748b',
    textMuted: darkMode ? '#64748b' : '#94a3b8',
    inputBg: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
    inputBorder: darkMode ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1',
    inputText: darkMode ? '#ffffff' : '#0f172a',
    accent: darkMode ? '#f59e0b' : '#d97706',
    accentLight: darkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(217, 119, 6, 0.1)',
    buttonBg: darkMode ? '#f59e0b' : '#d97706',
    buttonText: '#020617',
    tabBg: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#e2e8f0',
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.bg,
      padding: '1rem',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      userSelect: 'none',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        backgroundColor: theme.cardBg,
        padding: '2rem',
        borderRadius: '2.5rem',
        boxShadow: darkMode 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)' 
          : '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        border: `1px solid ${theme.cardBorder}`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}>
        
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-6rem',
          right: '-6rem',
          width: '12rem',
          height: '12rem',
          backgroundColor: theme.accentLight,
          filter: 'blur(60px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        {/* Company Logo Component */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <LogoUpdated/>
        </div>

        {/* Header Section */}
       
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Role Selector Tabs (Admin vs Staff) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            backgroundColor: theme.tabBg,
            padding: '0.25rem',
            borderRadius: '1rem',
            border: `1px solid ${theme.inputBorder}`
          }}>
            <button
              type="button"
              onClick={() => setRole('admin')}
              style={{
                padding: '0.625rem 0',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: role === 'admin' ? theme.buttonBg : 'transparent',
                color: role === 'admin' ? theme.buttonText : theme.textSecondary,
                boxShadow: role === 'admin' ? '0 4px 12px rgba(245, 158, 11, 0.3)' : 'none'
              }}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRole('staff')}
              style={{
                padding: '0.625rem 0',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: role === 'staff' ? theme.buttonBg : 'transparent',
                color: role === 'staff' ? theme.buttonText : theme.textSecondary,
                boxShadow: role === 'staff' ? '0 4px 12px rgba(245, 158, 11, 0.3)' : 'none'
              }}
            >
              Staff
            </button>
          </div>

          {/* Email Input */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: theme.textSecondary,
              textTransform: 'uppercase',
              marginBottom: '0.375rem',
              marginLeft: '0.25rem'
            }}>
              <Mail size={14} /> Staff Email
            </label>
            <input 
              type="email" 
              required
              value={email}
              style={{
                width: '100%',
                backgroundColor: theme.inputBg,
                border: `1px solid ${theme.inputBorder}`,
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                color: theme.inputText,
                outline: 'none',
                boxSizing: 'border-box',
                fontSize: '0.875rem'
              }}
              placeholder="staff@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: theme.textSecondary,
              textTransform: 'uppercase',
              marginBottom: '0.375rem',
              marginLeft: '0.25rem'
            }}>
              <Lock size={14} /> Password
            </label>
            <input 
              type="password" 
              required
              value={password}
              style={{
                width: '100%',
                backgroundColor: theme.inputBg,
                border: `1px solid ${theme.inputBorder}`,
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                color: theme.inputText,
                outline: 'none',
                boxSizing: 'border-box',
                fontSize: '0.875rem'
              }}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Admin / Staff Secret Key Input */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: theme.accent,
              textTransform: 'uppercase',
              marginBottom: '0.375rem',
              marginLeft: '0.25rem'
            }}>
              <KeyRound size={14} /> {role === 'admin' ? 'Admin Secret Key' : 'Staff Access Token'}
            </label>
            <input 
              type="password" 
              required
              value={adminSecret}
              style={{
                width: '100%',
                backgroundColor: theme.accentLight,
                border: `1px solid ${theme.cardBorder}`,
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                color: theme.accent,
                outline: 'none',
                boxSizing: 'border-box',
                fontSize: '0.875rem'
              }}
              placeholder="Enter security key"
              onChange={(e) => setAdminSecret(e.target.value)}
            />
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '1rem 0',
              borderRadius: '0.75rem',
              fontWeight: 900,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: theme.buttonText,
              backgroundColor: theme.buttonBg,
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1,
              transition: 'all 0.2s ease',
              boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)',
              marginTop: '0.5rem'
            }}
          >
            {isSubmitting ? 'Authenticating Staff...' : 'Authorize Access'}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: `1px solid ${theme.inputBorder}`,
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: theme.textMuted,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem',
            fontWeight: 500,
            margin: 0
          }}>
            <UserCheck size={14} style={{ color: theme.accent }} /> Need a staff account? 
            <button 
              onClick={() => navigate('/signup')} 
              style={{
                color: theme.accent,
                fontWeight: 700,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                marginLeft: '0.25rem',
                textDecoration: 'underline'
              }}
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