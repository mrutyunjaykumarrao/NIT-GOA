# Error Handling System

This document describes the comprehensive error handling system implemented in the NIT GOA application.

## Overview

The error handling system provides:
- Custom error pages for different HTTP status codes
- Error boundary for catching React component errors
- Toast notifications for user feedback
- Utilities for handling API errors
- Context for global error state management

## Components

### Error Pages

#### ErrorPage404 (404 Not Found)
- **Route**: `/error/404` and catch-all `*`
- **Features**: Animated astronaut and planet theme
- **Use Case**: When a requested page/resource doesn't exist

#### ErrorPage403 (403 Forbidden)
- **Route**: `/error/403`
- **Features**: Lock animation with access denied message
- **Use Case**: When user lacks permission to access a resource

#### ErrorPage500 (500 Internal Server Error)
- **Route**: `/error/500`
- **Features**: Server rack with sparks animation
- **Use Case**: When server encounters an internal error

#### NetworkError
- **Route**: `/error/network`
- **Features**: Network signal animation
- **Use Case**: When network connectivity issues occur

#### ErrorBoundary
- **Purpose**: Catches JavaScript errors in component tree
- **Features**: 
  - Error details in development mode
  - Automatic error logging
  - Graceful fallback UI

### Error Context

The `ErrorContext` provides global error state management:

```javascript
import { useError } from '../contexts/ErrorContext';

const { 
  error,           // Current error state
  isLoading,       // Loading state
  toasts,          // Toast notifications
  setError,        // Set error
  clearError,      // Clear error
  addToast,        // Add toast notification
  handleAsync      // Handle async operations
} = useError();
```

### Toast Notifications

Real-time notifications for user feedback:
- Error toasts (red)
- Success toasts (green)
- Warning toasts (orange)
- Info toasts (blue)

## Usage Examples

### Basic Error Handling

```javascript
import { useError } from '../contexts/ErrorContext';
import { AppError, ErrorCodes } from '../utils/errorUtils';

const MyComponent = () => {
  const { handleAsync, addToast } = useError();

  const fetchData = async () => {
    try {
      await handleAsync(async () => {
        const response = await api.getData();
        return response.data;
      });
      addToast('Data loaded successfully!', 'success');
    } catch (error) {
      // Error is automatically handled by context
      console.log('Error occurred:', error.message);
    }
  };

  return (
    <button onClick={fetchData}>
      Load Data
    </button>
  );
};
```

### Manual Error Navigation

```javascript
import { useNavigate } from 'react-router-dom';
import { navigateToErrorPage, ErrorCodes } from '../utils/errorUtils';

const MyComponent = () => {
  const navigate = useNavigate();

  const handleUnauthorized = () => {
    navigateToErrorPage(navigate, ErrorCodes.FORBIDDEN);
  };

  const handleNotFound = () => {
    navigateToErrorPage(navigate, ErrorCodes.NOT_FOUND);
  };
};
```

### Custom Error Creation

```javascript
import { AppError, ErrorCodes } from '../utils/errorUtils';

// Create specific errors
const notFoundError = AppError.notFound('User not found');
const forbiddenError = AppError.forbidden('Access denied');
const serverError = AppError.serverError('Database connection failed');
const networkError = AppError.networkError('Connection timeout');

// Create from HTTP response
const httpError = AppError.fromHttpError(axiosError);
```

### Error Boundary Usage

The ErrorBoundary is already implemented at the app level, but you can add more granular boundaries:

```javascript
import { ErrorBoundary } from '../components/ErrorPages';

const MyComponent = () => (
  <ErrorBoundary>
    <SomeRiskyComponent />
  </ErrorBoundary>
);
```

## Error Types and Routes

| Error Code | Route | Component | Use Case |
|------------|-------|-----------|----------|
| 404 | `/error/404`, `*` | ErrorPage404 | Page not found |
| 403 | `/error/403` | ErrorPage403 | Access forbidden |
| 500 | `/error/500` | ErrorPage500 | Server error |
| Network | `/error/network` | NetworkError | Connection issues |
| JavaScript | N/A | ErrorBoundary | Component errors |

## Styling

All error pages use the shared `ErrorPages.css` stylesheet featuring:
- Responsive design
- Dark mode support
- Smooth animations
- Consistent branding
- Accessibility features

## API Integration

The error system integrates with your API calls:

```javascript
// In your API service
import { handleApiError } from '../utils/errorUtils';

const apiService = {
  async getData() {
    try {
      const response = await axios.get('/api/data');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};
```

## Best Practices

1. **Use the Error Context**: Always use `useError()` hook for error handling in components
2. **Show User-Friendly Messages**: Use toast notifications for immediate feedback
3. **Log Errors**: All errors are automatically logged in development
4. **Handle Network Errors**: Distinguish between server and network errors
5. **Provide Recovery Options**: Each error page offers multiple recovery paths
6. **Test Error Scenarios**: Regularly test error flows during development

## Development vs Production

- **Development**: Shows detailed error information and stack traces
- **Production**: Shows user-friendly messages and hides technical details
- **Logging**: Errors can be sent to external logging services in production

## Customization

### Adding New Error Types

1. Create new error component in `/components/ErrorPages/`
2. Add route in `App.js`
3. Update `errorUtils.js` with new error codes
4. Export from `/components/ErrorPages/index.js`

### Modifying Styles

Edit `/components/ErrorPages/ErrorPages.css` to customize:
- Colors and branding
- Animations
- Responsive breakpoints
- Dark mode themes

## Testing Error Pages

You can test error pages by navigating to:
- `/error/404` - 404 page
- `/error/403` - 403 page  
- `/error/500` - 500 page
- `/error/network` - Network error page
- `/nonexistent-page` - Triggers 404 catch-all

## Accessibility

Error pages include:
- Proper heading hierarchy
- Alt text for visual elements
- Keyboard navigation support
- Screen reader friendly content
- High contrast color schemes
