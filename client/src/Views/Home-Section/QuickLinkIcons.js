import React from 'react';

// Custom SVG Icons for Quick Links
export const QuickLinkIcons = {
  // Departments Icon
  Departments: () => (
    <svg viewBox="0 0 64 64" className="quick-link-svg">
      <defs>
        <linearGradient id="departmentsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2E86C1" />
          <stop offset="100%" stopColor="#5DADE2" />
        </linearGradient>
      </defs>
      <path 
        d="M8 16h48v4H8v-4zm0 8h48v4H8v-4zm0 8h48v4H8v-4zm0 8h48v4H8v-4zm0 8h48v4H8v-4z" 
        fill="url(#departmentsGrad)"
      />
      <circle cx="12" cy="18" r="1.5" fill="#1B4F72" />
      <circle cx="12" cy="26" r="1.5" fill="#1B4F72" />
      <circle cx="12" cy="34" r="1.5" fill="#1B4F72" />
      <circle cx="12" cy="42" r="1.5" fill="#1B4F72" />
      <circle cx="12" cy="50" r="1.5" fill="#1B4F72" />
    </svg>
  ),

  // MIS Portal Icon
  MISPortal: () => (
    <svg viewBox="0 0 64 64" className="quick-link-svg">
      <defs>
        <linearGradient id="misGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#FF8A65" />
        </linearGradient>
      </defs>
      <rect x="8" y="12" width="48" height="36" rx="4" fill="url(#misGrad)" />
      <rect x="12" y="16" width="40" height="4" rx="2" fill="#fff" opacity="0.9" />
      <rect x="12" y="24" width="24" height="2" rx="1" fill="#fff" opacity="0.7" />
      <rect x="12" y="28" width="32" height="2" rx="1" fill="#fff" opacity="0.7" />
      <rect x="12" y="32" width="20" height="2" rx="1" fill="#fff" opacity="0.7" />
      <circle cx="44" cy="36" r="6" fill="#fff" opacity="0.2" />
      <path d="M41 36l2 2 4-4" stroke="#1B4F72" strokeWidth="2" fill="none" />
    </svg>
  ),

  // Research Icon
  Research: () => (
    <svg viewBox="0 0 64 64" className="quick-link-svg">
      <defs>
        <linearGradient id="researchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#28A745" />
          <stop offset="100%" stopColor="#6BCF7F" />
        </linearGradient>
      </defs>
      <circle cx="26" cy="26" r="14" fill="none" stroke="url(#researchGrad)" strokeWidth="4" />
      <path d="m46 46-10-10" stroke="url(#researchGrad)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="26" cy="26" r="8" fill="url(#researchGrad)" opacity="0.3" />
      <path d="M22 26h8M26 22v8" stroke="#1B4F72" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // Tenders Icon
  Tenders: () => (
    <svg viewBox="0 0 64 64" className="quick-link-svg">
      <defs>
        <linearGradient id="tendersGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DC3545" />
          <stop offset="100%" stopColor="#FF6B6B" />
        </linearGradient>
      </defs>
      <rect x="12" y="16" width="40" height="32" rx="2" fill="url(#tendersGrad)" />
      <rect x="16" y="20" width="32" height="3" rx="1.5" fill="#fff" opacity="0.9" />
      <rect x="16" y="26" width="24" height="2" rx="1" fill="#fff" opacity="0.7" />
      <rect x="16" y="30" width="28" height="2" rx="1" fill="#fff" opacity="0.7" />
      <rect x="16" y="34" width="20" height="2" rx="1" fill="#fff" opacity="0.7" />
      <path d="M44 38v6l-4-2-4 2v-6" fill="#fff" opacity="0.8" />
    </svg>
  ),

  // Training & Placements Icon
  TNP: () => (
    <svg viewBox="0 0 64 64" className="quick-link-svg">
      <defs>
        <linearGradient id="tnpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6F42C1" />
          <stop offset="100%" stopColor="#9A73D8" />
        </linearGradient>
      </defs>
      <path d="M32 12l20 12v24l-20 12-20-12V24l20-12z" fill="url(#tnpGrad)" />
      <path d="M32 12v36" stroke="#fff" strokeWidth="2" opacity="0.8" />
      <path d="M12 24l20 12 20-12" stroke="#fff" strokeWidth="2" opacity="0.8" />
      <circle cx="32" cy="30" r="4" fill="#fff" opacity="0.9" />
      <path d="M29 30l2 2 4-4" stroke="#1B4F72" strokeWidth="1.5" fill="none" />
    </svg>
  ),

  // Contact Us Icon
  Contact: () => (
    <svg viewBox="0 0 64 64" className="quick-link-svg">
      <defs>
        <linearGradient id="contactGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#17A2B8" />
          <stop offset="100%" stopColor="#4DD0E7" />
        </linearGradient>
      </defs>
      <rect x="8" y="18" width="48" height="30" rx="4" fill="url(#contactGrad)" />
      <path d="m8 22 24 16 24-16" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="3" fill="#fff" opacity="0.9" />
      <path d="M26 26l12 12M38 26L26 38" stroke="#1B4F72" strokeWidth="1" opacity="0.5" />
    </svg>
  )
};

export default QuickLinkIcons;
