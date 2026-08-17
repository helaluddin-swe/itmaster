import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppContextProvider from './context/AppContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'



const container=document.getElementById('root')

createRoot(container).render(
  
  <HelmetProvider> 
  <ThemeProvider> 
    <LanguageProvider>
  <BrowserRouter> 
  <AppContextProvider>
    <App />
  </AppContextProvider>
  </BrowserRouter>
   </LanguageProvider>
  </ThemeProvider>
  </HelmetProvider>
  
)
