/**
 * Centralized timezone utility for consistent time handling
 * 
 * STRATEGY:
 * - Store everything in UTC in the database
 * - Convert to IST only for display purposes
 * - All business logic works with UTC timestamps
 */

/**
 * Get current UTC timestamp
 * @returns {Date} Current UTC date
 */
function getUTCNow() {
  return new Date();
}

/**
 * Convert UTC date to IST for display
 * @param {Date|string} utcDate - UTC date to convert
 * @returns {Date} Date object in IST
 */
function utcToIST(utcDate) {
  const date = new Date(utcDate);
  // Create new date in IST timezone without modifying the original
  return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

/**
 * Convert IST date to UTC for storage
 * @param {Date|string} istDate - IST date to convert
 * @returns {Date} Date object in UTC
 */
function istToUTC(istDate) {
  const date = typeof istDate === 'string' ? new Date(istDate) : istDate;
  // If the date was created in IST context, convert to UTC
  const utcTime = date.getTime() - (5.5 * 60 * 60 * 1000);
  return new Date(utcTime);
}

/**
 * Format UTC date for database storage (always UTC)
 * @param {Date} utcDate - UTC date to format
 * @returns {string} MySQL-compatible datetime string
 */
function formatForStorage(utcDate = getUTCNow()) {
  return utcDate.toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * Parse database timestamp (always treat as UTC)
 * @param {string} timestamp - Database timestamp string
 * @returns {Date|null} UTC Date object
 */
function parseFromStorage(timestamp) {
  if (!timestamp) return null;
  
  // The database connection is set to UTC timezone, so timestamps are already in UTC
  // Simply parse as-is without any timezone conversion
  if (typeof timestamp === 'string') {
    // Handle both 'YYYY-MM-DD HH:mm:ss' and ISO string formats
    return timestamp.includes('T') ? new Date(timestamp) : new Date(timestamp + 'Z');
  }
  
  // If it's already a Date object, return as-is
  return new Date(timestamp);
}

/**
 * Format UTC date for IST display
 * @param {Date|string} utcDate - UTC date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted IST date string
 */
function formatForDisplay(utcDate, options = {}) {
  if (!utcDate) return '';
  
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
  
  return new Date(utcDate).toLocaleString('en-IN', { ...defaultOptions, ...options });
}

/**
 * Add duration to UTC date
 * @param {Date} utcDate - Base UTC date
 * @param {number} minutes - Minutes to add
 * @returns {Date} New UTC date
 */
function addMinutes(utcDate, minutes) {
  return new Date(utcDate.getTime() + (minutes * 60 * 1000));
}

/**
 * Get difference in minutes between two UTC dates
 * @param {Date} laterDate - Later UTC date
 * @param {Date} earlierDate - Earlier UTC date
 * @returns {number} Difference in minutes
 */
function getMinutesDifference(laterDate, earlierDate) {
  return Math.ceil((laterDate - earlierDate) / (1000 * 60));
}

/**
 * Get difference in seconds between two UTC dates
 * @param {Date} laterDate - Later UTC date
 * @param {Date} earlierDate - Earlier UTC date
 * @returns {number} Difference in seconds
 */
function getSecondsDifference(laterDate, earlierDate) {
  return Math.ceil((laterDate - earlierDate) / 1000);
}

/**
 * Check if current time is past given UTC timestamp
 * @param {Date|string} utcTimestamp - UTC timestamp to check against
 * @returns {boolean} True if current time is past the timestamp
 */
function isPast(utcTimestamp) {
  return getUTCNow() > new Date(utcTimestamp);
}

/**
 * Get IST timezone offset in minutes
 * @returns {number} Offset in minutes (330 for IST)
 */
function getISTOffset() {
  return 5.5 * 60; // 330 minutes
}

module.exports = {
  // Core functions
  getUTCNow,
  utcToIST,
  istToUTC,
  
  // Database operations
  formatForStorage,
  parseFromStorage,
  
  // Display operations
  formatForDisplay,
  
  // Utility functions
  addMinutes,
  getMinutesDifference,
  getSecondsDifference,
  isPast,
  getISTOffset
};
