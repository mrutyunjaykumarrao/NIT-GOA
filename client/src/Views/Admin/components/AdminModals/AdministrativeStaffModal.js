import React, { useState, useEffect } from 'react';
import ImageUpload from '../../../../components/ImageUpload';
import './AdminModal.css';

const AdministrativeStaffModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  mode = 'create', // 'create' or 'edit'
  initialData = null,
  departments = [],
  token
}) => {
  const [formData, setFormData] = useState({
    employee_code: '',
    honorific: '',
    full_name: '',
    email: '',
    extension_no: '',
    role: 'Administrative',
    job_title: '',  // Free-form job title instead of designation_id
    specialty: '',
    employment_status: 'Permanent',
    employment_type: 'Full-time',
    display_order: '',  // Will be auto-filled
    is_active: true,
    department_id: '',  // Optional for administrative staff
    qualifications: '',
    responsibilities: '',
    office_location: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [nextEmployeeCode, setNextEmployeeCode] = useState('');
  const [nextDisplayOrder, setNextDisplayOrder] = useState('');

  // Honorifics options
  const honorifics = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'];

  // Employment status options
  const employmentStatuses = ['Permanent', 'Contract', 'Temporary', 'Probation'];

  // Employment type options
  const employmentTypes = ['Full-time', 'Part-time', 'Contract'];

  // Define fetch functions before useEffect
  const fetchNextEmployeeCode = async () => {
    try {
      console.log('Fetching next employee code for Administrative...');
      const response = await fetch('/api/admin/employees/next-code/Administrative', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Received next employee code:', data);
        setNextEmployeeCode(data.nextCode);
      } else {
        console.error('Failed to fetch next employee code:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching next employee code:', error);
    }
  };

  const fetchNextDisplayOrder = async () => {
    try {
      console.log('Fetching next display order for Administrative...');
      const response = await fetch('/api/admin/employees/next-display-order/Administrative', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Received next display order:', data);
        setNextDisplayOrder(data.nextDisplayOrder);
      } else {
        console.error('Failed to fetch next display order:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching next display order:', error);
    }
  };

  useEffect(() => {
    if (show) {
      if (mode === 'create') {
        // Fetch suggestions for new staff member
        fetchNextEmployeeCode();
        fetchNextDisplayOrder();
      }
      
      if (mode === 'edit' && initialData) {
        setFormData({
          employee_code: initialData.employee_code || '',
          honorific: initialData.honorific || '',
          full_name: initialData.full_name || '',
          email: initialData.email || '',
          extension_no: initialData.extension_no || '',
          role: 'Administrative',
          job_title: initialData.job_title || '',
          specialty: initialData.specialty || '',
          employment_status: initialData.employment_status || 'Permanent',
          employment_type: initialData.employment_type || 'Full-time',
          display_order: initialData.display_order || '',
          is_active: initialData.is_active !== undefined ? initialData.is_active : true,
          department_id: initialData.department_id || '',
          qualifications: initialData.qualifications || '',
          responsibilities: initialData.responsibilities || '',
          office_location: initialData.office_location || ''
        });
        setCurrentImageUrl(initialData.image_url || '');
      } else if (mode === 'create') {
        setFormData({
          employee_code: '',
          honorific: '',
          full_name: '',
          email: '',
          extension_no: '',
          role: 'Administrative',
          job_title: '',
          specialty: '',
          employment_status: 'Permanent',
          employment_type: 'Full-time',
          display_order: '',
          is_active: true,
          department_id: '',
          qualifications: '',
          responsibilities: '',
          office_location: ''
        });
        setCurrentImageUrl('');
      }
      setSelectedImage(null);
      setErrors({});
    }
  }, [mode, initialData, show]);

  // Auto-fill suggestions when they are fetched
  useEffect(() => {
    if (mode === 'create' && nextEmployeeCode && (!formData.employee_code || formData.employee_code === '')) {
      console.log('Auto-filling employee code:', nextEmployeeCode);
      setFormData(prev => ({ ...prev, employee_code: nextEmployeeCode }));
    }
  }, [nextEmployeeCode, mode, formData.employee_code]);

  useEffect(() => {
    if (mode === 'create' && nextDisplayOrder && (!formData.display_order || formData.display_order === '' || formData.display_order === '0')) {
      console.log('Auto-filling display order:', nextDisplayOrder);
      setFormData(prev => ({ ...prev, display_order: nextDisplayOrder }));
    }
  }, [nextDisplayOrder, mode, formData.display_order]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageSelect = (file) => {
    setSelectedImage(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employee_code.trim()) {
      newErrors.employee_code = 'Employee code is required';
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Department is optional for administrative staff
    // No validation needed

    if (!formData.job_title || !formData.job_title.trim()) {
      newErrors.job_title = 'Job title is required';
    }

    // Validate display order
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
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add form data with proper type conversion
      Object.keys(formData).forEach(key => {
        let value = formData[key];
        
        // Convert boolean to proper format for database
        if (key === 'is_active') {
          value = value ? 1 : 0;
        }
        
        // Convert display_order to number
        if (key === 'display_order' && value) {
          value = parseInt(value, 10);
        }
        
        // Handle empty strings and convert to null for optional fields
        if (value === '' || value === undefined) {
          // Required fields should not be null
          const requiredFields = ['employee_code', 'full_name', 'email', 'role', 'job_title'];
          if (!requiredFields.includes(key)) {
            value = null;
          }
        }
        
        // Only append non-null values (or append null as string 'null' for FormData)
        submitData.append(key, value === null ? '' : value);
      });

      // Add image if selected
      if (selectedImage) {
        submitData.append('image', selectedImage);
      }

      await onSubmit(submitData, mode);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal admin-modal-large">
        <div className="admin-modal-header">
          <h2>{mode === 'create' ? 'Create New Administrative Staff' : 'Edit Administrative Staff'}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-form">
          {/* Image Upload Section */}
          <div className="admin-form-section">
            <h3>Profile Image</h3>
            <div className="admin-form-group admin-form-group-full">
              <ImageUpload
                currentImage={currentImageUrl}
                onImageSelect={handleImageSelect}
                maxSizeKB={5120}
                acceptedFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
              />
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="admin-form-section">
            <h3>Basic Information</h3>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="employee_code">Employee Code *</label>
                <input
                  type="text"
                  id="employee_code"
                  name="employee_code"
                  value={formData.employee_code}
                  onChange={handleInputChange}
                  className={errors.employee_code ? 'error' : ''}
                  placeholder={mode === 'create' && nextEmployeeCode ? nextEmployeeCode : 'e.g., ADMIN025'}
                />
                {mode === 'create' && nextEmployeeCode && (
                  <small className="form-hint">
                    Suggested next code: {nextEmployeeCode}
                  </small>
                )}
                {errors.employee_code && <span className="error-message">{errors.employee_code}</span>}
              </div>

              <div className="admin-form-group">
                <label htmlFor="honorific">Honorific</label>
                <select
                  id="honorific"
                  name="honorific"
                  value={formData.honorific}
                  onChange={handleInputChange}
                >
                  <option value="">Select Honorific</option>
                  {honorifics.map(honorific => (
                    <option key={honorific} value={honorific}>
                      {honorific}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group admin-form-group-full">
                <label htmlFor="full_name">Name *</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className={errors.full_name ? 'error' : ''}
                  placeholder="Full Name"
                />
                {errors.full_name && <span className="error-message">{errors.full_name}</span>}
              </div>

              <div className="admin-form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="email@nitgoa.ac.in"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="admin-form-group">
                <label htmlFor="extension_no">Extension Number</label>
                <input
                  type="text"
                  id="extension_no"
                  name="extension_no"
                  value={formData.extension_no}
                  onChange={handleInputChange}
                  placeholder="e.g., 1234"
                />
              </div>
            </div>
          </div>

          {/* Department and Role Section */}
          <div className="admin-form-section">
            <h3>Department & Role</h3>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="department_id">Department</label>
                <select
                  id="department_id"
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleInputChange}
                  className={errors.department_id ? 'error' : ''}
                >
                  <option value="">Select Department (Optional)</option>
                  {departments.map(dept => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
                {errors.department_id && <span className="error-message">{errors.department_id}</span>}
              </div>

              <div className="admin-form-group">
                <label htmlFor="job_title">Job Title *</label>
                <input
                  type="text"
                  id="job_title"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                  className={errors.job_title ? 'error' : ''}
                  placeholder="e.g., Medical Officer, Finance Manager, HR Executive"
                />
                {errors.job_title && <span className="error-message">{errors.job_title}</span>}
              </div>

              <div className="admin-form-group admin-form-group-full">
                <label htmlFor="specialty">Speciality</label>
                <input
                  type="text"
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  placeholder="e.g., Student Affairs, Finance, HR"
                />
              </div>
            </div>
          </div>

          {/* Employment Details Section */}
          <div className="admin-form-section">
            <h3>Employment Details</h3>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="employment_status">Employment Status</label>
                <select
                  id="employment_status"
                  name="employment_status"
                  value={formData.employment_status}
                  onChange={handleInputChange}
                >
                  {employmentStatuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="employment_type">Employment Type</label>
                <select
                  id="employment_type"
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleInputChange}
                >
                  {employmentTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

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
                  placeholder="0"
                />
                {errors.display_order && <span className="error-message">{errors.display_order}</span>}
              </div>

              <div className="admin-form-group">
                <label htmlFor="office_location">Office Location</label>
                <input
                  type="text"
                  id="office_location"
                  name="office_location"
                  value={formData.office_location}
                  onChange={handleInputChange}
                  placeholder="e.g., Room 201, Administrative Block"
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="admin-form-section">
            <h3>Additional Information</h3>
            <div className="admin-form-grid">
              <div className="admin-form-group admin-form-group-full">
                <label htmlFor="qualifications">Qualifications</label>
                <textarea
                  id="qualifications"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Educational qualifications and certifications"
                />
              </div>

              <div className="admin-form-group admin-form-group-full">
                <label htmlFor="responsibilities">Responsibilities</label>
                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Key responsibilities and duties"
                />
              </div>

              <div className="admin-form-group admin-form-group-checkbox">
                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  Active Staff Member
                </label>
              </div>
            </div>
          </div>

          <div className="admin-modal-actions">
            <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                <>
                  <i className={`fas ${mode === 'create' ? 'fa-plus' : 'fa-save'}`}></i>
                  {mode === 'create' ? 'Create Staff' : 'Update Staff'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdministrativeStaffModal;
