import React from 'react';
import './SCSTCell.css';

const SCSTCell = () => {
    return (
        <div className="sc-st-cell-page">
            <div className="sc-st-cell-container">
                {/* Hero Section */}
                <div className="sc-st-cell-hero">
                    <div className="sc-st-cell-hero-content">
                        <h1 className="sc-st-cell-hero-title">SC/ST Cell</h1>
                        <p className="sc-st-cell-hero-subtitle">National Institute of Technology Goa</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="sc-st-cell-content">
                    {/* Introduction and Duties Section - Combined */}
                    <section className="sc-st-cell-main-section">
                        <div className="sc-st-cell-content-card">
                            <p className="sc-st-cell-intro-text">
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
                            
                            <h2 className="sc-st-cell-section-title">Duties and Responsibilities of the SC/ST Cell:</h2>
                            <div className="sc-st-cell-duties-list">
                                <div className="sc-st-cell-duty-item">
                                    <span className="sc-st-cell-duty-number">1.</span>
                                    <p>Ensure Equal opportunities, Protection of Right and Full Participation (Act 1995).</p>
                                </div>
                                <div className="sc-st-cell-duty-item">
                                    <span className="sc-st-cell-duty-number">2.</span>
                                    <p>Promotion of higher education among the SC/ST or weaker communities that are suffering from economic, social, and educational lacks.</p>
                                </div>
                                <div className="sc-st-cell-duty-item">
                                    <span className="sc-st-cell-duty-number">3.</span>
                                    <p>Evaluation of all matters related to SC/ST students and employees of the Institute including the reservation rules as per Government of India norms.</p>
                                </div>
                                <div className="sc-st-cell-duty-item">
                                    <span className="sc-st-cell-duty-number">4.</span>
                                    <p>Redressal of complaints related to SC/ST students and employees at NIT Goa.</p>
                                </div>
                                <div className="sc-st-cell-duty-item">
                                    <span className="sc-st-cell-duty-number">5.</span>
                                    <p>Follow-up measures for achieving the objectives and targets laid down by MoE, GoI for the empowerment of SC and ST.</p>
                                </div>
                                <div className="sc-st-cell-duty-item">
                                    <span className="sc-st-cell-duty-number">6.</span>
                                    <p>Regular supervision of the reservation policies and other programs intended for SC/ST by the GoI for their effective implementation at NIT Goa.</p>
                                </div>
                                <div className="sc-st-cell-duty-item">
                                    <span className="sc-st-cell-duty-number">7.</span>
                                    <p>Ensuring timely submission of SC/ST Reports I and II by each appointing authority under the Ministry/Department to the Ministry/Department and ensuring scrutiny and consolidation of the above reports in respect of all establishments and services in and under the control of the Ministry/Department and sending the consolidated reports in the prescribed proformas to the Department of Personnel & Training.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contact and Complaint Section - Combined */}
                    <section className="sc-st-cell-contact-section">
                        <div className="sc-st-cell-content-card">
                            <h2 className="sc-st-cell-section-title">Contact Us</h2>
                            
                            {/* Contact Information */}
                            <div className="sc-st-cell-contact-info">
                                <div className="sc-st-cell-contact-item">
                                    <h3>For Your Queries/Complaints</h3>
                                    <p className="sc-st-cell-contact-name"><strong>Dr. T. Veerakumar</strong></p>
                                    <p className="sc-st-cell-contact-designation">Liaison Officer (SC/ST Cell)</p>
                                </div>
                                
                                <div className="sc-st-cell-contact-item">
                                    <p style={{textAlign: 'center'}}>Your feedback is welcome. Please write to: <a href="mailto:scstcell@nitgoa.ac.in" className="sc-st-cell-email-link">scstcell@nitgoa.ac.in</a></p>
                                </div>

                                <div className="sc-st-cell-contact-item">
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
                            <div className="sc-st-cell-complaint-form-container">
                                <h3 className="sc-st-cell-form-title">File a Complaint</h3>
                                <p className="sc-st-cell-form-description">
                                    If you have any grievances or complaints, please use our online complaint registration form.
                                </p>
                                <a 
                                    href="https://docs.google.com/forms/d/1htlljT6BxR9KsRUeF6q1eMhUB5l_IinhRWIDTPIxcGc/viewform?pli=1&pli=1&edit_requested=true" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="sc-st-cell-complaint-btn"
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
