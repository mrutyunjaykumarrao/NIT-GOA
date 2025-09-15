import React, { useState, useEffect } from 'react';
import './AdminModal.css';

const UserModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  mode = 'create', // 'create' or 'edit'
  initialData = null,
  employees = []
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    access_level: 'Faculty',
    employee_id: '',
    is_active: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        username: initialData.username || '',
        email: initialData.email || initialData.user_email || '',
        password: '', // Don't populate password for security
        access_level: initialData.access_level || initialData.role || 'Faculty',
        employee_id: initialData.employee_id || '',
        is_active: initialData.is_active !== undefined ? initialData.is_active : true
      });
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        access_level: 'Faculty',
        employee_id: '',
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

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (mode === 'create' && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.access_level) {
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
      // Remove password from data if it's empty in edit mode
      const submitData = { ...formData };
      if (mode === 'edit' && !submitData.password) {
        delete submitData.password;
      }
      
      await onSubmit(submitData);
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
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h2>{mode === 'create' ? 'Create New User' : 'Edit User'}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-form">
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={errors.username ? 'error' : ''}
                placeholder="Enter username"
                disabled={mode === 'edit'} // Username shouldn't be editable
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div className="admin-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter email address"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="admin-form-group">
              <label htmlFor="password">
                Password {mode === 'create' ? '*' : '(leave blank to keep current)'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                placeholder={mode === 'create' ? 'Enter password' : 'Enter new password'}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="admin-form-group">
              <label htmlFor="access_level">Role *</label>
              <select
                id="access_level"
                name="access_level"
                value={formData.access_level}
                onChange={handleInputChange}
                className={errors.role ? 'error' : ''}
              >
                <option value="Faculty">Faculty</option>
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
              {errors.role && <span className="error-message">{errors.role}</span>}
            </div>

            <div className="admin-form-group">
              <label htmlFor="employee_id">Link to Employee</label>
              <select
                id="employee_id"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleInputChange}
              >
                <option value="">Select Employee (Optional)</option>
                {employees.map(emp => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.employee_code} - {emp.first_name} {emp.last_name}
                  </option>
                ))}
              </select>
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
                Active User
              </label>
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
                  {mode === 'create' ? 'Create User' : 'Update User'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
