import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layout Components
import Navbar from './components/Navbar'

// Context
import { useTheme } from './context/ThemeContext'
import ProtectedRoute from './context/ProtectedRoute'

// Public Pages
import Home from './pages/home/Home'
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'
import LearningDashboard from './pages/learning/Dashboard'


// Protected Pages
import Dashboard from './pages/dashboard/Dashboard'


const App = () => {
  const { darkMode } = useTheme()
  const location = useLocation()

  const hideNavbarPaths = ['/login', '/signup', '/dashboard']
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname)

  return (
    <div
      className={`flex flex-col min-h-screen justify-between transition-colors duration-300 ${
        darkMode ? 'bg-[#020617] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <Toaster position="top-right" reverseOrder={false} />

      {!shouldHideNavbar && <Navbar />}

      <main className={`grow ${!shouldHideNavbar ? 'pt-16' : ''}`}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/courses/:slug" element={<LearningDashboard />} />
          <Route
            path="/courses/:slug/:topicId/:subtopicSlug"
            element={<LearningDashboard />}
          />
      

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          
          </Route>

          {/* FALLBACK CATCH-ALL */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App