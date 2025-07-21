import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AppliedSciences.css';
const AppliedSciences = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('home');

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    return (
        <div className="applied-sciences-page">
            <div className="applied-sciences-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Applied Sciences</h1>
                    <p className="page-subtitle">Department of Applied Sciences</p>
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
                                <h2>Welcome to the Department of Applied Sciences</h2>
                                
                                <div className="content-text">
                                    <p>
                                        The Department of Applied Sciences provides foundational knowledge in mathematics, physics, and chemistry that forms the backbone of engineering education. Our department is committed to excellence in teaching and research.
                                    </p>
                                    
                                    <p>
                                        We offer comprehensive courses that bridge the gap between theoretical sciences and practical engineering applications, ensuring students have a strong foundation for their specialized engineering studies.
                                    </p>
                                    
                                    <p>
                                        Our faculty members are dedicated to providing quality education and conducting cutting-edge research in various fields of applied sciences.
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* Faculty Section */}
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

export default AppliedSciences;
