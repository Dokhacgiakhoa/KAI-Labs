import React, { createContext, useState, useContext } from 'react';
import { en } from '../translations/en';
import { vi } from '../translations/vi';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });
  
  const t = language === 'en' ? en : vi;

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === 'en' ? 'vi' : 'en';
      localStorage.setItem('language', newLang);
      return newLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
