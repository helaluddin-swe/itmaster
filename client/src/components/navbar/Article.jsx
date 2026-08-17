import { X } from "lucide-react"
import { useState } from "react"


const Article = () => {
const[display,setDisplay]=useState(false)
  return   (
    
    <div className='absolute z-20 bg-white h-screen w-full top-20 border '>
      <div className='flex flex-col md:flex-row gap-4  text-gray-800'> 
         <div>left </div> 
         <div> right 
          
          <button> <X onClick={()=>setDisplay(false)}/> </button>
           </div>
         </div>
    </div>
  
)
}

export default Article
