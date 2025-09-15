import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import TranslationConfirmDialog from '../../components/TranslationConfirmDialog/TranslationConfirmDialog';
import ThemeToggle from '../../Views/ThemeToggle/ThemeToggle';
import ProfileDropdown from '../../components/ProfileDropdown/ProfileDropdown';
import { useGoogleTranslate } from '../../hooks/useGoogleTranslate';
import './AdminLayout.css';

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const {
    currentLanguage,
    languages,
    showTranslateConfirm,
    pendingTranslation,
    handleTranslateConfirm,
    changeLanguage
  } = useGoogleTranslate();
  const navigate = useNavigate();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = React.useState(false);
  const [forceRender, setForceRender] = React.useState(0);
  const languageDropdownRef = React.useRef(null);

  const handleTabClick = (tab) => {
    if (tab === 'home') {
      navigate('/');
    } else {
      setActiveTab(tab);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="admin-layout">
      {/* Admin Header */}
      <header className="admin-layout-header">
        <div className="admin-layout-header-content">
          {/* Left side - Logo and Title */}
          <div className="admin-layout-left">
            <div className="admin-layout-logo-section">
              <img 
                src="/NIT_LOGO.png" 
                alt="NIT Goa Logo" 
                className="admin-layout-logo"
              />
              <div className="admin-layout-title-section">
                <h1>Admin Dashboard</h1>
                <span className="admin-layout-subtitle">National Institute of Technology Goa</span>
              </div>
            </div>
          </div>

          {/* Right side - Controls and User */}
          <div className="admin-layout-right">
            {/* Language Selector */}
            <LanguageSelector
              currentLanguage={currentLanguage}
              languages={languages}
              isDropdownOpen={isLanguageDropdownOpen}
              onToggleDropdown={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              onLanguageChange={(languageCode) => {
                setIsLanguageDropdownOpen(false);
                changeLanguage(languageCode);
                // Force re-render of admin content after language change
                setTimeout(() => {
                  setForceRender(prev => prev + 1);
                  // Trigger Google Translate if available
                  if (window.google && window.google.translate && window.google.translate.TranslateElement) {
                    try {
                      window.location.reload();
                    } catch (e) {
                      console.log('Auto-refresh not needed');
                    }
                  }
                }, 100);
              }}
              dropdownRef={languageDropdownRef}
            />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile Dropdown */}
            <div className="admin-profile-section">
              <ProfileDropdown />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-layout-nav-container">
          <div className="admin-layout-nav-content">
            <div className="admin-layout-nav-tabs">
              <button 
                className={`admin-layout-nav-tab ${activeTab === 'home' ? 'admin-layout-nav-tab--active' : ''}`}
                onClick={() => handleTabClick('home')}
              >
                <i className="fas fa-home"></i>
                <span>Home</span>
              </button>
              <button 
                className={`admin-layout-nav-tab ${activeTab === 'analytics' ? 'admin-layout-nav-tab--active' : ''}`}
                onClick={() => handleTabClick('analytics')}
              >
                <i className="fas fa-chart-line"></i>
                <span>Analytics</span>
              </button>
              <button 
                className={`admin-layout-nav-tab ${activeTab === 'account-management' ? 'admin-layout-nav-tab--active' : ''}`}
                onClick={() => handleTabClick('account-management')}
              >
                <i className="fas fa-user-cog"></i>
                <span>Account Management</span>
              </button>
              <button 
                className={`admin-layout-nav-tab ${activeTab === 'faculty' ? 'admin-layout-nav-tab--active' : ''}`}
                onClick={() => handleTabClick('faculty')}
              >
                <i className="fas fa-graduation-cap"></i>
                <span>Faculty</span>
              </button>
              <button 
                className={`admin-layout-nav-tab ${activeTab === 'technical-staff' ? 'admin-layout-nav-tab--active' : ''}`}
                onClick={() => handleTabClick('technical-staff')}
              >
                <i className="fas fa-cogs"></i>
                <span>Technical Staff</span>
              </button>
              <button 
                className={`admin-layout-nav-tab ${activeTab === 'administrative-staff' ? 'admin-layout-nav-tab--active' : ''}`}
                onClick={() => handleTabClick('administrative-staff')}
              >
                <i className="fas fa-briefcase"></i>
                <span>Administrative Staff</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-layout-main" key={`admin-content-${currentLanguage}-${forceRender}`}>
        {children}
      </main>
      
      {/* Translation Confirmation Dialog */}
      <TranslationConfirmDialog
        isOpen={showTranslateConfirm}
        onConfirm={handleTranslateConfirm}
        onCancel={() => {}}
        targetLanguage={pendingTranslation}
        languages={languages}
      />
    </div>
  );
};

export default AdminLayout;
