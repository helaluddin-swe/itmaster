import React, { useState } from "react";
import { ChevronDown, ChevronUp, Network } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";


const RelatedQuestions = ({
  relatedQuestions = [],
  onQuestionClick,
}) => {
  const { darkMode } = useTheme();

  // Stores which accordion is open
  const [openQuestion, setOpenQuestion] = useState(null);

  if (!relatedQuestions?.length) return null;

  const toggleQuestion = (id) => {
    setOpenQuestion((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className={`mt-6 pt-5 border-t border-dashed ${darkMode ? "border-slate-700" : "border-slate-300"
        }`}
    >
      {/* Header */}
      <h4
        className={`text-sm font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-slate-400" : "text-slate-500"
          }`}
      >
        <Network size={18} />
        Most Asked Related Questions ({relatedQuestions.length})
      </h4>

      <div className="space-y-3">
        {relatedQuestions.map((rq, idx) => {
          const id = rq._id || idx;

          const exam =
            rq?.examAppearances
              ?.map((e) =>
                e.year
                  ? `${e.specificExam} (${e.year})`
                  : e.specificExam
              )
              .join(" • ") || "Previous Exam";

          const isOpen = openQuestion === id;

          return (
            <div
              key={id}
              className={`rounded-xl border overflow-hidden transition-all ${darkMode
                  ? "border-slate-700 bg-slate-900"
                  : "border-slate-200 bg-white"
                }`}
            >
              {/* Flash Card */}
              <button
                onClick={() => toggleQuestion(id)}
                className={`w-full flex items-center justify-between px-4 py-3 transition ${darkMode
                    ? "hover:bg-slate-800"
                    : "hover:bg-slate-50"
                  }`}
              >
                <div className="text-left">
                  <p
                    className={`font-semibold ${darkMode ? "text-slate-200" : "text-slate-800"
                      }`}
                  >
                    {exam}
                  </p>

                 
                </div>

                {isOpen ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {/* Expanded Question */}
              {isOpen && (
                <div
                  className={`border-t p-4 ${darkMode
                      ? "border-slate-700 bg-slate-800/40"
                      : "border-slate-200 bg-slate-50"
                    }`}
                >
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      onQuestionClick && onQuestionClick(rq)
                    }
                  >
                    <div className="flex items-start">
                      <span className="font-bold mr-2 text-indigo-600">
                        Q.
                      </span>

                      <div className="flex-1">
                        <p
                          className={`font-medium ${darkMode
                              ? "text-slate-200"
                              : "text-slate-800"
                            }`}
                        >
                          {rq.question}
                        </p>

                        <div className={`mt-3 inline-flex px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-white text-slate-950"}`}>
                          Correct Answer: {rq.answer}
                        </div>
                      </div>
                    </div>

                    
                   
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedQuestions;