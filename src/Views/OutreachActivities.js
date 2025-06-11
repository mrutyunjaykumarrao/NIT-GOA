import React, { useState } from 'react';
import './OutreachActivities.css';

const OutreachActivities = () => {
  const [activeTab, setActiveTab] = useState('community');

  const outreachPrograms = {
    community: {
      title: 'Community Engagement',
      icon: '🤝',
      programs: [
        {
          title: 'Digital Literacy Program',
          description: 'Teaching basic computer skills and digital literacy to rural communities and senior citizens.',
          impact: '500+ beneficiaries trained',
          duration: 'Ongoing',
          image: '💻',
          details: [
            'Basic computer operations and internet usage',
            'Digital payment systems training',
            'Online government services access',
            'Email and communication skills'
          ]
        },
        {
          title: 'Health Awareness Campaigns',
          description: 'Organizing health checkups, awareness sessions, and hygiene education in local villages.',
          impact: '1200+ people reached',
          duration: 'Monthly',
          image: '🏥',
          details: [
            'Free health checkups and consultations',
            'COVID-19 vaccination awareness',
            'Maternal and child health education',
            'Mental health awareness sessions'
          ]
        },
        {
          title: 'Skill Development Workshops',
          description: 'Vocational training programs for unemployed youth and women in nearby communities.',
          impact: '300+ participants trained',
          duration: 'Quarterly',
          image: '🛠️',
          details: [
            'Technical skills training',
            'Entrepreneurship development',
            'Financial literacy programs',
            'Career guidance and counseling'
          ]
        }
      ]
    },
    education: {
      title: 'Educational Outreach',
      icon: '📚',
      programs: [
        {
          title: 'School Partnership Program',
          description: 'Collaborating with local schools to improve STEM education and infrastructure.',
          impact: '15 schools partnered',
          duration: 'Ongoing',
          image: '🏫',
          details: [
            'STEM lab setup and equipment donation',
            'Teacher training workshops',
            'Student mentorship programs',
            'Science fair organization'
          ]
        },
        {
          title: 'Adult Education Initiative',
          description: 'Providing basic literacy and numeracy education to adults in rural areas.',
          impact: '200+ adults educated',
          duration: 'Ongoing',
          image: '📖',
          details: [
            'Basic reading and writing skills',
            'Numerical literacy training',
            'Functional English classes',
            'Life skills education'
          ]
        },
        {
          title: 'Engineering for Society',
          description: 'Student-led projects addressing local engineering challenges and solutions.',
          impact: '25+ projects completed',
          duration: 'Annual',
          image: '⚙️',
          details: [
            'Water purification systems',
            'Solar energy solutions',
            'Waste management projects',
            'Agricultural technology innovation'
          ]
        }
      ]
    },
    environment: {
      title: 'Environmental Conservation',
      icon: '🌱',
      programs: [
        {
          title: 'Plantation Drives',
          description: 'Large-scale tree plantation and maintenance programs in collaboration with local authorities.',
          impact: '5000+ trees planted',
          duration: 'Seasonal',
          image: '🌳',
          details: [
            'Native species plantation',
            'Coastal area afforestation',
            'Campus greening initiatives',
            'Community garden development'
          ]
        },
        {
          title: 'Clean Goa Campaign',
          description: 'Beach cleaning, waste segregation awareness, and plastic-free initiatives.',
          impact: '50+ beaches cleaned',
          duration: 'Monthly',
          image: '🏖️',
          details: [
            'Beach and river cleaning drives',
            'Plastic waste reduction campaigns',
            'Waste segregation education',
            'Eco-friendly alternatives promotion'
          ]
        },
        {
          title: 'Renewable Energy Awareness',
          description: 'Promoting solar energy adoption and energy conservation in rural communities.',
          impact: '100+ households impacted',
          duration: 'Ongoing',
          image: '☀️',
          details: [
            'Solar panel installation guidance',
            'Energy conservation workshops',
            'Renewable energy demonstrations',
            'Cost-benefit analysis sessions'
          ]
        }
      ]
    },
    technology: {
      title: 'Technology Transfer',
      icon: '💡',
      programs: [
        {
          title: 'Innovation Hub',
          description: 'Facilitating technology transfer from research labs to industry and society.',
          impact: '10+ technologies transferred',
          duration: 'Ongoing',
          image: '🔬',
          details: [
            'Industry-academia collaboration',
            'Prototype development support',
            'Patent filing assistance',
            'Commercialization guidance'
          ]
        },
        {
          title: 'Startup Incubation',
          description: 'Supporting student and alumni startups with mentorship and resources.',
          impact: '20+ startups incubated',
          duration: 'Ongoing',
          image: '🚀',
          details: [
            'Business plan development',
            'Funding assistance and connections',
            'Mentorship programs',
            'Market research support'
          ]
        },
        {
          title: 'Digital Infrastructure Support',
          description: 'Helping local organizations and governments with digital transformation.',
          impact: '5+ organizations assisted',
          duration: 'Project-based',
          image: '🌐',
          details: [
            'Website and application development',
            'Database management systems',
            'Digital governance solutions',
            'IT infrastructure planning'
          ]
        }
      ]
    }
  };

  const partnerships = [
    {
      name: 'Government of Goa',
      type: 'Government',
      description: 'Collaborative projects for digital governance and smart city initiatives',
      logo: '🏛️'
    },
    {
      name: 'Local NGOs',
      type: 'Non-Profit',
      description: 'Joint community service and social welfare programs',
      logo: '🤲'
    },
    {
      name: 'Industry Partners',
      type: 'Industry',
      description: 'Technology transfer and skill development initiatives',
      logo: '🏭'
    },
    {
      name: 'International Organizations',
      type: 'International',
      description: 'Global outreach and knowledge exchange programs',
      logo: '🌍'
    }
  ];

  const upcomingEvents = [
    {
      date: '2024-12-15',
      title: 'Digital Literacy Drive',
      location: 'Margao Community Center',
      type: 'Workshop'
    },
    {
      date: '2024-12-20',
      title: 'Beach Cleaning Campaign',
      location: 'Calangute Beach',
      type: 'Environmental'
    },
    {
      date: '2025-01-10',
      title: 'Health Awareness Camp',
      location: 'Ponda Village',
      type: 'Health'
    },
    {
      date: '2025-01-25',
      title: 'Technology Transfer Fair',
      location: 'NIT Goa Campus',
      type: 'Innovation'
    }
  ];

  return (
    <div className="outreach-page">
      <div className="outreach-container">
        <div className="outreach-header">
          <h1 className="outreach-title">Outreach Activities</h1>
          <p className="outreach-subtitle">
            Connecting with communities through education, technology, and social responsibility
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          {Object.keys(outreachPrograms).map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <span className="tab-icon">{outreachPrograms[tab].icon}</span>
              <span className="tab-text">{outreachPrograms[tab].title}</span>
            </button>
          ))}
        </div>

        {/* Programs Content */}
        <div className="programs-section">
          <h2 className="section-title">
            {outreachPrograms[activeTab].icon} {outreachPrograms[activeTab].title}
          </h2>
          <div className="programs-grid">
            {outreachPrograms[activeTab].programs.map((program, index) => (
              <div key={index} className="program-card">
                <div className="program-header">
                  <div className="program-image">{program.image}</div>
                  <div className="program-meta">
                    <h3 className="program-title">{program.title}</h3>
                    <div className="program-stats">
                      <span className="program-impact">{program.impact}</span>
                      <span className="program-duration">{program.duration}</span>
                    </div>
                  </div>
                </div>
                <p className="program-description">{program.description}</p>
                <div className="program-details">
                  <h4>Key Activities:</h4>
                  <ul>
                    {program.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout for Partnerships and Events */}
        <div className="bottom-section">
          {/* Partnerships */}
          <div className="partnerships-section">
            <h2 className="section-title">🤝 Our Partners</h2>
            <div className="partnerships-grid">
              {partnerships.map((partner, index) => (
                <div key={index} className="partner-card">
                  <div className="partner-logo">{partner.logo}</div>
                  <div className="partner-content">
                    <h3 className="partner-name">{partner.name}</h3>
                    <span className="partner-type">{partner.type}</span>
                    <p className="partner-description">{partner.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="events-section">
            <h2 className="section-title">📅 Upcoming Events</h2>
            <div className="events-list">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="event-card">
                  <div className="event-date">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-location">📍 {event.location}</p>
                    <span className="event-type">{event.type}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Get Involved Section */}
            <div className="get-involved">
              <h3 className="get-involved-title">Get Involved</h3>
              <p className="get-involved-description">
                Join our outreach initiatives and make a positive impact in the community
              </p>
              <div className="involvement-buttons">
                <button className="involve-btn volunteer-btn">
                  🙋‍♀️ Volunteer
                </button>
                <button className="involve-btn partner-btn">
                  🤝 Partner With Us
                </button>
                <button className="involve-btn contact-btn">
                  📧 Contact Outreach Office
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutreachActivities;
