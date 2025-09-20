import React, { useState, useEffect } from 'react';
import './FacultyEditForm.css';

const FacultyEditForm = ({ faculty, onSave, onCancel, section = 'all' }) => {
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
    research_areas: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (faculty) {
      setFormData({
        full_name: faculty.full_name || '',
        first_name: faculty.first_name || '',
        last_name: faculty.last_name || '',
        gender: faculty.gender || '',
        date_of_birth: faculty.date_of_birth ? faculty.date_of_birth.split('T')[0] : '',
        email: faculty.email || '',
        phone: faculty.phone || '',
        mobile: faculty.mobile || '',
        address: faculty.address || '',
        office_location: faculty.office_location || '',
        designation: faculty.designation || '',
        department: faculty.department || '',
        qualification: faculty.qualification || '',
        specialization: faculty.specialization || '',
        bio: faculty.bio || '',
        experience_years: faculty.experience_years || '',
        experience_description: faculty.experience_description || '',
        date_of_joining: faculty.date_of_joining ? faculty.date_of_joining.split('T')[0] : '',
        personal_website: faculty.personal_website || '',
        linkedin_url: faculty.linkedin_url || '',
        google_scholar_url: faculty.google_scholar_url || '',
        researchgate_url: faculty.researchgate_url || '',
        orcid_url: faculty.orcid_url || '',
        research_areas: faculty.research_areas || ''
      });
    }
  }, [faculty]);

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
      await onSave(formData);
    } catch (error) {
      console.error('Error saving faculty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalInfo = () => (
    <div className="faculty-edit-form-section">
      <h3>Personal Information</h3>
      <div className="faculty-edit-form-grid">
        <div className="faculty-edit-form-group">
          <label htmlFor="full_name">Full Name *</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            className={errors.full_name ? 'error' : ''}
            required
          />
          {errors.full_name && <span className="faculty-edit-error-message">{errors.full_name}</span>}
        </div>

        <div className="faculty-edit-form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="faculty-edit-form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="faculty-edit-form-group">
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

        <div className="faculty-edit-form-group">
          <label htmlFor="date_of_birth">Date of Birth</label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
          />
        </div>

        <div className="faculty-edit-form-group full-width">
          <label htmlFor="bio">Biography</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows="4"
            placeholder="Brief description about the faculty member..."
          />
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="faculty-edit-form-section">
      <h3>Contact Information</h3>
      <div className="faculty-edit-form-grid">
        <div className="faculty-edit-form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
            required
          />
          {errors.email && <span className="faculty-edit-error-message">{errors.email}</span>}
        </div>

        <div className="faculty-edit-form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className="faculty-edit-form-group">
          <label htmlFor="mobile">Mobile</label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
          />
        </div>

        <div className="faculty-edit-form-group">
          <label htmlFor="office_location">Office Location</label>
          <input
            type="text"
            id="office_location"
            name="office_location"
            value={formData.office_location}
            onChange={handleInputChange}
            placeholder="e.g., Room 101, Faculty Block"
          />
        </div>

        <div className="faculty-edit-form-group full-width">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows="3"
            placeholder="Complete postal address..."
          />
        </div>
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="faculty-edit-form-section">
      <h3>Professional Information</h3>
      <div className="faculty-edit-form-grid">
        <div className="faculty-edit-form-group">
          <label htmlFor="designation">Designation *</label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            className={errors.designation ? 'error' : ''}
            placeholder="e.g., Assistant Professor, Associate Professor"
            required
          />
          {errors.designation && <span className="faculty-edit-error-message">{errors.designation}</span>}
        </div>

        <div className="faculty-edit-form-group">
          <label htmlFor="department">Department *</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className={errors.department ? 'error' : ''}
            required
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
          {errors.department && <span className="faculty-edit-error-message">{errors.department}</span>}
        </div>

        <div className="faculty-edit-form-group">
          <label htmlFor="experience_years">Experience (Years)</label>
          <input
            type="number"
            id="experience_years"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleInputChange}
            className={errors.experience_years ? 'error' : ''}
            min="0"
            placeholder="e.g., 10"
          />
          {errors.experience_years && <span className="faculty-edit-error-message">{errors.experience_years}</span>}
        </div>

        <div className="faculty-edit-form-group">
          <label htmlFor="date_of_joining">Date of Joining</label>
          <input
            type="date"
            id="date_of_joining"
            name="date_of_joining"
            value={formData.date_of_joining}
            onChange={handleInputChange}
          />
        </div>

        <div className="faculty-edit-form-group full-width">
          <label htmlFor="qualification">Qualification</label>
          <textarea
            id="qualification"
            name="qualification"
            value={formData.qualification}
            onChange={handleInputChange}
            rows="2"
            placeholder="e.g., Ph.D. in Computer Science, M.Tech in Software Engineering"
          />
        </div>

        <div className="faculty-edit-form-group full-width">
          <label htmlFor="specialization">Specialization</label>
          <textarea
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            rows="2"
            placeholder="e.g., Machine Learning, Artificial Intelligence, Data Mining"
          />
        </div>

        <div className="faculty-edit-form-group full-width">
          <label htmlFor="research_areas">Research Areas</label>
          <textarea
            id="research_areas"
            name="research_areas"
            value={formData.research_areas}
            onChange={handleInputChange}
            rows="3"
            placeholder="e.g., Deep Learning, Computer Vision, Natural Language Processing"
          />
        </div>

        <div className="faculty-edit-form-group full-width">
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
  );

  const renderSocialLinks = () => (
    <div className="faculty-edit-form-section">
      <h3>Social Links & Online Presence</h3>
      <div className="faculty-edit-form-grid">
        <div className="faculty-edit-form-group">
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
          {errors.personal_website && <span className="faculty-edit-error-message">{errors.personal_website}</span>}
        </div>

        <div className="faculty-edit-form-group">
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
          {errors.linkedin_url && <span className="faculty-edit-error-message">{errors.linkedin_url}</span>}
        </div>

        <div className="faculty-edit-form-group">
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
          {errors.google_scholar_url && <span className="faculty-edit-error-message">{errors.google_scholar_url}</span>}
        </div>

        <div className="faculty-edit-form-group">
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
          {errors.researchgate_url && <span className="faculty-edit-error-message">{errors.researchgate_url}</span>}
        </div>

        <div className="faculty-edit-form-group">
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
          {errors.orcid_url && <span className="faculty-edit-error-message">{errors.orcid_url}</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="faculty-edit-form">
      <div className="faculty-edit-form-header">
        <h2>Edit Faculty Profile</h2>
        <button type="button" className="faculty-edit-close-button" onClick={onCancel}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {(section === 'all' || section === 'personal') && renderPersonalInfo()}
        {(section === 'all' || section === 'contact') && renderContactInfo()}
        {(section === 'all' || section === 'professional') && renderProfessionalInfo()}
        {(section === 'all' || section === 'social') && renderSocialLinks()}

        <div className="faculty-edit-form-actions">
          <button type="button" className="faculty-edit-cancel-button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="faculty-edit-save-button" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FacultyEditForm;
