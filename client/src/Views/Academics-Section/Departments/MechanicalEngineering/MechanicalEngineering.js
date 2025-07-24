import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MechanicalEngineering.css';

const MechanicalEngineering = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('home');

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    return (
        <div className="mechanical-engineering-page">
            <div className="mechanical-engineering-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Mechanical Engineering</h1>
                    <p className="page-subtitle">Department of Mechanical Engineering</p>
                </div>

                {/* Main Content Layout */}
                <div className="main-layout">
                    {/* Sidebar Navigation */}
                    <aside className="department-sidebar">
                        <nav className="department-nav">
                            <ul className="nav-list">
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'home' ? 'nav-active' : ''}`}
                                        onClick={() => handleSectionChange('home')}
                                    >
                                        Home
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'faculty' ? 'nav-active' : ''}`}
                                        onClick={() => handleNavigation('/faculty')}
                                    >
                                        Faculty
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'ug-handbook' ? 'nav-active' : ''}`}
                                        onClick={() => handleSectionChange('ug-handbook')}
                                    >
                                        UG Academic Handbook
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'pg-handbook' ? 'nav-active' : ''}`}
                                        onClick={() => handleSectionChange('pg-handbook')}
                                    >
                                        PG Academic Handbook
                                    </button>
                                </li>

                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'handbook' ? 'nav-active' : ''}`}
                                        onClick={() => handleSectionChange('handbook')}
                                    >
                                        Handbook
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <main className="department-content">
                        {/* Home Section */}
                        {activeSection === 'home' && (
                            <section className="content-section">
                                <h2>Welcome to the Department of Mechanical Engineering</h2>
                                
                                <div className="content-text">
                                    <p>
                                        The Department of Mechanical Engineering was established in the year 2018. It offers Undergraduate (B.Tech.) program in the field of Mechanical Engineering. The Institution and the faculty members are committed to provide the finest possible education to the students.
                                    </p>
                                    
                                    <p>
                                        Though it is relatively a newly introduced stream, every care is taken to ensure that the quality of education is not compromised. The lab, library facilities and other infrastructure are regularly upgraded with the support from the institute and our Director Sir.
                                    </p>
                                    
                                    <p>
                                        To ensure that good exposure to Mechanical Engineering is provided, the students are taken to NIT Suratkal Laboratories. Guest Lectures from Eminent people are also arranged.
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* UG Academic Handbook Section */}
                        {activeSection === 'ug-handbook' && (
                            <section className="content-section">
                                <h2>UG Academic Handbook</h2>
                                <div className="content-text">
                                    <p>Download the Undergraduate Academic Handbook for detailed information about the curriculum and academic policies.</p>
                                    <div className="handbook-link">
                                        <a 
                                            href="https://www.nitgoa.ac.in/static/AcademicHandbook_%2030_9_2013-CSE.pdf" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="handbook-download-btn"
                                        >
                                            📖 Download UG Academic Handbook (PDF)
                                        </a>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* PG Academic Handbook Section */}
                        {activeSection === 'pg-handbook' && (
                            <section className="content-section">
                                <h2>PG Academic Handbook</h2>
                                <div className="content-text">
                                    <p>Download the Postgraduate Academic Handbook for detailed information about the curriculum and academic policies.</p>
                                    <div className="handbook-link">
                                        <a 
                                            href="https://www.nitgoa.ac.in/static/PG%20Academic%20Handbook%20M.%20Tech%20(CSE).pdf" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="handbook-download-btn"
                                        >
                                            📚 Download PG Academic Handbook (PDF)
                                        </a>
                                    </div>
                                </div>
                            </section>
                        )}



                        {/* Handbook Section */}
                        {activeSection === 'handbook' && (
                            <section className="content-section">
                                <h2>Handbook</h2>
                                <div className="content-text">
                                    <p>General handbook and department-specific information for students and faculty.</p>
                                </div>
                            </section>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MechanicalEngineering;
