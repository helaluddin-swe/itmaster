import { X, Clock, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const Quiz= ({ questions, topicName, onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(questions.length * 60); // প্রতি প্রশ্নে ১ মিনিট
  const [isFinished, setIsFinished] = useState(false);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsFinished(true);
    }
  }, [timeLeft, isFinished]);

  const handleOptionSelect = (option) => {
    if (isFinished) return;
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: option });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) score++;
    });
    return score;
  };

  if (isFinished) {
    const score = calculateScore();
    return (
      <div className="fixed inset-0 z-[10001] bg-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">ফলাফল</h2>
          <p className="text-gray-500 mb-6">{topicName} মডেল টেস্ট সম্পন্ন হয়েছে</p>
          
          <div className="bg-indigo-50 rounded-3xl p-8 mb-8">
            <div className="text-5xl font-black text-indigo-600 mb-2">{score} / {questions.length}</div>
            <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs">আপনার স্কোর</p>
          </div>

          <button 
            onClick={onComplete}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-all"
          >
            ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-[10001] bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
          <div>
            <h3 className="font-bold text-gray-800 leading-none">{topicName}</h3>
            <p className="text-xs text-gray-400 mt-1">প্রশ্ন: {currentIndex + 1} / {questions.length}</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold ${timeLeft < 60 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
          <Clock size={18} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-100">
        <div 
          className="h-full bg-indigo-500 transition-all duration-300" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto p-6 md:flex md:items-center md:justify-center">
        <div className="w-full max-w-2xl bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold mb-4">প্রশ্ন নম্বর {currentIndex + 1}</span>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-4 rounded-2xl text-left border-2 transition-all flex items-center justify-between group ${
                  selectedAnswers[currentIndex] === option 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-gray-50 hover:border-gray-200 text-gray-600'
                }`}
              >
                <span className="font-medium">{option}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswers[currentIndex] === option ? 'border-indigo-600 bg-indigo-600' : 'border-gray-200'}`}>
                  {selectedAnswers[currentIndex] === option && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="p-6 bg-white border-t flex gap-4">
        <button 
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
          className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold disabled:opacity-50"
        >
          আগেরটি
        </button>
        
        {currentIndex === questions.length - 1 ? (
          <button 
            onClick={() => setIsFinished(true)}
            className="flex-[2] py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-100"
          >
            পরীক্ষা শেষ করুন
          </button>
        ) : (
          <button 
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
          >
            পরের প্রশ্ন <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz