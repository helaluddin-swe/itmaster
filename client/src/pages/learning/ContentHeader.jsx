import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { Copy, Check, Maximize2, Menu, Minimize2, Share2 } from "lucide-react";

const ContentHeader = ({
  copied,
  handleCopy,
  shareOpen,
  setShareOpen,          // ← needed for the share popup close button
  handleShare,
  setMobileLeftOpen,
  currentSubtopic,
  isFocusMode,
  setIsFocusMode
}) => {
  const { darkMode } = useTheme();
  const { resolve } = useLanguage();

  // Localized title
  const title = resolve(currentSubtopic?.title);

  return (
    <header
      className={`h-14 border-b px-4 flex items-center justify-between backdrop-blur z-20 ${
        darkMode
          ? "border-slate-800 bg-slate-950/80 text-slate-200"
          : "border-slate-200 bg-white/80 text-slate-800 shadow-sm"
      }`}
    >
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileLeftOpen(true)}
          className={`lg:hidden p-1.5 rounded-lg transition-colors ${
            darkMode
              ? "text-slate-400 hover:text-white hover:bg-slate-800"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <span className="text-xs text-indigo-500 font-semibold uppercase tracking-wider">
            Active Lesson
          </span>
          <h2
            className={`text-sm font-semibold truncate max-w-md ${
              darkMode ? "text-slate-200" : "text-slate-900"
            }`}
          >
            {title || "Untitled Lesson"}
          </h2>
        </div>
      </div>

      <div className="flex items-center space-x-2 relative">
        {/* Copy */}
        <button
          onClick={handleCopy}
          className={`flex items-center space-x-1 text-xs border px-2.5 py-1.5 rounded-lg transition-colors ${
            darkMode
              ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
              : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 shadow-sm"
          }`}
          title="Copy content"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span className="hidden md:inline">{copied ? "Copied" : "Copy"}</span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className={`flex items-center space-x-1 text-xs border px-2.5 py-1.5 rounded-lg transition-colors ${
            darkMode
              ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
              : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 shadow-sm"
          }`}
          title="Share lesson"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Share</span>
        </button>

        {shareOpen && (
          <div
            className={`absolute right-0 top-12 z-30 p-3 rounded-xl border shadow-xl text-xs space-y-2 w-72 ${
              darkMode
                ? "bg-slate-950 border-slate-800 text-slate-200"
                : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <p className="font-semibold text-xs">Share this lesson link</p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className={`px-2 py-1.5 rounded-lg border text-[11px] flex-1 outline-none ${
                  darkMode
                    ? "bg-slate-900 border-slate-800 text-slate-300"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShareOpen?.(false);
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Focus Mode */}
        <button
          onClick={() => setIsFocusMode(!isFocusMode)}
          className={`p-1.5 border rounded-lg transition-colors ${
            darkMode
              ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
              : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 shadow-sm"
          }`}
        >
          {isFocusMode ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};

export default ContentHeader;