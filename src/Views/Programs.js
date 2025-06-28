import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Programs.css';

const Programs = () => {
    const navigate = useNavigate();
    const [selectedLevel, setSelectedLevel] = useState('undergraduate');

    const programs = {
        undergraduate: [
            {
                id: 'cse-btech',
                title: 'B.Tech in Computer Science & Engineering',
                code: 'CSE',
                duration: '4 Years',
                seats: 44,
                eligibility: 'JEE Main + 12th with PCM',
                highlights: ['AI/ML Specialization', 'Industry Projects', 'Research Opportunities'],
                subjects: [
                    'Programming Fundamentals',
                    'Data Structures & Algorithms',
                    'Computer Networks',
                    'Database Management',
                    'Software Engineering',
                    'Machine Learning',
                    'Artificial Intelligence',
                    'Web Technologies'
                ],
                careerOptions: [
                    'Software Developer',
                    'Data Scientist',
                    'ML Engineer',
                    'System Analyst',
                    'Product Manager',
                    'Research Scientist'
                ],
                placementStats: {
                    percentage: '95%',
                    averagePackage: '₹8.5 LPA',
                    highestPackage: '₹25 LPA'
                }
            },
            {
                id: 'ece-btech',
                title: 'B.Tech in Electronics & Communication Engineering',
                code: 'ECE',
                duration: '4 Years',
                seats: 44,
                eligibility: 'JEE Main + 12th with PCM',
                highlights: ['VLSI Design', 'Communication Systems', 'Signal Processing'],
                subjects: [
                    'Electronic Devices',
                    'Digital Electronics',
                    'Communication Systems',
                    'Signal Processing',
                    'VLSI Design',
                    'Microprocessors',
                    'Antenna Theory',
                    'Embedded Systems'
                ],
                careerOptions: [
                    'Electronics Engineer',
                    'VLSI Designer',
                    'Communication Engineer',
                    'Embedded Systems Engineer',
                    'R&D Engineer',
                    'Technical Consultant'
                ],
                placementStats: {
                    percentage: '92%',
                    averagePackage: '₹7.8 LPA',
                    highestPackage: '₹22 LPA'
                }
            },
            {
                id: 'eee-btech',
                title: 'B.Tech in Electrical & Electronics Engineering',
                code: 'EEE',
                duration: '4 Years',
                seats: 44,
                eligibility: 'JEE Main + 12th with PCM',
                highlights: ['Power Systems', 'Renewable Energy', 'Smart Grid'],
                subjects: [
                    'Electrical Machines',
                    'Power Systems',
                    'Control Systems',
                    'Power Electronics',
                    'Renewable Energy',
                    'Protection Systems',
                    'High Voltage Engineering',
                    'Smart Grid Technologies'
                ],
                careerOptions: [
                    'Power Engineer',
                    'Control Systems Engineer',
                    'Renewable Energy Specialist',
                    'Grid Engineer',
                    'Project Manager',
                    'Consultant Engineer'
                ],
                placementStats: {
                    percentage: '90%',
                    averagePackage: '₹7.2 LPA',
                    highestPackage: '₹20 LPA'
                }
            },
            {
                id: 'mce-btech',
                title: 'B.Tech in Mechanical Engineering',
                code: 'MCE',
                duration: '4 Years',
                seats: 42,
                eligibility: 'JEE Main + 12th with PCM',
                highlights: ['Manufacturing', 'Robotics', 'Thermal Engineering'],
                subjects: [
                    'Engineering Mechanics',
                    'Thermodynamics',
                    'Fluid Mechanics',
                    'Manufacturing Technology',
                    'Machine Design',
                    'Robotics',
                    'CAD/CAM',
                    'Industrial Engineering'
                ],
                careerOptions: [
                    'Mechanical Engineer',
                    'Design Engineer',
                    'Manufacturing Engineer',
                    'Project Engineer',
                    'Quality Engineer',
                    'Research Engineer'
                ],
                placementStats: {
                    percentage: '88%',
                    averagePackage: '₹6.8 LPA',
                    highestPackage: '₹18 LPA'
                }
            },
            {
                id: 'cve-btech',
                title: 'B.Tech in Civil Engineering',
                code: 'CVE',
                duration: '4 Years',
                seats: 42,
                eligibility: 'JEE Main + 12th with PCM',
                highlights: ['Structural Design', 'Construction Management', 'Environmental Engineering'],
                subjects: [
                    'Structural Analysis',
                    'Concrete Technology',
                    'Geotechnical Engineering',
                    'Transportation Engineering',
                    'Environmental Engineering',
                    'Construction Management',
                    'Water Resources',
                    'Building Planning'
                ],
                careerOptions: [
                    'Civil Engineer',
                    'Structural Engineer',
                    'Project Manager',
                    'Construction Manager',
                    'Environmental Consultant',
                    'Urban Planner'
                ],
                placementStats: {
                    percentage: '85%',
                    averagePackage: '₹6.2 LPA',
                    highestPackage: '₹15 LPA'
                }
            }
        ],
        postgraduate: [
            {
                id: 'cse-mtech',
                title: 'M.Tech in Computer Science & Engineering',
                code: 'CSE',
                duration: '2 Years',
                seats: 27,
                eligibility: 'GATE + B.Tech/B.E. in relevant field',
                highlights: ['Research Focus', 'Advanced Computing', 'Industry Collaboration'],
                subjects: [
                    'Advanced Algorithms',
                    'Machine Learning',
                    'Data Mining',
                    'Computer Vision',
                    'Natural Language Processing',
                    'Distributed Systems',
                    'Research Methodology',
                    'Thesis Work'
                ],
                careerOptions: [
                    'Research Scientist',
                    'Senior Software Engineer',
                    'Data Scientist',
                    'ML Researcher',
                    'Technical Lead',
                    'Academia/Professor'
                ],
                placementStats: {
                    percentage: '98%',
                    averagePackage: '₹12 LPA',
                    highestPackage: '₹35 LPA'
                }
            },
            {
                id: 'vlsi-mtech',
                title: 'M.Tech in VLSI Design',
                code: 'VLSI',
                duration: '2 Years',
                seats: 27,
                eligibility: 'GATE + B.Tech/B.E. in ECE/EEE/CSE',
                highlights: ['Chip Design', 'Industry Projects', 'Advanced Labs'],
                subjects: [
                    'Advanced VLSI Design',
                    'Analog IC Design',
                    'Digital IC Design',
                    'System on Chip',
                    'FPGA Design',
                    'CAD Tools',
                    'Verification Techniques',
                    'Research Project'
                ],
                careerOptions: [
                    'VLSI Design Engineer',
                    'IC Design Engineer',
                    'Verification Engineer',
                    'CAD Engineer',
                    'Research Engineer',
                    'Technical Consultant'
                ],
                placementStats: {
                    percentage: '95%',
                    averagePackage: '₹11 LPA',
                    highestPackage: '₹30 LPA'
                }
            },
            {
                id: 'peps-mtech',
                title: 'M.Tech in Power Electronics & Power Systems',
                code: 'PEPS',
                duration: '2 Years',
                seats: 26,
                eligibility: 'GATE + B.Tech/B.E. in EEE/ECE',
                highlights: ['Power Systems', 'Renewable Energy', 'Smart Grid'],
                subjects: [
                    'Advanced Power Electronics',
                    'Power System Analysis',
                    'Renewable Energy Systems',
                    'Smart Grid Technologies',
                    'Power Quality',
                    'HVDC Systems',
                    'Energy Storage',
                    'Research Dissertation'
                ],
                careerOptions: [
                    'Power Systems Engineer',
                    'Renewable Energy Specialist',
                    'Grid Integration Engineer',
                    'R&D Engineer',
                    'Technical Consultant',
                    'Project Manager'
                ],
                placementStats: {
                    percentage: '92%',
                    averagePackage: '₹10 LPA',
                    highestPackage: '₹25 LPA'
                }
            }
        ],
        doctoral: [
            {
                id: 'cse-phd',
                title: 'Ph.D in Computer Science & Engineering',
                code: 'CSE',
                duration: '3-6 Years',
                seats: 'Variable',
                eligibility: 'M.Tech/M.E. + GATE/NET or equivalent',
                highlights: ['Cutting-edge Research', 'International Publications', 'Industry Collaboration'],
                subjects: [
                    'Advanced Research Methods',
                    'Literature Survey',
                    'Specialized Coursework',
                    'Original Research',
                    'Publications',
                    'Thesis Writing',
                    'Conferences',
                    'Teaching Assistantship'
                ],
                careerOptions: [
                    'Research Scientist',
                    'Professor/Academia',
                    'R&D Head',
                    'Technical Consultant',
                    'Innovation Manager',
                    'Startup Founder'
                ],
                placementStats: {
                    percentage: '100%',
                    averagePackage: '₹15+ LPA',
                    highestPackage: '₹40+ LPA'
                }
            },
            {
                id: 'all-phd',
                title: 'Ph.D in All Engineering Streams',
                code: 'ALL',
                duration: '3-6 Years',
                seats: 'Variable',
                eligibility: 'M.Tech/M.E. + GATE/NET or equivalent',
                highlights: ['Interdisciplinary Research', 'State-of-art Labs', 'Global Exposure'],
                subjects: [
                    'Research Methodology',
                    'Advanced Topics',
                    'Comprehensive Examination',
                    'Research Proposal',
                    'Original Contribution',
                    'Publications',
                    'Thesis Defense',
                    'International Exposure'
                ],
                careerOptions: [
                    'Professor/Academia',
                    'Senior Research Scientist',
                    'CTO/Technical Director',
                    'Policy Advisor',
                    'Innovation Consultant',
                    'Entrepreneur'
                ],
                placementStats: {
                    percentage: '100%',
                    averagePackage: '₹15+ LPA',
                    highestPackage: '₹40+ LPA'
                }
            }
        ]
    };

    const levelTabs = [
        { id: 'undergraduate', label: 'Undergraduate (B.Tech)', icon: '🎓' },
        { id: 'postgraduate', label: 'Postgraduate (M.Tech)', icon: '📚' },
        { id: 'doctoral', label: 'Doctoral (Ph.D)', icon: '🔬' }
    ];

    return (
        <div className="programs-page">
            <div className="programs-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Academic Programs</h1>
                    <p className="page-subtitle">Comprehensive engineering education from undergraduate to doctoral levels</p>
                </div>

                {/* Program Level Tabs */}
                <div className="program-tabs">
                    {levelTabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`tab-button ${selectedLevel === tab.id ? 'active' : ''}`}
                            onClick={() => setSelectedLevel(tab.id)}
                        >
                            <span className="tab-icon">{tab.icon}</span>
                            <span className="tab-label">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Programs Grid */}
                <div className="programs-grid">
                    {programs[selectedLevel].map((program) => (
                        <div key={program.id} className="program-card">
                            <div className="program-header">
                                <div className="program-title">
                                    <h3>{program.title}</h3>
                                    <div className="program-meta">
                                        <span className="duration">⏱️ {program.duration}</span>
                                        <span className="seats">🎯 {program.seats} Seats</span>
                                    </div>
                                </div>
                            </div>

                            <div className="program-content">
                                {/* Eligibility */}
                                <div className="content-section">
                                    <h4>📋 Eligibility</h4>
                                    <p>{program.eligibility}</p>
                                </div>

                                {/* Highlights */}
                                <div className="content-section">
                                    <h4>⭐ Key Highlights</h4>
                                    <div className="highlights">
                                        {program.highlights.map((highlight, idx) => (
                                            <span key={idx} className="highlight-tag">{highlight}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Subjects */}
                                <div className="content-section">
                                    <h4>📚 Key Subjects</h4>
                                    <div className="subjects-grid">
                                        {program.subjects.slice(0, 6).map((subject, idx) => (
                                            <div key={idx} className="subject-item">{subject}</div>
                                        ))}
                                        {program.subjects.length > 6 && (
                                            <div className="subject-item more">+{program.subjects.length - 6} more</div>
                                        )}
                                    </div>
                                </div>

                                {/* Career Options */}
                                <div className="content-section">
                                    <h4>💼 Career Opportunities</h4>
                                    <div className="career-options">
                                        {program.careerOptions.map((career, idx) => (
                                            <span key={idx} className="career-tag">{career}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Placement Stats */}
                                <div className="content-section">
                                    <h4>📊 Placement Statistics</h4>
                                    <div className="placement-stats">
                                        <div className="stat">
                                            <div className="stat-value">{program.placementStats.percentage}</div>
                                            <div className="stat-label">Placement Rate</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-value">{program.placementStats.averagePackage}</div>
                                            <div className="stat-label">Average Package</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-value">{program.placementStats.highestPackage}</div>
                                            <div className="stat-label">Highest Package</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="program-actions">
                                    <button 
                                        className="action-btn primary"
                                        onClick={() => navigate('/admissions')}
                                    >
                                        🎓 Apply Now
                                    </button>
                                    <button 
                                        className="action-btn secondary"
                                        onClick={() => navigate('/academics/regulations')}
                                    >
                                        📋 View Curriculum
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <section className="programs-cta">
                    <div className="cta-content">
                        <h2>Ready to Start Your Journey?</h2>
                        <p>Join NIT Goa and be part of India's premier engineering education</p>
                        <div className="cta-buttons">
                            <button 
                                className="cta-btn primary"
                                onClick={() => navigate('/admissions')}
                            >
                                🎓 Apply for Admission
                            </button>
                            <button 
                                className="cta-btn secondary"
                                onClick={() => navigate('/contact-us')}
                            >
                                💬 Get More Info
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Programs;
