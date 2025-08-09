import React, { createContext, useContext, useState, useEffect } from 'react';
import siteConfig from '../config/siteConfig';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [isHindi, setIsHindi] = useState(false);

  // Initialize language on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('userLanguagePreference');
    
    if (savedLanguage) {
      const language = savedLanguage === 'hindi' ? 'hindi' : 'english';
      setCurrentLanguage(language);
      setIsHindi(language === 'hindi');
    } else {
      // Auto-detect from browser
      const browserLang = navigator.language || navigator.userLanguage;
      const detectedHindi = browserLang.startsWith('hi') || browserLang.startsWith('hi-IN');
      
      setCurrentLanguage(detectedHindi ? 'hindi' : 'english');
      setIsHindi(detectedHindi);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'english' ? 'hindi' : 'english';
    setCurrentLanguage(newLanguage);
    setIsHindi(newLanguage === 'hindi');
    
    // Save to localStorage
    localStorage.setItem('userLanguagePreference', newLanguage === 'hindi' ? 'hindi' : 'english');
  };

  const getText = (key) => {
    return siteConfig.getTranslation(key, currentLanguage);
  };

  const value = {
    currentLanguage,
    isHindi,
    toggleLanguage,
    getText,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
