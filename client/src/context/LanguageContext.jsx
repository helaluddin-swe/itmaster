import React, { createContext, useContext, useState, useEffect } from 'react'; 

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  // Helper to extract the right language string from multi-language fields
  const resolve = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field; // Fallback if plain string
    return field[language] || field['en'] || Object.values(field)[0] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, resolve }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);