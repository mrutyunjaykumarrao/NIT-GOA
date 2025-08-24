import { useState, useCallback } from 'react';
import { useError } from '../contexts/ErrorContext';

/**
 * Custom hook for handling async operations with loading states and error handling
 * Integrates with your existing ErrorContext and Toast system
 */
const useAsyncOperation = () => {
  const [localLoading, setLocalLoading] = useState(false);
  const { addToast, setLoading: setGlobalLoading } = useError();

  const executeAsync = useCallback(async (
    asyncFunction,
    options = {}
  ) => {
    const {
      useGlobalLoading = false,
      showSuccessToast = false,
      successMessage = 'Operation completed successfully',
      showErrorToast = true,
      errorMessage = 'Operation failed',
      onSuccess,
      onError,
      finallyCallback
    } = options;

    try {
      // Set loading state
      if (useGlobalLoading) {
        setGlobalLoading(true);
      } else {
        setLocalLoading(true);
      }

      // Execute the async operation
      const result = await asyncFunction();

      // Show success toast if requested
      if (showSuccessToast) {
        addToast(successMessage, 'success', 3000);
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      console.error('Async operation error:', error);
      
      // Show error toast if requested
      if (showErrorToast) {
        const message = error.message || errorMessage;
        addToast(message, 'error', 5000);
      }

      // Call error callback if provided
      if (onError) {
        onError(error);
      }

      throw error; // Re-throw for caller to handle if needed
    } finally {
      // Clear loading states
      if (useGlobalLoading) {
        setGlobalLoading(false);
      } else {
        setLocalLoading(false);
      }

      // Call finally callback if provided
      if (finallyCallback) {
        finallyCallback();
      }
    }
  }, [addToast, setGlobalLoading]);

  return {
    loading: localLoading,
    executeAsync
  };
};

export default useAsyncOperation;
