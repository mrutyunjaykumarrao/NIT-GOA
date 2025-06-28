import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Academics.css';

const Academics = () => {
    const navigate = useNavigate();

    const academicSections = [
        {
            title: 'Departments',
            description: 'Explore our various engineering and science departments',
            icon: '🏢',
            route: '/academics/departments',
            stats: '7 Departments',
            highlights: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Applied Sciences', 'Humanities']
        },
        {
            title: 'Academic Programs',
            description: 'Comprehensive undergraduate and postgraduate programs',
            icon: '📚',
            route: '/academics/programs',
            stats: '15+ Programs',
            highlights: ['B.Tech Programs', 'M.Tech Programs', 'Ph.D Programs', 'Dual Degree']
        },
        {
            title: 'Academic Calendar',
            description: 'Important dates, examinations, and academic events',
            icon: '📅',
            route: '/academic-calendar',
            stats: 'Updated for 2024-25',
            highlights: ['Semester Schedule', 'Exam Dates', 'Holidays', 'Registration Dates']
        },
        {
            title: 'Regulations & Curriculum',
            description: 'Academic regulations, curriculum details, and guidelines',
            icon: '📋',
            route: '/academics/regulations',
            stats: 'Latest Guidelines',
            highlights: ['Academic Rules', 'Curriculum Structure', 'Credit System', 'Grading Policy']
        },
        {
            title: 'Results',
            description: 'Access semester results and academic performance',
            icon: '📊',
            route: '/academics/results',
            stats: 'Live Results',
            highlights: ['Semester Results', 'Grade Reports', 'Transcripts', 'Academic Records']
        },        {
            title: 'Library',
            description: 'Central library resources and digital collections',
            icon: '📖',
            route: '/academics/library',
            stats: '50,000+ Books',
            highlights: ['Digital Library', 'Research Papers', 'E-Journals', 'Study Spaces']
        },
        {
            title: 'Dissertation Formats',
            description: 'Guidelines and templates for thesis and dissertation writing',
            icon: '📄',
            route: '/academics/dissertation-formats',
            stats: 'Latest Templates',
            highlights: ['Ph.D Guidelines', 'M.Tech Templates', 'B.Tech Formats', 'Submission Rules']
        }
    ];

    const handleNavigate = (route) => {
        navigate(route);
    };

    return (
        <div className="academics-page">
            <div className="academics-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Academics</h1>
                    <p className="page-subtitle">Excellence in Engineering Education and Research</p>
                </div>

                {/* Academic Overview */}
                <section className="academic-overview">
                    <div className="overview-content">
                        <h2>Academic Excellence at NIT Goa</h2>
                        <p>
                            The National Institute of Technology Goa is committed to providing world-class engineering education 
                            and fostering innovation through rigorous academic programs. Our comprehensive curriculum combines 
                            theoretical knowledge with practical application, preparing students for leadership roles in technology 
                            and research.
                        </p>
                        <div className="overview-stats">
                            <div className="stat-item">
                                <div className="stat-number">7</div>
                                <div className="stat-label">Departments</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">15+</div>
                                <div className="stat-label">Programs</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">55+</div>
                                <div className="stat-label">Faculty Members</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">900+</div>
                                <div className="stat-label">Students</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Academic Sections Grid */}
                <section className="academic-sections">
                    <h2>Academic Sections</h2>
                    <div className="sections-grid">
                        {academicSections.map((section, index) => (
                            <div 
                                key={index} 
                                className="section-card"
                                onClick={() => handleNavigate(section.route)}
                            >
                                <div className="section-icon">{section.icon}</div>
                                <div className="section-content">
                                    <h3>{section.title}</h3>
                                    <p className="section-description">{section.description}</p>
                                    <div className="section-stats">{section.stats}</div>
                                    <div className="section-highlights">
                                        {section.highlights.map((highlight, idx) => (
                                            <span key={idx} className="highlight-tag">{highlight}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="section-arrow">→</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Access */}
                <section className="quick-access">
                    <h2>Quick Access</h2>
                    <div className="quick-access-grid">
                        <div className="quick-access-card" onClick={() => handleNavigate('/faculty')}>
                            <div className="quick-icon">👨‍🏫</div>
                            <h3>Faculty Directory</h3>
                            <p>Meet our distinguished faculty members</p>
                        </div>
                        <div className="quick-access-card" onClick={() => handleNavigate('/admissions')}>
                            <div className="quick-icon">🎓</div>
                            <h3>Admissions</h3>
                            <p>Apply for our programs</p>
                        </div>
                        <div className="quick-access-card" onClick={() => handleNavigate('/research')}>
                            <div className="quick-icon">🔬</div>
                            <h3>Research</h3>
                            <p>Explore research opportunities</p>
                        </div>
                        <div className="quick-access-card" onClick={() => handleNavigate('/placement')}>
                            <div className="quick-icon">💼</div>
                            <h3>Placements</h3>
                            <p>Career opportunities and placement support</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Academics;
