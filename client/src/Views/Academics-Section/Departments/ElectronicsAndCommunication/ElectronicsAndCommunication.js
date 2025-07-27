import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ElectronicsAndCommunication.css';

const ElectronicsAndCommunication = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('home');
    const [openResearchSection, setOpenResearchSection] = useState(null);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const toggleResearchSection = (section) => {
        setOpenResearchSection(openResearchSection === section ? null : section);
    };

    return (
        <div className="electronics-communication-page">
            <div className="electronics-communication-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Electronics & Communication Engineering</h1>
                    <p className="page-subtitle">Department of Electronics and Communication Engineering</p>
                </div>

                {/* Main Content Layout */}
                <div className="main-layout">
                    {/* Sidebar Navigation */}
                    <aside className="department-sidebar">
                        <nav className="department-nav">
                            <ul className="nav-list">
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'home' ? 'nav-active' : ''}`}
                                        onClick={() => handleSectionChange('home')}
                                    >
                                        Home
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'faculty' ? 'nav-active' : ''}`}
                                        onClick={() => handleNavigation('/faculty')}
                                    >
                                        Faculty
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'research' ? 'nav-active' : ''}`}
                                        onClick={() => handleSectionChange('research')}
                                    >
                                        Research
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'ug-handbook' ? 'nav-active' : ''}`}
                                        onClick={() => handleSectionChange('ug-handbook')}
                                    >
                                        UG Academic Handbook
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'pg-handbook' ? 'nav-active' : ''}`}
                                        onClick={() => handleSectionChange('pg-handbook')}
                                    >
                                        PG Academic Handbook
                                    </button>
                                </li>

                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'handbook' ? 'nav-active' : ''}`}
                                        onClick={() => handleSectionChange('handbook')}
                                    >
                                        Handbook
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <main className="department-content">
                        {/* Home Section */}
                        {activeSection === 'home' && (
                            <section className="content-section">
                                <h2>Welcome To Electronics and Communication Department</h2>
                                
                                <div className="content-text">
                                    <p>
                                        The Electronics and Communication Department of NIT Goa was formed in 2010. It offers B. Tech., M.Tech. in VLSI and Ph.D. program in Electronics and Communication Engineering. The goal of the department is to impart both theoretical and practical knowledge in Electronics and Communication Engineering to students so as to enable them for technology and research.
                                    </p>
                                    
                                    <p>
                                        The department covers following major areas in Electronics and Communication Engineering through its courses and projects: VLSI, Communication and Networking, Signal Processing, Microelectronics and Electronics Design, Electromagnetics. Faculty members in ECE department are committed towards teaching and research. They try to cultivate interest in students for research and technology. The Department has well equipped laboratories.
                                    </p>
                                </div>
                            </section>
                        )}
                        {/* Research Section */}
                        {activeSection === 'research' && (
                            <section className="content-section">
                                <h2>Research</h2>
                                <div className="research-content">
                                    <p className="research-intro">The department is actively engaged in cutting-edge research in VLSI design, communication systems, signal processing, microelectronics, and electromagnetics.</p>
                                    
                                    {/* Research Dropdown Sections */}
                                    <div className="research-sections">
                                        {/* SMDP-C2SD Project Section */}
                                        <div className="research-dropdown-section">
                                            <div 
                                                className={`research-section-header ${openResearchSection === 'smdp' ? 'active' : ''}`}
                                                onClick={() => toggleResearchSection('smdp')}
                                            >
                                                <h3 className="research-section-title">SMDP-C2SD Project</h3>
                                                <div className={`research-arrow ${openResearchSection === 'smdp' ? 'rotated' : ''}`}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M6 9l6 6 6-6"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            
                                            <div className={`research-section-content ${openResearchSection === 'smdp' ? 'expanded' : ''}`}>
                                                <div className="research-items research-scrollable">
                                                    <div className="research-card">
                                                        <div className="research-publication-list">
                                                            <p>
                                                                The world's electronic industry expected to be $ 2.4 Trillion and Indian electronic market is expected to be $ 400 Billion by 2020. Thanks to the semiconductor technology, which is the heart electronic industry able to fabricate stringent analog and digital system. The Semiconductor technology started from Integrated Circuit [IC] in 1958, then small scale integration, moved to medium scale integration and finally to Very Large Scale Integration [VLSI] in-order to meet the ever increasing complex electronic systems through the scaling of technology. Currently technology is in the era of System on Chip (SoC), where the process involves miniaturization of entire electronic system. To meet the India's semiconductor requirement i.e. skill intensive man power, Department of Electronics and Information Technology (Diety) executed Special Manpower Development Programme (SMDP-I) and SMDP-II.
                                                            </p>
                                                            <p>
                                                                Ministry of Electronics and Information Technology (Meity) started third phase of SMDP in 2014, which is known as SMDP-C2SD to meet the current requirement of VLSI/SoC/System Design. The goal of the programme is not limited to promotion of R&D in VLSI/SoC/System Design but also promote the quality researcher in the country through network PhD Programme. The outcome help to develop Intellectual Property in the country.
                                                            </p>
                                                            <p>
                                                                NIT Goa is one of the new Participating Institute (Category III), mentored by the cluster programme of IIT Roorkee. The other PI's in the cluster are NIT Jalandhar, NIT Patna, NIT Uttarakand. Under SMDP-C2SD programme NIT Goa proposed two ASICs even though this is the first time participation. The research output yielded 14 publications in reputed IEEE Conferences/Journals and Two Patents are in filing stage. As a part of SMDP activity NIT Goa coordinated 4th ZoPP Workshop during 25-26th of October 2018 at "The International center Goa", Dona Paula, Panaji.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Journals Section */}
                                        <div className="research-dropdown-section">
                                            <div 
                                                className={`research-section-header ${openResearchSection === 'journals' ? 'active' : ''}`}
                                                onClick={() => toggleResearchSection('journals')}
                                            >
                                                <h3 className="research-section-title">Journals</h3>
                                                <div className={`research-arrow ${openResearchSection === 'journals' ? 'rotated' : ''}`}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M6 9l6 6 6-6"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            
                                            <div className={`research-section-content ${openResearchSection === 'journals' ? 'expanded' : ''}`}>
                                                <div className="research-items research-scrollable">
                                                    <div className="research-card">
                                                        <h4 className="research-subsection-title">Journals 2020</h4>
                                                        <ul className="research-publication-list">
                                                            <li>IF:2.286, IEEE Access, 2020</li>
                                                            <li>IF:2.286, Neural Computing and Applications, 2020</li>
                                                            <li>IF:2.286, IET Biomedical Engineering, 2020</li>
                                                            <li>IF:2.286, Neurocomputing, 2020</li>
                                                            <li>IF:2.286, Pattern Recognition Letters, 2020</li>
                                                            <li>IF:2.286, Artificial Intelligence in Medicine, 2020</li>
                                                            <li>IF:2.286, International Journal of Pattern Recognition and Artificial Intelligence, 2020</li>
                                                            <li>IF:2.286, Expert Systems with Applications, 2020</li>
                                                            <li>Robust Mixed Source Localization in WSN using Swarm Intelligence Algorithms, Digital Signal Processing, Vol. 98, March 2020, Elsevier</li>
                                                            <li>Distributed Version of Hybrid Swarm Intelligence-Nelder Mead Algorithm for DOA estimation in WSN, Expert Systems With Applications, Elsevier, Vol. 144, April 2020</li>
                                                        </ul>

                                                        <h4 className="research-subsection-title">Journals 2019</h4>
                                                        <ul className="research-publication-list">
                                                            <li>Manikantta Reddy Karri, Vasantha M.H, Nithin Kumar Y.B, Devesh Dwivedi, "Design and Analysis of Multiplier Using Approximate 4-2 Compressor" International Journal of Electronics and Communications (Elsevier)- Vol. 107, pp. 89-97, 2019.</li>
                                                            <li>Vivek Sharma, Nithin Kumar Y.B, Vasantha M.H, "36 μW 4th Order Sigma-Delta Modulator Using Single Operational Amplifier" International Journal of Electronics Letters 1-16, 2020.</li>
                                                            <li>B. N. Subudhi, T. Veerakumar, S. Esakkirajan and A. Ghosh, "Kernelized Fuzzy Modal Variation for Local Change Detection from Video Scenes", IEEE Transactions on Multimedia, vol.22, pp.912-920, 2019. (IF: 5.452).</li>
                                                            <li>D. K. Rout, B. N Subudhi, T. Veerakumar, and S. Chaudhury, "Walsh-Hadamard Kernel based Features in Particle Filter Framework for Underwater Object Tracking", IEEE Transactions on Industrial Informatics,vol.16,pp.5712-5722, 2019 (IF: 7.377).</li>
                                                            <li>T. Veerakumar, B. N Subudhi, S. Esakkirajan and P. K. Pradhan, "Iterative Adaptive Unsymmetric Trimmed Shock Filter for High-Density Salt-and-Pepper Noise Removal" Circuits, Systems & Signal Processing, vol. 38, no. 6, pp. 2630–2652, 2019. (IF: 1.998).</li>
                                                            <li>T. Veerakumar, B. N Subudhi, and S. Esakkirajan, "Empirical mode decomposition and adaptive bilateral filter approach for impulse noise removal," Expert Systems with Applications, vol. 121, pp. 18-27, 2019. (IF: 3.928).</li>
                                                            <li>B. N. Subudhi, T. Veerakumar, S. Esakkirajan and A. Ghosh, "Context Dependent Fuzzy Associated Statistical Model for Intensity Inhomogeneity Correction from Magnetic Resonance Images", IEEE Journal of Translational Engineering in Health and Medicine, vol. 7, pp. 1-9, 2019. (IF: 1.754).</li>
                                                            <li>Ashish Sharma, S. Patidar, A. Upadhyay and U. R. Acharya, "Accurate tunable-Q wavelet transform based method for QRS complex detection", Computers and Electrical Engineering, vol.75, pp.101-111, 2019. (IF: 2.189).</li>
                                                            <li>Shree Prasad M, and T. Panigrahi, "Distributed Maximum Likelihood DOA Estimation Algorithm for Correlated Signals in Wireless Sensor Network," in Wireless Personal Communications, Springer, April 2019, Volume 105, Issue 4, pp 1527–1544.</li>
                                                            <li>Meera Dash, T. Panigrahi, R. Sharma, "Distributed Parameter Estimation of IIR System using Diffusion Particle Swarm Optimization Algorithm," Journal of King Saud university - Engineering Sciences, Elsevier, Vol. 31, Issue 4, pp. 345-354, Oct. 2019.</li>
                                                        </ul>

                                                        <h4 className="research-subsection-title">Journals 2018</h4>
                                                        <ul className="research-publication-list">
                                                            <li>B. Naresh Kumar Reddy, Vasantha.M.H. and Nithin Kumar Y.B., "An Energy- Efficient Fault-Aware Core Mapping in Mesh-based Network on Chip Systems," Journal of Network and Computer Applications, Vol. 105, pp. 79-87, 2018. (Impact Factor= 3.991).</li>
                                                            <li>C. Vimalraj, S. Esakkirajan, T. Veerakumar, P. Sreevidya, "Despeckling of Ultrasound Images using Directionally Decimated Wavelet Packets with Adaptive Clustering", IET Image Processing, Vol. 13, pp. 206-215, 2018. (IF:2.004).</li>
                                                            <li>Deepak Kumar Rout, BN Subudhi, T. Veerakumar, and Santanu Chaudhury, "Spatio-contextual Gaussian mixture model for local change detection in underwater video", Expert Systems with Applications, Vol. 97, pp.117-136, 2018. (IF:3.928).</li>
                                                            <li>A. Chatterjee, T. Mondal, Deven G. Patanvariya, Ravi Prasad K. Jagannath. Fractal-based design and fabrication of low-sidelobe antenna array. AEU -International Journal of Electronics and Communications, Elsevier, Vol.83, pp. 549-557, 2018.</li>
                                                        </ul>

                                                        <h4 className="research-subsection-title">Research Focus Areas</h4>
                                                        <p className="research-intro">
                                                            The department's faculty members publish high-quality research spanning multiple domains including VLSI design, signal processing, image processing, wireless communications, machine learning, biomedical engineering, and network-on-chip systems. Our research contributions are published in prestigious IEEE journals and international conferences with high impact factors.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* UG Academic Handbook Section */}
                        {activeSection === 'ug-handbook' && (
                            <section className="content-section">
                                <h2>UG Academic Handbook</h2>
                                <div className="content-text">
                                    <p>Download the Undergraduate Academic Handbook for detailed information about the B.Tech ECE curriculum and academic policies.</p>
                                    <div className="handbook-link">
                                        <a 
                                            href="https://www.nitgoa.ac.in/static/AcademicHandbook_%2030_9_2013-CSE.pdf" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="handbook-download-btn"
                                        >
                                            📖 Download UG Academic Handbook (PDF)
                                        </a>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* PG Academic Handbook Section */}
                        {activeSection === 'pg-handbook' && (
                            <section className="content-section">
                                <h2>PG Academic Handbook</h2>
                                <div className="content-text">
                                    <p>Download the Postgraduate Academic Handbook for detailed information about the M.Tech VLSI and Ph.D programs in ECE.</p>
                                    <div className="handbook-link">
                                        <a 
                                            href="https://www.nitgoa.ac.in/static/PG%20Academic%20Handbook%20M.%20Tech%20(CSE).pdf" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="handbook-download-btn"
                                        >
                                            📚 Download PG Academic Handbook (PDF)
                                        </a>
                                    </div>
                                </div>
                            </section>
                        )}



                        {/* Handbook Section */}
                        {activeSection === 'handbook' && (
                            <section className="content-section">
                                <h2>Handbook</h2>
                                <div className="content-text">
                                    <p>General handbook and department-specific information for students and faculty.</p>
                                </div>
                            </section>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ElectronicsAndCommunication;
