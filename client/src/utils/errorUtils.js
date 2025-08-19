// Error handling utilities
export const ErrorCodes = {
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  SERVICE_UNAVAILABLE: 503,
  NETWORK_ERROR: 'NETWORK_ERROR'
};

export const ErrorMessages = {
  [ErrorCodes.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorCodes.FORBIDDEN]: 'You do not have permission to access this resource.',
  [ErrorCodes.INTERNAL_SERVER_ERROR]: 'An internal server error occurred.',
  [ErrorCodes.BAD_REQUEST]: 'The request was invalid or malformed.',
  [ErrorCodes.UNAUTHORIZED]: 'You must be logged in to access this resource.',
  [ErrorCodes.SERVICE_UNAVAILABLE]: 'The service is temporarily unavailable.',
  [ErrorCodes.NETWORK_ERROR]: 'A network error occurred. Please check your connection.'
};

export class AppError extends Error {
  constructor(message, code, originalError = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }

  static fromHttpError(error) {
    if (error.response) {
      const { status, statusText, data } = error.response;
      const message = data?.message || ErrorMessages[status] || statusText || 'An error occurred';
      return new AppError(message, status, error);
    }
    
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      return new AppError(ErrorMessages[ErrorCodes.NETWORK_ERROR], ErrorCodes.NETWORK_ERROR, error);
    }
    
    return new AppError(error.message || 'An unknown error occurred', 'UNKNOWN', error);
  }

  static notFound(message = ErrorMessages[ErrorCodes.NOT_FOUND]) {
    return new AppError(message, ErrorCodes.NOT_FOUND);
  }

  static forbidden(message = ErrorMessages[ErrorCodes.FORBIDDEN]) {
    return new AppError(message, ErrorCodes.FORBIDDEN);
  }

  static serverError(message = ErrorMessages[ErrorCodes.INTERNAL_SERVER_ERROR]) {
    return new AppError(message, ErrorCodes.INTERNAL_SERVER_ERROR);
  }

  static networkError(message = ErrorMessages[ErrorCodes.NETWORK_ERROR]) {
    return new AppError(message, ErrorCodes.NETWORK_ERROR);
  }

  isNetworkError() {
    return this.code === ErrorCodes.NETWORK_ERROR;
  }

  isClientError() {
    return this.code >= 400 && this.code < 500;
  }

  isServerError() {
    return this.code >= 500 && this.code < 600;
  }
}

export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  // Log to error reporting service in production
  if (process.env.NODE_ENV === 'production') {
    // logErrorToService(error);
  }
  
  return AppError.fromHttpError(error);
};

export const navigateToErrorPage = (navigate, errorCode) => {
  const errorRoutes = {
    [ErrorCodes.NOT_FOUND]: '/error/404',
    [ErrorCodes.FORBIDDEN]: '/error/403',
    [ErrorCodes.INTERNAL_SERVER_ERROR]: '/error/500',
    [ErrorCodes.NETWORK_ERROR]: '/error/network'
  };

  const route = errorRoutes[errorCode] || '/error/404';
  navigate(route);
};

export default {
  ErrorCodes,
  ErrorMessages,
  AppError,
  handleApiError,
  navigateToErrorPage
};
