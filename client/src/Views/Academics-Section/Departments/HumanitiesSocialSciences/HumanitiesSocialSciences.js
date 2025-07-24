import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HumanitiesSocialSciences.css';

const HumanitiesSocialSciences = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('home');

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    return (
        <div className="humanities-social-sciences-page">
            <div className="humanities-social-sciences-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Humanities & Social Sciences</h1>
                    <p className="page-subtitle">Department of Humanities and Social Sciences</p>
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
                                <h2>Welcome to Department of Humanities & Social Sciences</h2>
                                
                                <div className="content-text">
                                    <p>
                                        The Department of Humanities and Social Sciences of NIT Goa is multidisciplinary in its orientation and at present it includes two principal disciplines: Economics and English. Apart from these, two new sub-disciplines have been introduced under Humanities. They are Dramaturgy and Health and Happiness. The aim is to offer a contra-disciplinary model, "art-science" education, which is in line with nation-wide epistemic reforms: NEP 2020 and introduction to the Indian Knowledge System.
                                    </p>
                                    
                                    <p>
                                        The department has efficient faculty members, who are dedicated to teaching, research and other co-curricular activities. The objective of the department is not limited to providing only sound understanding of the Social Sciences and English Language needed for engineering graduates, but also to make them realize their potential to become successful engineers. Imparting value-based liberal education to would-be engineers is the ultimate aim of the department and grooming them to take up the emerging global challenges is the vision of the department.
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* UG Academic Handbook Section */}
                        {activeSection === 'ug-handbook' && (
                            <section className="content-section">
                                <h2>UG Academic Handbook</h2>
                                <div className="content-text">
                                    <p>Download the Undergraduate Academic Handbook for detailed information about humanities and social sciences courses and academic policies.</p>
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
                                    <p>Download the Postgraduate Academic Handbook for detailed information about postgraduate programs in humanities and social sciences.</p>
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

export default HumanitiesSocialSciences;
