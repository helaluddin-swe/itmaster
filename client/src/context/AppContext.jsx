import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
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

    // --- MCQ and Search State ---
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showHint, setShowHint] = useState({});
    const [activeTopic, setActiveTopic] = useState(null);
    const [dataSource, setDataSource] = useState([]);

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

    // --- Backend Interactions (Mapped to your Router) ---

    // 1. Leaderboards
    const fetchGlobalLeaderboard = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/leaderboard/global`, getAuthHeaders());
            return res.data;
        } catch (err) { console.error("Global Leaderboard Error", err); return []; }
    };

    const fetchTimeframeLeaderboard = async (timeframe = 'daily') => {
        try {
            const res = await axios.get(`${backendUrl}/api/leaderboard/timeframe?timeframe=${timeframe}`, getAuthHeaders());
            return res.data;
        } catch (err) { console.error("Timeframe Leaderboard Error", err); return []; }
    };

    // 2. Exam & Results Processing
    const updateExamResults = async (resultData) => {
        try {
            const res = await axios.post(`${backendUrl}/api/update-results`, resultData, getAuthHeaders());
            if (res.data.success) {
                setUserData(prev => ({ ...prev, stats: res.data.stats }));
            }
            return res.data;
        } catch (err) { console.error("Update Results Error", err); }
    };

    const saveHistoryLog = async (historyData) => {
        try {
            const res = await axios.post(`${backendUrl}/api/save-history`, historyData, getAuthHeaders());
            return res.data;
        } catch (err) { console.error("Save History Error", err); }
    };

    // 3. History & Real-time Sync
    const getUserHistory = useCallback(async (userId) => {
        if (!userId) return [];
        try {
            const res = await axios.get(`${backendUrl}/api/history/${userId}`, getAuthHeaders());
            return res.data;
        } catch (err) { console.error("History Fetch Error", err); return []; }
    }, [backendUrl, getAuthHeaders]);

    const syncClick = async (isCorrect) => {
        if (!userData?._id) return;
        try {
            const res = await axios.post(`${backendUrl}/api/sync-click`, { 
                userId: userData._id, 
                isCorrect 
            }, getAuthHeaders());
            
            if (res.data.success) {
                setUserData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, totalPoints: res.data.totalPoints }
                }));
            }
        } catch (err) { /* Silent fail */ }
    };

    // --- MCQ Helpers ---
    const filteredQuestions = useMemo(() => {
        return dataSource.filter(q => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                q.question?.toLowerCase().includes(searchLower) ||
                q.topic?.toLowerCase().includes(searchLower) ||
                q.prevExams?.some(exam => exam.toLowerCase().includes(searchLower));

            const matchesCategory = selectedCategory === "All" || q.topic === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory, dataSource]);

    // --- Utils ---
    const optionText = { 0: 'ক', 1: 'খ', 2: 'গ', 3: 'ঘ' };
    const toBanglaNumber = useCallback((num) => {
        const bng = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return num?.toString().split('').map(d => bng[parseInt(d)] || d).join('') || '';
    }, []);

    const slugify = useCallback((text) => {
        return text?.toString().trim().replace(/\s+/g, '-').slice(0, 50).replace(/-+/g, '-');
    }, []);

    const toggleHint = (id) => {
        setShowHint(prev => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    // comments
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

    const contextValue = {
        // comment
        addComment,fetchComments,
        backendUrl, userData, setUserData, isLoggedIn, setIsLoggedIn, isLoading,
        isAdminAuthenticated, setIsAdminAuthenticated, logout,
        
        // MCQ Logic
        dataSource, setDataSource, filteredQuestions,
        searchTerm, setSearchTerm, selectedCategory, setSelectedCategory,
        activeTopic, setActiveTopic, showHint, toggleHint,
        
        // Utils
        slugify, optionText, toBanglaNumber, navigate,

        // Backend Methods
        fetchGlobalLeaderboard,
        fetchTimeframeLeaderboard,
        updateExamResults,
        saveHistoryLog,
        getUserHistory,
        syncClick
    };

    return (
        <AppContext.Provider value={contextValue}>
            {!isLoading ? children : (
                <div className="h-screen  dark:bg-[#020617] bg-white flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">Initializing System</p>
                </div>
            )}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
export const useAppContext = () => useContext(AppContext);