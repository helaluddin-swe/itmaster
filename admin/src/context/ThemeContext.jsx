import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setDarkMode(false);
            document.documentElement.classList.remove('dark');
        } else {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (darkMode) {
            setDarkMode(false);
            localStorage.setItem('theme', 'light');
            document.documentElement.classList.remove('dark');
        } else {
            setDarkMode(true);
            localStorage.setItem('theme', 'dark');
            document.documentElement.classList.add('dark');
        }
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);