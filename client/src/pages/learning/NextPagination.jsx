import { useTheme } from "../../context/ThemeContext"
import { ChevronLeft, ChevronRight } from "lucide-react"

const NextPagination = ({ 
  onPrevious = () => {}, 
  onNext = () => {}, 
  hasPrevious = false, 
  hasNext = false 
}) => {
  const { darkMode } = useTheme()

  return (
    <div className="flex items-center justify-between gap-4 pt-6">
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
          !hasPrevious 
            ? "opacity-50 cursor-not-allowed " + (darkMode ? "bg-slate-900/40 border-slate-800 text-slate-600" : "bg-slate-100 border-slate-200 text-slate-400")
            : darkMode 
              ? "bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700" 
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
        }`}
      >
        <ChevronLeft size={16} />
        <span>Previous Lesson</span>
      </button>

      <button
        onClick={onNext}
        disabled={!hasNext}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
          !hasNext 
            ? "opacity-50 cursor-not-allowed " + (darkMode ? "bg-slate-900/40 border-slate-800 text-slate-600" : "bg-slate-100 border-slate-200 text-slate-400")
            : "bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/20"
        }`}
      >
        <span>Next Lesson</span>
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

export default NextPagination