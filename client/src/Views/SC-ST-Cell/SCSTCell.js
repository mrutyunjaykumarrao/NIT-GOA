import React from 'react';
import './SCSTCell.css';

const SCSTCell = () => {
    return (
        <div className="scst-cell-page">
            <div className="scst-container">
                {/* Hero Section */}
                <div className="scst-hero">
                    <div className="hero-content">
                        <h1 className="hero-title">SC/ST Cell</h1>
                        <p className="hero-subtitle">National Institute of Technology Goa</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="scst-content">
                    {/* Introduction and Duties Section - Combined */}
                    <section className="main-section">
                        <div className="content-card">
                            <p className="intro-text">
                                NIT Goa aims to create an inclusive and impartial atmosphere for people from 
                                various communities. SC/ST cells play a crucial role in safeguarding the rights and 
                                interests of Scheduled Castes (SC) and Scheduled Tribes (ST) students and 
                                employees at NIT Goa. The cell ensures the implementation of policies and laws aimed 
                                at promoting social equality, preventing discrimination, and addressing 
                                grievances specific to SC and ST communities. It also provides support, representation, 
                                and advocacy for SC/ST individuals facing issues such as discrimination, 
                                harassment, or unfair treatment. Additionally, they often work towards creating 
                                awareness, promoting education, and facilitating socio-economic empowerment among SC/ST 
                                populations.
                            </p>
                            
                            <h2 className="section-title">Duties and Responsibilities of the SC/ST Cell:</h2>
                            <div className="duties-list">
                                <div className="duty-item">
                                    <span className="duty-number">1.</span>
                                    <p>Ensure Equal opportunities, Protection of Right and Full Participation (Act 1995).</p>
                                </div>
                                <div className="duty-item">
                                    <span className="duty-number">2.</span>
                                    <p>Promotion of higher education among the SC/ST or weaker communities that are suffering from economic, social, and educational lacks.</p>
                                </div>
                                <div className="duty-item">
                                    <span className="duty-number">3.</span>
                                    <p>Evaluation of all matters related to SC/ST students and employees of the Institute including the reservation rules as per Government of India norms.</p>
                                </div>
                                <div className="duty-item">
                                    <span className="duty-number">4.</span>
                                    <p>Redressal of complaints related to SC/ST students and employees at NIT Goa.</p>
                                </div>
                                <div className="duty-item">
                                    <span className="duty-number">5.</span>
                                    <p>Follow-up measures for achieving the objectives and targets laid down by MoE, GoI for the empowerment of SC and ST.</p>
                                </div>
                                <div className="duty-item">
                                    <span className="duty-number">6.</span>
                                    <p>Regular supervision of the reservation policies and other programs intended for SC/ST by the GoI for their effective implementation at NIT Goa.</p>
                                </div>
                                <div className="duty-item">
                                    <span className="duty-number">7.</span>
                                    <p>Ensuring timely submission of SC/ST Reports I and II by each appointing authority under the Ministry/Department to the Ministry/Department and ensuring scrutiny and consolidation of the above reports in respect of all establishments and services in and under the control of the Ministry/Department and sending the consolidated reports in the prescribed proformas to the Department of Personnel & Training.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contact and Complaint Section - Combined */}
                    <section className="contact-section">
                        <div className="content-card">
                            <h2 className="section-title">Contact Us</h2>
                            
                            {/* Contact Information */}
                            <div className="contact-info">
                                <div className="contact-item">
                                    <h3>For Your Queries/Complaints</h3>
                                    <p className="contact-name"><strong>Dr. T. Veerakumar</strong></p>
                                    <p className="contact-designation">Liaison Officer (SC/ST Cell)</p>
                                </div>
                                
                                <div className="contact-item">
                                    <p style={{textAlign: 'center'}}>Your feedback is welcome. Please write to: <a href="mailto:scstcell@nitgoa.ac.in" className="email-link">scstcell@nitgoa.ac.in</a></p>
                                </div>

                                <div className="contact-item">
                                    <p>
                                        The cell aims to ensure that anti-discrimination laws in the context of caste 
                                        are followed in letter and in spirit. On grievances (if any), students are 
                                        encouraged to approach the cell or fill in the enclosed Complaint Registration Form. 
                                        The cell strives to ensure that anonymity is maintained throughout the 
                                        investigation.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Complaint Form */}
                            <div className="complaint-form-container">
                                <h3 className="form-title">File a Complaint</h3>
                                <p className="form-description">
                                    If you have any grievances or complaints, please use our online complaint registration form.
                                </p>
                                <a 
                                    href="https://docs.google.com/forms/d/1htlljT6BxR9KsRUeF6q1eMhUB5l_IinhRWIDTPIxcGc/viewform?pli=1&pli=1&edit_requested=true" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="complaint-btn"
                                >
                                    Formal Online Complaint Registration Form (SC/ST Cell)
                                </a>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default SCSTCell;
