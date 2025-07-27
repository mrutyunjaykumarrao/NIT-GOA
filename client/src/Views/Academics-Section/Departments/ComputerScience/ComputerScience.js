import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ComputerScience.css';

const ComputerScience = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('home');

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    return (
        <div className="computer-science-page">
            <div className="computer-science-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Computer Science & Engineering</h1>
                    <p className="page-subtitle">Department of Computer Science and Engineering</p>
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
                                        className={`nav-link ${activeSection === 'research' ? 'nav-active' : ''}`}
                                        onClick={() => handleSectionChange('research')}
                                    >
                                        Research
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
                                        className={`nav-link ${activeSection === 'achievements' ? 'nav-active' : ''}`}
                                        onClick={() => handleSectionChange('achievements')}
                                    >
                                        Achievements
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
                                <h2>Welcome to the Department of Computer Science and Engineering</h2>
                                
                                <div className="content-text">
                                    <p>
                                        The Department of Computer Science and Engineering (CSE) of NIT Goa is one of the founding departments of the institute, started in 2010. It offers 4 years full time B. Tech. degree program, 2 years full time M. Tech. degree program and Ph.D. program in Computer Science and Engineering.
                                    </p>
                                    
                                    <p>
                                        The faculty members of CSE department have expertise in the following areas: mobile computing, context-aware computing, machine learning, mobile virtual communities, e-Health, pervasive health, community healthcare informatics, data mining, wireless sensor networks, information security, network security, cryptography, cloud security, key management, content based information retrieval, pattern recognition, kernel methods for pattern analysis, machine learning, artificial neural networks, computer vision, speech technology, algorithms, computational intelligence, privacy and security, network protocols and wireless networks.
                                    </p>
                                    
                                    <p>
                                        The department invites R & D organizations, public and private sector units to enhance and develop research and teaching interface with faculty and students.
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* Research Section */}
                        {activeSection === 'research' && (
                            <section className="content-section">
                                <h2>Research</h2>
                                <div className="content-text">
                                    <p>
                                        The faculty members of CSE department have expertise in the following areas: mobile computing, context-aware computing, machine learning, mobile virtual communities, e-Health, pervasive health, community healthcare informatics, data mining, wireless sensor networks, information security, network security, cryptography, cloud security, key management, content based information retrieval, pattern recognition, kernel methods for pattern analysis, machine learning, artificial neural networks, computer vision, speech technology, algorithms, computational intelligence, privacy and security, network protocols and wireless networks. The faculty members have published several research papers in these areas in national and international conferences and journals.
                                    </p>
                                    <p>
                                        The department invites R & D organizations, public and private sector units to enhance and develop research and teaching interface with faculty and students.
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* UG Academic Handbook Section */}
                        {activeSection === 'ug-handbook' && (
                            <section className="content-section">
                                <h2>UG Academic Handbook</h2>
                                <div className="content-text">
                                    <p>Download the Undergraduate Academic Handbook for detailed information about the B.Tech CSE curriculum and academic policies.</p>
                                </div>
                            </section>
                        )}

                        {/* PG Academic Handbook Section */}
                        {activeSection === 'pg-handbook' && (
                            <section className="content-section">
                                <h2>PG Academic Handbook</h2>
                                <div className="content-text">
                                    <p>Download the Postgraduate Academic Handbook for detailed information about the M.Tech and Ph.D programs in CSE.</p>
                                </div>
                            </section>
                        )}

                        {/* Achievements Section */}
                        {activeSection === 'achievements' && (
                            <section className="content-section">
                                <h2>Achievements</h2>
                                <div className="content-text">
                                    <p>Our department takes pride in the achievements of our students and faculty members in research, publications, and industry collaborations.</p>
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

export default ComputerScience;
