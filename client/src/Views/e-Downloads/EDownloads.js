import React, { useState } from 'react';
import './EDownloads.css';
import data from './data.json';

const EDownloads = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="edownloads-page">
      <div className="edownloads-container">
        <div className="edownloads-header">
          <h1 className="edownloads-title">e-Downloads</h1>
          <p className="edownloads-subtitle">Access important documents and resources</p>
        </div>

        <div className="edownloads-content">
          {/* For Faculty And Staff Section */}
          <div className="edownloads-section">
            <div 
              className={`edownloads-section-header ${openSection === 'faculty' ? 'active' : ''}`}
              onClick={() => toggleSection('faculty')}
            >
              <h2 className="edownloads-section-title">For Faculty And Staff</h2>
              <div className={`edownloads-arrow ${openSection === 'faculty' ? 'rotated' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>
            
            <div className={`edownloads-section-content ${openSection === 'faculty' ? 'expanded' : ''}`}>
              <div className="edownloads-items">
                {data.faculty.map((item, index) => (
                  <div key={index} className="edownloads-card">
                    <h3 className="edownloads-card-title">{item.file_name}</h3>
                    <button 
                      className="edownloads-download-btn"
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

          {/* For Students Section */}
          <div className="edownloads-section">
            <div 
              className={`edownloads-section-header ${openSection === 'students' ? 'active' : ''}`}
              onClick={() => toggleSection('students')}
            >
              <h2 className="edownloads-section-title">For Students</h2>
              <div className={`edownloads-arrow ${openSection === 'students' ? 'rotated' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>
            
            <div className={`edownloads-section-content ${openSection === 'students' ? 'expanded' : ''}`}>
              <div className="edownloads-items">
                {data.students.map((item, index) => (
                  <div key={index} className="edownloads-card">
                    <h3 className="edownloads-card-title">{item.file_name}</h3>
                    <button 
                      className="edownloads-download-btn"
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

export default EDownloads;
