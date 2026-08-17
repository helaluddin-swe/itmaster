import { useTheme } from "../../context/ThemeContext"

const LogoUpdated = ({onNavigate}) => {
  const {darkMode}=useTheme()
  return (
    <div className="flex flex-col cursor-pointer group shrink-0" onClick={() => onNavigate('/')}>
      <h1 className={`text-xl md:text-2xl font-black tracking-tight transition-colors duration-300 ${darkMode
          ? "text-white group-hover:text-indigo-400"
          : "text-slate-900 group-hover:text-indigo-600"
        }`}>
        Backend
        <span className="relative inline-block bg-linear-to-r from-emerald-500 via-teal-400 to-sky-500 bg-clip-text text-transparent pb-1">
          MASTER
          <svg
            className="absolute -bottom-0.5 left-0 w-full h-3 text-emerald-400/80 pointer-events-none"
            viewBox="0 0 250 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M2 7C70 2 180 2 248 6"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </h1>
      <p className={`text-[9px]  tracking-[0.2em] font-bold -mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"
        }`}>
        Complete Backend Preparation
      </p>
    </div>
  )
}
export default LogoUpdated