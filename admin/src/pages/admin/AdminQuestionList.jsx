import React, { useState, useEffect, useMemo } from 'react';
import axios from "axios";
import { X, Edit3, Trash2, Search, Database, AlertCircle, Filter } from 'lucide-react';
import AddNewQuestion from './AddNewQuestion';
import LoadMore from '../../components/LoadMore';
import { API } from '../../utils/helper';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

const AdminQuestionList = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(5);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const { backendUrl } = useAppContext();
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    setLoading(true);
    axios.get(`${backendUrl}/api/v1/questions`)
      .then((response) => {
        setData(response.data);
        setError(null);
        setLoading(false);
      })
      .catch((error) => {
        setError("Database connection failed. Please check if the server is running.");
        setLoading(false);
      });
  };

  // Extract unique subjects and topics dynamically from question data for easy filtering
  const availableSubjects = useMemo(() => {
    const subjects = new Set();
    (data || []).forEach(item => {
      if (item?.subject) subjects.add(item.subject);
      // Fallback check if category is used interchangeably
      if (item?.category) subjects.add(item.category);
    });
    return Array.from(subjects);
  }, [data]);

  const availableTopics = useMemo(() => {
    const topics = new Set();
    (data || []).forEach(item => {
      if (selectedSubject !== "all" && item?.subject !== selectedSubject && item?.category !== selectedSubject) {
        return;
      }
      if (item?.topic) topics.add(item.topic);
    });
    return Array.from(topics);
  }, [data, selectedSubject]);

  // Combined search and category/subject filtering logic
  const filteredData = useMemo(() => {
    return (data || []).filter(item => {
      if (!item) return false;

      const questionStr = String(item.question || "").toLowerCase();
      const topicStr = String(item.topic || "").toLowerCase();
      const subjectStr = String(item.subject || item.category || "").toLowerCase();
      const searchStr = String(searchTerm || "").toLowerCase();

      // Matches search term
      const matchesSearch = questionStr.includes(searchStr) || topicStr.includes(searchStr) || subjectStr.includes(searchStr);

      // Matches subject filter
      const matchesSubject = selectedSubject === "all" || subjectStr === selectedSubject.toLowerCase();

      // Matches topic filter
      const matchesTopic = selectedTopic === "all" || topicStr === selectedTopic.toLowerCase();

      return matchesSearch && matchesSubject && matchesTopic;
    });
  }, [data, searchTerm, selectedSubject, selectedTopic]);

  const handleDelete = async (id) => {
    if (window.confirm("Permanent delete? This cannot be undone.")) {
      try {
        await axios.delete(`${backendUrl}/api/v1/questions/${id}`);
        setData(data.filter(item => item._id !== id));
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  if (loading) return (
    <div className="p-20 text-center space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
      <p className={`font-bold uppercase tracking-widest text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Accessing Database...</p>
    </div>
  );

  if (error) return (
    <div className={`p-10 border rounded-3xl text-center shadow-lg ${darkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
      <AlertCircle className="text-red-500 mx-auto mb-4" size={40} />
      <p className={`font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
      <button onClick={fetchQuestions} className={`mt-4 text-xs underline font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Try Again</button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* MODAL OVERLAY */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
          <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl border p-6 custom-scrollbar ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900'}`}>
            <button
              onClick={() => setEditingQuestion(null)}
              className={`absolute top-6 right-6 p-2 rounded-full z-10 transition-colors ${darkMode ? 'text-slate-400 hover:text-white bg-slate-800 hover:bg-red-500/20' : 'text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-red-50'}`}
            >
              <X size={20} />
            </button>
            <AddNewQuestion
              editMode={true}
              existingData={editingQuestion}
              onSuccess={() => {
                setEditingQuestion(null);
                fetchQuestions();
              }}
            />
          </div>
        </div>
      )}

      {/* FILTER, SEARCH & HEADER SECTION */}
      <div className={`p-5 md:p-6 rounded-3xl border space-y-4 shadow-sm ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search Bar */}
          <div className="relative w-full lg:max-w-md">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} size={18} />
            <input
              type="text"
              placeholder="Search questions or topics..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setDisplayLimit(5);
              }}
              className={`w-full border rounded-2xl py-3 pl-12 pr-4 outline-none transition-all text-xs font-medium focus:ring-2 focus:ring-indigo-500/50 ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'}`}
            />
          </div>

          {/* Record Count Indicator */}
          <div className={`flex items-center gap-4 px-6 py-2.5 rounded-2xl border w-full lg:w-auto justify-between lg:justify-end ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div>
              <p className={`text-[10px] uppercase font-black tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Record Count</p>
              <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>{filteredData.length} Found</p>
            </div>
            <Database className="text-indigo-500 shrink-0" size={20} />
          </div>
        </div>

        {/* Category & Subject Quick Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-indigo-500 shrink-0" />
            <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Filters:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {/* Subject Dropdown */}
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedTopic("all"); // Reset topic when subject changes
                setDisplayLimit(5);
              }}
              className={`w-full border text-xs rounded-xl px-3 py-2.5 font-medium outline-none focus:ring-2 focus:ring-indigo-500/50 ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
            >
              <option value="all">All Subjects / Categories</option>
              {availableSubjects.map((subject, idx) => (
                <option key={idx} value={subject}>{subject}</option>
              ))}
            </select>

            {/* Topic Dropdown */}
            <select
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
                setDisplayLimit(5);
              }}
              className={`w-full border text-xs rounded-xl px-3 py-2.5 font-medium outline-none focus:ring-2 focus:ring-indigo-500/50 ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
            >
              <option value="all">All Topics</option>
              {availableTopics.map((topic, idx) => (
                <option key={idx} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* LIST VIEW */}
      <div className={`rounded-3xl border overflow-hidden shadow-xl ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
        {filteredData.length > 0 ? (
          <>
            <ul className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {filteredData.slice(0, displayLimit).map((item, index) => (
                <li key={item._id} className={`p-5 transition-all group ${darkMode ? 'hover:bg-slate-950/40' : 'hover:bg-slate-50'}`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex gap-4 items-start w-full min-w-0">
                      <span className="text-indigo-500/50 font-mono text-sm mt-0.5 font-bold shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`font-medium text-sm leading-relaxed transition-colors ${darkMode ? 'text-slate-200 group-hover:text-white' : 'text-slate-800 group-hover:text-slate-950'}`}>
                          {item.question}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {(item.subject || item.category) && (
                            <span className="text-[10px] px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold uppercase tracking-wider">
                              {item.subject || item.category}
                            </span>
                          )}
                          {item.topic && (
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-lg font-bold uppercase tracking-wider border ${darkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                              {item.topic}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button 
                        onClick={() => setEditingQuestion(item)} 
                        title="Edit Question"
                        className={`p-2.5 rounded-xl transition-all ${darkMode ? 'bg-slate-800 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10' : 'bg-slate-100 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'}`}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)} 
                        title="Delete Question"
                        className={`p-2.5 rounded-xl transition-all ${darkMode ? 'bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10' : 'bg-slate-100 text-slate-600 hover:text-red-600 hover:bg-red-50'}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className={`p-6 border-t flex justify-center ${darkMode ? 'bg-slate-950/20 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
              <LoadMore
                displayLimit={displayLimit}
                setDisplayLimit={setDisplayLimit}
                totalItems={filteredData}
              />
            </div>
          </>
        ) : (
          <div className="p-20 text-center">
            <Search className="mx-auto text-slate-600 mb-4" size={48} />
            <p className={`font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>No questions match your filter or search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuestionList;