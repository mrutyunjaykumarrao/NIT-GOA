import React from 'react';
import './LanguageSelector.css';

const LanguageSelector = ({
  currentLanguage,
  languages,
  isDropdownOpen,
  onToggleDropdown,
  onLanguageChange,
  dropdownRef,
  isMobile = false
}) => {
  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  const currentLang = getCurrentLanguage();
  const baseClass = isMobile ? 'mobile-language' : 'navbar-language';

  return (
    <div className={`${baseClass}-selector notranslate`} ref={dropdownRef}>
      <button
        className={`${baseClass}-btn notranslate`}
        onClick={onToggleDropdown}
        aria-expanded={isDropdownOpen}
        aria-label="Select Language"
      >
        <span className="language-flag notranslate">{currentLang.flag}</span>
        <span className="notranslate">{currentLang.name}</span>
        <span className={`dropdown-arrow notranslate ${isDropdownOpen ? 'rotated' : ''}`}>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      
      {isDropdownOpen && (
        <div className={`${baseClass}-dropdown open notranslate`}>
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option notranslate ${currentLanguage === language.code ? 'active' : ''}`}
              onClick={() => onLanguageChange(language.code)}
            >
              <span className="language-flag notranslate">{language.flag}</span>
              <div className="language-text notranslate">
                <span className="language-name notranslate">{language.name}</span>
                <span className="language-native notranslate">{language.native}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
