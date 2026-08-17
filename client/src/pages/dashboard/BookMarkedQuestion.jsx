import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bookmark, Trash2, ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { useAppContext } from '../../context/AppContext';



export default function BookmarkedQuestions({ onBack }) {
  const { backendUrl, userData } = useAppContext();
  const { darkMode } = useTheme();

  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookmarked questions for the current user
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!userData?._id) return;
      setLoading(true);
      try {
       
        const { data } = await axios.get(`${backendUrl}/api/v1/questions/bookmarked/${userData._id}`);
        setBookmarkedQuestions(data);
      } catch (err) {
        console.error("Failed to load bookmarks", err);
        toast.error("সংরক্ষিত প্রশ্নগুলো লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [backendUrl, userData]);

  // Remove bookmark handler
  const handleRemoveBookmark = async (questionId) => {
    if (!userData?._id) return;

    // Optimistic UI Update
    setBookmarkedQuestions(prev => prev.filter(q => q._id !== questionId));

    try {
      await axios.post(`${backendUrl}/api/v1/questions/${questionId}/bookmark`, { 
        userId: userData._id 
      });
      toast.success("Bookmark removed");
    } catch (error) {
      toast.error("Failed to remove bookmark");
    }
  };

  const theme = {
    pageBg: darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800",
    cardBg: darkMode ? "bg-slate-900 border-slate-800 shadow-slate-950" : "bg-white border-slate-200 shadow-sm",
    headerBg: darkMode ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-200",
    textMuted: darkMode ? "text-slate-400" : "text-slate-500",
    badge: darkMode ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme.pageBg}`}>
      
      {/* Top Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm ${theme.headerBg}`}>
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl ${theme.badge}`}>
              <Bookmark size={20} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight">সংরক্ষিত প্রশ্নসমূহ</h1>
              <p className={`text-xs ${theme.textMuted}`}>আপনার বুকমার্ক করা সকল গুরুত্বপূর্ণ প্রশ্ন</p>
            </div>
          </div>
        </div>
        
        <div className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${theme.badge}`}>
          Total: {bookmarkedQuestions.length}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-4 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className={`text-sm mt-3 ${theme.textMuted}`}>প্রশ্ন লোড হচ্ছে...</p>
          </div>
        ) : bookmarkedQuestions.length === 0 ? (
          <div className={`text-center py-20 px-4 rounded-3xl border ${theme.cardBg} space-y-3`}>
            <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center ${theme.badge}`}>
              <BookOpen size={28} />
            </div>
            <h3 className="text-base font-bold">কোনো সংরক্ষিত প্রশ্ন নেই</h3>
            <p className={`text-xs max-w-sm mx-auto ${theme.textMuted}`}>
              অনুশীলন করার সময় যেকোনো প্রশ্নের পাশের বুকমার্ক আইকনে ক্লিক করে এখানে সেভ করে রাখতে পারেন।
            </p>
          </div>
        ) : (
          bookmarkedQuestions.map((q, idx) => (
            <div key={q._id} className={`p-5 rounded-2xl border transition-all ${theme.cardBg}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                    {idx + 1}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${darkMode ? 'bg-indigo-950 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                    {Array.isArray(q.topic) ? q.topic[0] : q.topic}
                  </span>
                </div>

                {/* Remove Bookmark Button */}
                <button
                  onClick={() => handleRemoveBookmark(q._id)}
                  className={`p-2 rounded-xl transition-colors text-slate-400 hover:text-rose-500 ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-rose-50'}`}
                  title="Remove from bookmarks"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Question Text */}
              <h2 className="text-sm sm:text-base font-semibold leading-relaxed mb-4">
                {q.question}
              </h2>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {q.options.map((opt, i) => {
                  const isCorrect = opt === q.answer;
                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border text-xs sm:text-sm font-medium ${
                        isCorrect 
                          ? (darkMode ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 font-bold' : 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold')
                          : (darkMode ? 'bg-slate-950/40 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700')
                      }`}
                    >
                      {opt} {isCorrect && " ✓"}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Dropdown / Section */}
              {q.explanation && (
                <div className={`p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed ${darkMode ? 'bg-indigo-950/20 border-indigo-900/30 text-indigo-200' : 'bg-indigo-50/60 border-indigo-100 text-indigo-900'}`}>
                  <span className="font-bold block mb-1">ব্যাখ্যা:</span>
                  {q.explanation}
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
}