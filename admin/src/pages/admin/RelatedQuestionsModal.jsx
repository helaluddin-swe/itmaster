import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X, Check, Plus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

export default function RelatedQuestionsModal({ isOpen, onClose, selectedIds, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useAppContext();
  const { darkMode } = useTheme();

  useEffect(() => {
    if (!isOpen) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${backendUrl}/api/v1/questions`, {
          params: { search: searchTerm } // Ensure your backend supports a search query parameter
        });
        setQuestions(data);
      } catch (err) {
        console.error("Failed to load questions", err);
      } finally {
        setLoading(false);
      }
    };
    const delayDebounce = setTimeout(fetchAll, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, isOpen, backendUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className={`w-full max-w-2xl max-h-[80vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">Select Related Questions</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-500/10">
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search by question text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Question List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <p className="text-center py-6 text-sm text-slate-400">Loading questions...</p>
          ) : questions.length === 0 ? (
            <p className="text-center py-6 text-sm text-slate-400">No questions found.</p>
          ) : (
            questions.map((q) => {
              const isSelected = selectedIds.includes(q._id);
              return (
                <div
                  key={q._id}
                  onClick={() => onSelect(q)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected 
                      ? (darkMode ? 'bg-indigo-950/40 border-indigo-500/50' : 'bg-indigo-50 border-indigo-300')
                      : (darkMode ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700' : 'bg-slate-50/50 border-slate-200 hover:border-slate-300')
                  }`}
                >
                  <p className="text-xs sm:text-sm font-medium pr-4 line-clamp-2">{q.question}</p>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-400'}`}>
                    {isSelected ? <Check size={14} /> : <Plus size={14} className="opacity-0 hover:opacity-100" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button onClick={onClose} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold">
            Done
          </button>
        </div>

      </div>
    </div>
  );
}