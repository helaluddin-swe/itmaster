import { ChevronRight, X, BookOpen, Search, PlayCircle, Hash, CheckCircle2, AlertCircle, Timer, TrendingUp, History, BarChart3, ArrowLeft } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from "react-hot-toast";
import { ALL_QUESTIONS, generatePopularTest, subjects_Model_Test } from './data';
import ProgressChart from './Progress';
import PerformanceAnalysis from './ResultAnalysis';



const getSimulatedRank = (score, total) => {
  const percentage = (score / total) * 100;
  if (percentage >= 85) return { percentile: "Top 0.5%", status: "Cadet Material", color: "text-purple-600", bg: "bg-purple-50" };
  if (percentage >= 70) return { percentile: "Top 10%", status: "Competitive", color: "text-blue-600", bg: "bg-blue-50" };
  return { percentile: "Top 45%", status: "Average Candidate", color: "text-amber-600", bg: "bg-amber-50" };
};



const BCSQuestionBank = ({ onClose }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [questionCount, setQuestionCount] = useState(10);

  // --- Exam States ---
  const [quizActive, setQuizActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const timerRef = useRef(null);

 

useEffect(() => {
  const handleReviewLogic = () => {
    const params = new URLSearchParams(window.location.search);
    const subjectParam = params.get('subject'); // Decodes automatically
    const modeParam = params.get('mode');

    if (subjectParam && modeParam === 'review') {
      // 1. Find the subject (using trim to avoid hidden space issues)
      const subjectData = subjects_Model_Test.find(
        s => s.name.trim() === subjectParam.trim()
      );

      if (subjectData) {
        const count = parseInt(params.get('count')) || 10;
        
        // 2. Load questions
        const sourceQuestions = ALL_QUESTIONS[subjectParam] || ALL_QUESTIONS["Default"];
        const reviewQuestions = [...sourceQuestions].slice(0, count);

        // 3. Force update state
        setSelectedTopic(subjectData);
        setQuestions(reviewQuestions);
        setQuizActive(true);
        setIsSubmitted(true); // Shows answers immediately
        
        console.log("Review Mode Activated for:", subjectParam);
      }
    }
  };

  // Check immediately on mount
  handleReviewLogic();

  // Listen for the custom event from QuestionSolveView
  window.addEventListener('triggerReview', handleReviewLogic);
  // Listen for browser back/forward
  window.addEventListener('popstate', handleReviewLogic);

  return () => {
    window.removeEventListener('triggerReview', handleReviewLogic);
    window.removeEventListener('popstate', handleReviewLogic);
  };
}, [subjects_Model_Test]); // Re-run if subjects list loads late
  // --- Timer Logic ---
  useEffect(() => {
    if (quizActive && timeLeft > 0 && !isSubmitted) {
      timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (quizActive && timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
    return () => clearInterval(timerRef.current);
  }, [quizActive, timeLeft, isSubmitted]);

  // 2. Updated handleStart (Works for both fresh tests and reviews)
  const handleStart = () => {
    if (!selectedTopic) return;
    
    const isPopular = selectedTopic.name === "Popular Test";

    // Question Selection Logic
    let selected = isPopular
      ? generatePopularTest(ALL_QUESTIONS)
      : [...(ALL_QUESTIONS[selectedTopic.name] || ALL_QUESTIONS["Default"])]
          .sort(() => 0.5 - Math.random()) // Shuffling for new tests
          .slice(0, questionCount);

    const totalSeconds = selected.length * 36;

    // Set States for New Test
    setQuestions(selected);
    setTimeLeft(totalSeconds);
    setUserAnswers({});
    setIsSubmitted(false); // Must be false for a new test
    setQuizActive(true);

    toast.success(isPopular ? "১০০ প্রশ্নের মডেল টেস্ট শুরু হয়েছে!" : "পরীক্ষা শুরু হয়েছে!");
  };

  const saveDetailedProgress = (topic, stats, qCount) => {
    const history = JSON.parse(localStorage.getItem('bcs_exam_history') || '[]');
    const sessionParams = new URLSearchParams();
    sessionParams.set('subject', topic);
    sessionParams.set('count', qCount);
    sessionParams.set('mode', 'review');

    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      topic,
      ...stats,
      link: `${window.location.pathname}?${sessionParams.toString()}`,
      percentage: Math.round((stats.correct / stats.total) * 100)
    };

    localStorage.setItem('bcs_exam_history', JSON.stringify([newEntry, ...history]));
  };

  const handleSubmit = () => {
    clearInterval(timerRef.current);

    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    questions.forEach((q, idx) => {
      if (userAnswers[idx] === undefined) {
        unanswered++;
      } else if (userAnswers[idx] === q.a) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const total = questions.length;
    const timeSpentSeconds = (total * 36) - timeLeft;

    saveDetailedProgress(selectedTopic.name, {
      correct,
      incorrect,
      unanswered,
      total,
      timeSpentSeconds
    }, total);

    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.success("ফলাফল প্রস্তুত!");
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // --- UI Logic ---
  if (quizActive) {
    const score = questions.reduce((acc, q, idx) => acc + (userAnswers[idx] === q.a ? 1 : 0), 0);
    const rank = getSimulatedRank(score, questions.length);
    const history = JSON.parse(localStorage.getItem('bcs_exam_history') || '[]').slice(0, 7).reverse();

    return (
      <div className="fixed inset-0 z-10001 bg-slate-50 overflow-y-auto">
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b p-4">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <button
              onClick={() => {
                setQuizActive(false);
                setIsSubmitted(false);
                setSelectedTopic(null);
                if (onClose) onClose(); // Ensure it closes the modal/view
              }}
              className="text-gray-500 font-bold flex items-center gap-1 hover:text-red-500"
            >
              <ArrowLeft size={18} /> বন্ধ করুন
            </button>
            
            {/* Timer only shows if not submitted */}
            {!isSubmitted && (
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono font-bold ${timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-indigo-50 text-indigo-700'}`}>
                <Timer size={18} /> {formatTime(timeLeft)}
              </div>
            )}

            <div className="text-xs font-bold text-gray-400">
              {Object.keys(userAnswers).length} / {questions.length}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto p-4 md:p-6">
          {isSubmitted && (
            <div className="mb-10 space-y-6 animate-in zoom-in duration-500">
              <div className="bg-linear-to-br from-indigo-700 to-purple-800 p-8 rounded-3xl shadow-2xl text-white">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-white">আপনার অবস্থান (Rank)</h2>
                  <div className="bg-white/20 p-2 rounded-xl text-white"><BarChart3 size={24} /></div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-5xl font-black text-white">{questions.length > 0 ? Math.round((score / questions.length) * 100) : 0}%</div>
                  <div>
                    <h3 className="text-2xl font-bold text-amber-300">{rank.percentile}</h3>
                    <p className="text-white opacity-80 font-medium">Status: {rank.status}</p>
                  </div>
                </div>
                <PerformanceAnalysis history={history} />
              </div>
            </div>
          )}

          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className={`bg-white p-6 rounded-2xl border-2 transition-all ${isSubmitted ? (userAnswers[idx] === q.a ? 'border-green-500 bg-green-50/30' : 'border-red-100') : 'border-gray-100'}`}>
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex gap-3">
                  <span className="text-indigo-500 opacity-50">{idx + 1}.</span> {q.q}
                </h3>
                <div className="grid gap-3">
                  {q.options.map((opt, i) => {
                    const isCorrect = i === q.a;
                    const isSelected = userAnswers[idx] === i;
                    let btnStyle = "border-gray-100 text-gray-600";

                    if (isSubmitted) {
                      if (isCorrect) btnStyle = "border-green-500 bg-green-50 text-green-700 font-bold";
                      else if (isSelected) btnStyle = "border-red-500 bg-red-50 text-red-700";
                    } else if (isSelected) {
                      btnStyle = "border-indigo-600 bg-indigo-50 text-indigo-700";
                    }

                    return (
                      <button
                        key={i}
                        disabled={isSubmitted}
                        onClick={() => setUserAnswers(prev => ({ ...prev, [idx]: i }))}
                        className={`w-full p-4 text-left rounded-xl border-2 transition-all flex items-center gap-3 ${btnStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${isSelected ? 'bg-current text-white' : 'bg-gray-100'}`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {isSubmitted && (
                  <div className="mt-5 p-4 bg-white/50 border-l-4 border-indigo-500 rounded-r-xl animate-in slide-in-from-left-2">
                    <p className="text-sm text-indigo-900 font-bold mb-1 italic">ব্যাখ্যা (Explanation):</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{q.explanation || "এই প্রশ্নের সঠিক উত্তরটি সরাসরি তথ্য থেকে নেওয়া হয়েছে।"}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              className="w-full mt-10 py-5 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-xl hover:bg-indigo-700 transition-all active:scale-95"
            >
              পরীক্ষা সম্পন্ন করুন
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- Main Selection Screen ---
  const filteredSubjects = subjects_Model_Test.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="fixed inset-0 z-9999 flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-4xl h-[95vh] md:h-auto md:max-h-[90vh] rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="sticky top-0 bg-white border-b z-20">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold text-indigo-700 flex items-center gap-2">
              <BookOpen size={28} /> BCS Model Test
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          <div className="px-6 pb-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="বিষয় খুঁজুন..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSubjects.map((subject, index) => (
              <button
                key={index}
                onClick={() => { setSelectedTopic(subject); setQuestionCount(subject.mark); }}
                className={`flex items-center justify-between p-5 bg-white border shadow-sm rounded-2xl transition-all group hover:border-indigo-300 hover:shadow-lg active:scale-[0.98]`}
              >
                <div className="flex items-center gap-4 text-left">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${subject.color}`}>
                    {subject.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-indigo-700 leading-tight">{subject.name}</h3>
                    <p className="text-sm font-medium text-gray-400">পূর্ণমান: {subject.mark}</p>
                  </div>
                </div>
                <PlayCircle className="text-gray-300 group-hover:text-indigo-500 transition-all" size={28} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedTopic && !isSubmitted && !quizActive && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setSelectedTopic(null)} />
          <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl animate-in zoom-in duration-300">
            <div className={`p-8 text-center rounded-t-3xl ${selectedTopic.color}`}>
              <span className="text-6xl mb-4 block">{selectedTopic.icon}</span>
              <h3 className="text-2xl font-black text-gray-800">{selectedTopic.name}</h3>
            </div>
            <div className="p-8">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4"><Hash size={16} /> প্রশ্নের সংখ্যা:</label>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[10, 20, selectedTopic.mark].map(n => (
                  <button key={n} onClick={() => setQuestionCount(n)}
                    className={`py-3 rounded-xl font-bold transition-all ${selectedTopic.name === 'Popular Test' ? "hidden" : ""} border-2 ${questionCount === n ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 text-gray-400'}`}
                  > {n} </button>
                ))}
              </div>
              <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-extrabold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all" onClick={handleStart}>
                🚀 শুরু করুন
              </button>
              <button className="w-full py-4 mt-3 bg-gray-600 text-white rounded-2xl font-extrabold shadow-lg hover:bg-gray-700 active:scale-95 transition-all" onClick={() => setSelectedTopic(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BCSQuestionBank;