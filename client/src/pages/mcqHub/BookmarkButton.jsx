import React from 'react';
import { Bookmark } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const BookmarkButton = ({ isSaved, onToggleSave }) => {
  const { darkMode } = useTheme();

  return (
    <button
      onClick={onToggleSave}
      title={isSaved ? "Remove Bookmark" : "Save Question"}
      className={`p-2 rounded-xl transition-all duration-200 shrink-0 ${
        isSaved 
          ? darkMode 
            ? ' text-indigo-400 bg-amber-500' 
            : 'bg-indigo-100 text-indigo-600'
          : darkMode
            ? 'hover:bg-slate-800 text-slate-500 hover:text-slate-300'
            : 'hover:bg-slate-100 text-gray-400 hover:text-gray-600'
      }`}
    >
      <Bookmark size={20} className={isSaved ? "fill-current " : ""} />
    </button>
  );
};

export default BookmarkButton;