import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();
  
  return (
    <div className="language-switcher">
      <button
        onClick={() => changeLanguage('ar')}
        className={`${language === 'ar' ? 'active' : ''}`}
      >
        العربية
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`${language === 'en' ? 'active' : ''}`}
      >
        English
      </button>
    </div>
  );
};

export default LanguageSwitcher; 