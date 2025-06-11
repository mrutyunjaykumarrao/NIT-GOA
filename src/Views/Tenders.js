import React, { useState } from 'react';
import './Tenders.css';

const Tenders = () => {
    const [activeTab, setActiveTab] = useState('current');

    const currentTenders = [
        {
            id: 1,
            title: "Video Recording for GIAN Course",
            refNo: "NITGOA/EEE/GIAN/PUR/2025-26/OW/167",
            date: "09.06.2025",
            deadline: "20.06.2025",
            category: "Service",
            status: "Active"
        },
        {
            id: 2,
            title: "Expression of Interest for Running Cafeteria at NIT Goa Campus",
            refNo: "NITGOA/ADMIN/2025/OW/166",
            date: "04.06.2025",
            deadline: "25.06.2025",
            category: "Service",
            status: "Active"
        },
        {
            id: 3,
            title: "Annual Maintenance Contract for Landscape And Horticulture Works",
            refNo: "NITG/PUR/FMC/2025-26/OW/157",
            date: "21.05.2025",
            deadline: "15.07.2025",
            category: "Maintenance",
            status: "Active"
        },
        {
            id: 4,
            title: "Procurement of Sanitary Napkins Incinerator",
            refNo: "NITGOA/HOSTEL/PUR/2025/OW/103",
            date: "26.03.2025",
            deadline: "30.06.2025",
            category: "Procurement",
            status: "Active"
        },
        {
            id: 5,
            title: "Establishment of Cricket Practice Net at NIT Goa Campus",
            refNo: "NITGOA/SPORTS/PUR/OW/84",
            date: "11.03.2025",
            deadline: "10.07.2025",
            category: "Construction",
            status: "Active"
        }
    ];

    const archiveTenders = [
        {
            id: 6,
            title: "Supply of Library Books at NIT Goa Campus",
            refNo: "NITGOA/PUR/LIBRARY/2024/OW/197",
            date: "03.06.2024",
            deadline: "03.07.2024",
            category: "Procurement",
            status: "Completed"
        },
        {
            id: 7,
            title: "Venue Preparations for the 10th Convocation 2024",
            refNo: "NITGOA/CONV 2024/PUR/OW/386",
            date: "11.09.2024",
            deadline: "25.09.2024",
            category: "Service",
            status: "Completed"
        },
        {
            id: 8,
            title: "Audio/Photography for the 10th Convocation of NIT Goa",
            refNo: "NITGOA/CONV 2024/PUR/OW/352",
            date: "03.09.2024",
            deadline: "15.09.2024",
            category: "Service",
            status: "Completed"
        }
    ];

    const tenderCategories = [
        { name: "All", count: currentTenders.length + archiveTenders.length },
        { name: "Procurement", count: 2 },
        { name: "Service", count: 4 },
        { name: "Construction", count: 1 },
        { name: "Maintenance", count: 1 }
    ];

    return (
        <div className="tenders-page">
            <div className="tenders-container">
                <div className="page-header">
                    <h1>Tenders</h1>
                    <p className="page-subtitle">NIT Goa Procurement & Contract Opportunities</p>
                </div>

                <div className="tenders-content">
                    <section className="tenders-section overview-section">
                        <h2>Tender Information</h2>
                        <p>
                            National Institute of Technology Goa invites tenders for various procurement, 
                            construction, and service requirements. All tenders are conducted in accordance 
                            with the General Financial Rules (GFR) and Government of India procurement guidelines.
                        </p>
                        <div className="tender-stats">
                            <div className="tenders-stat-card">
                                <div className="tenders-stat-number">{currentTenders.length}</div>
                                <div className="tenders-stat-label">Active Tenders</div>
                            </div>
                            <div className="tenders-stat-card">
                                <div className="tenders-stat-number">{archiveTenders.length}</div>
                                <div className="tenders-stat-label">Completed Tenders</div>
                            </div>
                            <div className="tenders-stat-card">
                                <div className="tenders-stat-number">₹2.5Cr</div>
                                <div className="tenders-stat-label">Annual Procurement</div>
                            </div>
                        </div>
                    </section>

                    <section className="tenders-section categories-section">
                        <h2>Tender Categories</h2>
                        <div className="categories-grid">
                            {tenderCategories.map((category, index) => (
                                <div key={index} className="category-card">
                                    <h3>{category.name}</h3>
                                    <div className="category-count">{category.count}</div>
                                    <p>Active & Completed Tenders</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="tenders-section guidelines-section">
                        <h2>Tender Guidelines</h2>
                        <div className="guidelines-grid">
                            <div className="guideline-card">
                                <h3>Eligibility Criteria</h3>
                                <ul>
                                    <li>Valid GST registration certificate</li>
                                    <li>PAN card and income tax returns</li>
                                    <li>Experience certificates for relevant work</li>
                                    <li>Financial capability certificates</li>
                                    <li>No blacklisting by any government organization</li>
                                </ul>
                            </div>
                            
                            <div className="guideline-card">
                                <h3>Submission Process</h3>
                                <ul>
                                    <li>Download tender documents from official website</li>
                                    <li>Submit EMD through DD/RTGS/NEFT</li>
                                    <li>Technical and commercial bids in separate envelopes</li>
                                    <li>Submit before deadline mentioned in tender</li>
                                    <li>Late submissions will not be accepted</li>
                                </ul>
                            </div>
                            
                            <div className="guideline-card">
                                <h3>Selection Process</h3>
                                <ul>
                                    <li>Technical evaluation of submitted documents</li>
                                    <li>Financial bid opening for qualified vendors</li>
                                    <li>L1 (Lowest) bidder selection</li>
                                    <li>Due diligence and verification</li>
                                    <li>Work order issuance to selected vendor</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="tenders-section listing-section">
                        <h2>Tender Listings</h2>
                        <div className="tender-tabs">
                            <button 
                                className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
                                onClick={() => setActiveTab('current')}
                            >
                                Current Tenders ({currentTenders.length})
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'archive' ? 'active' : ''}`}
                                onClick={() => setActiveTab('archive')}
                            >
                                Archive ({archiveTenders.length})
                            </button>
                        </div>
                        
                        <div className="tender-list">
                            {activeTab === 'current' && currentTenders.map(tender => (
                                <div key={tender.id} className="tender-card current">
                                    <div className="tender-header">
                                        <h3>{tender.title}</h3>
                                        <span className={`status-badge ${tender.status.toLowerCase()}`}>
                                            {tender.status}
                                        </span>
                                    </div>
                                    <div className="tender-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Reference No:</span>
                                            <span className="detail-value">{tender.refNo}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Published Date:</span>
                                            <span className="detail-value">{tender.date}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Submission Deadline:</span>
                                            <span className="detail-value deadline">{tender.deadline}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Category:</span>
                                            <span className="detail-value">{tender.category}</span>
                                        </div>
                                    </div>
                                    <div className="tender-actions">
                                        <button className="btn-download">Download Documents</button>
                                        <button className="btn-details">View Details</button>
                                    </div>
                                </div>
                            ))}
                            
                            {activeTab === 'archive' && archiveTenders.map(tender => (
                                <div key={tender.id} className="tender-card archive">
                                    <div className="tender-header">
                                        <h3>{tender.title}</h3>
                                        <span className={`status-badge ${tender.status.toLowerCase()}`}>
                                            {tender.status}
                                        </span>
                                    </div>
                                    <div className="tender-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Reference No:</span>
                                            <span className="detail-value">{tender.refNo}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Published Date:</span>
                                            <span className="detail-value">{tender.date}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Completion Date:</span>
                                            <span className="detail-value">{tender.deadline}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Category:</span>
                                            <span className="detail-value">{tender.category}</span>
                                        </div>
                                    </div>
                                    <div className="tender-actions">
                                        <button className="btn-details">View Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="tenders-section contact-section">
                        <h2>Tender Enquiries</h2>
                        <div className="contact-info">
                            <div className="contact-card">
                                <h3>Purchase Officer</h3>
                                <p><strong>Email:</strong> purchase@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong> +91-832-2404250</p>
                                <p>For general tender enquiries and clarifications</p>
                            </div>
                            
                            <div className="contact-card">
                                <h3>Accounts Officer</h3>
                                <p><strong>Email:</strong> accounts@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong> +91-832-2404260</p>
                                <p>For financial and payment related queries</p>
                            </div>
                            
                            <div className="contact-card">
                                <h3>Technical Specifications</h3>
                                <p><strong>Email:</strong> technical@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong> +91-832-2404270</p>
                                <p>For technical queries and specifications</p>
                            </div>
                        </div>
                    </section>

                    <section className="tenders-section important-notes-section">
                        <h2>Important Notes</h2>
                        <div className="notes-grid">
                            <div className="note-card">
                                <h4>📋 Document Submission</h4>
                                <p>All tender documents must be submitted in original along with self-attested copies. 
                                Incomplete submissions will be rejected.</p>
                            </div>
                            
                            <div className="note-card">
                                <h4>💰 EMD Payment</h4>
                                <p>Earnest Money Deposit (EMD) should be submitted through Demand Draft or online transfer 
                                only. Cash payments are not accepted.</p>
                            </div>
                            
                            <div className="note-card">
                                <h4>⏰ Deadline Adherence</h4>
                                <p>Tender submissions received after the specified deadline will not be considered 
                                under any circumstances.</p>
                            </div>
                            
                            <div className="note-card">
                                <h4>🔍 Verification Process</h4>
                                <p>NIT Goa reserves the right to verify all submitted documents and may reject 
                                any tender without assigning reasons.</p>
                            </div>
                            
                            <div className="note-card">
                                <h4>📞 Clarifications</h4>
                                <p>All clarifications regarding tenders must be sought through official email channels. 
                                Verbal confirmations are not valid.</p>
                            </div>
                            
                            <div className="note-card">
                                <h4>⚖️ Legal Jurisdiction</h4>
                                <p>All tender related disputes will be subject to the jurisdiction of courts in 
                                South Goa district only.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Tenders;
