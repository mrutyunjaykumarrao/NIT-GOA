import React from 'react';

const FallbackAvatar = ({ name = 'User', size = 40, className = '' }) => {
  // Get initials from name
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const names = fullName.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Generate a consistent color based on name
  const getColor = (name) => {
    if (!name) return '#6B7280';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      '#EF4444', '#F97316', '#F59E0B', '#10B981', 
      '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials(name);
  const backgroundColor = getColor(name);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={`fallback-avatar ${className}`}
      style={{ backgroundColor, borderRadius: '50%' }}
    >
      <rect width="40" height="40" fill={backgroundColor} rx="20" />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="600"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
};

export default FallbackAvatar;
