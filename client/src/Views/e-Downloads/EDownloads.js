import React, { useState } from 'react';
import './EDownloads.css';

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
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Nomination form for Death-Cum-Retirement Gratuity</h3>
                  <button 
                    className="edownloads-download-btn"
                    onClick={() => handleDownload('https://www.nitgoa.ac.in/uploads/DCRG%20form.pdf')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Nomination form for Leave Encashment</h3>
                  <button 
                    className="edownloads-download-btn"
                    onClick={() => handleDownload('https://www.nitgoa.ac.in/uploads/LEAVE%20ENCASHMENT%20NOMINATION%20FORM.pdf')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Guest House Requisition Form</h3>
                  <button 
                    className="edownloads-download-btn"
                    onClick={() => handleDownload('https://www.nitgoa.ac.in/uploads/guesthouseform.pdf')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Application/Issue of NOC for outside Job</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Joining Report After Availing Leave</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Residential Accommodation Related Documents</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Seminar Hall Requisition Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Asset Declaration/Annual Property Returns Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">APAR for Faculty Members</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">APAR for Group A Non-Teaching Members</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">APAR for Group B & C Non-Teaching Members</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Air Ticket Booking Instructions</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Instructions on Booking of LTC</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">LTC Application Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">LTC Claim Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Self Declaration Certificate for completion of Journey</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Casual Leave RH Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Earned Leave Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Medical Leave Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Maternity Leave Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Paternity Leave Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Child Care Leave Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Guidelines for Seed Money</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Application form for Seed Money</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Seed Money Proposal Format</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Instructions for medical reimbursement</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Medical Claim Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Instructions for children education allowance</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Children education allowance claim form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Working Hours</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">CPDA FORM A</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">CPDA FORM B</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">CPDA FORM C</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">TA-DA FORM</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Travel Allowance Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Cash Advance Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Advance Adjustment Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Payment Process Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Medical Claim Form B (For Admitted Patient)</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">PFMS Mandate Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Purchase Related Forms</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Family Dependency Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Joint Declaration Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Format for Administration cum Financial Approval ON NOTE by Indentor</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Telephone Reimbursement Form</h3>
                  <button className="edownloads-download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
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
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Form for documents from Academic Section</h3>
                  <button 
                    className="edownloads-download-btn"
                    onClick={() => handleDownload('https://www.nitgoa.ac.in/static/Form%20for%20documents%20from%20Academic%20Section.pdf')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Forms for B.Tech Students</h3>
                  <button 
                    className="edownloads-download-btn"
                    onClick={() => handleDownload('https://www.nitgoa.ac.in/btechforms.html')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    View Forms
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Forms for M.Tech Students</h3>
                  <button 
                    className="edownloads-download-btn"
                    onClick={() => handleDownload('https://www.nitgoa.ac.in/mtechforms.html')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    View Forms
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Forms for Ph.D Students</h3>
                  <button 
                    className="edownloads-download-btn"
                    onClick={() => handleDownload('https://www.nitgoa.ac.in/phdforms.html')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    View Forms
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">No Dues Proforma for students</h3>
                  <button 
                    className="edownloads-download-btn"
                    onClick={() => handleDownload('https://www.nitgoa.ac.in/static/No%20Dues%20Form%20Student%205%20June2024.pdf')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Leave Rules for Ph.D. (Full-time) and M.Tech. (Full-time) Students</h3>
                  <button 
                    className="edownloads-download-btn"
                    onClick={() => handleDownload('https://www.nitgoa.ac.in/static/Leave_Rules_30march2023.pdf')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Rules for withdrawal of Admission (B.Tech./M.Tech./Ph.D.)</h3>
                  <button 
                    className="edownloads-download-btn"
                    onClick={() => handleDownload('https://www.nitgoa.ac.in/static/Rules_for_withdrawal_of_Admission_30march2023.pdf')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Travel Allowance Form</h3>
                  <button 
                    className="edownloads-download-btn"
                    onClick={() => handleDownload('https://www.nitgoa.ac.in/static/Travel_Allowance_Form.pdf')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Ph. D Contingency Reimbursement Form</h3>
                  <button 
                    className="edownloads-download-btn"
                    onClick={() => handleDownload('https://www.nitgoa.ac.in/static/Ph.D_Contignecy_Claim_Form_24June2017.pdf')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">Hospitalization and Domiciliary Benefit Policy Claim Form</h3>
                  <button 
                    className="edownloads-download-btn"
                    onClick={() => handleDownload('https://www.nitgoa.ac.in/static/Hospitalization_and_Domiciliary_Benefit_Policy_Claim_Form_23feb2018.PDF')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
                
                <div className="edownloads-card">
                  <h3 className="edownloads-card-title">TA/DA Form</h3>
                  <button 
                    className="edownloads-download-btn"
                    onClick={() => handleDownload('https://www.nitgoa.ac.in/static/TADA_form.pdf')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EDownloads;
