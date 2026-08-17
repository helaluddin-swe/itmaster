import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const backendUrl = (import.meta.env.VITE_API_URL || "http://localhost:5175").replace(/\/$/, "");

    // --- State Management ---
    const [userData, setUserData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
        sessionStorage.getItem('isAdminAuth') === 'true'
    );

    // --- API Configuration ---
    const getAuthHeaders = useCallback(() => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }), []);

    // --- User Management ---
    const getCurrentUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${backendUrl}/api/me`, getAuthHeaders());
            if (response.data.success) {
                setUserData(response.data.user);
                setIsLoggedIn(true);
            }
        } catch (error) {
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('isAdminAuth');
        setIsLoggedIn(false);
        setUserData(null);
        setIsAdminAuthenticated(false);
        navigate('/login');
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    // --- Comments API ---
    const fetchComments = async (partId) => {
        try {
            const res = await axios.get(`${backendUrl}/api/comments/${partId}`, getAuthHeaders());
            return res.data.success ? res.data.comments : [];
        } catch (err) {
            console.error("Fetch Comments Error", err);
            return [];
        }
    };

    const addComment = async (partId, text) => {
        try {
            const res = await axios.post(`${backendUrl}/api/comments`, { partId, text }, getAuthHeaders());
            return res.data;
        } catch (err) {
            console.error("Add Comment Error", err);
            return { success: false, message: "Failed to post comment" };
        }
    };
    const replyComment = async (commentId, text) => {
        try {
            const res = await axios.post(`${backendUrl}/api/comments/reply`, { commentId, text }, getAuthHeaders());
            return res.data;
        } catch (err) {
            console.error("Reply Comment Error", err);
            return { success: false, message: "Failed to post reply" };
        }
    };

    const contextValue = {
        backendUrl, 
        userData, 
        setUserData, 
        isLoggedIn, 
        setIsLoggedIn, 
        isLoading,
        isAdminAuthenticated, 
        setIsAdminAuthenticated, 
        logout,
        navigate,
        
        // Comments
        replyComment,
        fetchComments,
        addComment
    };

    return (
        <AppContext.Provider value={contextValue}>
            {!isLoading ? children : (
                <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">Initializing System</p>
                </div>
            )}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
export const useAppContext = () => useContext(AppContext);