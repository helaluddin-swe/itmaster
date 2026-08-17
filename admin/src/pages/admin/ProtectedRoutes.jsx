import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const AdminRoute = () => {
  const { userData, isLoggedIn, isAdminAuthenticated, isLoading } = useAppContext();
  const location = useLocation();

  // 1. Wait for the initial Auth Check (from AppContext useEffect)
  if (isLoading) {
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">
          Verifying Credentials...
        </p>
      </div>
    );
  }

  // 2. Logic Check
  // We allow access if they are a moderator OR a verified admin
  const isModerator = isLoggedIn && userData?.role === 'moderator';
  const isVerifiedAdmin = isLoggedIn && userData?.role === 'admin' && isAdminAuthenticated;

  if (isVerifiedAdmin || isModerator) {
    // Renders the child components defined in App.jsx
    return <Outlet />;
  }

  // 3. Unauthorized Access
  // If logged in but not authorized, redirect to Home. If not logged in, redirect to Login.
  const redirectPath = isLoggedIn ? "/" : "/login";
  
  return <Navigate to={redirectPath} replace state={{ from: location }} />;
};

export default AdminRoute;