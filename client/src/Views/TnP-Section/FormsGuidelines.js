import React, { useState } from 'react';
import './FormsGuidelines.css';
import data from './forms&guidlines_data.json';

const FormsGuidelines = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="forms-guidelines-page">
      <div className="forms-guidelines-container">
        <div className="forms-guidelines-header">
          <h1 className="forms-guidelines-title">Forms & Guidelines</h1>
          <p className="forms-guidelines-subtitle">Training & Placement - Internship Forms and Guidelines</p>
        </div>

        <div className="forms-guidelines-content">
          {/* Internship at External Organisation Section */}
          <div className="forms-guidelines-section">
            <div 
              className={`forms-guidelines-section-header ${openSection === 'external' ? 'active' : ''}`}
              onClick={() => toggleSection('external')}
            >
              <h2 className="forms-guidelines-section-title">Internship at External Organisation</h2>
              <div className={`forms-guidelines-arrow ${openSection === 'external' ? 'rotated' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>
            
            <div className={`forms-guidelines-section-content ${openSection === 'external' ? 'expanded' : ''}`}>
              <div className="forms-guidelines-items">
                {data.internship_at_external_organisation.map((item, index) => (
                  <div key={index} className="forms-guidelines-card">
                    <h3 className="forms-guidelines-card-title">{item.file_name}</h3>
                    <button 
                      className="forms-guidelines-download-btn"
                      onClick={() => handleDownload(item.link)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Internship at NITGOA Section */}
          <div className="forms-guidelines-section">
            <div 
              className={`forms-guidelines-section-header ${openSection === 'nitgoa' ? 'active' : ''}`}
              onClick={() => toggleSection('nitgoa')}
            >
              <h2 className="forms-guidelines-section-title">Internship at NIT Goa</h2>
              <div className={`forms-guidelines-arrow ${openSection === 'nitgoa' ? 'rotated' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>
            
            <div className={`forms-guidelines-section-content ${openSection === 'nitgoa' ? 'expanded' : ''}`}>
              <div className="forms-guidelines-items">
                {data.internship_at_nitgoa.map((item, index) => (
                  <div key={index} className="forms-guidelines-card">
                    <h3 className="forms-guidelines-card-title">{item.file_name}</h3>
                    <button 
                      className="forms-guidelines-download-btn"
                      onClick={() => handleDownload(item.link)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Internship Report Writing Guidelines Section */}
          <div className="forms-guidelines-section">
            <div 
              className={`forms-guidelines-section-header ${openSection === 'guidelines' ? 'active' : ''}`}
              onClick={() => toggleSection('guidelines')}
            >
              <h2 className="forms-guidelines-section-title">Internship Report Writing Guidelines</h2>
              <div className={`forms-guidelines-arrow ${openSection === 'guidelines' ? 'rotated' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>
            
            <div className={`forms-guidelines-section-content ${openSection === 'guidelines' ? 'expanded' : ''}`}>
              <div className="forms-guidelines-items">
                {data.internship_report_writing_guidelines.map((item, index) => (
                  <div key={index} className="forms-guidelines-card">
                    <h3 className="forms-guidelines-card-title">{item.file_name}</h3>
                    <button 
                      className="forms-guidelines-download-btn"
                      onClick={() => handleDownload(item.link)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormsGuidelines;
