import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'



// Auth & Admin Pages
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'

import AdminDashboard from './pages/admin/AdminDashboard'

// Data
// import { blog_details_data } from './assets/assest'
// import { ProjectData } from './assets/projectData'

import AdminRoute from './pages/admin/ProtectedRoutes'
// import Leaderboard from './pages/dashboard/LeaderBoard'
import ProtectedRoute from './context/ProtectedRoute'
import Home from './pages/home/Home'
// import Pakages from './components/Pakages'

const App = () => {
  return (
    <div className='flex flex-col justify-between min-h-screen'>
      <Toaster position="top-right" reverseOrder={false}  />
      
      {/* Navbar stays outside Routes to show on every page */}

      <Routes>
        {/* ========================================== */}
        {/* PUBLIC ROUTES (No login required)          */}
        {/* ========================================== */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path='/' element={<Home/>}/> 
          
        <Route element={<ProtectedRoute/>}>
        
        
          
        </Route>

        {/* ========================================== */}
        {/* ADMIN ROUTES (Requires Admin Role ONLY)    */}
        {/* ========================================== */}
        <Route element={<AdminRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<Navigate to="/admin-dashboard" replace />} />
         
        </Route>

        {/* CATCH ALL - Redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* <Footer /> */}
    </div>
  )
}

export default App