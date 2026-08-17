import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, BookOpen, Layers, Briefcase } from 'lucide-react';
import { toast } from "react-hot-toast";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

import QuestionCard from './QuestionCard';
import LifetimeDashboard from './LifetimeDashboard';
import SubjectCard from './SubjectCard';
import QuestionHeader from './QuestionHeader'; 
import LoadingOverlay from './LoadingOverlay';
import Breadcrumbs from '../../components/Breadcrumbs';
import { Subjects_Based_MCQ } from './data';
import { examCategories } from './data';

// Helper for safe localStorage reads
const getStorageAnswers = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return {};
  }
};

const EXAM_COLORS = [
  "bg-blue-50 text-blue-600 border-blue-100",
  "bg-emerald-50 text-emerald-600 border-emerald-100",
  "bg-orange-50 text-orange-600 border-orange-100",
  "bg-purple-50 text-purple-600 border-purple-100",
  "bg-cyan-50 text-cyan-600 border-cyan-100",
  "bg-rose-50 text-rose-600 border-rose-100"
];

const QuestionBankPage = ({ onClose }) => {
  const { backendUrl, userData, syncClick, saveHistoryLog } = useAppContext();
  const { darkMode } = useTheme();

  const [activeTab, setActiveTab] = useState('subjects');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [topicCounts, setTopicCounts] = useState({});
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });

  const [lifetimeStats, setLifetimeStats] = useState({
    totalAnswered: 0,
    totalCorrect: 0,
    subjectPerformance: {}
  });

  const handleGoBack = () => {
    window.history.back();
  };

  const theme = useMemo(() => ({
    pageBg: darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800",
    modalBg: darkMode ? "bg-slate-900 text-slate-100 border-slate-800" : "bg-white text-slate-800 border-slate-100",
    headerBg: darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200",
    contentBg: darkMode ? "bg-slate-950/50" : "bg-slate-50/50",
    iconContainer: darkMode ? "bg-indigo-500/15 text-indigo-400" : "bg-indigo-50 text-indigo-600",
    headingText: darkMode ? "text-white" : "text-slate-900",
    subText: darkMode ? "text-slate-400" : "text-slate-500",
    quizHero: darkMode 
      ? "bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 border border-indigo-500/30 text-white shadow-indigo-950/50" 
      : "bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-indigo-500/20",
    quizHeroSub: darkMode ? "text-indigo-300" : "text-indigo-100"
  }), [darkMode]);

  const getAllMCQAnsweredCount = useCallback(() => {
    let total = 0;
    Subjects_Based_MCQ.forEach(sub => {
      if (!sub.isSpecial) {
        const saved = getStorageAnswers(`qb_answers_${sub.name}`);
        total += Object.keys(saved).length;
      }
    });
    return total;
  }, []);

  const handleBack = useCallback(async () => {
    if (quizActive) {
      setLoading(true);
      if (userData?._id && selectedTopic) {
        const totalThisSession = Object.keys(userAnswers).length;
        if (totalThisSession > 0) {
          await saveHistoryLog({
            userId: userData._id,
            userName: userData.name,
            topic: selectedTopic.name,
            correct: stats.correct,
            incorrect: stats.wrong,
            total: totalThisSession,
            timeSpentSeconds: 0
          });
        }
      }
      setLoading(false);
      setQuizActive(false);
      setSelectedTopic(null);
    } else {
      if (onClose) onClose();
    }
  }, [quizActive, userData, selectedTopic, userAnswers, stats, saveHistoryLog, onClose]);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    window.history.pushState({ modalOpen: true, quizActive: false }, '');
    
    const handlePopState = (event) => {
      if (quizActive) {
        event.preventDefault();
        window.history.pushState({ modalOpen: true, quizActive: false }, '');
        handleBack();
      } else {
        if (onClose) onClose();
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('popstate', handlePopState);
    };
  }, [quizActive, handleBack, onClose]);

  useEffect(() => {
    const getCounts = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/v1/questions/counts`);
        setTopicCounts(data || {});
      } catch (err) {
        console.error("Count fetch failed", err);
      }
    };
    getCounts();
  }, [backendUrl]);

  useEffect(() => {
    if (userData?.stats) {
      setLifetimeStats({
        totalAnswered: userData.stats.totalSolved || 0,
        totalCorrect: userData.stats.totalCorrect || 0,
        subjectPerformance: userData.stats.subjectPerformance || {}
      });
    }
  }, [userData]);

  const fetchQuestions = async (item) => {
    setSelectedTopic(item);
    setLoading(true);
    try {
      let params = item.isExam ? { examCategory: item.id } : (!item.isSpecial ? { topic: item.name } : {});
      const response = await axios.get(`${backendUrl}/api/v1/questions`, { params });

      if (response.data?.length) {
        const fetchedQuestions = [...response.data].sort(() => 0.5 - Math.random());
        setQuestions(fetchedQuestions);
        
        const storageKey = `qb_answers_${item.name}`;
        const savedAnswers = getStorageAnswers(storageKey);
        setUserAnswers(savedAnswers);

        let correct = 0, wrong = 0;
        fetchedQuestions.forEach(q => {
          const answer = savedAnswers[q._id];
          if (answer) {
            answer === q.answer ? correct++ : wrong++; 
          }
        });
        
        setStats({ correct, wrong });
        setQuizActive(true);
        window.history.pushState({ modalOpen: true, quizActive: true }, '');
      } else {
        toast.error("এই টপিকে/পরীক্ষায় কোনো প্রশ্ন পাওয়া যায়নি");
      }
    } catch (error) {
      toast.error("Error loading questions");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = async (qId, selectedOpt, correctOpt) => {
    if (userAnswers[qId]) return;

    const isCorrect = selectedOpt === correctOpt;
    const newAnswers = { ...userAnswers, [qId]: selectedOpt };

    setUserAnswers(newAnswers);
    setStats(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      wrong: !isCorrect ? prev.wrong + 1 : prev.wrong
    }));

    if (selectedTopic) {
      try {
        localStorage.setItem(`qb_answers_${selectedTopic.name}`, JSON.stringify(newAnswers));
      } catch (e) {
        console.error("Failed to save answer to local storage", e);
      }
    }
    if (userData) {
      await syncClick(isCorrect);
    }
    isCorrect ? toast.success("সঠিক!") : toast.error("ভুল!");
  };

  const handleToggleBookmark = async (questionId) => {
    if (!userData) {
      toast.error("Please login to save questions");
      return;
    }

    setQuestions(prev => prev.map(q => {
      if (q._id === questionId) {
        const isBookmarked = q.bookmarkedBy?.includes(userData._id);
        const newBookmarks = isBookmarked 
          ? q.bookmarkedBy.filter(id => id !== userData._id) 
          : [...(q.bookmarkedBy || []), userData._id];
        return { ...q, bookmarkedBy: newBookmarks };
      }
      return q;
    }));

    try {
      await axios.post(`${backendUrl}/api/v1/questions/${questionId}/bookmark`, { 
        userId: userData._id 
      });
    } catch (error) {
      toast.error("Failed to update bookmark");
    }
  };

  const formattedExams = useMemo(() => {
    return examCategories.map((cat, idx) => ({
      isExam: true, 
      id: cat.id, 
      name: cat.name, 
      mark: cat.mark, 
      icon: cat.icon,
      color: EXAM_COLORS[idx % EXAM_COLORS.length], 
      tags: cat.exams
    }));
  }, []);

  const displayList = activeTab === 'subjects' ? Subjects_Based_MCQ : formattedExams;

  // Render Active Quiz Screen
  if (quizActive) {
    return (
      <QuizView
        theme={theme}
        stats={stats}
        questions={questions}
        userAnswers={userAnswers}
        selectedTopic={selectedTopic}
        userData={userData}
        loading={loading}
        onBack={handleBack}
        onOptionClick={handleOptionClick}
        onToggleBookmark={handleToggleBookmark}
      />
    );
  }

  // Render Modal Dashboard Screen
  return (
    <div className="fixed inset-0 z-9999 flex items-end md:items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      <div className={`relative w-full h-full md:h-[94dvh] md:max-w-6xl xl:max-w-7xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 border md:rounded-3xl ${theme.modalBg}`}>
        {/* Header */}
        <header className={`px-4 sm:px-6 py-4 md:px-8 border-b flex justify-between items-center shrink-0 z-10 ${theme.headerBg}`}>
          <div className="flex items-center gap-3 md:gap-4">
            <div className={`p-2.5 sm:p-3 rounded-2xl flex items-center justify-center shrink-0 ${theme.iconContainer}`}>
              <BookOpen size={24} className="sm:w-7 sm:h-7" />
            </div>
            <div>
              <h2 className={`text-base sm:text-xl md:text-2xl font-black tracking-tight leading-none mb-1 ${theme.headingText}`}>
                Practice Question
              </h2>
              <div className="hidden sm:block">
                <Breadcrumbs customTitle="" category="mcq-hub" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider block sm:hidden ${theme.subText}`}>
                Be MCQ Master
              </span>
            </div>
          </div>

          <button 
            onClick={onClose || handleGoBack} 
            className={`p-2 rounded-full transition-colors ${darkMode ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800' : 'text-slate-500 hover:text-rose-500 hover:bg-slate-100'}`}
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className={`flex-1 overflow-y-auto overscroll-contain transition-colors ${theme.contentBg}`}>
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
            <LifetimeDashboard lifetimeStats={lifetimeStats} />

            {/* Navigation Tabs */}
            <div className={`flex items-center justify-center p-1.5 mx-auto max-w-sm rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <button 
                onClick={() => setActiveTab('subjects')} 
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${activeTab === 'subjects' ? 'bg-indigo-600 text-white shadow-md' : `text-slate-500 hover:text-indigo-500 ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}`}
              >
                <Layers size={16}/> Subject
              </button>
              <button 
                onClick={() => setActiveTab('exams')} 
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${activeTab === 'exams' ? 'bg-indigo-600 text-white shadow-md' : `text-slate-500 hover:text-indigo-500 ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}`}
              >
                <Briefcase size={16}/> চাকরীভিত্তিক
              </button>
            </div>

            {/* Grid Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pb-20">
              {displayList.map((item, idx) => {
                const totalForThisItem = item.isExam 
                  ? "N/A" 
                  : (item.isSpecial ? Object.values(topicCounts).reduce((acc, count) => acc + count, 0) : (topicCounts[item.name] || 0));

                const answeredCount = item.isExam 
                  ? 0 
                  : (item.isSpecial ? getAllMCQAnsweredCount() : Object.keys(getStorageAnswers(`qb_answers_${item.name}`)).length);

                return (
                  <SubjectCard
                    key={item.id || item.name || idx}
                    subject={item}
                    totalQuestions={totalForThisItem}
                    answeredCount={answeredCount}
                    performance={lifetimeStats.subjectPerformance?.[item.name]}
                    onClick={() => fetchQuestions(item)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {loading && <LoadingOverlay />}
    </div>
  );
};

// Extracted Component for Quiz Active Screen
const QuizView = ({
  theme,
  stats,
  questions,
  userAnswers,
  selectedTopic,
  userData,
  loading,
  onBack,
  onOptionClick,
  onToggleBookmark
}) => (
  <div className={`fixed inset-0 z-10001 flex flex-col overflow-hidden transition-colors duration-300 animate-in fade-in ${theme.pageBg}`}>
    <QuestionHeader
      stats={stats}
      totalQuestions={questions.length}
      answeredCount={Object.keys(userAnswers).length}
      topicName={selectedTopic?.name}
      onBack={onBack}
    />
    <div className="flex-1 overflow-y-auto scroll-smooth overscroll-contain">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 pb-32 pt-6 sm:pt-10 mt-4">
        
        <div className={`rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all ${theme.quizHero}`}>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <h1 className="text-xl sm:text-3xl font-black mb-1 sm:mb-2 leading-tight">
                {selectedTopic?.name}
              </h1>
              <p className={`text-xs sm:text-sm font-medium ${theme.quizHeroSub}`}>
                আপনার মেধা যাচাই করুন এবং অনুশীলনে এগিয়ে থাকুন।
              </p>
            </div>
          </div>
          <BookOpen className="absolute -right-6 -bottom-6 text-white/10 w-32 h-32 sm:w-40 sm:h-40 rotate-12 pointer-events-none select-none" />
        </div>

        <div className="space-y-4 sm:space-y-6">
          {questions.map((q, idx) => (
            <QuestionCard
              key={q._id}
              question={q}
              index={idx}
              answered={userAnswers[q._id]}
              onOptionSelect={onOptionClick}
              onToggleBookmark={onToggleBookmark}
              isBookmarked={q.bookmarkedBy?.includes(userData?._id)}
            />
          ))}
        </div>
      </div>
    </div>
    {loading && <LoadingOverlay />}
  </div>
);

export default QuestionBankPage