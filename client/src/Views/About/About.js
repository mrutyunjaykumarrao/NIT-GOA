import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import aboutData from './about.json';

const About = () => {
    return (
        <div className="aboutpage-page">
            <div className="aboutpage-container">
                {/* Hero Section */}
                <div className="aboutpage-hero">
                    <div className="aboutpage-hero-content">
                        <h1>{aboutData.hero.title}</h1>
                        <p className="aboutpage-hero-subtitle">{aboutData.hero.subtitle}</p>
                        <div className="aboutpage-info">
                            <span className="aboutpage-label">{aboutData.hero.establishment}</span>
                            <span className="aboutpage-desc">{aboutData.hero.description}</span>
                        </div>
                    </div>
                </div>

                {/* Institute Overview Section */}
                <section className="aboutpage-institute-section">
                    <h2 className="aboutpage-section-title">{aboutData.institute_overview.section_title}</h2>
                    <div className="aboutpage-institute-content">
                        <div className="aboutpage-institute-header">
                            <h3 className="aboutpage-content-title">{aboutData.institute_overview.title}</h3>
                            <div className="aboutpage-content-meta">
                                <span className="aboutpage-location">{aboutData.institute_overview.location}</span>
                                <span className="aboutpage-type">{aboutData.institute_overview.type}</span>
                            </div>
                        </div>
                        
                        <div className="aboutpage-content-body">
                            <div className="aboutpage-content-description">
                                <h4>{aboutData.institute_overview.overview.title}</h4>
                                {aboutData.institute_overview.overview.paragraphs.map((paragraph, index) => (
                                    <p key={index}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vision & Mission Section */}
                <section className="aboutpage-vision-mission-section">
                    <div className="aboutpage-vision-mission-grid">
                        <div className="aboutpage-vision-content">
                            <div className="aboutpage-vision-header">
                                <h3 className="aboutpage-content-title">{aboutData.vision_mission.vision.title}</h3>
                            </div>
                            <div className="aboutpage-content-body">
                                <div className="aboutpage-content-description">
                                    <p>
                                        {aboutData.vision_mission.vision.content}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="aboutpage-mission-content">
                            <div className="aboutpage-mission-header">
                                <h3 className="aboutpage-content-title">{aboutData.vision_mission.mission.title}</h3>
                            </div>
                            <div className="aboutpage-content-body">
                                <div className="aboutpage-content-description">
                                    <p>
                                        {aboutData.vision_mission.mission.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Academic Programs Section */}
                <section className="aboutpage-programs-section">
                    <h2 className="aboutpage-section-title">{aboutData.academic_programs.section_title}</h2>
                    <div className="aboutpage-program-section">
                        <div className="aboutpage-program-header">
                            <h3 className="aboutpage-program-title">{aboutData.academic_programs.title}</h3>
                            <div className="aboutpage-program-meta">
                                <span className="aboutpage-specialization">{aboutData.academic_programs.specialization}</span>
                                <span className="aboutpage-seats">{aboutData.academic_programs.seats}</span>
                            </div>
                        </div>
                        
                        <div className="aboutpage-program-content">
                            <div className="aboutpage-program-description">
                                <h4>{aboutData.academic_programs.overview.title}</h4>
                                <p>
                                    {aboutData.academic_programs.overview.content}
                                </p>
                            </div>
                            
                            <div className="aboutpage-departments-grid">
                                <div className="aboutpage-department-card">
                                    <h4>{aboutData.academic_programs.departments.undergraduate.title}</h4>
                                    <ul>
                                        {aboutData.academic_programs.departments.undergraduate.programs.map((program, index) => (
                                            <li key={index}>
                                                <Link to={program.link} className="aboutpage-department-link">
                                                    {program.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="aboutpage-department-card">
                                    <h4>{aboutData.academic_programs.departments.postgraduate.title}</h4>
                                    <ul>
                                        {aboutData.academic_programs.departments.postgraduate.programs.map((program, index) => (
                                            <li key={index}>{program}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="aboutpage-department-card">
                                    <h4>{aboutData.academic_programs.departments.doctoral.title}</h4>
                                    <ul>
                                        {aboutData.academic_programs.departments.doctoral.programs.map((program, index) => (
                                            <li key={index}>{program}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Admissions Section */}
                <section className="aboutpage-admissions-section">
                    <h2 className="aboutpage-section-title">{aboutData.admissions.section_title}</h2>
                    <div className="aboutpage-admission-section">
                        <div className="aboutpage-admission-header">
                            <h3 className="aboutpage-content-title">{aboutData.admissions.title}</h3>
                            <div className="aboutpage-content-meta">
                                <span className="aboutpage-process">{aboutData.admissions.process}</span>
                                <span className="aboutpage-seats">{aboutData.admissions.seats}</span>
                            </div>
                        </div>
                        
                        <div className="aboutpage-admission-content">
                            <div className="aboutpage-admission-description">
                                <h4>{aboutData.admissions.overview.title}</h4>
                                <p>
                                    {aboutData.admissions.overview.content}
                                </p>
                            </div>
                            
                            <div className="aboutpage-admission-details-grid">
                                <div className="aboutpage-admission-detail-card">
                                    <h4>{aboutData.admissions.programs.btech.title}</h4>
                                    <p>{aboutData.admissions.programs.btech.description}</p>
                                    <ul>
                                        {aboutData.admissions.programs.btech.details.map((detail, index) => (
                                            <li key={index}>{detail}</li>
                                        ))}
                                    </ul>
                                    <div className="aboutpage-admission-link-wrapper">
                                        <Link to={aboutData.admissions.programs.btech.link.url} className="aboutpage-admission-link">
                                            {aboutData.admissions.programs.btech.link.text}
                                        </Link>
                                    </div>
                                </div>
                                <div className="aboutpage-admission-detail-card">
                                    <h4>{aboutData.admissions.programs.mtech.title}</h4>
                                    <p>{aboutData.admissions.programs.mtech.description}</p>
                                    <ul>
                                        {aboutData.admissions.programs.mtech.details.map((detail, index) => (
                                            <li key={index}>{detail}</li>
                                        ))}
                                    </ul>
                                    <div className="aboutpage-admission-link-wrapper">
                                        <Link to={aboutData.admissions.programs.mtech.link.url} className="aboutpage-admission-link">
                                            {aboutData.admissions.programs.mtech.link.text}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Research & Innovation Section */}
                <section className="aboutpage-research-section">
                    <h2 className="aboutpage-section-title">{aboutData.research.section_title}</h2>
                    <div className="aboutpage-research-section-content">
                        <div className="aboutpage-research-header">
                            <h3 className="aboutpage-content-title">{aboutData.research.title}</h3>
                            <div className="aboutpage-content-meta">
                                <span className="aboutpage-research-focus">{aboutData.research.focus}</span>
                                <span className="aboutpage-research-projects">{aboutData.research.projects}</span>
                            </div>
                        </div>
                        
                        <div className="aboutpage-research-content">
                            <div className="aboutpage-research-description">
                                <h4>{aboutData.research.overview.title}</h4>
                                <p>
                                    {aboutData.research.overview.content}
                                </p>
                            </div>
                            
                            <div className="aboutpage-research-link-wrapper">
                                <Link to={aboutData.research.link.url} className="aboutpage-research-link">
                                    {aboutData.research.link.text}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Placement & Industry Section */}
                <section className="aboutpage-placement-section">
                    <h2 className="aboutpage-section-title">{aboutData.placement.section_title}</h2>
                    <div className="aboutpage-placement-section-content">
                        <div className="aboutpage-placement-header">
                            <h3 className="aboutpage-content-title">{aboutData.placement.title}</h3>
                            <div className="aboutpage-content-meta">
                                <span className="aboutpage-companies">{aboutData.placement.companies}</span>
                                <span className="aboutpage-sectors">{aboutData.placement.sectors}</span>
                            </div>
                        </div>
                        
                        <div className="aboutpage-placement-content">
                            <div className="aboutpage-placement-description">
                                <h4>{aboutData.placement.overview.title}</h4>
                                <p>
                                    {aboutData.placement.overview.content}
                                </p>
                            </div>
                            
                            <div className="aboutpage-company-highlights">
                                <h4>{aboutData.placement.recruiters.title}</h4>
                                <p>
                                    {aboutData.placement.recruiters.content}
                                </p>
                            </div>
                            
                            <div className="aboutpage-placement-link-wrapper">
                                <Link to={aboutData.placement.link.url} className="aboutpage-placement-link">
                                    {aboutData.placement.link.text}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Outreach & Student Life Section */}
                <section className="aboutpage-outreach-section">
                    <div className="aboutpage-outreach-grid">
                        <div className="aboutpage-outreach-content">
                            <div className="aboutpage-outreach-header">
                                <h3 className="aboutpage-content-title">{aboutData.outreach_student_life.outreach.title}</h3>
                            </div>
                            <div className="aboutpage-content-body">
                                <div className="aboutpage-content-description">
                                    <p>
                                        {aboutData.outreach_student_life.outreach.content}
                                    </p>
                                </div>
                                <div className="aboutpage-outreach-link-wrapper">
                                    <Link to={aboutData.outreach_student_life.outreach.link.url} className="aboutpage-outreach-link">
                                        {aboutData.outreach_student_life.outreach.link.text}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="aboutpage-student-life-content">
                            <div className="aboutpage-student-life-header">
                                <h3 className="aboutpage-content-title">{aboutData.outreach_student_life.student_life.title}</h3>
                            </div>
                            <div className="aboutpage-content-body">
                                <div className="aboutpage-content-description">
                                    <p>
                                        {aboutData.outreach_student_life.student_life.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Collaborations & Culture Section */}
                <section className="aboutpage-collaborations-section">
                    <div className="aboutpage-collaborations-grid">
                        <div className="aboutpage-mou-content">
                            <div className="aboutpage-mou-header">
                                <h3 className="aboutpage-content-title">{aboutData.collaborations_culture.collaborations.title}</h3>
                            </div>
                            <div className="aboutpage-content-body">
                                <div className="aboutpage-content-description">
                                    <p>
                                        {aboutData.collaborations_culture.collaborations.content}
                                    </p>
                                </div>
                                <div className="aboutpage-mou-link-wrapper">
                                    <Link to={aboutData.collaborations_culture.collaborations.link.url} className="aboutpage-mou-link">
                                        {aboutData.collaborations_culture.collaborations.link.text}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="aboutpage-culture-content">
                            <div className="aboutpage-culture-header">
                                <h3 className="aboutpage-content-title">{aboutData.collaborations_culture.culture.title}</h3>
                            </div>
                            <div className="aboutpage-content-body">
                                <div className="aboutpage-content-description">
                                    <p>
                                        {aboutData.collaborations_culture.culture.content}
                                    </p>
                                </div>
                                <div className="aboutpage-culture-link-wrapper">
                                    <Link to={aboutData.collaborations_culture.culture.link.url} className="aboutpage-culture-link">
                                        {aboutData.collaborations_culture.culture.link.text}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
