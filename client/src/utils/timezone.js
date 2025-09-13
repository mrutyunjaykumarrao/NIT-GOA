/**
 * Frontend timezone utilities for consistent time display
 * All times are received from the server as UTC and displayed in IST
 */

/**
 * Format UTC timestamp for display in IST
 * @param {string|Date} utcTimestamp - UTC timestamp from server
 * @param {Object} options - Display options
 * @returns {string} Formatted IST time string
 */
export const formatDateTimeIST = (utcTimestamp, options = {}) => {
  if (!utcTimestamp) return 'Never';
  
  const defaultOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  
  return new Date(utcTimestamp).toLocaleString('en-IN', { ...defaultOptions, ...options });
};

/**
 * Format UTC date for display in IST (date only)
 * @param {string|Date} utcTimestamp - UTC timestamp from server
 * @returns {string} Formatted IST date string
 */
export const formatDateIST = (utcTimestamp) => {
  if (!utcTimestamp) return 'Never';
  
  return new Date(utcTimestamp).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Format UTC time for display in IST (time only)
 * @param {string|Date} utcTimestamp - UTC timestamp from server
 * @returns {string} Formatted IST time string
 */
export const formatTimeIST = (utcTimestamp) => {
  if (!utcTimestamp) return 'Never';
  
  return new Date(utcTimestamp).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

/**
 * Get relative time from UTC timestamp (e.g., "2 hours ago")
 * @param {string|Date} utcTimestamp - UTC timestamp from server
 * @returns {string} Relative time string
 */
export const getRelativeTime = (utcTimestamp) => {
  if (!utcTimestamp) return 'Never';
  
  const now = new Date();
  const date = new Date(utcTimestamp);
  const diffMs = now - date;
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return formatDateIST(utcTimestamp);
};

/**
 * Convert current browser time to UTC for sending to server
 * @param {Date} localDate - Local date from browser
 * @returns {string} UTC ISO string
 */
export const localToUTC = (localDate = new Date()) => {
  return localDate.toISOString();
};

/**
 * Get current time in UTC for sending to server
 * @returns {string} Current UTC time as ISO string
 */
export const getCurrentUTC = () => {
  return new Date().toISOString();
};

/**
 * Check if a UTC timestamp is in the past
 * @param {string|Date} utcTimestamp - UTC timestamp to check
 * @returns {boolean} True if timestamp is in the past
 */
export const isPast = (utcTimestamp) => {
  if (!utcTimestamp) return false;
  return new Date() > new Date(utcTimestamp);
};

/**
 * Get time remaining until a future UTC timestamp
 * @param {string|Date} utcTimestamp - Future UTC timestamp
 * @returns {Object} Object with days, hours, minutes, seconds remaining
 */
export const getTimeRemaining = (utcTimestamp) => {
  if (!utcTimestamp) return null;
  
  const now = new Date();
  const target = new Date(utcTimestamp);
  const diffMs = target - now;
  
  if (diffMs <= 0) return null;
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
};

/**
 * Format time remaining as a human-readable string
 * @param {string|Date} utcTimestamp - Future UTC timestamp
 * @returns {string} Human-readable time remaining
 */
export const formatTimeRemaining = (utcTimestamp) => {
  const remaining = getTimeRemaining(utcTimestamp);
  if (!remaining) return 'Expired';
  
  const { days, hours, minutes, seconds } = remaining;
  
  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  if (minutes > 0) return `${minutes}m ${seconds}s remaining`;
  return `${seconds}s remaining`;
};
