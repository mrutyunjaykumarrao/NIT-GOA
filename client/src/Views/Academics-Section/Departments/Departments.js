import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Departments.css';
import useScrollToTop from '../../../utils/useScrollToTop';

const Departments = () => {
    // Handle smooth scroll to top for quick link navigation
    useScrollToTop();
    
    const navigate = useNavigate();

    const departments = [
        {
            id: 'cse',
            name: 'Computer Science & Engineering',
            code: 'CSE',
            
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

    // eslint-disable-next-line no-unused-vars
    const handleViewFaculty = (deptCode) => {
        navigate(`/faculty?dept=${deptCode.toLowerCase()}`);
    };

    const handleDepartmentClick = (deptId) => {
        switch (deptId) {
            case 'cse':
                navigate('/academics/computer-science');
                break;
            case 'ece':
                navigate('/academics/electronics-communication');
                break;
            case 'eee':
                navigate('/academics/electrical-electronics');
                break;
            case 'mce':
                navigate('/academics/mechanical-engineering');
                break;
            case 'cve':
                navigate('/academics/civil-engineering');
                break;
            case 'aps':
                navigate('/academics/applied-sciences');
                break;
            case 'hss':
                navigate('/academics/humanities-social-sciences');
                break;
            default:
                // For any future departments
                break;
        }
    };

    return (
        <div className="departments-page">
            <div className="departments-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Departments</h1>
                    <p className="page-subtitle">Explore our world-class engineering and science departments</p>
                </div>

                {/* Departments Grid */}
                <section className="departments-grid">
                    {departments.map((dept) => (
                        <div 
                            key={dept.id} 
                            className="department-card"
                            onClick={() => handleDepartmentClick(dept.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div 
                                className="department-header"
                                style={{ borderLeftColor: dept.color }}
                            >
                                <div className="department-main-content">
                                    <div className="department-icon" style={{ color: dept.color }}>
                                        {dept.icon}
                                    </div>
                                    <div className="department-info">
                                        <h3>{dept.name}</h3>
                                        <div className="department-code">({dept.code})</div>
                                    </div>
                                </div>
                                <div className="department-stats">
                                    <span> {dept.faculty} Faculty</span>
                                    <span> {dept.students} Students</span>
                                    <span> Est. {dept.established}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default Departments;
