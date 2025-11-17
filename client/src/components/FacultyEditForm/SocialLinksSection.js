import React from 'react';

const SocialLinksSection = ({ formData, setFormData, loading }) => {

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="faculty-edit-components-form-section">
            <h3 className="faculty-edit-section-title">Social Links</h3>
            
            <div className="faculty-edit-form-grid">
                <div className="faculty-edit-form-group">
                    <label htmlFor="linkedin_url">LinkedIn</label>
                    <input
                        type="url"
                        id="linkedin_url"
                        value={formData.linkedin_url || ''}
                        onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                        disabled={loading}
                        className="faculty-edit-form-input"
                        placeholder="https://linkedin.com/in/username"
                    />
                </div>

                <div className="faculty-edit-form-group">
                    <label htmlFor="personal_website_url">Personal Website</label>
                    <input
                        type="url"
                        id="personal_website_url"
                        value={formData.personal_website_url || ''}
                        onChange={(e) => handleInputChange('personal_website_url', e.target.value)}
                        disabled={loading}
                        className="faculty-edit-form-input"
                        placeholder="https://yourwebsite.com"
                    />
                </div>

                <div className="faculty-edit-form-group">
                    <label htmlFor="google_scholar_url">Google Scholar</label>
                    <input
                        type="url"
                        id="google_scholar_url"
                        value={formData.google_scholar_url || ''}
                        onChange={(e) => handleInputChange('google_scholar_url', e.target.value)}
                        disabled={loading}
                        className="faculty-edit-form-input"
                        placeholder="https://scholar.google.com/citations?user=..."
                    />
                </div>

                <div className="faculty-edit-form-group">
                    <label htmlFor="research_gate_url">ResearchGate</label>
                    <input
                        type="url"
                        id="research_gate_url"
                        value={formData.research_gate_url || ''}
                        onChange={(e) => handleInputChange('research_gate_url', e.target.value)}
                        disabled={loading}
                        className="faculty-edit-form-input"
                        placeholder="https://researchgate.net/profile/..."
                    />
                </div>
            </div>
        </div>
    );
};

export default SocialLinksSection;
