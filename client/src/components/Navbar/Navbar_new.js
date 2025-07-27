import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLoginModal } from '../../contexts/LoginModalContext';
import { useGoogleTranslate } from '../../hooks/useGoogleTranslate';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import TranslationConfirmDialog from '../TranslationConfirmDialog/TranslationConfirmDialog';
import ThemeToggle from '../../Views/ThemeToggle/ThemeToggle';
import './Navbar.css';

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
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileLanguageDropdownOpen, setIsMobileLanguageDropdownOpen] = useState(false);
  const ticking = useRef(false);
  const languageDropdownRef = useRef(null);
  const mobileLanguageDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Use the Google Translate hook
  const {
    currentLanguage,
    languages,
    showTranslateConfirm,
    pendingTranslation,
    handleTranslateConfirm,
    changeLanguage,
    getCurrentLanguage
  } = useGoogleTranslate();

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

  // Toggle language dropdown
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  // Toggle mobile language dropdown
  const toggleMobileLanguageDropdown = () => {
    setIsMobileLanguageDropdownOpen(!isMobileLanguageDropdownOpen);
  };

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

  // Navigation data
  const navigationData = {
    "admissions": {
      "name": "Admissions",
      "path": "/admissions",
      "items": {
        "undergraduate": {
          "name": "Undergraduate",
          "items": [
            { "name": "B.Tech", "path": "/admissions/btech" },
            { "name": "B.Tech (Lateral Entry)", "path": "/admissions/btech-lateral" }
          ]
        },
        "postgraduate": {
          "name": "Postgraduate",
          "items": [
            { "name": "M.Tech", "path": "/admissions/mtech" },
            { "name": "M.Sc", "path": "/admissions/msc" },
            { "name": "MBA", "path": "/admissions/mba" }
          ]
        },
        "research": {
          "name": "Research",
          "items": [
            { "name": "Ph.D", "path": "/admissions/phd" }
          ]
        }
      }
    },
    "academics": {
      "name": "Academics",
      "path": "/academics",
      "items": [
        { "name": "Departments", "path": "/academics/departments" },
        { "name": "Courses", "path": "/academics/courses" },
        { "name": "Academic Calendar", "path": "/academics/calendar" },
        { "name": "Regulations", "path": "/academics/regulations" },
        { "name": "Academic Council", "path": "/academics/council" }
      ]
    },
    "faculty": {
      "name": "Faculty",
      "path": "/faculty",
      "items": [
        { "name": "All Faculty", "path": "/faculty" },
        { "name": "Recruitment", "path": "/faculty/recruitment" },
        { "name": "Faculty Achievements", "path": "/faculty/achievements" }
      ]
    },
    "research": {
      "name": "Research",
      "path": "/research",
      "items": [
        { "name": "Research Areas", "path": "/research/areas" },
        { "name": "Publications", "path": "/research/publications" },
        { "name": "Projects", "path": "/research/projects" },
        { "name": "Research Facilities", "path": "/research/facilities" }
      ]
    },
    "placements": {
      "name": "Placements",
      "path": "/placements",
      "items": [
        { "name": "Training & Placement Cell", "path": "/placements/tpc" },
        { "name": "Placement Statistics", "path": "/placements/statistics" },
        { "name": "Recruiters", "path": "/placements/recruiters" },
        { "name": "Training Programs", "path": "/placements/training" }
      ]
    },
    "student-life": {
      "name": "Student Life",
      "path": "/student-life",
      "items": [
        { "name": "Hostels", "path": "/student-life/hostels" },
        { "name": "Clubs & Societies", "path": "/student-life/clubs" },
        { "name": "Sports", "path": "/student-life/sports" },
        { "name": "Cultural Activities", "path": "/student-life/cultural" },
        { "name": "Student Council", "path": "/student-life/council" }
      ]
    }
  };

  return (
    <>
      <nav className={`navbar-wrapper ${scrollProgress > 0 ? 'navbar-compact' : ''}`}>
        {/* Top Header */}
        <div className={`navbar-top-header ${isTopNavHidden ? 'navbar-top-header-hidden' : ''}`}>
          <div className="navbar-top-header-content">
            <div className="navbar-top-nav">
              <div 
                className="navbar-dropdown"
                onMouseEnter={() => handleDropdownMouseEnter('quickLinks')}
                onMouseLeave={handleMouseLeave}
              >
                <span className="navbar-dropdown-trigger">
                  Quick Links
                  <span className="navbar-dropdown-arrow">▼</span>
                </span>
                {openDropdown === 'quickLinks' && (
                  <div className="navbar-dropdown-menu">
                    <a href="/tenders">Tenders</a>
                    <a href="/rti">RTI</a>
                    <a href="/downloads">Downloads</a>
                    <a href="/telephone-directory">Telephone Directory</a>
                    <a href="/grievances">Grievances</a>
                  </div>
                )}
              </div>
              <a href="/alumni">Alumni</a>
              <a href="/convocation">Convocation</a>
              <a href="/events">Events</a>
            </div>
            
            <div className="navbar-top-nav-controls">
              <LanguageSelector
                currentLanguage={currentLanguage}
                languages={languages}
                isDropdownOpen={isLanguageDropdownOpen}
                onToggleDropdown={toggleLanguageDropdown}
                onLanguageChange={changeLanguage}
                dropdownRef={languageDropdownRef}
              />
              
              <ThemeToggle />
              
              {isAuthenticated ? (
                <div 
                  className="navbar-dropdown"
                  onMouseEnter={() => handleDropdownMouseEnter('auth')}
                  onMouseLeave={handleMouseLeave}
                >
                  <span className="navbar-dropdown-trigger">
                    Welcome, {user?.displayName || user?.email || 'User'}
                    <span className="navbar-dropdown-arrow">▼</span>
                  </span>
                  {openDropdown === 'auth' && (
                    <div className="navbar-dropdown-menu">
                      <a href="/profile">Profile</a>
                      <a href="/dashboard">Dashboard</a>
                      <button onClick={logout}>Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={openLoginModal} className="navbar-login-btn">
                  Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="navbar-main-header" style={{
          '--scale-factor': 1 - (scrollProgress * 0.25)
        }}>
          <div className="navbar-header-content">
            <div className="navbar-logo-section">
              <a href="/" className="navbar-logo-link">
                <img 
                  src="/logo192.png" 
                  alt="NIT Goa Logo" 
                  className="navbar-nit-logo"
                />
                <div className="navbar-institute-info">
                  <div className="navbar-institute-name-hindi">
                    राष्ट्रीय प्रौद्योगिकी संस्थान गोवा
                  </div>
                  <div className="navbar-institute-name-english">
                    National Institute of Technology Goa
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="navbar-main-navigation" style={{
          '--nav-scale': 1 - (scrollProgress * 0.1)
        }}>
          <div className="navbar-nav-content">
            <a href="/" className="navbar-nav-item">Home</a>
            
            {Object.entries(navigationData).map(([key, section]) => (
              <div 
                key={key}
                className="navbar-nav-item navbar-dropdown"
                onMouseEnter={() => handleMouseEnter(key)}
                onMouseLeave={handleMouseLeave}
              >
                <span>{section.name}</span>
                {openDropdown === key && (
                  <div className="navbar-dropdown-menu">
                    {section.items && typeof section.items === 'object' && !Array.isArray(section.items) 
                      ? Object.entries(section.items).map(([subKey, subItem]) => (
                          <div key={subKey} className="navbar-dropdown-item-with-submenu">
                            <div 
                              className="navbar-submenu-item"
                              onMouseEnter={() => handleSubmenuEnter(subKey)}
                              onMouseLeave={handleSubmenuLeave}
                            >
                              {subItem.name}
                              <span className="navbar-submenu-arrow">→</span>
                            </div>
                            {activeSubmenu === subKey && (
                              <div className="navbar-submenu">
                                {subItem.items.map((item, index) => (
                                  <a key={index} href={item.path}>{item.name}</a>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      : section.items?.map((item, index) => (
                          <a key={index} href={item.path}>{item.name}</a>
                        ))
                    }
                  </div>
                )}
              </div>
            ))}
            
            <a href="/about" className="navbar-nav-item">About</a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`navbar-mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`navbar-mobile-menu ${isMobileMenuClosing ? 'closing' : ''}`}>
            <div className="navbar-mobile-menu-header">
              <div className="navbar-mobile-language-selector">
                <LanguageSelector
                  currentLanguage={currentLanguage}
                  languages={languages}
                  isDropdownOpen={isMobileLanguageDropdownOpen}
                  onToggleDropdown={toggleMobileLanguageDropdown}
                  onLanguageChange={changeLanguage}
                  dropdownRef={mobileLanguageDropdownRef}
                  isMobile={true}
                />
              </div>
              <ThemeToggle />
              <button 
                className="navbar-mobile-close-btn"
                onClick={closeMobileMenu}
                aria-label="Close mobile menu"
              >
                ✕
              </button>
            </div>
            
            <div className="navbar-mobile-nav">
              <a href="/" onClick={() => handleMobileNavigation('/')}>Home</a>
              
              {Object.entries(navigationData).map(([key, section]) => (
                <div key={key} className="navbar-mobile-nav-item">
                  <div 
                    className="navbar-mobile-nav-header"
                    onClick={() => toggleMobileDropdown(key)}
                  >
                    <span>{section.name}</span>
                    <span className={`navbar-mobile-arrow ${mobileOpenDropdown === key ? 'open' : ''}`}>
                      ▼
                    </span>
                  </div>
                  
                  {mobileOpenDropdown === key && (
                    <div className="navbar-mobile-dropdown">
                      {section.items && typeof section.items === 'object' && !Array.isArray(section.items)
                        ? Object.entries(section.items).map(([subKey, subItem]) => (
                            <div key={subKey} className="navbar-mobile-submenu-item">
                              <div 
                                className="navbar-mobile-submenu-header"
                                onClick={() => toggleMobileNestedDropdown(subKey)}
                              >
                                <span>{subItem.name}</span>
                                <span className={`navbar-mobile-arrow ${mobileNestedDropdown === subKey ? 'open' : ''}`}>
                                  ▼
                                </span>
                              </div>
                              {mobileNestedDropdown === subKey && (
                                <div className="navbar-mobile-nested-dropdown">
                                  {subItem.items.map((item, index) => (
                                    <a 
                                      key={index} 
                                      href={item.path}
                                      onClick={() => handleMobileNavigation(item.path)}
                                    >
                                      {item.name}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        : section.items?.map((item, index) => (
                            <a 
                              key={index} 
                              href={item.path}
                              onClick={() => handleMobileNavigation(item.path)}
                            >
                              {item.name}
                            </a>
                          ))
                      }
                    </div>
                  )}
                </div>
              ))}
              
              <a href="/about" onClick={() => handleMobileNavigation('/about')}>About</a>
              
              {/* Mobile Auth Section */}
              <div className="navbar-mobile-auth">
                {isAuthenticated ? (
                  <>
                    <div className="navbar-mobile-user-info">
                      Welcome, {user?.displayName || user?.email || 'User'}
                    </div>
                    <a href="/profile" onClick={() => handleMobileNavigation('/profile')}>Profile</a>
                    <a href="/dashboard" onClick={() => handleMobileNavigation('/dashboard')}>Dashboard</a>
                    <button onClick={logout} className="navbar-mobile-logout-btn">Logout</button>
                  </>
                ) : (
                  <button onClick={openLoginModal} className="navbar-mobile-login-btn">
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Translation Confirmation Dialog */}
      <TranslationConfirmDialog
        isOpen={showTranslateConfirm}
        pendingTranslation={pendingTranslation}
        onConfirm={handleTranslateConfirm}
        onCancel={() => handleTranslateConfirm(false)}
      />
    </>
  );
};

export default Navbar;
