import { useLanguage } from "../../context/LanguageContext"
import { useTheme } from "../../context/ThemeContext"


const Promo1 = () => {
  const { darkMode } = useTheme()
  const { language,resolve } = useLanguage()

  return (
    <div className={`p-5 rounded-2xl shadow-sm relative overflow-hidden transition-all duration-300 ${
      darkMode 
        ? "bg-linear-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 text-white" 
        : "bg-linear-to-br from-indigo-50 via-white to-indigo-100/50 border border-indigo-200 text-gray-900"
    }`}>
      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
        darkMode 
          ? "text-indigo-400 bg-indigo-900/50 border-indigo-700/50" 
          : "text-indigo-700 bg-indigo-100 border-indigo-200"
      }`}>
        {resolve("promo.specialOffer")}
      </span>
      <h3 className={`text-lg font-extrabold mt-3 mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
        {resolve("promo.title")}
      </h3>
      <p className={`text-xs mb-4 ${darkMode ? "text-slate-400" : "text-gray-600"}`}>
        {resolve("promo.description")}
      </p>
      <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md">
        {resolve("promo.subscribe")}
      </button>
    </div>
  )
}

export default Promo1