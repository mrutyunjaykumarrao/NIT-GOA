import React from 'react';
import { useError } from '../../contexts/ErrorContext';
import './Toast.css';

const Toast = () => {
  const { toasts, removeToast } = useError();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          onClick={() => removeToast(toast.id)}
        >
          <div className="toast-content">
            <div className="toast-icon">
              {toast.type === 'error' && '⚠️'}
              {toast.type === 'success' && '✅'}
              {toast.type === 'warning' && '⚠️'}
              {toast.type === 'info' && 'ℹ️'}
            </div>
            <div className="toast-message">{toast.message}</div>
            <button
              className="toast-close"
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
          <div className="toast-progress">
            <div 
              className="toast-progress-bar"
              style={{ 
                animation: toast.duration > 0 ? `progress ${toast.duration}ms linear` : 'none'
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
