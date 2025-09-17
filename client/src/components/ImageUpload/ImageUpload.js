import React, { useState, useRef, useEffect } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ 
  currentImage = null, 
  onImageSelect, 
  maxSizeKB = 5120, // 5MB default
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  disabled = false,
  fallbackImage = null // Default image to show when currentImage fails to load
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(currentImage);
  const [error, setError] = useState('');
  const [imageLoadError, setImageLoadError] = useState(false);
  const fileInputRef = useRef(null);

  // Reset preview image when currentImage prop changes
  useEffect(() => {
    setPreviewImage(currentImage);
    setImageLoadError(false); // Reset error state when new image is provided
  }, [currentImage]);

  const validateFile = (file) => {
    if (!file) return 'No file selected';
    
    if (!acceptedFormats.includes(file.type)) {
      return `Please select a valid image format: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`;
    }
    
    if (file.size > maxSizeKB * 1024) {
      return `File size must be less than ${maxSizeKB / 1024}MB`;
    }
    
    return null;
  };

  const handleFileSelect = (file) => {
    setError('');
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // Pass file to parent component
    if (onImageSelect) {
      onImageSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageError = () => {
    setImageLoadError(true);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setError('');
    setImageLoadError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageSelect) {
      onImageSelect(null);
    }
  };

  return (
    <div className="image-upload-container">
      <div
        className={`image-upload-area ${dragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''} ${error ? 'error' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          disabled={disabled}
        />
        
        {previewImage ? (
          <div className="image-preview">
            <img 
              src={imageLoadError && fallbackImage ? fallbackImage : previewImage} 
              alt="Preview" 
              className={`preview-image ${imageLoadError ? 'fallback-active' : ''}`}
              onError={handleImageError}
            />
            {imageLoadError && fallbackImage && (
              <div className="fallback-indicator">
                <i className="fas fa-exclamation-triangle"></i>
                <span>Using default image</span>
              </div>
            )}
            <div className="image-overlay">
              <button
                type="button"
                className="remove-image-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                disabled={disabled}
              >
                <i className="fas fa-trash"></i>
              </button>
              <button
                type="button"
                className="change-image-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                disabled={disabled}
              >
                <i className="fas fa-edit"></i>
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <i className="fas fa-cloud-upload-alt upload-icon"></i>
            <p className="upload-text">
              <strong>Click to upload</strong> or drag and drop
            </p>
            <p className="upload-hint">
              {acceptedFormats.map(f => f.split('/')[1]).join(', ').toUpperCase()} 
              (max {maxSizeKB / 1024}MB)
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="upload-error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
