import React, { useState } from 'react';
import './Regulations.css';

const Regulations = () => {
    const [selectedCategory, setSelectedCategory] = useState('academic');

    const regulationsData = {
        academic: {
            title: 'Academic Regulations',
            icon: '📚',
            sections: [
                {
                    title: 'Admission and Registration',
                    content: [
                        'Students must register for courses at the beginning of each semester',
                        'Late registration may be permitted with penalty fees',
                        'Maximum course load: 26 credits per semester',
                        'Minimum course load: 12 credits per semester for regular students',
                        'Course withdrawal deadline: 60% of semester completion'
                    ]
                },
                {
                    title: 'Attendance Requirements',
                    content: [
                        'Minimum 75% attendance required in each course',
                        'Students with less than 75% attendance will be barred from examinations',
                        'Medical leave requires proper documentation',
                        'Attendance condonment possible in exceptional cases',
                        'Regular monitoring through biometric systems'
                    ]
                },
                {
                    title: 'Examination System',
                    content: [
                        'Continuous evaluation through assignments, quizzes, and practicals',
                        'Mid-semester examination: 30% weightage',
                        'End-semester examination: 50% weightage',
                        'Internal assessment: 20% weightage',
                        'Re-examination permitted for failed courses'
                    ]
                },
                {
                    title: 'Grading System',
                    content: [
                        'Letter grades: S, A, B, C, D, F',
                        'Grade points: S=10, A=9, B=8, C=7, D=6, F=0',
                        'SGPA calculated each semester',
                        'CGPA maintained throughout the program',
                        'Minimum CGPA of 6.0 required for graduation'
                    ]
                }
            ]
        },
        curriculum: {
            title: 'Curriculum Structure',
            icon: '🎯',
            sections: [
                {
                    title: 'B.Tech Curriculum Framework',
                    content: [
                        'Total credits required: 160-170 credits',
                        'Core courses: 60-70% of total credits',
                        'Elective courses: 20-25% of total credits',
                        'Project work: 10-15% of total credits',
                        'Industrial training/internship mandatory'
                    ]
                },
                {
                    title: 'Course Categories',
                    content: [
                        'Basic Science Courses (Mathematics, Physics, Chemistry)',
                        'Engineering Science Courses',
                        'Professional Core Courses',
                        'Professional Elective Courses',
                        'Open Electives and Humanities'
                    ]
                },
                {
                    title: 'M.Tech Curriculum',
                    content: [
                        'Total credits required: 64 credits',
                        'Coursework: 40 credits minimum',
                        'Dissertation: 24 credits',
                        'Research methodology course mandatory',
                        'Minimum 2 publications expected'
                    ]
                },
                {
                    title: 'Ph.D Requirements',
                    content: [
                        'Coursework: 16 credits minimum',
                        'Comprehensive examination after coursework',
                        'Research proposal defense',
                        'Annual progress evaluation',
                        'Thesis defense and viva voce'
                    ]
                }
            ]
        },
        assessment: {
            title: 'Assessment & Evaluation',
            icon: '📊',
            sections: [
                {
                    title: 'Continuous Assessment',
                    content: [
                        'Regular assignments and quizzes (10%)',
                        'Laboratory practicals and reports (10%)',
                        'Mid-semester examination (30%)',
                        'End-semester examination (50%)',
                        'Project presentations and viva voce'
                    ]
                },
                {
                    title: 'Project Evaluation',
                    content: [
                        'Project proposal and literature survey',
                        'Progress presentations (2-3 per semester)',
                        'Interim project report submission',
                        'Final project demonstration',
                        'Thesis/report evaluation by external examiner'
                    ]
                },
                {
                    title: 'Research Evaluation (Ph.D)',
                    content: [
                        'Annual research progress review',
                        'Publications in peer-reviewed journals',
                        'Conference presentations',
                        'Thesis evaluation by external experts',
                        'Open defense and viva voce examination'
                    ]
                }
            ]
        },
        student: {
            title: 'Student Guidelines',
            icon: '👨‍🎓',
            sections: [
                {
                    title: 'Code of Conduct',
                    content: [
                        'Maintain discipline and decorum on campus',
                        'Respect faculty, staff, and fellow students',
                        'No ragging or harassment of any kind',
                        'Proper dress code to be maintained',
                        'Smoking and alcohol prohibited on campus'
                    ]
                },
                {
                    title: 'Academic Integrity',
                    content: [
                        'No plagiarism in assignments or projects',
                        'Proper citation and referencing required',
                        'Original work expected in all submissions',
                        'Collaboration permitted only when explicitly allowed',
                        'Strict action against academic dishonesty'
                    ]
                },
                {
                    title: 'Hostel Rules',
                    content: [
                        'Students must reside in hostels (except day scholars)',
                        'Regular mess attendance required',
                        'Visitor policy strictly enforced',
                        'Maintain cleanliness in rooms and common areas',
                        'Noise levels to be kept minimum after 10 PM'
                    ]
                },
                {
                    title: 'Leave and Absence',
                    content: [
                        'Prior permission required for absence',
                        'Medical certificates for health-related leave',
                        'Emergency leave with proper justification',
                        'Academic leave affects attendance calculation',
                        'Semester drop possible in exceptional cases'
                    ]
                }
            ]
        }
    };

    const categories = [
        { id: 'academic', label: 'Academic Regulations', icon: '📚' },
        { id: 'curriculum', label: 'Curriculum Structure', icon: '🎯' },
        { id: 'assessment', label: 'Assessment & Evaluation', icon: '📊' },
        { id: 'student', label: 'Student Guidelines', icon: '👨‍🎓' }
    ];

    const downloadLinks = [
        {
            title: 'Academic Regulations 2024-25',
            type: 'PDF',
            size: '2.5 MB',
            icon: '📄'
        },
        {
            title: 'Curriculum Guidelines',
            type: 'PDF',
            size: '1.8 MB',
            icon: '📋'
        },
        {
            title: 'Examination Rules',
            type: 'PDF',
            size: '1.2 MB',
            icon: '📝'
        },
        {
            title: 'Student Handbook',
            type: 'PDF',
            size: '3.1 MB',
            icon: '📖'
        }
    ];

    return (
        <div className="regulations-page">
            <div className="regulations-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Academic Regulations & Curriculum</h1>
                    <p className="page-subtitle">
                        Comprehensive guidelines for academic programs, curriculum structure, and student policies
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="category-tabs">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            <span className="tab-icon">{category.icon}</span>
                            <span className="tab-label">{category.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Display */}
                <div className="regulations-content">
                    <div className="content-header">
                        <h2>
                            <span className="content-icon">{regulationsData[selectedCategory].icon}</span>
                            {regulationsData[selectedCategory].title}
                        </h2>
                    </div>

                    <div className="sections-grid">
                        {regulationsData[selectedCategory].sections.map((section, index) => (
                            <div key={index} className="regulation-section">
                                <h3>{section.title}</h3>
                                <ul className="regulation-list">
                                    {section.content.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Reference */}
                <section className="quick-reference">
                    <h2>Quick Reference</h2>
                    <div className="reference-grid">
                        <div className="reference-card">
                            <div className="ref-icon">🎓</div>
                            <h3>Minimum CGPA</h3>
                            <div className="ref-value">6.0</div>
                            <p>Required for graduation</p>
                        </div>
                        <div className="reference-card">
                            <div className="ref-icon">📅</div>
                            <h3>Attendance</h3>
                            <div className="ref-value">75%</div>
                            <p>Minimum required</p>
                        </div>
                        <div className="reference-card">
                            <div className="ref-icon">📚</div>
                            <h3>B.Tech Credits</h3>
                            <div className="ref-value">160-170</div>
                            <p>Total credits required</p>
                        </div>
                        <div className="reference-card">
                            <div className="ref-icon">🔬</div>
                            <h3>M.Tech Credits</h3>
                            <div className="ref-value">64</div>
                            <p>Total credits required</p>
                        </div>
                    </div>
                </section>

                {/* Downloads Section */}
                <section className="downloads-section">
                    <h2>Download Documents</h2>
                    <div className="downloads-grid">
                        {downloadLinks.map((link, index) => (
                            <div key={index} className="download-card">
                                <div className="download-icon">{link.icon}</div>
                                <div className="download-info">
                                    <h3>{link.title}</h3>
                                    <div className="download-meta">
                                        <span className="file-type">{link.type}</span>
                                        <span className="file-size">{link.size}</span>
                                    </div>
                                </div>
                                <button className="download-btn">
                                    ⬇️ Download
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Important Notice */}
                <section className="important-notice">
                    <div className="notice-content">
                        <div className="notice-icon">⚠️</div>
                        <div className="notice-text">
                            <h3>Important Notice</h3>
                            <p>
                                All students are advised to regularly check the academic regulations and curriculum 
                                guidelines. Any updates or changes will be communicated through official channels. 
                                For clarifications, contact the Academic Section.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Regulations;
