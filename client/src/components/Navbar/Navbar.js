import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLoginModal } from '../../contexts/LoginModalContext';
import './Navbar.css';
import ThemeToggle from '../../Views/ThemeToggle/ThemeToggle';
// import nitLogo from '../../assets/images/Home/NIT_LOGO_192.png'; // Now using public logo192.png

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { openLoginModal } = useLoginModal();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTopNavHidden, setIsTopNavHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuClosing, setIsMobileMenuClosing] = useState(false);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
  const [mobileNestedDropdown, setMobileNestedDropdown] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileLanguageDropdownOpen, setIsMobileLanguageDropdownOpen] = useState(false);
  const [showTranslateConfirm, setShowTranslateConfirm] = useState(false);
  const [pendingTranslation, setPendingTranslation] = useState(null);
  const ticking = useRef(false);
  const languageDropdownRef = useRef(null);
  const mobileLanguageDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Language configuration with native names and flags - only reliable languages
  const languages = useMemo(() => [
    { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' }
  ], []);

  // Get current language object
  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

    // Google Translate integration functions
  const initializeGoogleTranslate = useCallback(() => {
    // Check if Google Translate is ready
    if (window.googleTranslateReady) {
      console.log('Google Translate is ready');
      return;
    }
    
    // Wait for Google Translate to be ready
    if (window.google && window.google.translate && !window.googleTranslateInitialized) {
      console.log('Google Translate available, initializing...');
      
      setTimeout(() => {
        try {
          // Check if widget was created
          const selectElement = document.querySelector('#google_translate_element select');
          console.log('Translation select element found:', !!selectElement);
          
          if (selectElement) {
            console.log('Available language options:', 
              Array.from(selectElement.options).map(opt => ({
                value: opt.value, 
                text: opt.text
              }))
            );
          }
        } catch (error) {
          console.error('Error checking Google Translate widget:', error);
        }
      }, 3000);
      
    } else {
      // Retry after a short delay
      setTimeout(initializeGoogleTranslate, 500);
    }
  }, []);

  // Optimized Google Translate integration with immediate reload for reliability
  const translatePage = useCallback((targetLang) => {
    console.log('translatePage called with:', targetLang);
    
    // Close dropdowns immediately
    setIsLanguageDropdownOpen(false);
    setIsMobileLanguageDropdownOpen(false);
    
    // Get the language name for the prompt
    const selectedLanguage = languages.find(lang => lang.code === targetLang);
    const languageName = selectedLanguage ? selectedLanguage.name : targetLang;
    
    // Set up pending translation data
    const translationData = {
      targetLang,
      languageName,
      isEnglish: targetLang === 'en'
    };
    
    console.log('Setting pending translation:', translationData);
    setPendingTranslation(translationData);
    
    // Show confirmation dialog
    console.log('Showing confirmation dialog');
    setShowTranslateConfirm(true);
  }, [languages]);

  // Handle confirmation dialog response
  const handleTranslateConfirm = useCallback((confirmed) => {
    console.log('handleTranslateConfirm called with:', confirmed);
    console.log('pendingTranslation:', pendingTranslation);
    
    setShowTranslateConfirm(false);
    
    if (!confirmed || !pendingTranslation) {
      console.log('Confirmation cancelled or no pending translation');
      setPendingTranslation(null);
      return;
    }
    
    const { targetLang, isEnglish } = pendingTranslation;
    console.log('Processing translation for:', targetLang, 'isEnglish:', isEnglish);
    
    if (isEnglish) {
      console.log('English selected - clearing all translation and cache');
      localStorage.removeItem('preferred-language');
      
      // Clear Google Translate cookie
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // Force navigation to clean base URL
      const baseUrl = window.location.href.split('#')[0].split('?')[0];
      console.log('Reloading to English URL:', baseUrl);
      
      // Try multiple approaches for reliability
      window.history.replaceState(null, null, baseUrl);
      window.location.href = baseUrl;
      
      // Fallback reload if navigation doesn't work
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      // Cache the selection and prepare translation
      localStorage.setItem('preferred-language', targetLang);
      setCurrentLanguage(targetLang);
      
      const baseUrl = window.location.href.split('#')[0].split('?')[0];
      const translateHash = `#googtrans(en|${targetLang})`;
      const newUrl = baseUrl + translateHash;
      
      // Set Google Translate cookie
      document.cookie = `googtrans=/en/${targetLang}; path=/; max-age=86400`;
      
      // Navigate to translated page
      console.log('User confirmed - navigating to translated page:', newUrl);
      
      // Try multiple approaches for reliability
      window.history.replaceState(null, null, newUrl);
      window.location.href = newUrl;
      
      // Fallback reload if navigation doesn't work
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
    
    setPendingTranslation(null);
  }, [pendingTranslation]);

  // Load saved language preference on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    console.log('Saved language from cache:', savedLanguage);
    
    // If no saved language, default to English (no cache)
    if (!savedLanguage) {
      console.log('No saved language, defaulting to English');
      setCurrentLanguage('en');
      return;
    }
    
    // If saved language is English, don't translate
    if (savedLanguage === 'en') {
      console.log('Saved language is English, keeping original page');
      setCurrentLanguage('en');
      return;
    }
    
    // For non-English saved languages, set current language
    console.log('Setting current language to saved:', savedLanguage);
    setCurrentLanguage(savedLanguage);
  }, []);

  // Monitor URL hash changes to sync language state (with English protection)
  useEffect(() => {
    let isProcessingHashChange = false; // Prevent recursive calls
    
    const handleHashChange = () => {
      if (isProcessingHashChange) return;
      isProcessingHashChange = true;
      
      setTimeout(() => {
        const hash = window.location.hash;
        const savedLanguage = localStorage.getItem('preferred-language');
        
        if (hash.includes('googtrans')) {
          // Extract language from hash like #googtrans(en|hi)
          const match = hash.match(/googtrans\(en\|(\w+)\)/);
          if (match && match[1]) {
            const detectedLang = match[1];
            
            // Only update if it's a valid language and user didn't explicitly choose English
            if (detectedLang !== currentLanguage && 
                languages.some(lang => lang.code === detectedLang) &&
                savedLanguage !== 'en') {
              console.log('URL hash language detected (not overriding English choice):', detectedLang);
              setCurrentLanguage(detectedLang);
              localStorage.setItem('preferred-language', detectedLang);
            }
          }
        } else {
          // No translation hash - only reset to English if not explicitly set
          if (currentLanguage !== 'en' && savedLanguage !== 'en') {
            console.log('No translation hash, resetting to English');
            setCurrentLanguage('en');
            localStorage.setItem('preferred-language', 'en');
          }
        }
        
        isProcessingHashChange = false;
      }, 100); // Small delay to prevent rapid changes
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Check initial hash (but not if user explicitly chose English)
    const initialSavedLang = localStorage.getItem('preferred-language');
    if (initialSavedLang !== 'en') {
      handleHashChange();
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [currentLanguage, languages]);

  // Initialize Google Translate when component mounts
  useEffect(() => {
    initializeGoogleTranslate();
    
    // Cleanup on unmount
    // No cleanup needed for translateTimeoutRef (removed)
    return () => {};
  }, [initializeGoogleTranslate]);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
      if (mobileLanguageDropdownRef.current && !mobileLanguageDropdownRef.current.contains(event.target)) {
        setIsMobileLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (dropdownName) => {
    setOpenDropdown(dropdownName);
    // Clear submenu when switching main dropdowns
    if (dropdownName !== 'admissions') {
      setActiveSubmenu(null);
    }
  };

  const handleMouseLeave = () => {
    // Instant response for fast cursor movement
    setOpenDropdown(null);
    setActiveSubmenu(null);
  };

  const handleSubmenuEnter = (submenuName) => {
    setActiveSubmenu(submenuName);
  };

  const handleSubmenuLeave = () => {
    setActiveSubmenu(null);
  };

  const handleDropdownMouseEnter = (dropdownName) => {
    setOpenDropdown(dropdownName);
  };

  // Throttled scroll handler for smooth progressive scaling and top nav hiding
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const startScroll = 10; // Start shrinking earlier
        const maxScroll = 80; // Shorter distance for complete shrink
        
        // Calculate smooth progress from 0 to 1 with easing
        const rawProgress = (scrollTop - startScroll) / (maxScroll - startScroll);
        const progress = Math.max(0, Math.min(rawProgress, 1));
        
        // Apply easing function for smoother animation
        const easedProgress = progress * progress * (3 - 2 * progress); // Smoothstep function
        
        setScrollProgress(easedProgress);

        // Top navbar hiding logic
        const scrollDelta = scrollTop - lastScrollY;
        const scrollThreshold = 5; // Minimum scroll distance to trigger hide/show

        if (Math.abs(scrollDelta) > scrollThreshold) {
          if (scrollTop > 100) { // Only hide after scrolling past 100px
            if (scrollDelta > 0) {
              // Scrolling down - hide top nav
              setIsTopNavHidden(true);
            } else {
              // Scrolling up - show top nav
              setIsTopNavHidden(false);
            }
          } else {
            // Always show top nav when near the top
            setIsTopNavHidden(false);
          }
          setLastScrollY(scrollTop);
        }
        
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Mobile menu handlers
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setMobileOpenDropdown(null); // Close any open mobile dropdowns
    setMobileNestedDropdown(null); // Close any nested dropdowns
  };

  const closeMobileMenu = () => {
    setIsMobileMenuClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsMobileMenuClosing(false);
      setMobileOpenDropdown(null);
      setMobileNestedDropdown(null);
    }, 300); // Match animation duration
  };

  const toggleMobileDropdown = (dropdownName) => {
    if (mobileOpenDropdown === dropdownName) {
      setMobileOpenDropdown(null);
      setMobileNestedDropdown(null); // Close nested when main closes
    } else {
      setMobileOpenDropdown(dropdownName);
      setMobileNestedDropdown(null); // Close any previous nested
    }
  };

  const toggleMobileNestedDropdown = (nestedName) => {
    setMobileNestedDropdown(mobileNestedDropdown === nestedName ? null : nestedName);
  };

  const handleMobileNavigation = (path) => {
    setIsMobileMenuClosing(true);
    setTimeout(() => {
      navigate(path);
      setIsMobileMenuOpen(false);
      setIsMobileMenuClosing(false);
      setMobileOpenDropdown(null);
      setMobileNestedDropdown(null);
    }, 300);
  };

  // Enhanced language change handler with English protection
  const changeLanguage = useCallback((languageCode) => {
    if (languageCode === currentLanguage) return;
    
    console.log(`Language change from ${currentLanguage} to: ${languageCode}`);
    
    // Close dropdown first
    setIsLanguageDropdownOpen(false);
    
    // Update current language immediately for UI feedback
    setCurrentLanguage(languageCode);
    localStorage.setItem('preferred-language', languageCode);
    
    // Handle English selection properly
    if (languageCode === 'en') {
      console.log('English selected - clearing any existing translations');
      // Clear the hash and reset to English
      try {
        const currentHash = window.location.hash;
        if (currentHash.includes('googtrans')) {
          const baseUrl = window.location.href.split('#')[0].split('?')[0];
          window.history.replaceState(null, null, baseUrl); // Use replaceState to avoid reload
        }
        // Clear any Google Translate cookies
        document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      } catch (error) {
        console.error('Error clearing English translation:', error);
      }
    } else {
      // Start translation for non-English languages
      try {
        translatePage(languageCode);
      } catch (error) {
        console.error('Translation error:', error);
      }
    }
    
  }, [currentLanguage, translatePage]);

  // Toggle language dropdown
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  // Toggle mobile language dropdown
  const toggleMobileLanguageDropdown = () => {
    setIsMobileLanguageDropdownOpen(!isMobileLanguageDropdownOpen);
  };

  return (
    <div 
      className={`navbar-wrapper ${isTopNavHidden ? 'navbar-compact' : ''}`}
      style={{
        '--scroll-progress': scrollProgress,
        '--navbar-top-header-height': `${35 - scrollProgress * 10}px`,
        '--navbar-main-header-height': `${85 - scrollProgress * 25}px`,
      }}
    >
      {/* Top Header */}
      <div className={`navbar-top-header ${isTopNavHidden ? 'navbar-top-header-hidden' : ''}`}>
        <div className="navbar-top-header-content">
          {/* Desktop Controls - Hidden when hamburger menu is visible */}
          <div className="navbar-top-nav-controls desktop-only">
            {/* Enhanced Language Selector */}
            <div className="navbar-language-selector desktop-language-selector" ref={languageDropdownRef}>
              <button 
                className="navbar-language-btn"
                onClick={toggleLanguageDropdown}
                aria-label="Change language"
              >
                <span className="language-flag">
                  {getCurrentLanguage().flag}
                </span>
                <span className="language-name">
                  {getCurrentLanguage().name}
                </span>
                <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className={`navbar-language-dropdown notranslate ${isLanguageDropdownOpen ? 'open' : ''}`}>
                {languages.map((language) => (
                  <button
                    key={language.code}
                    className={`language-option notranslate ${language.code === currentLanguage ? 'active' : ''}`}
                    onClick={() => translatePage(language.code)}
                  >
                    <span className="language-flag notranslate">
                      {language.flag}
                    </span>
                    <span className="language-name notranslate">
                      {language.name}
                      <div className="language-native notranslate">{language.native}</div>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Desktop Top Nav */}
          <nav className="navbar-top-nav desktop-only">
            <a href="https://www.nitgoa.ac.in/alumni/" target="_blank" rel="noopener noreferrer">Alumni</a>
            <a href="/nirf">NIRF</a>
            <a href="/tenders">Tenders</a>
            <a href="/gian">GIAN</a>
            <a href="https://www.nitgoa.ac.in/rajbhasha/#/" target="_blank" rel="noopener noreferrer">RAJBHASHA</a>
            {/* Login/User Section */}
            <div className="auth-section">
              {isAuthenticated && user ? (
                <div className="user-menu">
                  <span className="user-greeting">
                    Welcome, {user.name || user.username}
                  </span>
                  {user.role === 'admin' && (
                    <button 
                      className="nav-btn nav-btn--admin"
                      onClick={() => navigate('/admin')}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                      Admin Panel
                    </button>
                  )}
                  <button 
                    className="nav-btn nav-btn--logout"
                    onClick={logout}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  className="nav-btn nav-btn--login"
                  onClick={openLoginModal}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Login
                </button>
              )}
            </div>
          </nav>

          {/* Mobile Top Nav */}
          <nav className="navbar-top-nav mobile-only">
            <a href="/tenders">Tenders</a>
            <a href="/gian">GIAN</a>
            <a href="https://www.nitgoa.ac.in/rajbhasha/#/" target="_blank" rel="noopener noreferrer">RAJBHASHA</a>
          </nav>

          {/* Mobile Login Button */}
          <div className="mobile-auth mobile-only">
            {isAuthenticated && user ? (
              <button 
                className="nav-btn nav-btn--logout mobile-logout"
                onClick={logout}
              >
                Logout
              </button>
            ) : (
              <button 
                className="nav-btn nav-btn--login mobile-login"
                onClick={openLoginModal}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="navbar-main-header">
        <div className="navbar-header-content">
          <div className="navbar-logo-section">
            <a href="/" className="navbar-logo-link">
              <img src="/logo192.png" alt="NIT Goa Logo" className="navbar-nit-logo" />
              <div className="navbar-institute-info">
                <h1 className="navbar-institute-name-hindi">राष्ट्रीय प्रौद्योगिकी संस्थान गोवा</h1>
                <h2 className="navbar-institute-name-english">National Institute of Technology Goa</h2>
              </div>
            </a>
          </div>
          {/* Hamburger Menu Button - Only visible on mobile */}
          <button 
            className={`hamburger-btn ${isMobileMenuOpen ? 'hamburger-active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="navbar-main-navigation">
        <div className="navbar-nav-content">
          <a href="/" className="navbar-nav-item">Home</a>

          {/* Administration Dropdown */}
          <div 
            className="navbar-nav-item navbar-dropdown"
            onMouseEnter={() => handleMouseEnter('administration')}
            onMouseLeave={handleMouseLeave}
          >
            <span>Administration</span>
            {openDropdown === 'administration' && (
              <div className="navbar-dropdown-menu">
                <a href="/administration/board-of-governors">Board of Governors</a>
                <a href="/administration/director">Director</a>
                <a href="/administration/registrar">Registrar</a>
                <a href="/administration/senate">Senate</a>
                <a href="/administration/deans">Deans</a>
                <a href="/administration/committees">Committees</a>
                <a href="/administration/finance-committee">Finance Committee</a>
                <a href="/administration/building-works-committee">Building and Works Committee</a>
                <a href="/heads-of-departments">Heads of Departments</a>
                <a href="https://www.nitgoa.ac.in/uploads/NITGoaStatute-2023.pdf" target="_blank" rel="noopener noreferrer">NIT Goa(Amendment) Statute 2023</a>
                <a href="/pdf/Administration/organisationalstructure/Org_Chart.pdf" target="_blank" rel="noopener noreferrer">Organizational Structure</a>
                <a href="/reports">Reports</a>
              </div>
            )}
          </div>

          {/* Academics Dropdown */}
          <div 
            className="navbar-nav-item navbar-dropdown"
            onMouseEnter={() => handleMouseEnter('academics')}
            onMouseLeave={handleMouseLeave}
          >
            <span>Academics</span>
            {openDropdown === 'academics' && (
              <div className="navbar-dropdown-menu">
                <a href="/academic-calendar">Academic Calendar</a>
                <a href="/academics/regulations">Regulations and Curriculum</a>
                <a href="/academics/dissertation-formats">Dissertation Formats</a>
                <a href="https://mis.nitgoa.ac.in/misnitgoa/result.aspx" target="_blank" rel="noopener noreferrer">Results</a>
                <a href="/academics/departments">Departments</a>
                <a href="https://www.nitgoa.ac.in/academics/library.html" target="_blank" rel="noopener noreferrer">Library</a>
              </div>
            )}
          </div>
          {/* Admissions Dropdown */}
                <div 
                className="navbar-nav-item navbar-dropdown"
                onMouseEnter={() => handleMouseEnter('admissions')}
                onMouseLeave={handleMouseLeave}
                >
                <span>Admissions</span>
                {openDropdown === 'admissions' && (
                  <div 
                  className="navbar-dropdown-menu"
                  onMouseEnter={() => handleDropdownMouseEnter('admissions')}
                  onMouseLeave={handleMouseLeave}
                  >
                  <div 
                    className="navbar-dropdown-item-with-submenu"
                    onMouseEnter={() => handleSubmenuEnter('btech')}
                    onMouseLeave={handleSubmenuLeave}
                  >
                    <span className="navbar-submenu-item">
                    B.Tech
                    <span className="navbar-submenu-arrow">▶</span>
                    </span>
                    {activeSubmenu === 'btech' && (
                    <div className="navbar-submenu">
                      <a href="/admissions/btech/josaa-csab">JoSAA/CSAB</a>
                      <a href="/admissions/btech/dasa">DASA</a>
                      <a href="/admissions/btech/facilities">Facilities</a>
                      <a href="/admissions/btech/strengths">Strengths of NIT Goa</a>
                    </div>
                    )}
                  </div>
                  <a href="/admissions/mtech">M.Tech</a>
                  <a href="/admissions/phd">Ph.D</a>
                  <a href="https://www.nitgoa.ac.in/uploads/AdmissionBrochure%202august2024.pdf" target="_blank" rel="noopener noreferrer">Admission Brochure</a>
                  <a href="https://www.nitgoa.ac.in/static/fee_structure_23-24_25july2023.pdf" target="_blank" rel="noopener noreferrer">Fee Structure</a>
                  <div 
                    className="navbar-dropdown-item-with-submenu"
                    onMouseEnter={() => handleSubmenuEnter('hostels')}
                    onMouseLeave={handleSubmenuLeave}
                  >
                    <span className="navbar-submenu-item">
                    Hostels
                    <span className="navbar-submenu-arrow">▶</span>
                    </span>
                    {activeSubmenu === 'hostels' && (
                    <div className="navbar-submenu hostels-submenu">
                      <a href="https://www.nitgoa.ac.in/static/Rules_of_NIT_Goa_Hostel_18July2022.pdf" target="_blank" rel="noopener noreferrer">B.Tech Students</a>
                      <a href="https://www.nitgoa.ac.in/static/Rules_mtech_hostel_20june16.pdf" target="_blank" rel="noopener noreferrer">M.Tech Students</a>
                    </div>
                    )}
                  </div>
                  </div>
                )}
                </div>

                {/* Training & Placement Dropdown */}
                <div 
                className="navbar-nav-item navbar-dropdown"
                onMouseEnter={() => handleMouseEnter('training')}
                onMouseLeave={handleMouseLeave}
                >
                <span>Training & Placement</span>
                {openDropdown === 'training' && (
                  <div className="navbar-dropdown-menu">
                  <a href="/training-placement">T & P</a>
                  <a href="/company-login">Company Login</a>
                  <a href="/forms-guidelines">Forms & Guidelines</a>
                  </div>
                )}
                </div>
                
                {/* People Dropdown */}
          <div 
            className="navbar-nav-item navbar-dropdown"
            onMouseEnter={() => handleMouseEnter('people')}
            onMouseLeave={handleMouseLeave}
          >
            <span>People</span>
            {openDropdown === 'people' && (
              <div className="navbar-dropdown-menu">
                <a href="/faculty">Faculty</a>
                <a href="/technical-staff">Technical Staff</a>
                <a href="/administrative-staff">Administrative Staff</a>
                <a href="https://www.nitgoa.ac.in/static/TelephoneDirectory.pdf" target="_blank" rel="noopener noreferrer">Telephone Directory</a>
              </div>
            )}
          </div>

          {/* Research Dropdown */}
          <div 
            className="navbar-nav-item navbar-dropdown"
            onMouseEnter={() => handleMouseEnter('research')}
            onMouseLeave={handleMouseLeave}
          >
            <span>Research</span>
            {openDropdown === 'research' && (
              <div className="navbar-dropdown-menu">
                <a href="/research/rd-projects">R & D Projects</a>
                <a href="https://www.nitgoa.ac.in/research/Research_Consultancy/research_consultancy.html" target="_blank" rel="noopener noreferrer">Research & Consultancy</a>
                <a href="/research/mou-details">Details Of MoUs</a>
                <a href="https://www.nitgoa.ac.in/static/NIT_Goa_IPR_10Nov2015.pdf" target="_blank" rel="noopener noreferrer">IPR Policy</a>
              </div>
            )}
          </div>

          <a href="/outreach-activities" className="navbar-nav-item">Outreach Activities</a>
          <a href="https://mis.nitgoa.ac.in/misnitgoa/academic/ONLINEFEESCOLLECTION/Payment.aspx" target="_blank" rel="noopener noreferrer" className="navbar-nav-item">Fee Payment</a>
          <a href="/hostels" className="navbar-nav-item">Hostels</a>
        </div>
        
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={`mobile-menu-overlay ${isMobileMenuClosing ? 'closing' : ''}`} onClick={closeMobileMenu}>
          <div className={`mobile-menu ${isMobileMenuClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
            {/* Mobile Menu Header */}
            <div className="mobile-menu-header">
              <div className="mobile-menu-theme">
                <ThemeToggle />
                
                {/* Mobile Language Selector */}
                <div className="navbar-language-selector mobile-language-selector" ref={mobileLanguageDropdownRef}>
                  <button 
                    className="navbar-language-btn mobile-language-btn"
                    onClick={toggleMobileLanguageDropdown}
                    aria-label="Change language"
                  >
                    <span className="language-flag notranslate">
                      {getCurrentLanguage().flag}
                    </span>
                    <span className="language-name notranslate">
                      {getCurrentLanguage().name}
                    </span>
                    <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {isMobileLanguageDropdownOpen && (
                    <div className="navbar-language-dropdown mobile-language-dropdown notranslate">
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          className={`language-option notranslate ${language.code === currentLanguage ? 'active' : ''}`}
                          onClick={() => translatePage(language.code)}
                        >
                          <span className="language-flag notranslate">
                            {language.flag}
                          </span>
                          <span className="language-name notranslate">
                            {language.name}
                            <div className="language-native notranslate">{language.native}</div>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button className="mobile-menu-close" onClick={closeMobileMenu}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="mobile-menu-content">
              {/* Home */}
              <div className="mobile-nav-item">
                <button onClick={() => handleMobileNavigation('/')}>Home</button>
              </div>

              {/* Administration */}
              <div className="mobile-nav-item">
                <button 
                  className="mobile-dropdown-trigger"
                  onClick={() => toggleMobileDropdown('administration')}
                >
                  Administration
                  <svg className={`dropdown-icon ${mobileOpenDropdown === 'administration' ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                {mobileOpenDropdown === 'administration' && (
                  <div className="mobile-dropdown-menu open">
                    <button onClick={() => handleMobileNavigation('/administration/board-of-governors')}>Board of Governors</button>
                    <button onClick={() => handleMobileNavigation('/administration/director')}>Director</button>
                    <button onClick={() => handleMobileNavigation('/administration/registrar')}>Registrar</button>
                    <button onClick={() => handleMobileNavigation('/administration/senate')}>Senate</button>
                    <button onClick={() => handleMobileNavigation('/administration/deans')}>Deans</button>
                    <button onClick={() => handleMobileNavigation('/administration/committees')}>Committees</button>
                    <button onClick={() => handleMobileNavigation('/administration/finance-committee')}>Finance Committee</button>
                    <button onClick={() => handleMobileNavigation('/administration/building-works-committee')}>Building and Works Committee</button>
                    <button onClick={() => handleMobileNavigation('/heads-of-departments')}>Heads of Departments</button>
                    <button onClick={() => window.open('https://www.nitgoa.ac.in/uploads/NITGoaStatute-2023.pdf', '_blank')}>NIT Goa(Amendment) Statute 2023</button>
                    <button onClick={() => window.open('/pdf/Administration/organisationalstructure/Org_Chart.pdf', '_blank')}>Organizational Structure</button>
                    <button onClick={() => handleMobileNavigation('/reports')}>Reports</button>
                  </div>
                )}
              </div>

              {/* Academics */}
              <div className="mobile-nav-item">
                <button 
                  className="mobile-dropdown-trigger"
                  onClick={() => toggleMobileDropdown('academics')}
                >
                  Academics
                  <svg className={`dropdown-icon ${mobileOpenDropdown === 'academics' ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                {mobileOpenDropdown === 'academics' && (
                  <div className="mobile-dropdown-menu open">
                    <button onClick={() => handleMobileNavigation('/academic-calendar')}>Academic Calendar</button>
                    <button onClick={() => handleMobileNavigation('/academics/regulations')}>Regulations and Curriculum</button>
                    <button onClick={() => handleMobileNavigation('/academics/dissertation-formats')}>Dissertation Formats</button>
                    <button onClick={() => window.open('https://mis.nitgoa.ac.in/misnitgoa/result.aspx', '_blank')}>Results</button>
                    <button onClick={() => handleMobileNavigation('/academics/departments')}>Departments</button>
                    <button onClick={() => window.open('https://www.nitgoa.ac.in/academics/library.html', '_blank')}>Library</button>
                  </div>
                )}
              </div>

              {/* Admissions */}
              <div className="mobile-nav-item">
                <button 
                  className="mobile-dropdown-trigger"
                  onClick={() => toggleMobileDropdown('admissions')}
                >
                  Admissions
                  <svg className={`dropdown-icon ${mobileOpenDropdown === 'admissions' ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                {mobileOpenDropdown === 'admissions' && (
                  <div className="mobile-dropdown-menu open">
                    {/* B.Tech Submenu */}
                    <button 
                      className="mobile-dropdown-trigger"
                      onClick={() => toggleMobileNestedDropdown('btech')}
                    >
                      B.Tech
                      <svg className={`dropdown-icon ${mobileNestedDropdown === 'btech' ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6,9 12,15 18,9"></polyline>
                      </svg>
                    </button>
                    {mobileNestedDropdown === 'btech' && (
                      <div className="mobile-dropdown-menu open">
                        <button onClick={() => handleMobileNavigation('/admissions/btech/josaa-csab')}>JoSAA/CSAB</button>
                        <button onClick={() => handleMobileNavigation('/admissions/btech/dasa')}>DASA</button>
                        <button onClick={() => handleMobileNavigation('/admissions/btech/facilities')}>Facilities</button>
                        <button onClick={() => handleMobileNavigation('/admissions/btech/strengths')}>Strengths of NIT Goa</button>
                      </div>
                    )}
                    
                    <button onClick={() => handleMobileNavigation('/admissions/mtech')}>M.Tech</button>
                    <button onClick={() => handleMobileNavigation('/admissions/phd')}>Ph.D</button>
                    <button onClick={() => window.open('https://www.nitgoa.ac.in/static/fee_structure_23-24_25july2023.pdf', '_blank')}>Fee Structure</button>
                    <button onClick={() => window.open('https://www.nitgoa.ac.in/uploads/AdmissionBrochure%202august2024.pdf', '_blank')}>Admission Brochure</button>
                    
                    {/* Hostels Submenu */}
                    <button 
                      className="mobile-dropdown-trigger"
                      onClick={() => toggleMobileNestedDropdown('hostels')}
                    >
                      Hostels
                      <svg className={`dropdown-icon ${mobileNestedDropdown === 'hostels' ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6,9 12,15 18,9"></polyline>
                      </svg>
                    </button>
                    {mobileNestedDropdown === 'hostels' && (
                      <div className="mobile-dropdown-menu open">
                        <button onClick={() => window.open('https://www.nitgoa.ac.in/static/Rules_of_NIT_Goa_Hostel_18July2022.pdf', '_blank')}>B.Tech Students</button>
                        <button onClick={() => window.open('https://www.nitgoa.ac.in/static/Rules_mtech_hostel_20june16.pdf', '_blank')}>M.Tech Students</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Training & Placement */}
              <div className="mobile-nav-item">
                <button 
                  className="mobile-dropdown-trigger"
                  onClick={() => toggleMobileDropdown('training')}
                >
                  Training & Placement
                  <svg className={`dropdown-icon ${mobileOpenDropdown === 'training' ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                {mobileOpenDropdown === 'training' && (
                  <div className="mobile-dropdown-menu open">
                    <button onClick={() => handleMobileNavigation('/training-placement')}>T & P</button>
                    <button onClick={() => handleMobileNavigation('/company-login')}>Company Login</button>
                    <button onClick={() => handleMobileNavigation('/forms-guidelines')}>Forms & Guidelines</button>
                  </div>
                )}
              </div>

              {/* People */}
              <div className="mobile-nav-item">
                <button 
                  className="mobile-dropdown-trigger"
                  onClick={() => toggleMobileDropdown('people')}
                >
                  People
                  <svg className={`dropdown-icon ${mobileOpenDropdown === 'people' ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                {mobileOpenDropdown === 'people' && (
                  <div className="mobile-dropdown-menu open">
                    <button onClick={() => handleMobileNavigation('/faculty')}>Faculty</button>
                    <button onClick={() => handleMobileNavigation('/technical-staff')}>Technical Staff</button>
                    <button onClick={() => handleMobileNavigation('/administrative-staff')}>Administrative Staff</button>
                    <button onClick={() => handleMobileNavigation('/telephone-directory')}>Telephone Directory</button>
                  </div>
                )}
              </div>

              {/* Research */}
              <div className="mobile-nav-item">
                <button 
                  className="mobile-dropdown-trigger"
                  onClick={() => toggleMobileDropdown('research')}
                >
                  Research
                  <svg className={`dropdown-icon ${mobileOpenDropdown === 'research' ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                {mobileOpenDropdown === 'research' && (
                  <div className="mobile-dropdown-menu open">
                    <button onClick={() => handleMobileNavigation('/research/rd-projects')}>R & D Projects</button>
                    <button onClick={() => window.open('https://www.nitgoa.ac.in/research/Research_Consultancy/research_consultancy.html', '_blank')}>Research & Consultancy</button>
                    <button onClick={() => handleMobileNavigation('/research/mou-details')}>Details Of MoUs</button>
                    <button onClick={() => window.open('https://www.nitgoa.ac.in/static/NIT_Goa_IPR_10Nov2015.pdf', '_blank')}>IPR Policy</button>
                  </div>
                )}
              </div>

              {/* Single Items */}
              <div className="mobile-nav-item">
                <button onClick={() => handleMobileNavigation('/outreach-activities')}>Outreach Activities</button>
              </div>
              <div className="mobile-nav-item">
                <button onClick={() => handleMobileNavigation('/nirf')}>NIRF</button>
              </div>
              <div className="mobile-nav-item">
                <button onClick={() => window.open('https://www.nitgoa.ac.in/alumni/', '_blank')}>Alumni</button>
              </div>
              <div className="mobile-nav-item">
                <button onClick={() => window.open('https://mis.nitgoa.ac.in/misnitgoa/academic/ONLINEFEESCOLLECTION/Payment.aspx', '_blank')}>Fee Payment</button>
              </div>
              <div className="mobile-nav-item">
                <button onClick={() => handleMobileNavigation('/hostels')}>Hostels</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Translation Confirmation Dialog */}
      {showTranslateConfirm && pendingTranslation && (
        <div className="translate-confirm-overlay">
          <div className="translate-confirm-dialog">
            <div className="translate-confirm-header">
              <h3>
                {pendingTranslation.isEnglish ? '🇺🇸 Switch to English' : `🌐 Translate to ${pendingTranslation.languageName}`}
              </h3>
            </div>
            <div className="translate-confirm-body">
              <p>
                {pendingTranslation.isEnglish 
                  ? 'This will reload the page and remove all translations, returning to the original English content.'
                  : `This will reload the page and translate the content to ${pendingTranslation.languageName}.`
                }
              </p>
            </div>
            <div className="translate-confirm-actions">
              <button 
                className="translate-confirm-btn translate-confirm-cancel"
                onClick={() => handleTranslateConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="translate-confirm-btn translate-confirm-proceed"
                onClick={() => handleTranslateConfirm(true)}
              >
                {pendingTranslation.isEnglish ? 'Switch to English' : 'Translate Page'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;