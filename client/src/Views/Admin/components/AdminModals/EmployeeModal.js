import React, { useState, useEffect } from 'react';
import './AdminModal.css';

const EmployeeModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  mode = 'create', // 'create' or 'edit'
  initialData = null,
  departments = []
}) => {
  const [formData, setFormData] = useState({
    employee_code: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department_id: '',
    role: 'Faculty',
    position: '',
    joining_date: '',
    is_active: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        employee_code: initialData.employee_code || '',
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        department_id: initialData.department_id || '',
        role: initialData.role || 'Faculty',
        position: initialData.position || '',
        joining_date: initialData.joining_date ? initialData.joining_date.split('T')[0] : '',
        is_active: initialData.is_active !== undefined ? initialData.is_active : true
      });
    } else {
      setFormData({
        employee_code: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        department_id: '',
        role: 'Faculty',
        position: '',
        joining_date: '',
        is_active: true
      });
    }
    setErrors({});
  }, [mode, initialData, show]);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employee_code.trim()) {
      newErrors.employee_code = 'Employee code is required';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.department_id) {
      newErrors.department_id = 'Department is required';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
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
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal admin-modal-large">
        <div className="admin-modal-header">
          <h2>{mode === 'create' ? 'Create New Employee' : 'Edit Employee'}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-form">
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
                  placeholder="e.g., EMP001"
                />
                {errors.employee_code && <span className="error-message">{errors.employee_code}</span>}
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
                  placeholder="employee@nitgoa.ac.in"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="admin-form-group">
                <label htmlFor="first_name">First Name *</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={errors.first_name ? 'error' : ''}
                  placeholder="First Name"
                />
                {errors.first_name && <span className="error-message">{errors.first_name}</span>}
              </div>

              <div className="admin-form-group">
                <label htmlFor="last_name">Last Name *</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={errors.last_name ? 'error' : ''}
                  placeholder="Last Name"
                />
                {errors.last_name && <span className="error-message">{errors.last_name}</span>}
              </div>

              <div className="admin-form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="joining_date">Date of Joining</label>
                <input
                  type="date"
                  id="joining_date"
                  name="joining_date"
                  value={formData.joining_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="admin-form-section">
            <h3>Professional Information</h3>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="department_id">Department *</label>
                <select
                  id="department_id"
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleInputChange}
                  className={errors.department_id ? 'error' : ''}
                >
                  <option value="">Select Department</option>
                  <option value="1">Computer Science & Engineering</option>
                  <option value="2">Electronics & Communication Engineering</option>
                  <option value="3">Electrical & Electronics Engineering</option>
                  <option value="4">Mechanical Engineering</option>
                  <option value="5">Civil Engineering</option>
                  <option value="6">Humanities & Social Sciences</option>
                  <option value="7">Applied Sciences</option>
                </select>
                {errors.department_id && <span className="error-message">{errors.department_id}</span>}
              </div>

              <div className="admin-form-group">
                <label htmlFor="role">Role *</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={errors.role ? 'error' : ''}
                >
                  <option value="Faculty">Faculty</option>
                  <option value="Staff">Staff</option>
                  <option value="Technical Staff">Technical Staff</option>
                  <option value="Administrative Staff">Administrative Staff</option>
                </select>
                {errors.role && <span className="error-message">{errors.role}</span>}
              </div>

              <div className="admin-form-group admin-form-group-full">
                <label htmlFor="position">Position/Designation</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="e.g., Assistant Professor, Associate Professor, Lab Technician"
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
                  Active Employee
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
                  {mode === 'create' ? 'Create Employee' : 'Update Employee'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
