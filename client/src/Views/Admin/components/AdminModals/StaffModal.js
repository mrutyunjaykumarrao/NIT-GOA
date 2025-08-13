import React, { useState, useEffect } from 'react';
import './AdminModal.css';

const StaffModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  mode = 'create', // 'create' or 'edit'
  initialData = null,
  employees = [],
  departments = []
}) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    position: '',
    department: '',
    qualifications: '',
    skills: '',
    specialization: '',
    experience_years: '',
    date_of_joining: '',
    phone: '',
    email: '',
    office_location: '',
    is_active: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        employee_id: initialData.employee_id || '',
        position: initialData.position || '',
        department: initialData.department || '',
        qualifications: initialData.qualifications || '',
        skills: initialData.skills || '',
        specialization: initialData.specialization || '',
        experience_years: initialData.experience_years || '',
        date_of_joining: initialData.date_of_joining ? initialData.date_of_joining.split('T')[0] : '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        office_location: initialData.office_location || '',
        is_active: initialData.is_active !== undefined ? initialData.is_active : true
      });
    } else {
      setFormData({
        employee_id: '',
        position: '',
        department: '',
        qualifications: '',
        skills: '',
        specialization: '',
        experience_years: '',
        date_of_joining: '',
        phone: '',
        email: '',
        office_location: '',
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

    if (!formData.employee_id) {
      newErrors.employee_id = 'Please select an employee';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    // Experience years validation
    if (formData.experience_years && (isNaN(formData.experience_years) || formData.experience_years < 0)) {
      newErrors.experience_years = 'Experience years must be a positive number';
    }

    // Email validation if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
          <h2>{mode === 'create' ? 'Create New Staff' : 'Edit Staff'}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-form">
          {/* Basic Information Section */}
          <div className="admin-form-section">
            <h3>Basic Information</h3>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="employee_id">Link to Employee *</label>
                <select
                  id="employee_id"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleInputChange}
                  className={errors.employee_id ? 'error' : ''}
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.employee_id} value={emp.employee_id}>
                      {emp.employee_code} - {emp.first_name} {emp.last_name}
                    </option>
                  ))}
                </select>
                {errors.employee_id && <span className="error-message">{errors.employee_id}</span>}
              </div>

              <div className="admin-form-group">
                <label htmlFor="position">Position/Designation *</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={errors.position ? 'error' : ''}
                  placeholder="e.g., Lab Technician, Administrative Officer"
                />
                {errors.position && <span className="error-message">{errors.position}</span>}
              </div>

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
                  <option value="CSE">Computer Science & Engineering</option>
                  <option value="ECE">Electronics & Communication Engineering</option>
                  <option value="EEE">Electrical & Electronics Engineering</option>
                  <option value="MCE">Mechanical Engineering</option>
                  <option value="CVE">Civil Engineering</option>
                  <option value="HSS">Humanities & Social Sciences</option>
                  <option value="APS">Applied Sciences</option>
                  <option value="Administration">Administration</option>
                  <option value="Library">Library</option>
                  <option value="IT Services">IT Services</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                {errors.department && <span className="error-message">{errors.department}</span>}
              </div>

              <div className="admin-form-group">
                <label htmlFor="experience_years">Experience (Years)</label>
                <input
                  type="number"
                  id="experience_years"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleInputChange}
                  className={errors.experience_years ? 'error' : ''}
                  min="0"
                  placeholder="5"
                />
                {errors.experience_years && <span className="error-message">{errors.experience_years}</span>}
              </div>

              <div className="admin-form-group">
                <label htmlFor="date_of_joining">Date of Joining</label>
                <input
                  type="date"
                  id="date_of_joining"
                  name="date_of_joining"
                  value={formData.date_of_joining}
                  onChange={handleInputChange}
                />
              </div>

              <div className="admin-form-group admin-form-group-full">
                <label htmlFor="specialization">Specialization/Area of Expertise</label>
                <textarea
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="e.g., Network Administration, Laboratory Management, Student Affairs"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="admin-form-section">
            <h3>Contact Information</h3>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="staff@nitgoa.ac.in"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
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

              <div className="admin-form-group admin-form-group-full">
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

          {/* Professional Details Section */}
          <div className="admin-form-section">
            <h3>Professional Details</h3>
            <div className="admin-form-grid">
              <div className="admin-form-group admin-form-group-full">
                <label htmlFor="qualifications">Qualifications</label>
                <textarea
                  id="qualifications"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="e.g., B.Tech in Electronics, Diploma in Computer Applications"
                />
              </div>

              <div className="admin-form-group admin-form-group-full">
                <label htmlFor="skills">Skills & Competencies</label>
                <textarea
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="e.g., Technical skills, software expertise, administrative capabilities"
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

export default StaffModal;
