import { useState, useEffect, useCallback, useMemo } from 'react';

// Constants
const LANGUAGE_STORAGE_KEY = 'preferred-language';
const GOOGLE_TRANSLATE_COOKIE = 'googtrans';

export const useGoogleTranslate = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showTranslateConfirm, setShowTranslateConfirm] = useState(false);
  const [pendingTranslation, setPendingTranslation] = useState(null);

  // Language configuration
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
  const getCurrentLanguage = useCallback(() => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  }, [languages, currentLanguage]);

  // Clear translation data completely - Enhanced version
  const clearTranslationData = useCallback(() => {
    console.log('Performing comprehensive translation data clearing');
    
    // Clear localStorage
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    
    // Clear all possible Google Translate cookies with multiple domain variations
    const cookiesToClear = [
      'googtrans',
      'googtrans=/en/en',
      'googtrans=/auto/en',
      'googtrans=',
      '__Secure-3PSID',
      '__Secure-3PAPISID',
      '__Secure-3PSIDCC'
    ];
    
    cookiesToClear.forEach(cookieName => {
      // Clear for current domain
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${window.location.hostname}`;
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.${window.location.hostname}`;
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      
      // Clear for Google domains
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.google.com`;
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=translate.google.com`;
    });
    
    // Clear localStorage and sessionStorage comprehensively
    try {
      if (typeof(Storage) !== "undefined") {
        // Clear all storage items that might contain Google Translate data
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('googtrans') || key.includes('translate') || key.includes('goog'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Clear sessionStorage as well
        const sessionKeysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && (key.includes('googtrans') || key.includes('translate') || key.includes('goog'))) {
            sessionKeysToRemove.push(key);
          }
        }
        sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
      }
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    
    // Clear any window variables that might persist
    if (window.google && window.google.translate) {
      try {
        // Reset any Google Translate state
        delete window.googleTranslateInitialized;
        delete window.googleTranslateReady;
      } catch (error) {
        console.log('Error clearing Google Translate variables:', error);
      }
    }
    
    // Remove any Google Translate elements from DOM
    try {
      const elementsToRemove = document.querySelectorAll('[class*="goog-te"], [id*="goog"], .skiptranslate');
      elementsToRemove.forEach(el => {
        if (el && el.parentNode && el.id !== 'google_translate_element') {
          el.parentNode.removeChild(el);
        }
      });
    } catch (e) {
      console.warn('Could not remove Google Translate elements:', e);
    }
    
    console.log('Translation data clearing completed');
  }, []);

  // Set translation cookie
  const setTranslationCookie = useCallback((targetLang) => {
    document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=/en/${targetLang}; path=/; max-age=86400`;
  }, []);

  // Get base URL
  const getBaseUrl = useCallback(() => {
    return window.location.href.split('#')[0].split('?')[0];
  }, []);

  // Navigate to translated page
  const navigateToTranslatedPage = useCallback((targetLang) => {
    const baseUrl = getBaseUrl();
    const translateHash = `#googtrans(en|${targetLang})`;
    const newUrl = baseUrl + translateHash;
    
    window.history.replaceState(null, null, newUrl);
    window.location.href = newUrl;
    
    // Fallback reload
    setTimeout(() => window.location.reload(), 100);
  }, [getBaseUrl]);

  // Initialize Google Translate
  const initializeGoogleTranslate = useCallback(() => {
    if (window.googleTranslateReady) {
      console.log('Google Translate is ready');
      return;
    }

    if (window.google && window.google.translate && !window.googleTranslateInitialized) {
      console.log('Google Translate available, initializing...');
      setTimeout(() => {
        try {
          const selectElement = document.querySelector('#google_translate_element select');
          console.log('Translation select element found:', !!selectElement);
          if (selectElement) {
            console.log('Available language options:', 
              Array.from(selectElement.options).map(opt => ({ value: opt.value, text: opt.text }))
            );
          }
        } catch (error) {
          console.error('Error checking Google Translate widget:', error);
        }
      }, 3000);
    } else {
      setTimeout(initializeGoogleTranslate, 500);
    }
  }, []);

  // Translate page
  const translatePage = useCallback((targetLang) => {
    console.log('translatePage called with:', targetLang);
    
    const selectedLanguage = languages.find(lang => lang.code === targetLang);
    const languageName = selectedLanguage ? selectedLanguage.name : targetLang;
    
    const translationData = {
      targetLang,
      languageName,
      isEnglish: targetLang === 'en'
    };
    
    console.log('Setting pending translation:', translationData);
    setPendingTranslation(translationData);
    setShowTranslateConfirm(true);
  }, [languages]);

  // Handle translation confirmation
  const handleTranslateConfirm = useCallback((confirmed) => {
    console.log('handleTranslateConfirm called with:', confirmed);
    setShowTranslateConfirm(false);
    
    if (!confirmed || !pendingTranslation) {
      setPendingTranslation(null);
      return;
    }

    const { targetLang, isEnglish } = pendingTranslation;
    
    if (isEnglish) {
      console.log('English confirmed - completely clearing all translation and cache');
      
      // Clear all translation data thoroughly
      clearTranslationData();
      
      // Get clean base URL
      const baseUrl = getBaseUrl();
      console.log('Navigating to clean English URL:', baseUrl);
      
      // Clear URL state and navigate to clean page
      window.history.replaceState(null, null, baseUrl);
      
      // Force a complete reload to ensure clean state
      console.log('Forcing complete page replacement to:', baseUrl);
      window.location.replace(baseUrl);
      
    } else {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, targetLang);
      setCurrentLanguage(targetLang);
      setTranslationCookie(targetLang);
      navigateToTranslatedPage(targetLang);
    }
    
    setPendingTranslation(null);
  }, [pendingTranslation, clearTranslationData, getBaseUrl, setTranslationCookie, navigateToTranslatedPage]);

  // Change language handler
  const changeLanguage = useCallback((languageCode) => {
    if (languageCode === currentLanguage) return;
    
    console.log(`Language change from ${currentLanguage} to: ${languageCode}`);
    setCurrentLanguage(languageCode);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    
    if (languageCode === 'en') {
      console.log('English selected - completely clearing all translations and cache');
      try {
        // Clear all translation data first
        clearTranslationData();
        
        // Clear URL hash if it contains translation data
        const currentHash = window.location.hash;
        const baseUrl = getBaseUrl();
        if (currentHash.includes('googtrans') || currentHash.includes('#')) {
          window.history.replaceState(null, null, baseUrl);
        }
        
        // Force refresh to clean slate
        console.log('Forcing refresh to clean English page:', baseUrl);
        
        // Use location.replace for a clean reload without history
        setTimeout(() => {
          window.location.replace(baseUrl);
        }, 100);
        
      } catch (error) {
        console.error('Error clearing English translation:', error);
        // Fallback: force a simple reload
        window.location.reload();
      }
    } else {
      try {
        translatePage(languageCode);
      } catch (error) {
        console.error('Translation error:', error);
      }
    }
  }, [currentLanguage, translatePage, getBaseUrl, clearTranslationData]);

  // Load saved language preference with English protection
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    console.log('Saved language from cache:', savedLanguage);
    
    if (!savedLanguage) {
      console.log('No saved language, defaulting to English');
      setCurrentLanguage('en');
      return;
    }
    
    if (savedLanguage === 'en') {
      console.log('Saved language is English, ensuring clean state');
      setCurrentLanguage('en');
      // Ensure any unwanted translation artifacts are cleared
      const currentHash = window.location.hash;
      if (currentHash.includes('googtrans')) {
        const baseUrl = getBaseUrl();
        window.history.replaceState(null, null, baseUrl);
      }
      return;
    }
    
    setCurrentLanguage(savedLanguage);
  }, [getBaseUrl]);

  // Monitor URL hash changes with strong English protection
  useEffect(() => {
    let isProcessingHashChange = false;
    
    const handleHashChange = () => {
      if (isProcessingHashChange) return;
      isProcessingHashChange = true;
      
      setTimeout(() => {
        const hash = window.location.hash;
        const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        
        // If user explicitly chose English, ignore any translation hashes
        if (savedLanguage === 'en') {
          if (hash.includes('googtrans')) {
            console.log('User chose English - removing unwanted translation hash');
            const baseUrl = getBaseUrl();
            window.history.replaceState(null, null, baseUrl);
          }
          isProcessingHashChange = false;
          return;
        }
        
        if (hash.includes('googtrans')) {
          const match = hash.match(/googtrans\(en\|(\w+)\)/);
          if (match && match[1]) {
            const detectedLang = match[1];
            
            // Only apply if it's a valid language and user didn't explicitly choose English
            if (detectedLang !== currentLanguage && 
                languages.some(lang => lang.code === detectedLang)) {
              console.log('URL hash language detected:', detectedLang);
              setCurrentLanguage(detectedLang);
              localStorage.setItem(LANGUAGE_STORAGE_KEY, detectedLang);
            }
          }
        } else {
          // No translation hash - only reset if not explicitly English
          if (currentLanguage !== 'en' && savedLanguage !== 'en') {
            console.log('No translation hash, resetting to English');
            setCurrentLanguage('en');
            localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
          }
        }
        
        isProcessingHashChange = false;
      }, 100);
    };

    window.addEventListener('hashchange', handleHashChange);
    
    const initialSavedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (initialSavedLang !== 'en') {
      handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentLanguage, languages]);

  // Initialize Google Translate
  useEffect(() => {
    initializeGoogleTranslate();
  }, [initializeGoogleTranslate]);

  return {
    currentLanguage,
    languages,
    showTranslateConfirm,
    pendingTranslation,
    translatePage,
    handleTranslateConfirm,
    changeLanguage,
    getCurrentLanguage
  };
};
