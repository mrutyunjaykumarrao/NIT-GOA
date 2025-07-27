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

  // Clear translation data
  const clearTranslationData = useCallback(() => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
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
      console.log('English selected - clearing all translation and cache');
      clearTranslationData();
      const baseUrl = getBaseUrl();
      window.history.replaceState(null, null, baseUrl);
      window.location.href = baseUrl;
      setTimeout(() => window.location.reload(), 100);
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
      console.log('English selected - clearing any existing translations');
      try {
        const currentHash = window.location.hash;
        if (currentHash.includes('googtrans')) {
          const baseUrl = getBaseUrl();
          window.history.replaceState(null, null, baseUrl);
        }
        clearTranslationData();
      } catch (error) {
        console.error('Error clearing English translation:', error);
      }
    } else {
      try {
        translatePage(languageCode);
      } catch (error) {
        console.error('Translation error:', error);
      }
    }
  }, [currentLanguage, translatePage, getBaseUrl, clearTranslationData]);

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    console.log('Saved language from cache:', savedLanguage);
    
    if (!savedLanguage) {
      setCurrentLanguage('en');
      return;
    }
    
    if (savedLanguage === 'en') {
      setCurrentLanguage('en');
      return;
    }
    
    setCurrentLanguage(savedLanguage);
  }, []);

  // Monitor URL hash changes
  useEffect(() => {
    let isProcessingHashChange = false;
    
    const handleHashChange = () => {
      if (isProcessingHashChange) return;
      isProcessingHashChange = true;
      
      setTimeout(() => {
        const hash = window.location.hash;
        const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        
        if (hash.includes('googtrans')) {
          const match = hash.match(/googtrans\(en\|(\w+)\)/);
          if (match && match[1]) {
            const detectedLang = match[1];
            if (detectedLang !== currentLanguage && 
                languages.some(lang => lang.code === detectedLang) && 
                savedLanguage !== 'en') {
              console.log('URL hash language detected:', detectedLang);
              setCurrentLanguage(detectedLang);
              localStorage.setItem(LANGUAGE_STORAGE_KEY, detectedLang);
            }
          }
        } else {
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
