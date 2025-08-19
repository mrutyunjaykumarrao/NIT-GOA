import { useState, useCallback } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((error) => {
    console.error('Error handled:', error);
    setError(error);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleAsync = useCallback(async (asyncFunction) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await asyncFunction();
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getErrorType = useCallback((error) => {
    if (!error) return null;
    
    if (error.response) {
      switch (error.response.status) {
        case 404:
          return 'NOT_FOUND';
        case 403:
          return 'FORBIDDEN';
        case 500:
          return 'SERVER_ERROR';
        case 502:
        case 503:
        case 504:
          return 'SERVER_ERROR';
        default:
          return 'UNKNOWN';
      }
    }
    
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      return 'NETWORK_ERROR';
    }
    
    return 'UNKNOWN';
  }, []);

  return {
    error,
    isLoading,
    handleError,
    clearError,
    handleAsync,
    getErrorType
  };
};

export default useErrorHandler;
