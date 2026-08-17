import { useNavigate } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { ArrowLeft } from "lucide-react"

const GoHome = () => {
  const navigate=useNavigate()
  const {darkMode}=useTheme()
  const handelGoHome=()=>{
   navigate('/')
  }
  return (
    <button onClick={handelGoHome} className={`${darkMode?"bg-slate-800 text-white":"bg-slate-100 text-slate-950"}  font-bold  `}><ArrowLeft/></button>
  )
}
export default GoHome