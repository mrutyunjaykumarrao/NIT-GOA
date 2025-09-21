import React from 'react';

const ContactInformationSection = ({ formData, setFormData, loading }) => {

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="faculty-edit-components-form-section">
            <h3 className="faculty-edit-section-title">Contact Information</h3>
            <div className="faculty-edit-form-grid">
                
                {/* Row 1: Email (2) and Extension No (1) in 2:1 ratio */}
                <div className="faculty-edit-form-row">
                    <div className="faculty-edit-form-group" style={{ flex: '2' }}>
                        <label htmlFor="email">Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled={loading}
                            className="faculty-edit-form-input"
                            placeholder="Enter official email address"
                            required
                        />
                    </div>
                    
                    <div className="faculty-edit-form-group" style={{ flex: '1' }}>
                        <label htmlFor="extension_no">Extension No</label>
                        <input
                            type="text"
                            id="extension_no"
                            value={formData.extension_no || ''}
                            onChange={(e) => handleInputChange('extension_no', e.target.value)}
                            disabled={loading}
                            className="faculty-edit-form-input"
                            placeholder="Enter office extension"
                        />
                    </div>
                </div>

                {/* Row 2: Phone Mobile and Phone Residence in 1:1 ratio */}
                <div className="faculty-edit-form-row">
                    <div className="faculty-edit-form-group">
                        <label htmlFor="phone_mobile">Phone (Mobile)</label>
                        <input
                            type="tel"
                            id="phone_mobile"
                            value={formData.phone_mobile || ''}
                            onChange={(e) => handleInputChange('phone_mobile', e.target.value)}
                            disabled={loading}
                            className="faculty-edit-form-input"
                            placeholder="Enter mobile number"
                        />
                    </div>

                    <div className="faculty-edit-form-group">
                        <label htmlFor="phone_residence">Phone (Residence)</label>
                        <input
                            type="tel"
                            id="phone_residence"
                            value={formData.phone_residence || ''}
                            onChange={(e) => handleInputChange('phone_residence', e.target.value)}
                            disabled={loading}
                            className="faculty-edit-form-input"
                            placeholder="Enter residence number"
                        />
                    </div>
                </div>

                {/* Row 3: Office Location and Office Hours in 1:1 ratio */}
                <div className="faculty-edit-form-row">
                    <div className="faculty-edit-form-group">
                        <label htmlFor="office_location">Office Location</label>
                        <input
                            type="text"
                            id="office_location"
                            value={formData.office_location || ''}
                            onChange={(e) => handleInputChange('office_location', e.target.value)}
                            disabled={loading}
                            className="faculty-edit-form-input"
                            placeholder="e.g., Room No. 201, Block A"
                        />
                    </div>

                    <div className="faculty-edit-form-group">
                        <label htmlFor="office_hours">Office Hours</label>
                        <input
                            type="text"
                            id="office_hours"
                            value={formData.office_hours || ''}
                            onChange={(e) => handleInputChange('office_hours', e.target.value)}
                            disabled={loading}
                            className="faculty-edit-form-input"
                            placeholder="e.g., Mon-Fri: 9:00 AM - 5:00 PM"
                        />
                    </div>
                </div>

                {/* Row 4: Address (full width) */}
                <div className="faculty-edit-form-row">
                    <div className="faculty-edit-form-group full-width">
                        <label htmlFor="address">Address</label>
                        <textarea
                            id="address"
                            value={formData.address || ''}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            disabled={loading}
                            className="faculty-edit-form-input faculty-edit-form-textarea"
                            rows="3"
                            placeholder="Enter complete address"
                        />
                    </div>
                </div>
            </div>

            {/* Contact Information Preview */}
            <div className="contact-summary">
                <h4>Contact Information Preview</h4>
                <div className="summary-grid">
                    {formData.email && (
                        <div className="summary-item">
                            <strong>Email:</strong> {formData.email}
                        </div>
                    )}
                    {formData.extension_no && (
                        <div className="summary-item">
                            <strong>Extension:</strong> {formData.extension_no}
                        </div>
                    )}
                    {formData.phone_mobile && (
                        <div className="summary-item">
                            <strong>Mobile:</strong> {formData.phone_mobile}
                        </div>
                    )}
                    {formData.phone_residence && (
                        <div className="summary-item">
                            <strong>Residence:</strong> {formData.phone_residence}
                        </div>
                    )}
                    {formData.office_location && (
                        <div className="summary-item">
                            <strong>Office Location:</strong> {formData.office_location}
                        </div>
                    )}
                    {formData.office_hours && (
                        <div className="summary-item office-hours">
                            <strong>Office Hours:</strong> <span className="office-hours-text">{formData.office_hours}</span>
                        </div>
                    )}
                </div>
                {formData.address && (
                    <div className="summary-item address-item">
                        <strong>Address:</strong> {formData.address}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactInformationSection;