import React, { useState } from 'react';
import './DissertationFormats.css';

const DissertationFormats = () => {
    const [selectedProgram, setSelectedProgram] = useState('phd');

    const programs = [
        { id: 'phd', name: 'Ph.D Dissertation', icon: '🎓' },
        { id: 'mtech', name: 'M.Tech Thesis', icon: '📚' },
        { id: 'btech', name: 'B.Tech Project Report', icon: '📝' }
    ];

    const formatDownloads = {
        phd: {
            title: 'Ph.D Dissertation Format',
            description: 'Download the official Ph.D dissertation format template and guidelines',
            downloadFile: '/src/assets/AcademicsSection/Dissertation Formats/PhDDissertationFormat.rar',
            fileName: 'PhDDissertationFormat.rar'
        },
        mtech: {
            title: 'M.Tech Thesis Format',
            description: 'Download the official M.Tech thesis format template and guidelines',
            downloadFile: '/src/assets/AcademicsSection/Dissertation Formats/MTechDissertationFormat.rar',
            fileName: 'MTechDissertationFormat.rar'
        },
        btech: {
            title: 'B.Tech Project Report Format',
            description: 'Download the official B.Tech project report format template and guidelines',
            downloadFile: '/src/assets/AcademicsSection/Dissertation Formats/BTechReportFormat.rar',
            fileName: 'BTechReportFormat.rar'
        }
    };

    const formatGuidelines = {
        phd: {
            title: 'Ph.D Dissertation Guidelines',
            description: 'Comprehensive formatting guidelines for Ph.D dissertation submission',
            sections: [
                {
                    title: 'General Format Requirements',
                    items: [
                        'Page Size: A4 (210 × 297 mm)',
                        'Margins: Top & Bottom: 1 inch (25.4 mm), Left & Right: 1 inch (25.4 mm)',
                        'Font: Times New Roman, 12 pt for body text',
                        'Line Spacing: 1.5 for body text, single for references',
                        'Page Numbers: Bottom center, starting from Introduction'
                    ]
                },
                {
                    title: 'Document Structure',
                    items: [
                        'Title Page (as per prescribed format)',
                        'Certificate from Supervisor',
                        'Declaration by Scholar',
                        'Acknowledgments',
                        'Abstract (English & Hindi)',
                        'Table of Contents',
                        'List of Figures',
                        'List of Tables',
                        'List of Abbreviations',
                        'Chapters (Introduction, Literature Review, Methodology, Results, Conclusion)',
                        'References',
                        'Appendices',
                        'List of Publications'
                    ]
                },
                {
                    title: 'Binding Requirements',
                    items: [
                        'Hard bound copies: 3 (including one for library)',
                        'Soft bound copies: 2 for pre-submission review',
                        'CD/DVD: 2 copies with complete thesis in PDF format',
                        'Binding Color: Dark Blue with Golden lettering',
                        'Spine: Include thesis title, author name, and year'
                    ]
                }
            ]
        },
        mtech: {
            title: 'M.Tech Thesis Guidelines',
            description: 'Formatting specifications for M.Tech thesis submission',
            sections: [
                {
                    title: 'General Format Requirements',
                    items: [
                        'Page Size: A4 (210 × 297 mm)',
                        'Margins: Top & Bottom: 1 inch, Left & Right: 1 inch',
                        'Font: Times New Roman, 12 pt for body text',
                        'Line Spacing: 1.5 for body text',
                        'Page Numbers: Bottom center'
                    ]
                },
                {
                    title: 'Document Structure',
                    items: [
                        'Title Page',
                        'Certificate',
                        'Declaration',
                        'Acknowledgments',
                        'Abstract',
                        'Table of Contents',
                        'List of Figures and Tables',
                        'Chapters (minimum 5 chapters)',
                        'References',
                        'Appendices (if any)'
                    ]
                },
                {
                    title: 'Submission Requirements',
                    items: [
                        'Hard bound copies: 2',
                        'Soft bound copies: 1 for review',
                        'Digital copy: PDF format on CD',
                        'Binding Color: Dark Green with Golden lettering',
                        'Thesis length: 60-100 pages (excluding appendices)'
                    ]
                }
            ]
        },
        btech: {
            title: 'B.Tech Project Report Guidelines',
            description: 'Format specifications for B.Tech final year project reports',
            sections: [
                {
                    title: 'General Format Requirements',
                    items: [
                        'Page Size: A4 (210 × 297 mm)',
                        'Margins: Top & Bottom: 1 inch, Left & Right: 1 inch',
                        'Font: Times New Roman, 12 pt',
                        'Line Spacing: 1.5',
                        'Page Numbers: Bottom right'
                    ]
                },
                {
                    title: 'Document Structure',
                    items: [
                        'Title Page',
                        'Certificate from Guide',
                        'Declaration',
                        'Acknowledgments',
                        'Abstract',
                        'Table of Contents',
                        'List of Figures and Tables',
                        'Introduction',
                        'Literature Survey',
                        'Methodology',
                        'Implementation/Results',
                        'Conclusion and Future Work',
                        'References'
                    ]
                },
                {
                    title: 'Submission Requirements',
                    items: [
                        'Spiral bound copies: 3',
                        'Report length: 40-60 pages',
                        'Digital submission: Upload to portal',
                        'Include source code (if applicable)',
                        'Demo/Presentation: 15-20 minutes'
                    ]
                }
            ]
        }
    };    const templates = [
        {
            name: 'Ph.D Dissertation Template',
            description: 'Complete LaTeX template for Ph.D dissertation',
            format: 'LaTeX',
            size: '2.5 MB',
            downloadUrl: '/templates/phd-dissertation-template.zip',
            preview: '/templates/phd-preview.pdf'
        },
        {
            name: 'Ph.D Title Page Template',
            description: 'Official title page format for Ph.D dissertation',
            format: 'Word',
            size: '45 KB',
            downloadUrl: '/templates/phd-title-template.docx',
            preview: '/templates/phd-title-preview.pdf'
        },
        {
            name: 'M.Tech Thesis Template',
            description: 'Complete template for M.Tech thesis',
            format: 'LaTeX',
            size: '1.8 MB',
            downloadUrl: '/templates/mtech-thesis-template.zip',
            preview: '/templates/mtech-preview.pdf'
        },
        {
            name: 'M.Tech Title Page Template',
            description: 'Official title page format for M.Tech thesis',
            format: 'Word',
            size: '38 KB',
            downloadUrl: '/templates/mtech-title-template.docx',
            preview: '/templates/mtech-title-preview.pdf'
        },
        {
            name: 'B.Tech Project Report Template',
            description: 'Template for B.Tech final year project report',
            format: 'Word',
            size: '120 KB',
            downloadUrl: '/templates/btech-project-template.docx',
            preview: '/templates/btech-preview.pdf'
        },
        {
            name: 'Certificate Templates',
            description: 'Standard certificate formats for all programs',
            format: 'Word',
            size: '85 KB',
            downloadUrl: '/templates/certificate-templates.docx',
            preview: '/templates/certificate-preview.pdf'
        }
    ];

    const importantNotes = [
        {
            title: 'Plagiarism Check',
            content: 'All dissertations/theses must pass plagiarism check with similarity index below 10% (excluding references).',
            icon: '🔍'
        },
        {
            title: 'Language Requirements',
            content: 'Documents must be written in English with proper grammar and academic style. Hindi abstract required for Ph.D.',
            icon: '📝'
        },
        {
            title: 'Submission Deadline',
            content: 'Submit final copies at least 15 days before the defense/viva-voce examination.',
            icon: '⏰'
        },
        {
            title: 'Digital Repository',
            content: 'All approved dissertations will be archived in the institutional digital repository.',
            icon: '💾'
        }
    ];

    const submissionChecklist = [
        'Title page with all required information',
        'Supervisor certificate properly signed',
        'Student declaration duly signed',
        'Abstract within word limit (350 words for Ph.D, 250 for M.Tech)',
        'Proper citation and referencing format (IEEE/APA)',
        'All figures and tables properly numbered and captioned',
        'List of publications (for Ph.D)',
        'Plagiarism report attached',
        'Soft copies in prescribed format',
        'Binding as per guidelines'
    ];

    return (
        <div className="dissertation-page">
            <div className="dissertation-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Dissertation & Thesis Formats</h1>
                    <p className="page-subtitle">Guidelines, templates, and requirements for academic submissions</p>
                </div>

                {/* Program Selection */}
                <section className="program-selection">
                    <div className="program-tabs">
                        {programs.map(program => (
                            <button
                                key={program.id}
                                className={`program-tab ${selectedProgram === program.id ? 'active' : ''}`}
                                onClick={() => setSelectedProgram(program.id)}
                            >
                                {program.icon} {program.name}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Format Guidelines */}
                <section className="format-guidelines">
                    <div className="guidelines-content">
                        <h2>{formatGuidelines[selectedProgram].title}</h2>
                        <p className="guidelines-description">
                            {formatGuidelines[selectedProgram].description}
                        </p>
                        
                        <div className="guidelines-sections">
                            {formatGuidelines[selectedProgram].sections.map((section, index) => (
                                <div key={index} className="guideline-section">
                                    <h3>{section.title}</h3>
                                    <ul className="guideline-list">
                                        {section.items.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Templates Download */}
                <section className="templates-section">
                    <h2>Download Templates</h2>
                    <div className="templates-grid">
                        {templates.map((template, index) => (
                            <div key={index} className="template-card">
                                <div className="template-header">
                                    <h3>{template.name}</h3>
                                    <span className="template-format">{template.format}</span>
                                </div>
                                <p className="template-description">{template.description}</p>
                                <div className="template-meta">
                                    <span className="template-size">Size: {template.size}</span>
                                </div>
                                <div className="template-actions">
                                    <button className="download-btn">
                                        📥 Download
                                    </button>
                                    <button className="preview-btn">
                                        👁️ Preview
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Important Notes */}
                <section className="important-notes">
                    <h2>Important Notes</h2>
                    <div className="notes-grid">
                        {importantNotes.map((note, index) => (
                            <div key={index} className="note-card">
                                <div className="note-icon">{note.icon}</div>
                                <h3>{note.title}</h3>
                                <p>{note.content}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Submission Checklist */}
                <section className="submission-checklist">
                    <h2>Pre-Submission Checklist</h2>
                    <div className="checklist-container">
                        <p className="checklist-intro">
                            Ensure all the following items are completed before final submission:
                        </p>
                        <div className="checklist">
                            {submissionChecklist.map((item, index) => (
                                <div key={index} className="checklist-item">
                                    <input type="checkbox" id={`check-${index}`} />
                                    <label htmlFor={`check-${index}`}>{item}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Information */}
                <section className="contact-section">
                    <h2>Need Help?</h2>
                    <div className="contact-cards">
                        <div className="contact-card">
                            <h3>📧 Academic Office</h3>
                            <p><strong>Email:</strong> academic@nitgoa.ac.in</p>
                            <p><strong>Phone:</strong> +91-832-2404200</p>
                            <p>For format guidelines and submission queries</p>
                        </div>
                        <div className="contact-card">
                            <h3>📚 Library</h3>
                            <p><strong>Email:</strong> library@nitgoa.ac.in</p>
                            <p><strong>Ext:</strong> 6205</p>
                            <p>For template assistance and formatting help</p>
                        </div>
                        <div className="contact-card">
                            <h3>💻 IT Support</h3>
                            <p><strong>Email:</strong> itsupport@nitgoa.ac.in</p>
                            <p><strong>Ext:</strong> 6120</p>
                            <p>For digital submission and technical issues</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DissertationFormats;
