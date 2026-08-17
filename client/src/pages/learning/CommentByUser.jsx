import { MessageSquare } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"

const CommentByUser = ({handleAddComment,newComment,setNewComment,comments}) => {
  const {darkMode}=useTheme()
  return (
    <div className="pt-6 space-y-4">
          <h3
            className={`text-sm font-semibold flex items-center space-x-2 ${
              darkMode ? 'text-slate-200' : 'text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            <span>Discussion ({comments.length})</span>
          </h3>
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ask a question..."
              className={`flex-1 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500'
                  : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 shadow-sm'
              }`}
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
            >
              Post
            </button>
          </form>
          <div className="space-y-3 pt-2">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`p-3 rounded-xl space-y-1 border ${
                  darkMode
                    ? 'bg-slate-900/40 border-slate-800/80'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <span className="font-semibold text-xs text-indigo-500">
                  {comment.user}
                </span>
                <p
                  className={`text-xs ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  {comment.text}
                </p>
              </div>
            ))}
          </div>
        </div>
  )
}
export default CommentByUser