import React, { useState, useEffect } from 'react';
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
    extension_no: '',
    mobile: '',
    display_order: '',
    profile_image: null
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!show) {
      // Reset form when modal closes
      setFormData({
        full_name: '',
        honorific: '',
        designation: '',
        department: '',
        email: '',
        extension_no: '',
        mobile: '',
        display_order: '',
        profile_image: null
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profile_image: 'Image size should be less than 5MB'
        }));
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          profile_image: 'Please select a valid image file'
        }));
        return;
      }

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to create faculty'
      }));
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
            <p className="admin-form-help-text">
              Create a basic faculty profile. You can add more details later using the edit page.
            </p>

            <div className="admin-form-grid">
              {/* Profile Image */}
              <div className="admin-form-group admin-form-group-full">
                <label htmlFor="profile_image">Profile Image</label>
                <div className="image-upload-container">
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                  <input
                    type="file"
                    id="profile_image"
                    name="profile_image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={errors.profile_image ? 'error' : ''}
                  />
                  <small>Max size: 5MB. Supported formats: JPG, PNG, GIF</small>
                </div>
                {errors.profile_image && <span className="error-message">{errors.profile_image}</span>}
              </div>

              {/* Full Name */}
              <div className="admin-form-group">
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

              {/* Honorific */}
              <div className="admin-form-group">
                <label htmlFor="honorific">Honorific</label>
                <select
                  id="honorific"
                  name="honorific"
                  value={formData.honorific}
                  onChange={handleInputChange}
                >
                  <option value="">Select (Optional)</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Prof.">Prof.</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                </select>
              </div>

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
                      <option value="CSE">Computer Science & Engineering</option>
                      <option value="ECE">Electronics & Communication Engineering</option>
                      <option value="EEE">Electrical & Electronics Engineering</option>
                      <option value="MCE">Mechanical Engineering</option>
                      <option value="CVE">Civil Engineering</option>
                      <option value="HSS">Humanities & Social Sciences</option>
                      <option value="APS">Applied Sciences</option>
                    </>
                  )}
                </select>
                {errors.department && <span className="error-message">{errors.department}</span>}
              </div>

              {/* Email */}
              <div className="admin-form-group admin-form-group-full">
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
                <small>Lower numbers appear first</small>
                {errors.display_order && <span className="error-message">{errors.display_order}</span>}
              </div>
            </div>

            {errors.submit && (
              <div className="error-message submit-error">
                <i className="fas fa-exclamation-circle"></i> {errors.submit}
              </div>
            )}
          </div>

          <div className="admin-modal-actions">
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
        </form>
      </div>
    </div>
  );
};

export default FacultyModal;

