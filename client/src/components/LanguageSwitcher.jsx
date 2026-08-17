import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const { darkMode } = useTheme();

  const languages = [
    { code: "en", label: "English" },
    { code: "bn", label: "বাংলা" },
    { code: "fr", label: "Français" },
    { code: "es", label: "Español" },
  ];

  const handleLanguageChange = (e) => {
    const code = e.target.value;
    setLanguage(code);
  };

  return (
    <div className="flex items-center">
      <select
        value={language || "en"}
        onChange={handleLanguageChange}
        className={`
          px-3 py-1.5 text-xs font-bold rounded-lg border shadow-sm cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all
          ${
            darkMode
              ? "bg-slate-800 text-slate-200 border-slate-700"
              : "bg-gray-200 text-gray-700 border-gray-300"
          }
        `}
      >
        {languages.map((lang) => (
          <option
            key={lang.code}
            value={lang.code}
            className={darkMode ? "bg-slate-900 text-white" : "bg-white text-gray-900"}
          >
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;