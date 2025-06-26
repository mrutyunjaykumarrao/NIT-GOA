import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Departments.css';

const Departments = () => {
    const navigate = useNavigate();
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const departments = [
        {
            id: 'cse',
            name: 'Computer Science & Engineering',
            code: 'CSE',
            icon: '💻',
            color: '#4285f4',
            established: '2010',
            hod: 'Dr. Veena Thenkanidiyoor',
            students: 180,
            faculty: 12,
            programs: ['B.Tech', 'M.Tech', 'Ph.D'],
            labs: ['Programming Lab', 'Data Structures Lab', 'AI/ML Lab', 'Network Lab', 'Software Engineering Lab'],
            researchAreas: [
                'Artificial Intelligence & Machine Learning',
                'Data Mining & Analytics',
                'Computer Networks & Security',
                'Software Engineering',
                'Human-Computer Interaction'
            ],
            facilities: [
                'High-Performance Computing Cluster',
                'Advanced Programming Labs',
                'Research Labs with Latest Equipment',
                'Dedicated Project Rooms'
            ],
            achievements: [
                'Best Department Award 2023',
                'High Placement Rate (95%)',
                'Multiple Research Publications',
                'Industry Collaborations'
            ]
        },
        {
            id: 'ece',
            name: 'Electronics & Communication Engineering',
            code: 'ECE',
            icon: '📡',
            color: '#ff9800',
            established: '2010',
            hod: 'Dr. Veerakumar',
            students: 176,
            faculty: 11,
            programs: ['B.Tech', 'M.Tech', 'Ph.D'],
            labs: ['Digital Electronics Lab', 'Communication Lab', 'Microprocessor Lab', 'VLSI Lab', 'Signal Processing Lab'],
            researchAreas: [
                'VLSI Design & Embedded Systems',
                'Digital Signal Processing',
                'Wireless Communication',
                'Microwave Engineering',
                'Image Processing'
            ],
            facilities: [
                'Advanced VLSI Design Tools',
                'Communication System Labs',
                'RF & Microwave Labs',
                'Digital Signal Processing Labs'
            ],
            achievements: [
                'Excellence in VLSI Research',
                'Industry Project Collaborations',
                'Patent Publications',
                'Student Innovation Awards'
            ]
        },
        {
            id: 'eee',
            name: 'Electrical & Electronics Engineering',
            code: 'EEE',
            icon: '⚡',
            color: '#f44336',
            established: '2010',
            hod: 'Dr. Suresh Mikkili',
            students: 176,
            faculty: 9,
            programs: ['B.Tech', 'M.Tech (PEPS)', 'Ph.D'],
            labs: ['Electrical Machines Lab', 'Power Electronics Lab', 'Control Systems Lab', 'Power Systems Lab', 'Renewable Energy Lab'],
            researchAreas: [
                'Power Electronics & Drives',
                'Renewable Energy Systems',
                'Smart Grid Technologies',
                'Control Systems',
                'Power Quality'
            ],
            facilities: [
                'High Voltage Laboratory',
                'Power Electronics Lab',
                'Renewable Energy Research Lab',
                'Advanced Control Systems Lab'
            ],
            achievements: [
                'Smart Grid Research Excellence',
                'Renewable Energy Projects',
                'Industry Partnerships',
                'Innovation in Power Systems'
            ]
        },
        {
            id: 'mce',
            name: 'Mechanical Engineering',
            code: 'MCE',
            icon: '⚙️',
            color: '#9c27b0',
            established: '2010',
            hod: 'Dr. Prasenjit Dey',
            students: 168,
            faculty: 10,
            programs: ['B.Tech', 'Ph.D'],
            labs: ['Manufacturing Lab', 'Thermal Engineering Lab', 'Fluid Mechanics Lab', 'CAD/CAM Lab', 'Robotics Lab'],
            researchAreas: [
                'Manufacturing Technology',
                'Thermal Engineering',
                'Robotics & Automation',
                'Materials Science',
                'Computational Fluid Dynamics'
            ],
            facilities: [
                'Advanced Manufacturing Lab',
                'Thermal Analysis Equipment',
                'CAD/CAM/CAE Software',
                'Materials Testing Lab'
            ],
            achievements: [
                'Innovation in Manufacturing',
                'Robotics Research Projects',
                'Industry Collaborations',
                'Student Competition Wins'
            ]
        },
        {
            id: 'cve',
            name: 'Civil Engineering',
            code: 'CVE',
            icon: '🏗️',
            color: '#795548',
            established: '2010',
            hod: 'Dr. Harikumar M',
            students: 168,
            faculty: 8,
            programs: ['B.Tech', 'Ph.D'],
            labs: ['Structural Engineering Lab', 'Geotechnical Lab', 'Environmental Lab', 'Transportation Lab', 'Surveying Lab'],
            researchAreas: [
                'Structural Engineering',
                'Geotechnical Engineering',
                'Environmental Engineering',
                'Transportation Engineering',
                'Construction Management'
            ],
            facilities: [
                'Universal Testing Machine',
                'Concrete Technology Lab',
                'Soil Mechanics Lab',
                'Environmental Analysis Lab'
            ],
            achievements: [
                'Sustainable Construction Research',
                'Infrastructure Development Projects',
                'Environmental Impact Studies',
                'Community Outreach Programs'
            ]
        },
        {
            id: 'aps',
            name: 'Applied Sciences',
            code: 'APS',
            icon: '🔬',
            color: '#607d8b',
            established: '2010',
            hod: 'Dr. L. Shangerganesh',
            students: 'All Departments',
            faculty: 8,
            programs: ['Ph.D', 'Core Courses for all B.Tech'],
            labs: ['Physics Lab', 'Chemistry Lab', 'Mathematics Lab', 'Language Lab'],
            researchAreas: [
                'Mathematical Modeling',
                'Materials Science',
                'Computational Physics',
                'Analytical Chemistry',
                'Applied Mathematics'
            ],
            facilities: [
                'Advanced Physics Labs',
                'Chemical Analysis Equipment',
                'Computational Facilities',
                'Research Instrumentation'
            ],
            achievements: [
                'Excellence in Basic Sciences',
                'Research Publications',
                'Innovation in Teaching',
                'Student Academic Support'
            ]
        },
        {
            id: 'hss',
            name: 'Humanities & Social Sciences',
            code: 'HSS',
            icon: '📚',
            color: '#3f51b5',
            established: '2010',
            hod: 'Dr. Sarani Ghosal Mondal',
            students: 'All Departments',
            faculty: 4,
            programs: ['Ph.D', 'Core Courses for all B.Tech'],
            labs: ['Language Lab', 'Communication Skills Lab', 'Digital Humanities Lab'],
            researchAreas: [
                'Applied Linguistics',
                'English Language Teaching',
                'Philosophy & Ethics',
                'Economics',
                'Management Studies'
            ],
            facilities: [
                'Language Laboratory',
                'Communication Skills Center',
                'Digital Learning Resources',
                'Seminar Halls'
            ],
            achievements: [
                'Excellence in Communication Skills',
                'Student Development Programs',
                'Cultural Activities',
                'Personality Development'
            ]
        }
    ];

    const handleViewFaculty = (deptCode) => {
        navigate(`/faculty?dept=${deptCode.toLowerCase()}`);
    };

    const handleDepartmentClick = (dept) => {
        setSelectedDepartment(selectedDepartment?.id === dept.id ? null : dept);
    };

    return (
        <div className="departments-page">
            <div className="departments-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Departments</h1>
                    <p className="page-subtitle">Explore our world-class engineering and science departments</p>
                </div>

                {/* Departments Overview */}
                <section className="departments-overview">
                    <div className="overview-stats">
                        <div className="overview-stat">
                            <div className="stat-number">7</div>
                            <div className="stat-label">Departments</div>
                        </div>
                        <div className="overview-stat">
                            <div className="stat-number">55+</div>
                            <div className="stat-label">Faculty Members</div>
                        </div>
                        <div className="overview-stat">
                            <div className="stat-number">900+</div>
                            <div className="stat-label">Students</div>
                        </div>
                        <div className="overview-stat">
                            <div className="stat-number">15+</div>
                            <div className="stat-label">Programs</div>
                        </div>
                    </div>
                </section>

                {/* Departments Grid */}
                <section className="departments-grid">
                    {departments.map((dept) => (
                        <div key={dept.id} className="department-card">
                            <div 
                                className="department-header"
                                style={{ borderLeftColor: dept.color }}
                                onClick={() => handleDepartmentClick(dept)}
                            >
                                <div className="department-icon" style={{ color: dept.color }}>
                                    {dept.icon}
                                </div>
                                <div className="department-info">
                                    <h3>{dept.name}</h3>
                                    <div className="department-code">({dept.code})</div>
                                    <div className="department-stats">
                                        <span>👨‍🏫 {dept.faculty} Faculty</span>
                                        <span>🎓 {dept.students} Students</span>
                                        <span>📅 Est. {dept.established}</span>
                                    </div>
                                </div>
                                <div className="expand-arrow">
                                    {selectedDepartment?.id === dept.id ? '▼' : '▶'}
                                </div>
                            </div>

                            {selectedDepartment?.id === dept.id && (
                                <div className="department-details">
                                    <div className="details-grid">
                                        <div className="detail-section">
                                            <h4>👨‍💼 Head of Department</h4>
                                            <p>{dept.hod}</p>
                                        </div>

                                        <div className="detail-section">
                                            <h4>🎓 Programs Offered</h4>
                                            <div className="program-tags">
                                                {dept.programs.map((program, idx) => (
                                                    <span key={idx} className="program-tag">{program}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="detail-section">
                                            <h4>🔬 Laboratories</h4>
                                            <ul className="labs-list">
                                                {dept.labs.map((lab, idx) => (
                                                    <li key={idx}>{lab}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="detail-section">
                                            <h4>🔍 Research Areas</h4>
                                            <ul className="research-list">
                                                {dept.researchAreas.map((area, idx) => (
                                                    <li key={idx}>{area}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="detail-section">
                                            <h4>🏢 Facilities</h4>
                                            <ul className="facilities-list">
                                                {dept.facilities.map((facility, idx) => (
                                                    <li key={idx}>{facility}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="detail-section">
                                            <h4>🏆 Achievements</h4>
                                            <ul className="achievements-list">
                                                {dept.achievements.map((achievement, idx) => (
                                                    <li key={idx}>{achievement}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="department-actions">
                                        <button 
                                            className="action-btn primary"
                                            onClick={() => handleViewFaculty(dept.code)}
                                        >
                                            👨‍🏫 View Faculty
                                        </button>
                                        <button 
                                            className="action-btn secondary"
                                            onClick={() => navigate('/academics/programs')}
                                        >
                                            📚 View Programs
                                        </button>
                                        <button 
                                            className="action-btn secondary"
                                            onClick={() => navigate('/research')}
                                        >
                                            🔬 Research Areas
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </section>

                {/* Call to Action */}
                <section className="departments-cta">
                    <div className="cta-content">
                        <h2>Interested in Joining Us?</h2>
                        <p>Explore our admission process and start your journey at NIT Goa</p>
                        <div className="cta-buttons">
                            <button 
                                className="cta-btn primary"
                                onClick={() => navigate('/admissions')}
                            >
                                🎓 Apply Now
                            </button>
                            <button 
                                className="cta-btn secondary"
                                onClick={() => navigate('/contact-us')}
                            >
                                📞 Contact Us
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Departments;
