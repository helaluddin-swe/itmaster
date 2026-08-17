import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TestAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  // Common button styles to keep the JSX clean
  const btnBase = "px-4 py-2 rounded-lg font-medium transition-all duration-200"
  const btnPrimary = `${btnBase} bg-blue-600 text-white hover:bg-blue-700`
  const btnOutline = `${btnBase} border border-gray-300 text-gray-700 hover:bg-gray-100`
  const btnDanger = `${btnBase} bg-red-500 text-white hover:bg-red-600`

  return (
    <div className="p-6 flex items-center gap-4 bg-gray-50 min-h-screen">
      {/* Home Button */}
      <button 
        onClick={() => navigate('/')} 
        className={btnOutline}
      >
        Home
      </button>

      {isLoggedIn ? (
        /* Logged In State */
        <button 
          onClick={() => setIsLoggedIn(false)} 
          className={btnDanger}
        >
          Log Out
        </button>
      ) : (
        /* Logged Out State */
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/signup')} 
            className={btnOutline}
          >
            Sign Up
          </button>
          <button 
            onClick={() => navigate('/login')} 
            className={btnPrimary}
          >
            Login
          </button>
        </div>
      )}
    </div>
  )
}

export default TestAuth