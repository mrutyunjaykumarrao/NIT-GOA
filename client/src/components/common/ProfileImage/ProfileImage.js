import React, { useState } from 'react';
import './ProfileImage.css';

/**
 * Standardized Profile Image Component
 * 
 * Features:
 * - Consistent avatar styling across all staff sections
 * - Fallback avatar with initials and color-coded background
 * - Proper image loading states and error handling
 * - Responsive sizing and theming support
 * - Optimized image path handling
 */

const ProfileImage = ({ 
  staff, 
  size = 100, 
  className = '', 
  showLoadingState = true,
  borderRadius = '50%'
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get staff name for fallback avatar
  const getStaffName = (staff) => {
    if (!staff) return 'Staff';
    if (staff.full_name) return staff.full_name;
    if (staff.first_name && staff.last_name) {
      return `${staff.first_name} ${staff.last_name}`;
    }
    if (staff.first_name) return staff.first_name;
    if (staff.last_name) return staff.last_name;
    if (staff.name) return staff.name;
    return 'Staff';
  };

  // Generate initials from name
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Generate consistent color based on name
  const getAvatarColor = (name) => {
    if (!name) return '#6B7280';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      '#EF4444', '#F97316', '#F59E0B', '#10B981', 
      '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899',
      '#84CC16', '#06B6D4', '#6366F1', '#D946EF'
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  // Standardized image path handling
  const getImagePath = (imagePath) => {
    if (!imagePath) return null;
    
    // Handle absolute URLs
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Handle relative paths
    if (imagePath.startsWith('images/')) {
      return `${process.env.PUBLIC_URL}/${imagePath}`;
    }
    
    // Handle paths starting with /
    if (imagePath.startsWith('/')) {
      return `${process.env.PUBLIC_URL}${imagePath}`;
    }
    
    // Default handling with PUBLIC_URL
    return `${process.env.PUBLIC_URL}/${imagePath.replace(/^\/+/, '')}`;
  };

  const handleImageError = (e) => {
    console.log('🚨 IMAGE LOAD ERROR:', {
      staffName: getStaffName(staff),
      originalImageUrl: staff?.image_url || staff?.image,
      processedImageSrc: imageSrc,
      errorEvent: e
    });
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    console.log('✅ IMAGE LOAD SUCCESS:', {
      staffName: getStaffName(staff),
      originalImageUrl: staff?.image_url || staff?.image,
      processedImageSrc: imageSrc
    });
    setImageLoaded(true);
    setImageError(false);
  };

  const staffName = getStaffName(staff);
  const imageSrc = getImagePath(staff?.image_url || staff?.image);
  const initials = getInitials(staffName);
  const avatarColor = getAvatarColor(staffName);

  // Debug logging for troubleshooting 
  if (process.env.NODE_ENV === 'development') {
    console.log('ProfileImage Debug:', {
      staffName,
      originalImageUrl: staff?.image_url || staff?.image,
      processedImageSrc: imageSrc,
      initials,
      avatarColor,
      imageLoaded,
      imageError
    });
  }

  // Fallback Avatar Component
  const FallbackAvatar = () => (
    <div
      className={`profile-image-fallback ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius,
        backgroundColor: avatarColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: Math.max(Math.min(size * 0.4, 18), 12),
        fontWeight: '600',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        flexShrink: 0,
        userSelect: 'none'
      }}
      title={staffName}
    >
      {initials}
    </div>
  );

  // If no image URL, show fallback
  if (!imageSrc) {
    return <FallbackAvatar />;
  }

  // Always try to show the image first, fallback will be handled by onError
  return (
    <div 
      className={`profile-image-container ${className}`}
      style={{ 
        position: 'relative', 
        width: size, 
        height: size,
        flexShrink: 0
      }}
    >
      {/* Show fallback only if image failed to load */}
      {imageError && <FallbackAvatar />}
      
      {/* Actual image - always try to display */}
      <img
        src={imageSrc}
        alt={`${staffName} profile`}
        className={`profile-image ${imageLoaded && !imageError ? 'loaded' : 'loading'}`}
        style={{ 
          display: imageError ? 'none' : 'block',
          width: size,
          height: size,
          borderRadius,
          objectFit: 'cover',
          position: imageError ? 'absolute' : 'static',
          top: 0,
          left: 0,
          border: '2px solid transparent',
          transition: 'all 0.2s ease-in-out'
        }}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default ProfileImage;
