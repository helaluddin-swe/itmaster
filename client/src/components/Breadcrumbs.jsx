import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Breadcrumbs = ({ category, customTitle, align = "left" }) => {
  const { pathname } = useLocation();
  const pathnames = pathname.split('/').filter((x) => x);

  const currentCategory = category || pathnames[0];
  const detailsSlug = pathnames[1];
  const isDetailPage = !!customTitle || pathnames.length > 1;
  const { darkMode, toggleTheme } = useTheme();

  const handleScroll = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // --- Centralized Dynamic Theme Engine ---
  const theme = {
    textMuted: darkMode ? "text-slate-400" : "text-gray-500",
    linkHover: darkMode ? "hover:text-indigo-400" : "hover:text-indigo-600",
    chevronColor: darkMode ? "text-slate-600" : "text-gray-400",
    activeCategory: darkMode ? "text-slate-200 font-bold" : "text-gray-900 font-bold",
    detailTitle: darkMode ? "text-indigo-400 font-bold" : "text-indigo-600 font-bold"
  };

  // Alignment mapping
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  return (
    <nav 
      className={`flex items-center text-xs md:text-sm py-2 font-medium transition-colors duration-300 ${theme.textMuted} ${alignmentClasses[align] || 'justify-start'}`} 
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1 sm:space-x-1.5 flex-wrap">
        
        {/* 1. HOME */}
        <li className="flex items-center">
          <Link 
            to="/" 
            onClick={handleScroll}
            className={`flex items-center transition-colors ${theme.linkHover}`}
          >
            <Home className="w-3.5 h-3.5 mr-1 shrink-0" />
            <span className="hidden sm:inline">HOME</span>
          </Link>
        </li>

        {/* 2. CATEGORY */}
        {currentCategory && (
          <li className="flex items-center">
            <ChevronRight className={`w-4 h-4 shrink-0 mx-0.5 ${theme.chevronColor}`} />
            {isDetailPage ? (
              <Link 
                to={`/${currentCategory}`} 
                onClick={handleScroll}
                className={`capitalize transition-colors px-1 ${theme.linkHover}`}
              >
                {currentCategory.replace(/-/g, ' ')}
              </Link>
            ) : (
              <span className={`capitalize px-1 ${theme.activeCategory}`}>
                {currentCategory.replace(/-/g, ' ')}
              </span>
            )}
          </li>
        )}

        {/* 3. DETAILS */}
        {isDetailPage && (
          <li className="flex items-center min-w-0">
            <ChevronRight className={`w-4 h-4 shrink-0 mx-0.5 ${theme.chevronColor}`} />
            <span className={`capitalize truncate max-w-[140px] sm:max-w-[200px] md:max-w-xs px-1 ${theme.detailTitle}`} title={customTitle || (detailsSlug && detailsSlug.replace(/-/g, ' '))}>
              {customTitle || (detailsSlug && detailsSlug.replace(/-/g, ' '))}
            </span>
          </li>
        )}

      </ol>
    </nav>
  );
};

export default Breadcrumbs;