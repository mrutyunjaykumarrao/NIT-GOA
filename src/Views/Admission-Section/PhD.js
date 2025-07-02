import React from 'react';
import './PhD.css';

const PhD = () => {
    const phdData = {
        title: "Ph.D. Admissions",
        subtitle: "Doctor of Philosophy Programs at NIT Goa",
        currentSession: "AY: 2025-26 (July Session)",
        importantLinks: [
            {
                title: "Ph.D. Information Brochure",
                link: "https://www.nitgoa.ac.in/static/Ph.D%20Admission%20Brochure%2022%20May%202025Rev.pdf",
                description: "Complete admission guidelines and requirements"
            },
            {
                title: "Online Application Portal", 
                link: "https://forms.gle/a8Y4RBBx3gMnNs4i9",
                description: "Apply online for Ph.D. admission"
            },
            {
                title: "Application Fee Payment",
                link: "https://u.payu.in/PAYUMN/xr3RLYOl16Ug", 
                description: "Pay application fee online"
            },
            {
                title: "Ph.D. Rules & Regulations",
                link: "https://www.nitgoa.ac.in/uploads/PhD%20(Rules%20&%20Regulations)_2014-15_Jan%202025_Merge.pdf",
                description: "Official Ph.D. program regulations"
            }
        ]
    };

    return (
        <div className="phd-page">
            <div className="phd-container">
                {/* Header Section */}
                <div className="phd-hero">
                    <div className="hero-content">
                        <h1>{phdData.title}</h1>
                        <p className="hero-subtitle">{phdData.subtitle}</p>
                        <div className="session-info">
                            <span className="session-label">{phdData.currentSession}</span>
                        </div>
                    </div>
                </div>

                {/* Important Links */}
                <section className="links-section">
                    <h2 className="section-title">Important Links</h2>
                    <div className="links-grid">
                        {phdData.importantLinks.map((link, index) => (
                            <a key={index} href={link.link} target="_blank" rel="noopener noreferrer" className="link-card">
                                <h3>{link.title}</h3>
                                <p>{link.description}</p>
                            </a>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PhD;