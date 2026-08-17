import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from './AppContext';


const ProtectedRoute = () => {
    const { isLoggedIn, isLoading } = useAppContext();
    const location = useLocation();

    // The AppContext shows a full-screen loader during 'isLoading'.
    // We return null here to prevent a flash of the login page during re-auth.
    if (isLoading) return null;

    return isLoggedIn ? (
        <Outlet />
    ) : (
        // We pass 'state' so we can redirect them back here after login
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default ProtectedRoute