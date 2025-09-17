import React from 'react';

const ContactInformationSection = ({ formData, setFormData, loading }) => {

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="form-section">
            <h3 className="section-title">Contact Information</h3>
            <div className="form-grid">
                {/* Email */}
                <div className="form-group full-width">
                    <label htmlFor="email">Email Address *</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={loading}
                        className="form-input"
                        placeholder="Enter official email address"
                        required
                    />
                </div>

                {/* Phone Numbers */}
                <div className="form-row contact-phones">
                    <div className="form-group">
                        <label htmlFor="phone_mobile">Phone (Mobile)</label>
                        <input
                            type="tel"
                            id="phone_mobile"
                            value={formData.phone_mobile || ''}
                            onChange={(e) => handleInputChange('phone_mobile', e.target.value)}
                            disabled={loading}
                            className="form-input"
                            placeholder="Enter mobile number"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone_residence">Phone (Residence)</label>
                        <input
                            type="tel"
                            id="phone_residence"
                            value={formData.phone_residence || ''}
                            onChange={(e) => handleInputChange('phone_residence', e.target.value)}
                            disabled={loading}
                            className="form-input"
                            placeholder="Enter residence number"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="extension_no">Extension No</label>
                        <input
                            type="text"
                            id="extension_no"
                            value={formData.extension_no || ''}
                            onChange={(e) => handleInputChange('extension_no', e.target.value)}
                            disabled={loading}
                            className="form-input"
                            placeholder="Enter office extension number"
                        />
                    </div>
                </div>

                {/* Address */}
                <div className="form-group full-width">
                    <label htmlFor="address">Address</label>
                    <textarea
                        id="address"
                        value={formData.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={loading}
                        className="form-input form-textarea"
                        rows="3"
                        placeholder="Enter complete address"
                    />
                </div>

                {/* Office Information */}
                <div className="form-row office-info">
                    <div className="form-group">
                        <label htmlFor="office_location">Office Location</label>
                        <input
                            type="text"
                            id="office_location"
                            value={formData.office_location || ''}
                            onChange={(e) => handleInputChange('office_location', e.target.value)}
                            disabled={loading}
                            className="form-input"
                            placeholder="e.g., Room No. 201, Block A"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="office_hours">Office Hours</label>
                        <input
                            type="text"
                            id="office_hours"
                            value={formData.office_hours || ''}
                            onChange={(e) => handleInputChange('office_hours', e.target.value)}
                            disabled={loading}
                            className="form-input"
                            placeholder="e.g., Mon-Fri: 9:00 AM - 5:00 PM"
                        />
                    </div>
                </div>
            </div>

            {/* Contact Summary */}
            <div className="contact-summary">
                <h4>Contact Summary:</h4>
                <div className="summary-grid">
                    {formData.email && (
                        <div className="summary-item">
                            <strong>Email:</strong> {formData.email}
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
                    {formData.extension_no && (
                        <div className="summary-item">
                            <strong>Extension:</strong> {formData.extension_no}
                        </div>
                    )}
                    {formData.office_location && (
                        <div className="summary-item">
                            <strong>Office:</strong> {formData.office_location}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactInformationSection;