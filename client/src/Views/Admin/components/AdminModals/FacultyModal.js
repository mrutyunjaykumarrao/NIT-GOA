import React, { useState, useEffect } from 'react';
import ImageUpload from '../../../../components/ImageUpload';
import './AdminModal.css';

const FacultyModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  departments = []
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    honorific: '',
    designation: '',
    department: '',
    email: '',
    gender: '',
    extension_no: '',
    mobile: '',
    display_order: '',
    profile_image: null,
    create_user_account: false,
    username: '',
    password: '',
    access_level: 'faculty'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!show) {
      // Reset form when modal closes
      setFormData({
        full_name: '',
        honorific: '',
        designation: '',
        department: '',
        email: '',
        gender: '',
        extension_no: '',
        mobile: '',
        display_order: '',
        profile_image: null,
        create_user_account: false,
        username: '',
        password: '',
        access_level: 'faculty'
      });
      setImagePreview(null);
      setErrors({});
    }
  }, [show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (file) => {
    if (file) {
      setFormData(prev => ({
        ...prev,
        profile_image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.profile_image) {
        setErrors(prev => ({
          ...prev,
          profile_image: ''
        }));
      }
    } else {
      // Handle image removal
      setFormData(prev => ({
        ...prev,
        profile_image: null
      }));
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    // At least one contact method required
    if (!formData.extension_no.trim() && !formData.mobile.trim()) {
      newErrors.extension_no = 'Please provide either extension number or mobile number';
      newErrors.mobile = 'Please provide either extension number or mobile number';
    }

    // Display order validation (optional but if provided must be valid)
    if (formData.display_order && (isNaN(formData.display_order) || formData.display_order < 0)) {
      newErrors.display_order = 'Display order must be a positive number';
    }

    // User account validation (if checkbox is checked)
    if (formData.create_user_account) {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }

      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (!formData.access_level) {
        newErrors.access_level = 'Access level is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Collect all validation errors and show in alert
      const errorMessages = Object.entries(errors)
        .map(([field, message]) => `• ${field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${message}`)
        .join('\n');
      
      alert(`Please fix the following errors:\n\n${errorMessages}`);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      alert(`Error: ${error.message || 'Failed to create faculty profile. Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h2>Create New Faculty Profile</h2>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-form">
          <div className="admin-form-section">

            {/* Profile Layout - Image on Left, Fields on Right */}
            <div className="admin-profile-layout">
              {/* Profile Image Column */}
              <div className="admin-profile-image-column">
                <label htmlFor="profile_image">
                  <i className="fas fa-camera"></i> Profile Image
                </label>
                <ImageUpload
                  currentImage={imagePreview}
                  onImageSelect={handleImageChange}
                  maxSizeKB={5120}
                  acceptedFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif']}
                />
                {errors.profile_image && <span className="error-message">{errors.profile_image}</span>}
              </div>

              {/* Profile Info Column */}
              <div className="admin-profile-info-column">
                <div className="admin-form-row">
                  {/* Honorific */}
                  <div className="admin-form-group">
                    <label htmlFor="honorific">Honorific</label>
                    <select
                      id="honorific"
                      name="honorific"
                      value={formData.honorific}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                    </select>
                  </div>

                  {/* Full Name */}
                  <div className="admin-form-group admin-form-group-flex-2">
                    <label htmlFor="full_name">Full Name *</label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className={errors.full_name ? 'error' : ''}
                      placeholder="e.g., John Doe"
                    />
                    {errors.full_name && <span className="error-message">{errors.full_name}</span>}
                  </div>
                </div>

                <div className="admin-form-row">
                  {/* Designation */}
                  <div className="admin-form-group">
                    <label htmlFor="designation">Designation *</label>
                    <input
                      type="text"
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className={errors.designation ? 'error' : ''}
                      placeholder="e.g., Assistant Professor"
                    />
                    {errors.designation && <span className="error-message">{errors.designation}</span>}
                  </div>

                  {/* Department */}
                  <div className="admin-form-group">
                    <label htmlFor="department">Department *</label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={errors.department ? 'error' : ''}
                    >
                      <option value="">Select Department</option>
                      {departments.length > 0 ? (
                        departments.map(dept => (
                          <option key={dept.department_id || dept.name} value={dept.name || dept.department_name}>
                            {dept.name || dept.department_name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option key="CSE" value="CSE">Computer Science & Engineering</option>
                          <option key="ECE" value="ECE">Electronics & Communication Engineering</option>
                          <option key="EEE" value="EEE">Electrical & Electronics Engineering</option>
                          <option key="MCE" value="MCE">Mechanical Engineering</option>
                          <option key="CVE" value="CVE">Civil Engineering</option>
                          <option key="HSS" value="HSS">Humanities & Social Sciences</option>
                          <option key="APS" value="APS">Applied Sciences</option>
                        </>
                      )}
                    </select>
                    {errors.department && <span className="error-message">{errors.department}</span>}                  </div>
                </div>
              </div>
            </div>

            {/* Rest of the form fields */}
            <div className="admin-form-grid">
              {/* Gender */}
              <div className="admin-form-group admin-form-group-gender">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={errors.gender ? 'error' : ''}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span className="error-message">{errors.gender}</span>}
              </div>

              {/* Email */}
              <div className="admin-form-group admin-form-group-email">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="faculty@nitgoa.ac.in"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* Second Row Container: Extension, Mobile, Display Order */}
              <div className="admin-form-grid-row-2">
                {/* Extension No */}
                <div className="admin-form-group">
                  <label htmlFor="extension_no">Extension Number</label>
                  <input
                    type="text"
                    id="extension_no"
                    name="extension_no"
                    value={formData.extension_no}
                    onChange={handleInputChange}
                    className={errors.extension_no ? 'error' : ''}
                    placeholder="e.g., 2501"
                  />
                  {errors.extension_no && <span className="error-message">{errors.extension_no}</span>}
                </div>

                {/* Mobile */}
                <div className="admin-form-group">
                  <label htmlFor="mobile">Mobile Number</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={errors.mobile ? 'error' : ''}
                    placeholder="+91 9876543210"
                  />
                  {errors.mobile && <span className="error-message">{errors.mobile}</span>}
                </div>

                {/* Display Order */}
                <div className="admin-form-group">
                  <label htmlFor="display_order">Display Order</label>
                  <input
                    type="number"
                    id="display_order"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleInputChange}
                    className={errors.display_order ? 'error' : ''}
                    min="0"
                    placeholder="e.g., 1"
                  />
                  {errors.display_order && <span className="error-message">{errors.display_order}</span>}
                </div>
              </div>

              {/* User Account Creation Row (conditional) */}
              {formData.create_user_account && (
                <div className="admin-form-grid-row-2">
                  {/* Username */}
                  <div className="admin-form-group">
                    <label htmlFor="username">Username *</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={errors.username ? 'error' : ''}
                      placeholder="e.g., johndoe"
                    />
                    {errors.username && <span className="error-message">{errors.username}</span>}
                  </div>

                  {/* Password */}
                  <div className="admin-form-group">
                    <label htmlFor="password">Password *</label>
                    <div className="admin-password-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={errors.password ? 'error' : ''}
                        placeholder="Min 6 characters"
                      />
                      <button
                        type="button"
                        className="admin-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                    {errors.password && <span className="error-message">{errors.password}</span>}
                  </div>

                  {/* Access Level */}
                  <div className="admin-form-group">
                    <label htmlFor="access_level">Access Level *</label>
                    <select
                      id="access_level"
                      name="access_level"
                      value={formData.access_level}
                      onChange={handleInputChange}
                      className={errors.access_level ? 'error' : ''}
                    >
                      <option value="faculty">Faculty</option>
                      <option value="admin">Admin</option>
                    </select>
                    {errors.access_level && <span className="error-message">{errors.access_level}</span>}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="admin-modal-actions">
            <div className="admin-modal-actions-left">
              <label className="admin-checkbox-label">
                <input
                  type="checkbox"
                  name="create_user_account"
                  checked={formData.create_user_account}
                  onChange={(e) => setFormData(prev => ({ ...prev, create_user_account: e.target.checked }))}
                />
                <span>Create User Account</span>
              </label>
            </div>
            <div className="admin-modal-actions-right">
              <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus"></i>
                    Create Faculty Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyModal;

