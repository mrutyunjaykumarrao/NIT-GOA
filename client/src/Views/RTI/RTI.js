import React from 'react';
import './RTI.css';

const RTI = () => {
    return (
        <div className="rti-page">
            <div className="rti-container">
                <div className="page-header">
                    <h1>Right to Information (RTI)</h1>
                    <p className="page-subtitle">Transparency and Accountability at NIT Goa</p>
                </div>

                <div className="rti-content">
                    <section className="rti-section overview-section">
                        <h2>About RTI</h2>
                        <p>
                            The Right to Information Act, 2005 (RTI Act) is an Act of the Parliament of India to provide 
                            for setting out the practical regime of right to information for citizens to secure access to 
                            information under the control of public authorities.
                        </p>
                        <p>
                            National Institute of Technology Goa, being a public authority under the RTI Act, is committed 
                            to ensuring transparency and accountability in its functioning. Citizens can seek information 
                            about the institute's activities, policies, and decisions through the RTI mechanism.
                        </p>
                    </section>

                    <section className="rti-section officers-section">
                        <h2>RTI Officers</h2>
                        <div className="officers-grid">
                            <div className="officer-card">
                                <h3>Public Information Officer (PIO)</h3>
                                <div className="officer-details">
                                    <p><strong>Name:</strong> Dr. [Name]</p>
                                    <p><strong>Designation:</strong> Assistant Registrar</p>
                                    <p><strong>Email:</strong> pio@nitgoa.ac.in</p>
                                    <p><strong>Phone:</strong> +91-832-2404216</p>
                                    <p><strong>Address:</strong> National Institute of Technology Goa,<br/>
                                    Kottamoll Plateau, Cuncolim,<br/>
                                    South Goa, Goa - 403703</p>
                                </div>
                            </div>
                            <div className="officer-card">
                                <h3>Appellate Authority</h3>
                                <div className="officer-details">
                                    <p><strong>Name:</strong> Registrar</p>
                                    <p><strong>Designation:</strong> Registrar</p>
                                    <p><strong>Email:</strong> registrar@nitgoa.ac.in</p>
                                    <p><strong>Phone:</strong> +91-832-2404200</p>
                                    <p><strong>Address:</strong> National Institute of Technology Goa,<br/>
                                    Kottamoll Plateau, Cuncolim,<br/>
                                    South Goa, Goa - 403703</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rti-section application-section">
                        <h2>How to Apply for RTI</h2>
                        <div className="application-steps">
                            <div className="step-card">
                                <div className="step-number">1</div>
                                <h3>Prepare Your Application</h3>
                                <p>Write your RTI application clearly mentioning the specific information you seek. 
                                Include your name, address, and contact details.</p>
                            </div>
                            <div className="step-card">
                                <div className="step-number">2</div>
                                <h3>Pay the Fee</h3>
                                <p>Attach an application fee of ₹10 through Demand Draft payable to 
                                "National Institute of Technology Goa" or Indian Postal Order.</p>
                            </div>
                            <div className="step-card">
                                <div className="step-number">3</div>
                                <h3>Submit Application</h3>
                                <p>Submit your application to the Public Information Officer either in person, 
                                by post, or through email.</p>
                            </div>
                            <div className="step-card">
                                <div className="step-number">4</div>
                                <h3>Receive Information</h3>
                                <p>You will receive the requested information within 30 days of submission. 
                                If not satisfied, you can file an appeal.</p>
                            </div>
                        </div>
                    </section>

                    <section className="rti-section fee-structure-section">
                        <h2>Fee Structure</h2>
                        <div className="fee-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Particulars</th>
                                        <th>Fee Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Application Fee</td>
                                        <td>₹10</td>
                                    </tr>
                                    <tr>
                                        <td>Additional Fee (per page)</td>
                                        <td>₹2</td>
                                    </tr>
                                    <tr>
                                        <td>Inspection of Documents (per hour)</td>
                                        <td>₹5</td>
                                    </tr>
                                    <tr>
                                        <td>CD/DVD</td>
                                        <td>₹50</td>
                                    </tr>
                                    <tr>
                                        <td>First Appeal</td>
                                        <td>No Fee</td>
                                    </tr>
                                    <tr>
                                        <td>Second Appeal (State Information Commission)</td>
                                        <td>₹25</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="fee-exemption">
                            <h3>Fee Exemption</h3>
                            <p>Below Poverty Line (BPL) card holders are exempted from paying any fee. 
                            They need to submit a copy of their BPL card along with the application.</p>
                        </div>
                    </section>

                    <section className="rti-section guidelines-section">
                        <h2>Guidelines and Important Information</h2>
                        <div className="guidelines-grid">
                            <div className="guideline-card">
                                <h3>Response Time</h3>
                                <ul>
                                    <li>30 days for normal information</li>
                                    <li>48 hours for life and liberty related information</li>
                                    <li>5 days additional if third party is involved</li>
                                </ul>
                            </div>
                            <div className="guideline-card">
                                <h3>Appeal Process</h3>
                                <ul>
                                    <li>First Appeal: Within 30 days to Appellate Authority</li>
                                    <li>Second Appeal: Within 90 days to State Information Commission</li>
                                    <li>No fee for first appeal</li>
                                </ul>
                            </div>
                            <div className="guideline-card">
                                <h3>Information Exempted</h3>
                                <ul>
                                    <li>Information affecting national security</li>
                                    <li>Personal information of third parties</li>
                                    <li>Trade secrets and commercial confidence</li>
                                    <li>Information received in confidence</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="rti-section proactive-disclosure-section">
                        <h2>Proactive Disclosure</h2>
                        <p>
                            As per Section 4 of the RTI Act, NIT Goa proactively discloses the following information 
                            on its website for public access:
                        </p>
                        <div className="disclosure-grid">
                            <div className="disclosure-item">
                                <h4>Organizational Structure</h4>
                                <p>Details of organization, functions, and duties</p>
                            </div>
                            <div className="disclosure-item">
                                <h4>Powers & Functions</h4>
                                <p>Powers and functions of its officers and employees</p>
                            </div>
                            <div className="disclosure-item">
                                <h4>Decision Making Process</h4>
                                <p>Procedure followed in decision making</p>
                            </div>
                            <div className="disclosure-item">
                                <h4>Rules & Regulations</h4>
                                <p>Rules, regulations, instructions, manuals and records</p>
                            </div>
                            <div className="disclosure-item">
                                <h4>Categories of Documents</h4>
                                <p>Categories of documents held or under its control</p>
                            </div>
                            <div className="disclosure-item">
                                <h4>Policies</h4>
                                <p>Statement of policies and guidelines</p>
                            </div>
                        </div>
                    </section>

                    <section className="rti-section contact-section">
                        <h2>Contact Information</h2>
                        <div className="contact-info">
                            <div className="contact-card">
                                <h3>For RTI Applications</h3>
                                <p><strong>Public Information Officer</strong></p>
                                <p>Email: pio@nitgoa.ac.in</p>
                                <p>Phone: +91-832-2404216</p>
                            </div>
                            <div className="contact-card">
                                <h3>For Appeals</h3>
                                <p><strong>Appellate Authority</strong></p>
                                <p>Email: registrar@nitgoa.ac.in</p>
                                <p>Phone: +91-832-2404200</p>
                            </div>
                            <div className="contact-card">
                                <h3>Postal Address</h3>
                                <p>National Institute of Technology Goa</p>
                                <p>Kottamoll Plateau, Cuncolim</p>
                                <p>South Goa, Goa - 403703</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RTI;
