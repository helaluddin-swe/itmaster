import { Bookmark, CheckCircle, Heart } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"

const UserInteraction = ({setIsLiked,isLiked,isBookmarked,setIsBookmarked,isCompleted,setIsCompleted}) => {
  const {darkMode}=useTheme()
  return (
      <div
          className={`pt-6 border-t flex items-center justify-between ${
            darkMode ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-1.5 text-xs px-3 py-2 rounded-lg border transition-colors ${
                isLiked
                  ? darkMode
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : 'bg-rose-50 border-rose-200 text-rose-600'
                  : darkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`}
              />
              <span>{isLiked ? 'Liked' : 'Like'}</span>
            </button>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`flex items-center space-x-1.5 text-xs px-3 py-2 rounded-lg border transition-colors ${
                isBookmarked
                  ? darkMode
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-amber-50 border-amber-200 text-amber-600'
                  : darkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`}
              />
              <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>
            
            {/* NEW: Completed Button */}
            <button
              onClick={() => setIsCompleted(!isCompleted)}
              className={`flex items-center space-x-1.5 text-xs px-3 py-2 rounded-lg border transition-colors ${
                isCompleted
                  ? darkMode
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10'
                    : 'bg-emerald-500 border-emerald-600 text-white shadow-sm'
                  : darkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <CheckCircle
                className={`w-4 h-4 ${isCompleted ? (darkMode ? 'text-emerald-400' : 'text-white') : ''}`}
              />
              <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>
          </div>
        </div>
  )
}
export default UserInteraction