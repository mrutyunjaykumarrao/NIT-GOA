import React, { useState } from 'react';
import './GIAN.css';

const GIAN = () => {
    const [activeSection, setActiveSection] = useState(() => {
        // Get saved section from localStorage or default to 'home'
        return localStorage.getItem('gian-active-section') || 'home';
    });

    const handleSectionChange = (section) => {
        setActiveSection(section);
        // Save the current section to localStorage
        localStorage.setItem('gian-active-section', section);
        // Smooth scroll to section header when changing sections
        setTimeout(() => {
            const sectionHeader = document.querySelector('.gian-section-header');
            if (sectionHeader) {
                const headerOffset = 120; // Offset to account for navbar height
                const elementPosition = sectionHeader.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100); // Small delay to ensure DOM is updated
    };

    return (
        <div className="gian-page">
            <div className="gian-container">
                {/* Page Header */}
                <div className="gian-page-header">
                    <h1>GIAN</h1>
                    <p className="gian-page-subtitle">Global Initiative of Academic Networks</p>
                </div>

                {/* Main Content Layout */}
                <div className="gian-main-layout">
                    {/* Sidebar Navigation */}
                    <aside className="gian-sidebar">
                        <nav className="gian-nav">
                            <ul className="gian-nav-list">
                                <li className="gian-nav-item">
                                    <button 
                                        className={`gian-nav-link ${activeSection === 'home' ? 'gian-nav-active' : ''}`}
                                        onClick={() => handleSectionChange('home')}
                                    >
                                        Home
                                    </button>
                                </li>
                                <li className="gian-nav-item">
                                    <button 
                                        className={`gian-nav-link ${activeSection === 'objective' ? 'gian-nav-active' : ''}`}
                                        onClick={() => handleSectionChange('objective')}
                                    >
                                        Objective
                                    </button>
                                </li>
                                <li className="gian-nav-item">
                                    <button 
                                        className={`gian-nav-link ${activeSection === 'guidelines' ? 'gian-nav-active' : ''}`}
                                        onClick={() => handleSectionChange('guidelines')}
                                    >
                                        Guidelines
                                    </button>
                                </li>
                                <li className="gian-nav-item">
                                    <button 
                                        className={`gian-nav-link ${activeSection === 'upcoming' ? 'gian-nav-active' : ''}`}
                                        onClick={() => handleSectionChange('upcoming')}
                                    >
                                        Upcoming Courses
                                    </button>
                                </li>
                                <li className="gian-nav-item">
                                    <button 
                                        className={`gian-nav-link ${activeSection === 'completed' ? 'gian-nav-active' : ''}`}
                                        onClick={() => handleSectionChange('completed')}
                                    >
                                        Completed Courses
                                    </button>
                                </li>
                                <li className="gian-nav-item">
                                    <button 
                                        className={`gian-nav-link ${activeSection === 'contact' ? 'gian-nav-active' : ''}`}
                                        onClick={() => handleSectionChange('contact')}
                                    >
                                        Contact Us
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <main className="gian-content">
                        {/* Home Section */}
                        {activeSection === 'home' && (
                            <section className="gian-section">
                                <div className="gian-content-wrapper">
                                    <p className="gian-intro-text">
                                        Global Initiative for Academic Network (GIAN) programme approved by Union Cabinet in Higher Education aimed at tapping the talent pool of Scientist and Entrepreneur Internationally to encourage their engagement with the institutes of higher Education in India so as to augment the country's existing academic resources, accelerate the pace of quality reform, and elevate India's scientific and technological capacity to global excellence.
                                    </p>
                                    <p className="gian-intro-text">
                                        In order to (i) gather the best international experience into our systems of education, (ii) enable interaction of students and faculty with the best academic and industry experts from all over the world, (iii) share their experiences and expertise to motivate people to work on Indian problems, there is a need for a Scheme of International Summer and Winter Term. During the 'Retreat' of IITs with Minister of Human Resource Development Smt. Smriti Zubin Irani on 29th June, 2014 at Goa, it was decided that a system of Guest Lectures by internationally and nationally renowned experts would be evolved along with a comprehensive Faculty Development Programme not only for new IITs, IIMs, IISERs but also for NITs and other institutions in the country.
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* Objective Section */}
                        {activeSection === 'objective' && (
                            <section className="gian-section">
                                <div className="gian-section-header">
                                    <h2>THE PROPOSED GIAN IS ENVISAGED TO ACHIEVE THE FOLLOWING OBJECTIVES:</h2>
                                </div>
                                <div className="gian-content-wrapper">
                                    <ul className="gian-objectives-list">
                                        <li>To increase the footfalls of reputed international faculty in the Indian academic institutes.</li>
                                        <li>Provide opportunity to our faculty and students to learn and share knowledge and teaching skills in cutting edge areas.</li>
                                        <li>To create avenue for possible collaborative research.</li>
                                        <li>To increase participation and presence of international students in the academic Institutes.</li>
                                        <li>Opportunity for the students of different Institutes/Universities to interact and learn subjects in niche areas through collaborative learning process.</li>
                                        <li>Provide opportunity for the technical persons from Indian Industries to improve understandings and update their knowledge in relevant areas.</li>
                                        <li>Motivate the best international experts in the world to work on problems related to India.</li>
                                    </ul>
                                </div>
                            </section>
                        )}

                        {/* Guidelines Section */}
                        {activeSection === 'guidelines' && (
                            <section className="gian-section">
                                <div className="gian-section-header">
                                    <h2>The important aspects of the ISWT programme area as follows:</h2>
                                </div>
                                <div className="gian-content-wrapper">
                                    <div className="gian-guidelines-content">
                                        <div className="gian-guideline-item">
                                            <p><strong>i.</strong> Academic Institute/Universities will identify one or more subjects to be offered in this Ministry of Education scheme. This subject typically should not be offered in the regular semesters/year and can be interdisciplinary/industry oriented/ research oriented in nature and scope.</p>
                                        </div>
                                        <div className="gian-guideline-item">
                                            <p><strong>ii.</strong> Duration: Subjects should be offered in the Summer and Winter vacation of the host Institute.</p>
                                        </div>
                                        <div className="gian-guideline-item">
                                            <p><strong>iii.</strong> Each subject should be taught by at least one reputed international faculty jointly with one faculty from the host Institute. One additional faculty may be associated from another academic/ research organization in India.</p>
                                        </div>
                                        <div className="gian-guideline-item">
                                            <p><strong>iv.</strong> The international faculty should be-</p>
                                            <ul>
                                                <li>an expert in the area specified in the subject.</li>
                                                <li>working in academic institutions / industry / research organizations / independent researcher of international repute.</li>
                                                <li>encouraged to engage in a long term collaborative research programme with faculty members of the host Institute.</li>
                                            </ul>
                                        </div>
                                        <div className="gian-guideline-item">
                                            <p><strong>v.</strong> Each subject should be designed as per following:</p>
                                            <p>Duration of a lecture hour: 1hr.</p>
                                            <p>Total number of lectures: 30</p>
                                            <p>Maximum lectures per day: 3 lectures and / or tutorials ( eg 2 lectures and 1 tutorial)</p>
                                            <p>Total duration of a subject: 10 working days.</p>
                                        </div>
                                        <div className="gian-guideline-item">
                                            <p><strong>vi.</strong> The students can also obtain academic credits for these subjects based on the evaluation and grading process and agreed credit transfer mechanism between that host institute and the home institute of the students. The home university of the student will be mainly responsible for transferring academic credits. The host institute will only provide information on the grading system, subject syllabus, and the academic policy.</p>
                                        </div>
                                        <div className="gian-guideline-item">
                                            <p><strong>vii.</strong> A number of course would be taught by the Institute during the International Summer/Winter term. The participants have to resister for the subjects offered in this ISWT scheme with payments of registration fee plus the subject fee for each subject registered. While, the registration fee would be a nominal fee for registering for the course, once selected, the subject fee would depend on the number of subjects, the participants chooses to take.</p>
                                        </div>
                                        <div className="gian-guideline-item">
                                            <p><strong>viii.</strong> After successful completion of the subject , all participants, will get subject participation certificates. Those participating in examinations will get completion certificates with grades and credits.</p>
                                        </div>
                                        <div className="gian-guideline-item">
                                            <p><strong>ix.</strong> Each course should have a minimum of 50 participants. At least 30 participants must be teachers and students from other institutions, among whom at least 20 must be teachers from other Institutions.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Upcoming Courses Section */}
                        {activeSection === 'upcoming' && (
                            <section className="gian-section">
                                <div className="gian-section-header">
                                    <h2>Upcoming Courses:</h2>
                                </div>
                                <div className="gian-content-wrapper">
                                    <div className="gian-upcoming-container">
                                        <div className="gian-upcoming-course">
                                            <div className="gian-course-number">• 2412164:</div>
                                            <div className="gian-course-details-upcoming">
                                                <h3 className="gian-course-title-upcoming">Controller Design: Evolution from Classical to Machine Learning Framework</h3>
                                                <div className="gian-course-faculty-info">
                                                    <p><strong>Foreign Faculty:</strong> Dr. Akshya K. Swain, University of Auckland, New Zealand</p>
                                                    <p><strong>Host Faculty:</strong> Dr. Amol D. Rahulkar</p>
                                                </div>
                                                <div className="gian-course-schedule">
                                                    <p><strong>Date:</strong> 7-11 July, 2025</p>
                                                </div>
                                                <div className="gian-course-brochure">
                                                    <a href="https://www.nitgoa.ac.in/gian/gianuploads/GIANBrochure%2015jan2025.pdf" target="_blank" rel="noopener noreferrer" className="gian-brochure-link">
                                                        BROCHURE
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Completed Courses Section */}
                        {activeSection === 'completed' && (
                            <section className="gian-section">
                                <div className="gian-completed-header">
                                    <div className="gian-completed-title-container">
                                        <h2 className="gian-completed-main-title">Completed Courses</h2>
                                        <div className="gian-completed-subtitle">GIAN courses successfully conducted at NIT Goa</div>
                                    </div>
                                    <div className="gian-completed-stats">
                                        <div className="gian-completed-stat">
                                            <span className="gian-completed-number">18</span>
                                            <span className="gian-completed-label">Courses Completed</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="gian-completed-container">
                                    <div className="gian-completed-grid">
                                        <div className="gian-completed-card">
                                            <div className="gian-completed-content">
                                                <div className="gian-completed-number-badge">01</div>
                                                <h3 className="gian-completed-title">151038D04 : POWER CONVERTERS FOR ALTERNATE ENERGY SOURCES</h3>
                                                <div className="gian-completed-faculty">
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Foreign Faculty</span>
                                                        <span className="gian-faculty-name">Ashoka Krishna Sarpangal Bhat, Canada</span>
                                                    </div>
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Host Faculty</span>
                                                        <span className="gian-faculty-name">Dr. Soumitra Das</span>
                                                    </div>
                                                </div>
                                                <div className="gian-completed-date">21-03-2016 to 01-04-2016</div>
                                            </div>
                                        </div>

                                        <div className="gian-completed-card">
                                            <div className="gian-completed-content">
                                                <div className="gian-completed-number-badge">02</div>
                                                <h3 className="gian-completed-title">161038K01 : Computational Mathematics and Finite Element Method</h3>
                                                <div className="gian-completed-faculty">
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Foreign Faculty</span>
                                                        <span className="gian-faculty-name">Karan S. Surana, University of Kansas, Lawrence, KS, USA, United States of America</span>
                                                    </div>
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Host Faculty</span>
                                                        <span className="gian-faculty-name">Dr. P Saidi Reddy</span>
                                                    </div>
                                                </div>
                                                <div className="gian-completed-date">01-07-2016 to 11-07-2016</div>
                                            </div>
                                        </div>

                                        <div className="gian-completed-card">
                                            <div className="gian-completed-content">
                                                <div className="gian-completed-number-badge">03</div>
                                                <h3 className="gian-completed-title">161038D01 : Public Key Infrastructure (PKI) and Trust Management</h3>
                                                <div className="gian-completed-faculty">
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Foreign Faculty</span>
                                                        <span className="gian-faculty-name">Audun Jøsang, Department of Informatics, University of Oslo, Norway, Norway</span>
                                                    </div>
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Host Faculty</span>
                                                        <span className="gian-faculty-name">Dr. Modi Chirag Navinchandra</span>
                                                    </div>
                                                </div>
                                                <div className="gian-completed-date">05-11-2016 to 14-11-2016</div>
                                            </div>
                                        </div>

                                        <div className="gian-completed-card">
                                            <div className="gian-completed-content">
                                                <div className="gian-completed-number-badge">04</div>
                                                <h3 className="gian-completed-title">151038M02 : Computational Nonlinear Optics</h3>
                                                <div className="gian-completed-faculty">
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Foreign Faculty</span>
                                                        <span className="gian-faculty-name">Jeremy R. Gulley, Kennesaw State University, north of Atlanta, GA, United States of America</span>
                                                    </div>
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Host Faculty</span>
                                                        <span className="gian-faculty-name">Dr. Saidi Reddy Parne</span>
                                                    </div>
                                                </div>
                                                <div className="gian-completed-date">07-11-2016 to 18-11-2016</div>
                                            </div>
                                        </div>

                                        <div className="gian-completed-card">
                                            <div className="gian-completed-content">
                                                <div className="gian-completed-number-badge">05</div>
                                                <h3 className="gian-completed-title">161038D10 : Cyber Crime Investigation and Digital Forensics</h3>
                                                <div className="gian-completed-faculty">
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Foreign Faculty</span>
                                                        <span className="gian-faculty-name">Greg Gogolin, Ferris State University, Michigan, USA, United States of America</span>
                                                    </div>
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Host Faculty</span>
                                                        <span className="gian-faculty-name">Dr. Modi Chirag Navinchandra</span>
                                                    </div>
                                                </div>
                                                <div className="gian-completed-date">30-11-2016 to 06-12-2016</div>
                                            </div>
                                        </div>

                                        <div className="gian-completed-card">
                                            <div className="gian-completed-content">
                                                <div className="gian-completed-number-badge">06</div>
                                                <h3 className="gian-completed-title">161038D04 : POWER ELECTRONICS FOR RENEWABLE ENERGY SYSTEMS</h3>
                                                <div className="gian-completed-faculty">
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Foreign Faculty</span>
                                                        <span className="gian-faculty-name">Marcelo Godoy Simoes, Colorado School of Mines, USA, United States of America</span>
                                                    </div>
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Host Faculty</span>
                                                        <span className="gian-faculty-name">Dr. Suresh Mikkili</span>
                                                    </div>
                                                </div>
                                                <div className="gian-completed-date">08-12-2016 to 17-12-2016</div>
                                            </div>
                                        </div>

                                        <div className="gian-completed-card">
                                            <div className="gian-completed-content">
                                                <div className="gian-completed-number-badge">07</div>
                                                <h3 className="gian-completed-title">151038D01 : Cloud Security and Privacy</h3>
                                                <div className="gian-completed-faculty">
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Foreign Faculty</span>
                                                        <span className="gian-faculty-name">Muttukrishnan Rajarajan, School of Mathematics, Computer Science and Engineering, City University London, United Kingdom</span>
                                                    </div>
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Host Faculty</span>
                                                        <span className="gian-faculty-name">Dr. Damodar Reddy Edla</span>
                                                    </div>
                                                </div>
                                                <div className="gian-completed-date">12-12-2016 to 18-12-2016</div>
                                            </div>
                                        </div>

                                        <div className="gian-completed-card">
                                            <div className="gian-completed-content">
                                                <div className="gian-completed-number-badge">08</div>
                                                <h3 className="gian-completed-title">161038L01 : Applied Continuum Mechanics</h3>
                                                <div className="gian-completed-faculty">
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Foreign Faculty</span>
                                                        <span className="gian-faculty-name">J. N. Reddy, Department of Mechanical Engineering Texas A&M University, College Station, TX, United States of America</span>
                                                    </div>
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Host Faculty</span>
                                                        <span className="gian-faculty-name">Dr. Saidi Reddy Parne</span>
                                                    </div>
                                                </div>
                                                <div className="gian-completed-date">15-12-2016 to 25-12-2016</div>
                                            </div>
                                        </div>

                                        <div className="gian-completed-card">
                                            <div className="gian-completed-content">
                                                <div className="gian-completed-number-badge">09</div>
                                                <h3 className="gian-completed-title">161038D02 : Nanoscale Wireless Networking: Opportunities, Challenges, and Recent Advances</h3>
                                                <div className="gian-completed-faculty">
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Foreign Faculty</span>
                                                        <span className="gian-faculty-name">Mahbub Hassan, Australia</span>
                                                    </div>
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Host Faculty</span>
                                                        <span className="gian-faculty-name">Dr. Trilochan Panigrahi</span>
                                                    </div>
                                                </div>
                                                <div className="gian-completed-date">19-12-2016 to 24-12-2016</div>
                                            </div>
                                        </div>

                                        <div className="gian-completed-card">
                                            <div className="gian-completed-content">
                                                <div className="gian-completed-number-badge">10</div>
                                                <h3 className="gian-completed-title">161038K02 : Advancements in Privacy Preserving Data Mining</h3>
                                                <div className="gian-completed-faculty">
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Foreign Faculty</span>
                                                        <span className="gian-faculty-name">Ljiljana Brankovic, University of Newcastle, Australia, Australia</span>
                                                    </div>
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Host Faculty</span>
                                                        <span className="gian-faculty-name">Dr. Modi Chirag Navinchandra</span>
                                                    </div>
                                                </div>
                                                <div className="gian-completed-date">19-12-2016 to 29-12-2016</div>
                                            </div>
                                        </div>

                                        <div className="gian-completed-card">
                                            <div className="gian-completed-content">
                                                <div className="gian-completed-number-badge">11</div>
                                                <h3 className="gian-completed-title">161038D08 : Low Power Nyquist-rate Data Converter</h3>
                                                <div className="gian-completed-faculty">
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Foreign Faculty</span>
                                                        <span className="gian-faculty-name">Edoardo Bonizzoni, University of Pavia, Italy., Italy</span>
                                                    </div>
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Host Faculty</span>
                                                        <span className="gian-faculty-name">Dr. Nithin Kumar Y.B.</span>
                                                    </div>
                                                </div>
                                                <div className="gian-completed-date">06-03-2017 to 10-03-2017</div>
                                            </div>
                                        </div>

                                        <div className="gian-completed-card">
                                            <div className="gian-completed-content">
                                                <div className="gian-completed-number-badge">12</div>
                                                <h3 className="gian-completed-title">151038D06 : Non-linear Adaptive Signal Processing</h3>
                                                <div className="gian-completed-faculty">
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Foreign Faculty</span>
                                                        <span className="gian-faculty-name">John Soraghan, University of Strathclyde, United Kingdom</span>
                                                    </div>
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Host Faculty</span>
                                                        <span className="gian-faculty-name">Dr. Badri Narayan Subudhi</span>
                                                    </div>
                                                </div>
                                                <div className="gian-completed-date">13-03-2017 to 18-03-2017</div>
                                            </div>
                                        </div>

                                        <div className="gian-completed-card">
                                            <div className="gian-completed-content">
                                                <div className="gian-completed-number-badge">13</div>
                                                <h3 className="gian-completed-title">161038D06 : Advance Adjustable Speed AC Motor Drive Systems: Application Problems & Solutions</h3>
                                                <div className="gian-completed-faculty">
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Foreign Faculty</span>
                                                        <span className="gian-faculty-name">Prasad N. Enjeti, Texas A&M University, United States of America</span>
                                                    </div>
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Host Faculty</span>
                                                        <span className="gian-faculty-name">Dr. Suresh Mikkili</span>
                                                    </div>
                                                </div>
                                                <div className="gian-completed-date">15-05-2017 to 19-05-2017</div>
                                            </div>
                                        </div>

                                        <div className="gian-completed-card">
                                            <div className="gian-completed-content">
                                                <div className="gian-completed-number-badge">14</div>
                                                <h3 className="gian-completed-title">151038M03 : The Field Theory of Classical and Quantum Phase Transitions</h3>
                                                <div className="gian-completed-faculty">
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Foreign Faculty</span>
                                                        <span className="gian-faculty-name">Flavio S. Nogueira, Institute for Theoretical Solid State Physics, IFW Dresden, Germany</span>
                                                    </div>
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Host Faculty</span>
                                                        <span className="gian-faculty-name">Dr. Saidi Reddy Parne</span>
                                                    </div>
                                                </div>
                                                <div className="gian-completed-date">03-07-2017 to 13-07-2017</div>
                                            </div>
                                        </div>

                                        <div className="gian-completed-card">
                                            <div className="gian-completed-content">
                                                <div className="gian-completed-number-badge">15</div>
                                                <h3 className="gian-completed-title">171038D01 : Redox based Resistive Non-volatile Memory Technology</h3>
                                                <div className="gian-completed-faculty">
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Foreign Faculty</span>
                                                        <span className="gian-faculty-name">Vikas Rana, Germany</span>
                                                    </div>
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Host Faculty</span>
                                                        <span className="gian-faculty-name">Dr. Lalat Indu Giri</span>
                                                    </div>
                                                </div>
                                                <div className="gian-completed-date">04-12-2017 to 09-12-2017</div>
                                            </div>
                                        </div>

                                        <div className="gian-completed-card">
                                            <div className="gian-completed-content">
                                                <div className="gian-completed-number-badge">16</div>
                                                <h3 className="gian-completed-title">171038B01 : Principle and Applications of Electron Paramagnetic Resonance Spectroscopy</h3>
                                                <div className="gian-completed-faculty">
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Foreign Faculty</span>
                                                        <span className="gian-faculty-name">Thomas Prisner, Germany</span>
                                                    </div>
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Host Faculty</span>
                                                        <span className="gian-faculty-name">Dr. Velavan Kathirvelu</span>
                                                    </div>
                                                </div>
                                                <div className="gian-completed-date">29-01-2018 to 09-02-2018</div>
                                            </div>
                                        </div>

                                        <div className="gian-completed-card">
                                            <div className="gian-completed-content">
                                                <div className="gian-completed-number-badge">17</div>
                                                <h3 className="gian-completed-title">171038D07 : Emerging antennas for future communications systems: Theory, Challenges and Physical Implementation</h3>
                                                <div className="gian-completed-faculty">
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Foreign Faculty</span>
                                                        <span className="gian-faculty-name">Yahia M.M. Antar, Royal Military College, Canada</span>
                                                    </div>
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Host Faculty</span>
                                                        <span className="gian-faculty-name">Dr. Pragati Patel</span>
                                                    </div>
                                                </div>
                                                <div className="gian-completed-date">05-03-2018 to 10-03-2018</div>
                                            </div>
                                        </div>

                                        <div className="gian-completed-card">
                                            <div className="gian-completed-content">
                                                <div className="gian-completed-number-badge">18</div>
                                                <h3 className="gian-completed-title">2412134: BLOCKCHAIN EVOLUTION AND ITS APPLICATIONS</h3>
                                                <div className="gian-completed-faculty">
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Foreign Faculty</span>
                                                        <span className="gian-faculty-name">Prof. Roman Vitenberg, University of Oslo, Norway</span>
                                                    </div>
                                                    <div className="gian-faculty-item">
                                                        <span className="gian-faculty-label">Host Faculty</span>
                                                        <span className="gian-faculty-name">Dr. Modi Chirag Navinchandra</span>
                                                    </div>
                                                </div>
                                                <div className="gian-completed-date">10-20 March, 2025</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Contact Section */}
                        {activeSection === 'contact' && (
                            <section className="gian-section">
                                <div className="gian-section-header">
                                    <h2>Contact Us</h2>
                                </div>
                                <div className="gian-content-wrapper">
                                    {/* Main Contact Card */}
                                    <div className="gian-contact-main-card">
                                        <div className="gian-contact-content">
                                            <h3>Dr. B.Santhi</h3>
                                            <p className="gian-contact-title">Local Coordinator, GIAN Cell NIT Goa</p>
                                            
                                            <div className="gian-contact-details">
                                                <div className="gian-contact-item">
                                                    <div className="gian-contact-item-icon">
                                                        <span>📍</span>
                                                    </div>
                                                    <div className="gian-contact-item-text">
                                                        <strong>Address</strong>
                                                        <p>Cuncolim, South Goa, Goa<br/>PIN-403 703, INDIA</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="gian-contact-item">
                                                    <div className="gian-contact-item-icon">
                                                        <span>📧</span>
                                                    </div>
                                                    <div className="gian-contact-item-text">
                                                        <strong>Email</strong>
                                                        <p>gian@nitgoa.ac.in</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="gian-contact-item">
                                                    <div className="gian-contact-item-icon">
                                                        <span>📞</span>
                                                    </div>
                                                    <div className="gian-contact-item-text">
                                                        <strong>Phone</strong>
                                                        <p>-</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default GIAN;
