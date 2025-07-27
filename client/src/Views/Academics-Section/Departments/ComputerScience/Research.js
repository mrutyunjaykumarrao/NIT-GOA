import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ComputerScience.css';

const ComputerScienceResearch = () => {
    const navigate = useNavigate();

    const handleBackToDepartment = () => {
        navigate('/academics/computer-science');
    };

    const handleHomeNavigation = () => {
        navigate('/');
    };

    return (
        <div className="computer-science-page">
            <div className="computer-science-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Research</h1>
                    <p className="page-subtitle">Computer Science & Engineering Research Areas</p>
                </div>

                {/* Main Content */}
                <div className="computer-science-content">
                    <div className="content-section">
                        <h2>Research Expertise and Areas</h2>
                        
                        <div className="content-text">
                            <p>
                                The faculty members of CSE department have expertise in the following areas: mobile computing, context-aware computing, machine learning, mobile virtual communities, e-Health, pervasive health, community healthcare informatics, data mining, wireless sensor networks, information security, network security, cryptography, cloud security, key management, content based information retrieval, pattern recognition, kernel methods for pattern analysis, machine learning, artificial neural networks, computer vision, speech technology, algorithms, computational intelligence, privacy and security, network protocols and wireless networks.
                            </p>
                            
                            <p>
                                The faculty members have published several research papers in these areas in national and international conferences and journals.
                            </p>
                            
                            <p>
                                The department invites R & D organizations, public and private sector units to enhance and develop research and teaching interface with faculty and students.
                            </p>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="department-navigation">
                            <button 
                                className="nav-btn"
                                onClick={handleHomeNavigation}
                            >
                                Home
                            </button>
                            
                            <button 
                                className="nav-btn"
                                onClick={handleBackToDepartment}
                            >
                                Back to Department
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComputerScienceResearch;
