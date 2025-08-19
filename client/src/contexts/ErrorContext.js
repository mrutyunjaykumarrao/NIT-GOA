import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AppError, ErrorCodes } from '../utils/errorUtils';

// Error Context
const ErrorContext = createContext();

// Error actions
const ERROR_ACTIONS = {
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST'
};

// Initial state
const initialState = {
  error: null,
  isLoading: false,
  toasts: []
};

// Error reducer
const errorReducer = (state, action) => {
  switch (action.type) {
    case ERROR_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case ERROR_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case ERROR_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case ERROR_ACTIONS.ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      };
    
    case ERROR_ACTIONS.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };
    
    default:
      return state;
  }
};

// Error Provider
export const ErrorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer, initialState);

  const setError = useCallback((error) => {
    const appError = error instanceof AppError ? error : AppError.fromHttpError(error);
    dispatch({ type: ERROR_ACTIONS.SET_ERROR, payload: appError });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ERROR_ACTIONS.CLEAR_ERROR });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: ERROR_ACTIONS.SET_LOADING, payload: loading });
  }, []);

  const addToast = useCallback((message, type = 'error', duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    dispatch({ type: ERROR_ACTIONS.ADD_TOAST, payload: toast });
    
    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: ERROR_ACTIONS.REMOVE_TOAST, payload: id });
      }, duration);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: ERROR_ACTIONS.REMOVE_TOAST, payload: id });
  }, []);

  const handleAsync = useCallback(async (asyncFunction, options = {}) => {
    const { showLoading = true, showToastOnError = false } = options;
    
    try {
      if (showLoading) setLoading(true);
      clearError();
      
      const result = await asyncFunction();
      return result;
    } catch (error) {
      const appError = error instanceof AppError ? error : AppError.fromHttpError(error);
      
      if (showToastOnError) {
        addToast(appError.message, 'error');
      } else {
        setError(appError);
      }
      
      throw appError;
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [setLoading, clearError, setError, addToast]);

  const value = {
    ...state,
    setError,
    clearError,
    setLoading,
    addToast,
    removeToast,
    handleAsync
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

// Custom hook to use error context
export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

// HOC for error handling
export const withErrorHandler = (Component) => {
  return function WithErrorHandlerComponent(props) {
    const errorContext = useError();
    return <Component {...props} errorHandler={errorContext} />;
  };
};

export default ErrorContext;
