import React, { useState, useEffect } from 'react';
import './AdminModal.css';

const FacultyModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  mode = 'create', // 'create' or 'edit'
  initialData = null,
  employees = [],
  departments = []
}) => {
  const [formData, setFormData] = useState({
    // Personal Information
    full_name: '',
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    
    // Contact Information
    email: '',
    phone: '',
    mobile: '',
    address: '',
    office_location: '',
    
    // Professional Information
    designation: '',
    department: '',
    qualification: '',
    specialization: '',
    bio: '',
    experience_years: '',
    experience_description: '',
    date_of_joining: '',
    
    // Social Links
    personal_website: '',
    linkedin_url: '',
    google_scholar_url: '',
    researchgate_url: '',
    orcid_url: '',
    research_areas: '',
    
    // Additional Fields
    employee_id: '',
    is_active: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        full_name: initialData.full_name || '',
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        gender: initialData.gender || '',
        date_of_birth: initialData.date_of_birth ? initialData.date_of_birth.split('T')[0] : '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        mobile: initialData.mobile || '',
        address: initialData.address || '',
        office_location: initialData.office_location || '',
        designation: initialData.designation || '',
        department: initialData.department || '',
        qualification: initialData.qualification || '',
        specialization: initialData.specialization || '',
        bio: initialData.bio || '',
        experience_years: initialData.experience_years || '',
        experience_description: initialData.experience_description || '',
        date_of_joining: initialData.date_of_joining ? initialData.date_of_joining.split('T')[0] : '',
        personal_website: initialData.personal_website || '',
        linkedin_url: initialData.linkedin_url || '',
        google_scholar_url: initialData.google_scholar_url || '',
        researchgate_url: initialData.researchgate_url || '',
        orcid_url: initialData.orcid_url || '',
        research_areas: initialData.research_areas || '',
        employee_id: initialData.employee_id || '',
        is_active: initialData.is_active !== undefined ? initialData.is_active : true
      });
    } else {
      setFormData({
        full_name: '',
        first_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '',
        email: '',
        phone: '',
        mobile: '',
        address: '',
        office_location: '',
        designation: '',
        department: '',
        qualification: '',
        specialization: '',
        bio: '',
        experience_years: '',
        experience_description: '',
        date_of_joining: '',
        personal_website: '',
        linkedin_url: '',
        google_scholar_url: '',
        researchgate_url: '',
        orcid_url: '',
        research_areas: '',
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

    // Required fields validation
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
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

    // URL validation
    const urlFields = ['personal_website', 'linkedin_url', 'google_scholar_url', 'researchgate_url', 'orcid_url'];
    urlFields.forEach(field => {
      if (formData[field] && formData[field].trim()) {
        try {
          new URL(formData[field]);
        } catch (e) {
          newErrors[field] = 'Please enter a valid URL';
        }
      }
    });

    // Experience years validation
    if (formData.experience_years && (isNaN(formData.experience_years) || formData.experience_years < 0)) {
      newErrors.experience_years = 'Experience years must be a positive number';
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
          <h2>{mode === 'create' ? 'Create New Faculty' : 'Edit Faculty'}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-form">
          {/* Personal Information Section */}
          <div className="admin-form-section">
            <h3>Personal Information</h3>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="full_name">Full Name *</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className={errors.full_name ? 'error' : ''}
                  placeholder="Dr. John Doe"
                />
                {errors.full_name && <span className="error-message">{errors.full_name}</span>}
              </div>

              <div className="admin-form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="John"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Doe"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="date_of_birth">Date of Birth</label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                />
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

              <div className="admin-form-group admin-form-group-full">
                <label htmlFor="bio">Biography</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Brief description about the faculty member..."
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="admin-form-section">
            <h3>Contact Information</h3>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="john.doe@nitgoa.ac.in"
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
                  placeholder="+91 832 2404200"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="mobile">Mobile</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="office_location">Office Location</label>
                <input
                  type="text"
                  id="office_location"
                  name="office_location"
                  value={formData.office_location}
                  onChange={handleInputChange}
                  placeholder="Room 101, Faculty Block"
                />
              </div>

              <div className="admin-form-group admin-form-group-full">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Complete postal address..."
                />
              </div>
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="admin-form-section">
            <h3>Professional Information</h3>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="designation">Designation *</label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className={errors.designation ? 'error' : ''}
                  placeholder="Assistant Professor"
                />
                {errors.designation && <span className="error-message">{errors.designation}</span>}
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
                  placeholder="10"
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
                <label htmlFor="qualification">Qualification</label>
                <textarea
                  id="qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Ph.D. in Computer Science, M.Tech in Software Engineering"
                />
              </div>

              <div className="admin-form-group admin-form-group-full">
                <label htmlFor="specialization">Specialization</label>
                <textarea
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Machine Learning, Artificial Intelligence, Data Mining"
                />
              </div>

              <div className="admin-form-group admin-form-group-full">
                <label htmlFor="research_areas">Research Areas</label>
                <textarea
                  id="research_areas"
                  name="research_areas"
                  value={formData.research_areas}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Deep Learning, Computer Vision, Natural Language Processing"
                />
              </div>

              <div className="admin-form-group admin-form-group-full">
                <label htmlFor="experience_description">Experience Description</label>
                <textarea
                  id="experience_description"
                  name="experience_description"
                  value={formData.experience_description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Brief description of professional experience and expertise..."
                />
              </div>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="admin-form-section">
            <h3>Social Links & Online Presence</h3>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="personal_website">Personal Website</label>
                <input
                  type="url"
                  id="personal_website"
                  name="personal_website"
                  value={formData.personal_website}
                  onChange={handleInputChange}
                  className={errors.personal_website ? 'error' : ''}
                  placeholder="https://example.com"
                />
                {errors.personal_website && <span className="error-message">{errors.personal_website}</span>}
              </div>

              <div className="admin-form-group">
                <label htmlFor="linkedin_url">LinkedIn Profile</label>
                <input
                  type="url"
                  id="linkedin_url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleInputChange}
                  className={errors.linkedin_url ? 'error' : ''}
                  placeholder="https://linkedin.com/in/username"
                />
                {errors.linkedin_url && <span className="error-message">{errors.linkedin_url}</span>}
              </div>

              <div className="admin-form-group">
                <label htmlFor="google_scholar_url">Google Scholar</label>
                <input
                  type="url"
                  id="google_scholar_url"
                  name="google_scholar_url"
                  value={formData.google_scholar_url}
                  onChange={handleInputChange}
                  className={errors.google_scholar_url ? 'error' : ''}
                  placeholder="https://scholar.google.com/citations?user=..."
                />
                {errors.google_scholar_url && <span className="error-message">{errors.google_scholar_url}</span>}
              </div>

              <div className="admin-form-group">
                <label htmlFor="researchgate_url">ResearchGate Profile</label>
                <input
                  type="url"
                  id="researchgate_url"
                  name="researchgate_url"
                  value={formData.researchgate_url}
                  onChange={handleInputChange}
                  className={errors.researchgate_url ? 'error' : ''}
                  placeholder="https://www.researchgate.net/profile/username"
                />
                {errors.researchgate_url && <span className="error-message">{errors.researchgate_url}</span>}
              </div>

              <div className="admin-form-group">
                <label htmlFor="orcid_url">ORCID iD</label>
                <input
                  type="url"
                  id="orcid_url"
                  name="orcid_url"
                  value={formData.orcid_url}
                  onChange={handleInputChange}
                  className={errors.orcid_url ? 'error' : ''}
                  placeholder="https://orcid.org/0000-0000-0000-0000"
                />
                {errors.orcid_url && <span className="error-message">{errors.orcid_url}</span>}
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
                  Active Faculty
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
                  {mode === 'create' ? 'Create Faculty' : 'Update Faculty'}
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
