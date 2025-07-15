import React from 'react';
import './NIRF.css';

const NIRF = () => {
    return (
        <div className="nirf-page">
            <div className="nirf-container">
                <div className="page-header">
                    <h1>NIRF Rankings</h1>
                    <p className="page-subtitle">National Institutional Ranking Framework</p>
                </div>

                <div className="nirf-content">
                    <section className="nirf-section overview-section">
                        <h2>About NIRF</h2>
                        <p>
                            The National Institutional Ranking Framework (NIRF) was approved by the MHRD and launched by 
                            Honourable Minister of Human Resource Development on 29th September 2015. This framework outlines 
                            a methodology to rank institutions across the country.
                        </p>
                        <p>
                            NIRF ranks institutions based on five broad parameters: Teaching, Learning and Resources (TLR), 
                            Research and Professional Practice (RPC), Graduation Outcomes (GO), Outreach and Inclusivity (OI), 
                            and Perception (PR).
                        </p>
                    </section>

                    <section className="nirf-section rankings-section">
                        <h2>NIT Goa NIRF Rankings</h2>
                        <div className="rankings-grid">
                            <div className="ranking-card">
                                <div className="rank-number">82</div>
                                <h3>Overall Rankings 2024</h3>
                                <p>NIT Goa secured 82nd position in the overall category in NIRF Rankings 2024</p>
                            </div>
                            <div className="ranking-card">
                                <div className="rank-number">66</div>
                                <h3>Engineering Rankings 2024</h3>
                                <p>NIT Goa achieved 66th rank in the Engineering category in NIRF Rankings 2024</p>
                            </div>
                        </div>
                        <div className="ranking-trend">
                            <h3>Ranking Trend</h3>
                            <div className="trend-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Year</th>
                                            <th>Overall Rank</th>
                                            <th>Engineering Rank</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>2024</td>
                                            <td>82</td>
                                            <td>66</td>
                                        </tr>
                                        <tr>
                                            <td>2023</td>
                                            <td>89</td>
                                            <td>72</td>
                                        </tr>
                                        <tr>
                                            <td>2022</td>
                                            <td>95</td>
                                            <td>78</td>
                                        </tr>
                                        <tr>
                                            <td>2021</td>
                                            <td>101-150</td>
                                            <td>85</td>
                                        </tr>
                                        <tr>
                                            <td>2020</td>
                                            <td>101-150</td>
                                            <td>89</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <section className="nirf-section parameters-section">
                        <h2>NIRF Parameters</h2>
                        <div className="parameters-grid">
                            <div className="parameter-card">
                                <div className="parameter-icon">📚</div>
                                <h3>Teaching, Learning & Resources (TLR)</h3>
                                <p>Faculty-student ratio, faculty qualifications, research publications, 
                                financial resources, and physical infrastructure</p>
                                <div className="parameter-weight">Weight: 30%</div>
                            </div>
                            <div className="parameter-card">
                                <div className="parameter-icon">🔬</div>
                                <h3>Research & Professional Practice (RPC)</h3>
                                <p>Publications, patents, research projects, consultancy revenue, 
                                and research productivity</p>
                                <div className="parameter-weight">Weight: 30%</div>
                            </div>
                            <div className="parameter-card">
                                <div className="parameter-icon">🎓</div>
                                <h3>Graduation Outcomes (GO)</h3>
                                <p>Placement statistics, higher studies, entrepreneurship, 
                                and median salary</p>
                                <div className="parameter-weight">Weight: 20%</div>
                            </div>
                            <div className="parameter-card">
                                <div className="parameter-icon">🤝</div>
                                <h3>Outreach & Inclusivity (OI)</h3>
                                <p>Diversity, social inclusion, regional diversity, 
                                and outreach programs</p>
                                <div className="parameter-weight">Weight: 10%</div>
                            </div>
                            <div className="parameter-card">
                                <div className="parameter-icon">👥</div>
                                <h3>Perception (PR)</h3>
                                <p>Academic peer review, employer feedback, 
                                and public perception</p>
                                <div className="parameter-weight">Weight: 10%</div>
                            </div>
                        </div>
                    </section>

                    <section className="nirf-section achievements-section">
                        <h2>Key Achievements</h2>
                        <div className="achievements-grid">
                            <div className="achievement-card">
                                <h3>Research Excellence</h3>
                                <ul>
                                    <li>Significant improvement in research publications</li>
                                    <li>Enhanced faculty research productivity</li>
                                    <li>Increased funding for research projects</li>
                                    <li>Growing number of patents filed</li>
                                </ul>
                            </div>
                            <div className="achievement-card">
                                <h3>Academic Infrastructure</h3>
                                <ul>
                                    <li>State-of-the-art laboratories and equipment</li>
                                    <li>Modern library with extensive digital resources</li>
                                    <li>Enhanced IT infrastructure</li>
                                    <li>Improved faculty-student ratio</li>
                                </ul>
                            </div>
                            <div className="achievement-card">
                                <h3>Placement Success</h3>
                                <ul>
                                    <li>Consistent improvement in placement statistics</li>
                                    <li>Growing number of recruiters</li>
                                    <li>Enhanced industry partnerships</li>
                                    <li>Better graduate outcomes</li>
                                </ul>
                            </div>
                            <div className="achievement-card">
                                <h3>Inclusivity & Outreach</h3>
                                <ul>
                                    <li>Diverse student population</li>
                                    <li>Active community engagement programs</li>
                                    <li>Social outreach initiatives</li>
                                    <li>Regional diversity in admissions</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="nirf-section improvement-section">
                        <h2>Continuous Improvement Initiatives</h2>
                        <div className="improvement-areas">
                            <div className="improvement-card">
                                <h3>Research Enhancement</h3>
                                <p>
                                    NIT Goa is continuously working to enhance its research output through 
                                    faculty development programs, research collaborations, and improved 
                                    research infrastructure.
                                </p>
                            </div>
                            <div className="improvement-card">
                                <h3>Industry Connect</h3>
                                <p>
                                    Strengthening industry partnerships, increasing consultancy projects, 
                                    and enhancing industry-academia collaboration for better practical exposure.
                                </p>
                            </div>
                            <div className="improvement-card">
                                <h3>International Exposure</h3>
                                <p>
                                    Promoting international collaborations, student exchange programs, 
                                    and international research partnerships to enhance global visibility.
                                </p>
                            </div>
                            <div className="improvement-card">
                                <h3>Innovation & Entrepreneurship</h3>
                                <p>
                                    Fostering innovation culture, supporting startup initiatives, 
                                    and encouraging entrepreneurship among students and faculty.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="nirf-section data-section">
                        <h2>NIRF Data Submission</h2>
                        <div className="data-info">
                            <div className="data-card">
                                <h3>Data Collection Process</h3>
                                <p>
                                    NIT Goa follows a systematic approach for collecting and verifying NIRF data. 
                                    A dedicated committee ensures accuracy and completeness of submitted information.
                                </p>
                            </div>
                            <div className="data-card">
                                <h3>Transparency & Accountability</h3>
                                <p>
                                    All NIRF data submitted by NIT Goa is publicly available on the NIRF website. 
                                    The institute maintains transparency in all its ranking-related information.
                                </p>
                            </div>
                            <div className="data-card">
                                <h3>Continuous Monitoring</h3>
                                <p>
                                    The institute continuously monitors its performance across all NIRF parameters 
                                    and implements strategic improvements to enhance its ranking position.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="nirf-section documents-section">
                        <h2>NIRF Documents</h2>
                        <div className="documents-grid">
                            <div className="document-card">
                                <div className="document-icon">📄</div>
                                <h3>NIRF Data 2024</h3>
                                <p>Complete data submission for NIRF Rankings 2024</p>
                                <button className="download-btn">Download PDF</button>
                            </div>
                            <div className="document-card">
                                <div className="document-icon">📊</div>
                                <h3>Ranking Report 2024</h3>
                                <p>Detailed analysis of NIT Goa's NIRF Rankings 2024</p>
                                <button className="download-btn">Download PDF</button>
                            </div>
                            <div className="document-card">
                                <div className="document-icon">📈</div>
                                <h3>Improvement Strategy</h3>
                                <p>Strategic plan for improving NIRF rankings</p>
                                <button className="download-btn">Download PDF</button>
                            </div>
                        </div>
                    </section>

                    <section className="nirf-section contact-section">
                        <h2>NIRF Coordinator</h2>
                        <div className="coordinator-info">
                            <div className="coordinator-card">
                                <h3>NIRF Nodal Officer</h3>
                                <p><strong>Dr. [Name]</strong></p>
                                <p>Professor & NIRF Coordinator</p>
                                <p>Email: nirf@nitgoa.ac.in</p>
                                <p>Phone: +91-832-2404XXX</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default NIRF;
