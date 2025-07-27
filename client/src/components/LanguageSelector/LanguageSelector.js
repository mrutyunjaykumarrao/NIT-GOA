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
    <div className={`${baseClass}-selector`} ref={dropdownRef}>
      <button
        className={`${baseClass}-btn`}
        onClick={onToggleDropdown}
        aria-expanded={isDropdownOpen}
        aria-label="Select Language"
      >
        <span className="language-flag">{currentLang.flag}</span>
        <span>{currentLang.name}</span>
        <span className={`dropdown-arrow ${isDropdownOpen ? 'rotated' : ''}`}>▼</span>
      </button>
      
      {isDropdownOpen && (
        <div className={`${baseClass}-dropdown open`}>
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${currentLanguage === language.code ? 'active' : ''}`}
              onClick={() => onLanguageChange(language.code)}
            >
              <span className="language-flag">{language.flag}</span>
              <div className="language-text">
                <span className="language-name">{language.name}</span>
                <span className="language-native">{language.native}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
