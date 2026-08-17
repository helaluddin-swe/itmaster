import React from 'react';
import { Bookmark, CheckCircle2, XCircle, Info, MoveRight, BookOpen } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ExamAppearance from './ExamAppearence';
import RelatedQuestions from "./RelatedQuestions"
import { useNavigate } from "react-router-dom"


const QuestionCard = ({
  question,
  index,
  answered,
  onOptionSelect,
  onToggleBookmark,
  isBookmarked,
  onRelatedQuestionClick
}) => {
  const { darkMode } = useTheme();
  const navigate = useNavigate()

  const theme = {
    card: darkMode ? "bg-slate-900 border-slate-800 shadow-slate-950" : "bg-white border-slate-200 shadow-slate-200/50",
    text: darkMode ? "text-slate-200" : "text-slate-800",
    number: darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500",
    optionBase: darkMode ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700",
    optionCorrect: darkMode ? "bg-emerald-900/30 border-emerald-500 text-emerald-300" : "bg-emerald-50 border-emerald-500 text-emerald-700",
    optionWrong: darkMode ? "bg-rose-900/30 border-rose-500 text-rose-300" : "bg-rose-50 border-rose-500 text-rose-700",
    explanation: darkMode ? "bg-indigo-950/30 border-indigo-500/20 text-indigo-200" : "bg-indigo-50/50 border-indigo-100 text-indigo-800",
    bookmarkBtn: darkMode ? "hover:bg-slate-800 text-slate-500 hover:text-amber-400" : "hover:bg-slate-100 text-slate-400 hover:text-amber-500",
    bookmarkActive: "text-amber-500"
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation(); // prevent misclicks on card elements
    onToggleBookmark(question._id);
  };

  return (
    <div className={`p-4 sm:p-6 rounded-2xl border shadow-sm transition-all duration-300 ${theme.card}`}>
      <div className="flex gap-3 sm:gap-4 items-start">
        <span className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl font-bold text-sm sm:text-base ${theme.number}`}>
          {index + 1}
        </span>

        <div className="flex-1 space-y-4 pt-1">
          <div className="flex justify-between items-start gap-4">
            <h3 className={`text-sm sm:text-base font-semibold leading-relaxed ${theme.text}`}>
              {question.question}
            </h3>

            {/* BOOKMARK BUTTON */}
            <button
              onClick={handleBookmarkClick}
              className={`shrink-0 p-1.5 rounded-lg transition-colors duration-200 ${theme.bookmarkBtn} ${isBookmarked ? theme.bookmarkActive : ''}`}
              title={isBookmarked ? "Remove Bookmark" : "Save Question"}
            >
              <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {question.options.map((opt, i) => {
              const isSelected = answered === opt;
              const isCorrect = opt === question.answer;

              let optStyle = theme.optionBase;
              let icon = null;

              if (answered) {
                if (isCorrect) {
                  optStyle = theme.optionCorrect;
                  icon = <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />;
                } else if (isSelected && !isCorrect) {
                  optStyle = theme.optionWrong;
                  icon = <XCircle size={18} className="text-rose-500 shrink-0" />;
                }
              }

              return (
                <button
                  key={i}
                  disabled={!!answered}
                  onClick={() => onOptionSelect(question._id, opt, question.answer)}
                  className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border text-left text-sm font-medium transition-all duration-200 ${optStyle} ${!answered ? 'hover:-translate-y-0.5' : 'cursor-default'}`}
                >
                  <span className="pr-2">{opt}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {answered && question.explanation && (
            <div className={`mt-4 p-4 rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${theme.explanation}`}>
              <Info size={20} className="shrink-0 mt-0.5 opacity-80" />
              <p className="text-xs sm:text-sm leading-relaxed">
                {question.explanation}
              </p>

            </div>
          )}
          

          {/* INTEGRATED COMPONENTS */}
          {answered && (
            <>
              <ExamAppearance examAppearances={question.examAppearances} />
              <RelatedQuestions
                relatedQuestions={question.relatedQuestions}
                onQuestionClick={onRelatedQuestionClick}
                question={question}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;