import React, { useState } from 'react';
import './Results.css';

const Results = () => {
    const [selectedProgram, setSelectedProgram] = useState('btech');
    const [selectedSemester, setSelectedSemester] = useState('current');

    const programs = [
        { id: 'btech', name: 'B.Tech', semesters: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'] },
        { id: 'mtech', name: 'M.Tech', semesters: ['I', 'II', 'III', 'IV'] },
        { id: 'phd', name: 'Ph.D', semesters: ['Coursework', 'Comprehensive', 'Research'] }
    ];

    const resultTypes = [
        {
            title: 'Semester Results',
            description: 'Access your semester examination results',
            icon: '📊',
            action: 'View Results',
            features: ['Grade Sheet', 'CGPA Calculation', 'Subject-wise Performance', 'Result History']
        },
        {
            title: 'Supplementary Results',
            description: 'Results for supplementary examinations',
            icon: '📝',
            action: 'Check Status',
            features: ['Re-examination Results', 'Improvement Results', 'Back Paper Status', 'Revaluation Results']
        },
        {
            title: 'Transcripts',
            description: 'Official academic transcripts and certificates',
            icon: '📜',
            action: 'Request Transcript',
            features: ['Official Transcripts', 'Degree Certificates', 'Migration Certificates', 'Character Certificates']
        },
        {
            title: 'Grade Reports',
            description: 'Detailed grade analysis and statistics',
            icon: '📈',
            action: 'Generate Report',
            features: ['Semester-wise Analysis', 'Subject Performance', 'Ranking Information', 'Academic Progress']
        }
    ];

    const announcements = [
        {
            date: '2024-12-15',
            title: 'Even Semester Results 2024',
            type: 'result',
            urgent: true,
            content: 'Results for Even Semester 2024 examinations have been declared. Students can check their results online.'
        },
        {
            date: '2024-12-10',
            title: 'Revaluation Application',
            type: 'notice',
            urgent: false,
            content: 'Applications for revaluation of Even Semester 2024 papers are now open. Last date: 20th December 2024.'
        },
        {
            date: '2024-12-05',
            title: 'Transcript Processing',
            type: 'info',
            urgent: false,
            content: 'Transcript requests are being processed. Expected delivery time: 7-10 working days.'
        },
        {
            date: '2024-11-28',
            title: 'Supplementary Exam Results',
            type: 'result',
            urgent: false,
            content: 'Results for November 2024 supplementary examinations are now available.'
        }
    ];

    const getAnnouncementIcon = (type) => {
        switch (type) {
            case 'result': return '📊';
            case 'notice': return '📢';
            case 'info': return 'ℹ️';
            default: return '📄';
        }
    };

    return (
        <div className="results-page">
            <div className="results-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Results & Academic Records</h1>
                    <p className="page-subtitle">Access your examination results, transcripts, and academic performance</p>
                </div>

                {/* Quick Access Panel */}
                <section className="quick-access-panel">
                    <div className="access-controls">
                        <div className="control-group">
                            <label>Program:</label>
                            <select 
                                value={selectedProgram} 
                                onChange={(e) => setSelectedProgram(e.target.value)}
                                className="results-select"
                            >
                                {programs.map(program => (
                                    <option key={program.id} value={program.id}>{program.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="control-group">
                            <label>Semester:</label>
                            <select 
                                value={selectedSemester} 
                                onChange={(e) => setSelectedSemester(e.target.value)}
                                className="results-select"
                            >
                                <option value="current">Current Semester</option>
                                {programs.find(p => p.id === selectedProgram)?.semesters.map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                        </div>
                        <button className="quick-check-btn">
                            Quick Check Results
                        </button>
                    </div>
                </section>

                {/* Results Services */}
                <section className="results-services">
                    <h2>Academic Services</h2>
                    <div className="services-grid">
                        {resultTypes.map((service, index) => (
                            <div key={index} className="service-card">
                                <div className="service-header">
                                    <div className="service-icon">{service.icon}</div>
                                    <h3>{service.title}</h3>
                                </div>
                                <p className="service-description">{service.description}</p>
                                <ul className="service-features">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx}>{feature}</li>
                                    ))}
                                </ul>
                                <button className="service-action-btn">
                                    {service.action}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Announcements */}
                <section className="results-announcements">
                    <h2>Latest Announcements</h2>
                    <div className="announcements-list">
                        {announcements.map((announcement, index) => (
                            <div key={index} className={`announcement-card ${announcement.urgent ? 'urgent' : ''}`}>
                                <div className="announcement-header">
                                    <div className="announcement-icon">
                                        {getAnnouncementIcon(announcement.type)}
                                    </div>
                                    <div className="announcement-meta">
                                        <h3>{announcement.title}</h3>
                                        <span className="announcement-date">{announcement.date}</span>
                                        {announcement.urgent && <span className="urgent-badge">Urgent</span>}
                                    </div>
                                </div>
                                <p className="announcement-content">{announcement.content}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Important Information */}
                <section className="important-info">
                    <h2>Important Information</h2>
                    <div className="info-grid">
                        <div className="info-card">
                            <h3>🔒 Student Login Required</h3>
                            <p>Access to results requires valid student credentials. Contact the Academic Office if you face login issues.</p>
                        </div>
                        <div className="info-card">
                            <h3>📞 Academic Helpdesk</h3>
                            <p>For queries regarding results, contact: academic@nitgoa.ac.in or call +91-832-2404200</p>
                        </div>
                        <div className="info-card">
                            <h3>⏰ Result Declaration</h3>
                            <p>Results are typically declared within 6-8 weeks of examination completion. Check announcements regularly.</p>
                        </div>
                        <div className="info-card">
                            <h3>📋 Revaluation Process</h3>
                            <p>Revaluation applications must be submitted within 15 days of result declaration with prescribed fees.</p>
                        </div>
                    </div>
                </section>                {/* External Links */}
                <section className="external-links">
                    <h2>External Resources</h2>
                    <div className="links-grid">
                        <a href="https://www.nitgoa.ac.in/student-portal" target="_blank" rel="noopener noreferrer" className="external-link-card">
                            <div className="link-icon">🌐</div>
                            <h3>Student Portal</h3>
                            <p>Access the official student portal for detailed academic records</p>
                        </a>
                        <a href="https://play.google.com/store/apps/details?id=com.nitgoa" target="_blank" rel="noopener noreferrer" className="external-link-card">
                            <div className="link-icon">📱</div>
                            <h3>Mobile App</h3>
                            <p>Download the NIT Goa mobile app for quick result access</p>
                        </a>
                        <a href="mailto:academic@nitgoa.ac.in?subject=Email Notification Subscription" className="external-link-card">
                            <div className="link-icon">📧</div>
                            <h3>Email Notifications</h3>
                            <p>Subscribe to email alerts for result announcements</p>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Results;
