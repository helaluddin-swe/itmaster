import { useState, useEffect } from "react";
import { HelpCircle, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

const Mcq = ({ currentSubtopic }) => {
  const { darkMode } = useTheme();
  const { resolve, activeLanguage } = useLanguage();

  // Track selected answers per question index: { [questionIndex]: optionIndex }
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Reset answers when subtopic or language changes
  useEffect(() => {
    setSelectedAnswers({});
  }, [currentSubtopic, activeLanguage]);

  const handleSelect = (questionIndex, optIdx) => {
    // Prevent changing answer once selected
    if (selectedAnswers[questionIndex] !== undefined) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optIdx,
    }));
  };

  const questions = currentSubtopic?.questions || [];

  if (!questions.length) return null;

  return (
    <div className="mt-8 space-y-4">
      <h3
        className={`text-sm font-semibold flex items-center space-x-2 ${
          darkMode ? "text-slate-200" : "text-slate-900"
        }`}
      >
        <HelpCircle className="w-4 h-4 text-indigo-500" />
        <span>Practice MCQs</span>
      </h3>

      {questions.map((q, idx) => {
        // Resolve localized fields using activeLanguage from context
        const questionText = resolve(q.questionText);
        const options = resolve(q.options); // returns array for current language
        const explanation = resolve(q.explanation);
        const correctIndex = q.correctOptionIndex ?? 0;

        const selectedOpt = selectedAnswers[idx];
        const isAnswered = selectedOpt !== undefined;
        const isCorrect = isAnswered && selectedOpt === correctIndex;

        // Ensure options is always an array
        const optionsArr = Array.isArray(options) ? options : [];

        return (
          <div
            key={idx}
            className={`p-4 rounded-xl space-y-3 border ${
              darkMode
                ? "bg-slate-900/60 border-slate-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            {/* Question */}
            <p
              className={`text-xs font-semibold ${
                darkMode ? "text-slate-200" : "text-slate-800"
              }`}
            >
              {idx + 1}. {questionText}
            </p>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {optionsArr.map((opt, optIdx) => {
                let btnStyle = darkMode
                  ? "bg-slate-950 border-slate-800 text-slate-300 hover:border-indigo-500 hover:text-white"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-500 hover:bg-slate-100/50";

                let icon = null;

                if (isAnswered) {
                  if (optIdx === correctIndex) {
                    btnStyle =
                      "bg-emerald-500/10 border-emerald-500 text-emerald-500 font-medium";
                    icon = (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
                    );
                  } else if (optIdx === selectedOpt) {
                    btnStyle =
                      "bg-rose-500/10 border-rose-500 text-rose-500 font-medium";
                    icon = (
                      <XCircle className="w-4 h-4 text-rose-500 ml-auto shrink-0" />
                    );
                  } else {
                    btnStyle = darkMode
                      ? "bg-slate-950/40 border-slate-800/50 text-slate-500 opacity-60"
                      : "bg-slate-50/50 border-slate-200/50 text-slate-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(idx, optIdx)}
                    disabled={isAnswered}
                    className={`text-left p-2.5 rounded-lg text-xs transition-all border flex items-center justify-between gap-2 ${btnStyle}`}
                  >
                    <span>
                      <span className="font-bold mr-1.5 opacity-70">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      {opt}
                    </span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Result + Explanation */}
            {isAnswered && (
              <div className="space-y-2 pt-1">
                <div
                  className={`text-[11px] font-medium ${
                    isCorrect ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {isCorrect
                    ? "Correct! Well done."
                    : "Incorrect. The correct answer is highlighted above."}
                </div>

                {explanation && (
                  <div
                    className={`flex items-start gap-2 text-[11px] leading-relaxed p-2.5 rounded-lg border ${
                      darkMode
                        ? "bg-slate-950/50 border-slate-800 text-slate-400"
                        : "bg-amber-50/50 border-amber-100 text-slate-600"
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{explanation}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Mcq;