import React, { useState } from 'react';
import './OutreachActivities.css';

const OutreachActivities = () => {
  // State for the first card image swapping
  const [card1MainImage, setCard1MainImage] = useState("https://www.nitgoa.ac.in/static/SPIEdamodarschool.jpg");
  const [card1Gallery, setCard1Gallery] = useState([
    "https://www.nitgoa.ac.in/static/SPIEmushtfund.jpg",
    "https://www.nitgoa.ac.in/static/stem3.jpg"
  ]);

  // State for the second card image swapping
  const [card2MainImage, setCard2MainImage] = useState("https://www.nitgoa.ac.in/static/SCIENCE FAIR.jpg");
  const [card2Gallery, setCard2Gallery] = useState([
    "https://www.nitgoa.ac.in/static/RAA.jpg",
    "https://www.nitgoa.ac.in/static/stem4.jpg"
  ]);

  // State for remaining cards
  const [card3MainImage, setCard3MainImage] = useState("https://www.nitgoa.ac.in/static/swachhata 21march2024.jpg");
  const [card3Gallery, setCard3Gallery] = useState([
    "https://www.nitgoa.ac.in/static/swachhata.jpg",
    "https://www.nitgoa.ac.in/static/SHRAMDHAAN1.jpg"
  ]);

  const [card4MainImage, setCard4MainImage] = useState("https://www.nitgoa.ac.in/static/arduino(1).jpg");
  const [card4Gallery, setCard4Gallery] = useState([
    "https://www.nitgoa.ac.in/static/arduino(2).jpg",
    "https://www.nitgoa.ac.in/static/stem5.jpg"
  ]);

  const [card5MainImage, setCard5MainImage] = useState("https://www.nitgoa.ac.in/static/UBA1.png");
  const [card5Gallery, setCard5Gallery] = useState([
    "https://www.nitgoa.ac.in/static/SURVEY IN KALAY1.jpg",
    "https://www.nitgoa.ac.in/static/KALAY_GRAMSABHA.jpg"
  ]);

  const [card6MainImage, setCard6MainImage] = useState("https://www.nitgoa.ac.in/static/School Visit.jpg");
  const [card6Gallery, setCard6Gallery] = useState([
    "https://www.nitgoa.ac.in/static/Permanent_Campus.jpeg",
    "https://www.nitgoa.ac.in/static/Industrial visit(1).jpg"
  ]);

  const [card7MainImage, setCard7MainImage] = useState("https://www.nitgoa.ac.in/static/img 16march2024.jpeg");
  const [card7Gallery, setCard7Gallery] = useState([
    "https://www.nitgoa.ac.in/static/SHRAMDHAAN2.jpg",
    "https://www.nitgoa.ac.in/static/img12march2024.jpg"
  ]);

  const [card8MainImage, setCard8MainImage] = useState("https://www.nitgoa.ac.in/static/enggday1.jpg");
  const [card8Gallery, setCard8Gallery] = useState([
    "https://www.nitgoa.ac.in/static/enggday2.jpg",
    "https://www.nitgoa.ac.in/static/enggday3.jpg"
  ]);

  const [card9MainImage, setCard9MainImage] = useState("https://www.nitgoa.ac.in/static/stem1.jpg");
  const [card9Gallery, setCard9Gallery] = useState([
    "https://www.nitgoa.ac.in/static/stem2.jpg",
    "https://www.nitgoa.ac.in/static/stem3.jpg"
  ]);

  // Function to handle image swap for card 1
  const handleCard1ImageSwap = (clickedImage) => {
    const currentMain = card1MainImage;
    setCard1MainImage(clickedImage);
    setCard1Gallery(card1Gallery.map(img => 
      img === clickedImage ? currentMain : img
    ));
  };

  // Function to handle image swap for card 2
  const handleCard2ImageSwap = (clickedImage) => {
    const currentMain = card2MainImage;
    setCard2MainImage(clickedImage);
    setCard2Gallery(card2Gallery.map(img => 
      img === clickedImage ? currentMain : img
    ));
  };

  // Handler functions for all remaining cards
  const handleCard3ImageSwap = (clickedImage) => {
    const currentMain = card3MainImage;
    setCard3MainImage(clickedImage);
    setCard3Gallery(card3Gallery.map(img => img === clickedImage ? currentMain : img));
  };

  const handleCard4ImageSwap = (clickedImage) => {
    const currentMain = card4MainImage;
    setCard4MainImage(clickedImage);
    setCard4Gallery(card4Gallery.map(img => img === clickedImage ? currentMain : img));
  };

  const handleCard5ImageSwap = (clickedImage) => {
    const currentMain = card5MainImage;
    setCard5MainImage(clickedImage);
    setCard5Gallery(card5Gallery.map(img => img === clickedImage ? currentMain : img));
  };

  const handleCard6ImageSwap = (clickedImage) => {
    const currentMain = card6MainImage;
    setCard6MainImage(clickedImage);
    setCard6Gallery(card6Gallery.map(img => img === clickedImage ? currentMain : img));
  };

  const handleCard7ImageSwap = (clickedImage) => {
    const currentMain = card7MainImage;
    setCard7MainImage(clickedImage);
    setCard7Gallery(card7Gallery.map(img => img === clickedImage ? currentMain : img));
  };

  const handleCard8ImageSwap = (clickedImage) => {
    const currentMain = card8MainImage;
    setCard8MainImage(clickedImage);
    setCard8Gallery(card8Gallery.map(img => img === clickedImage ? currentMain : img));
  };

  const handleCard9ImageSwap = (clickedImage) => {
    const currentMain = card9MainImage;
    setCard9MainImage(clickedImage);
    setCard9Gallery(card9Gallery.map(img => img === clickedImage ? currentMain : img));
  };

  return (
    <div className="outreach-container">
      <div className="outreach-hero">
        <h1>Outreach Activities</h1>
        <p>Connecting with communities through education, innovation, and social responsibility</p>
      </div>

      <div className="outreach-content">
        
        {/* Main Story */}
        <section className="featured-story">
          <div className="featured-story-content">
            <div className="featured-story-text">
              <div className="story-category">Featured Initiative</div>
              <h2>Women in STEM Workshop</h2>
              <p>The SPIE Student Chapter NIT Goa conducted an inspiring workshop at Sharada Mandir School, Panjim, focusing on sparking interest in STEM fields among middle school girls through hands-on experiments in physics, optics, and robotics.</p>
              <div className="story-date">March 2024</div>
            </div>
            <div className="featured-story-image">
              <img 
                src="https://www.nitgoa.ac.in/static/img6march2024.jpg" 
                alt="Women in STEM Initiative by SPIE Student Chapter" 
                onError={(e) => {e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}}
              />
            </div>
          </div>
        </section>

        {/* Recent Activities Grid */}
        <section className="activities-section">
          <h2 className="section-title">Recent Activities</h2>
          
          <div className="activities-grid">
            <div className="activity-card">
              <img 
                src={card1MainImage}
                alt="Light & Optics Workshop" 
                className="activity-image"
                onError={(e) => {e.target.src = "https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}}
              />
              <div className="activity-content">
                <h3>Light & Optics Workshops</h3>
                <p>SPIE student chapter organized workshops at Mustifund High School and Damodar Higher Secondary School, introducing students to the fascinating world of light and optics through interactive demonstrations.</p>
                <div className="activity-gallery">
                  {card1Gallery.map((imgSrc, index) => (
                    <img 
                      key={index}
                      src={imgSrc} 
                      alt={index === 0 ? "Mustifund workshop" : "Interactive sessions"} 
                      className="gallery-img"
                      onClick={() => handleCard1ImageSwap(imgSrc)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="activity-card">
              <img 
                src={card2MainImage}
                alt="All Goa Science Fair" 
                className="activity-image"
                onError={(e) => {e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}}
              />
              <div className="activity-content">
                <h3>All Goa Science Fair</h3>
                <p>The inaugural All Goa Science Fair brought together 42 teams of grades 8-10 students to showcase innovative projects on "Science and technology for a clean and green tomorrow".</p>
                <div className="activity-gallery">
                  {card2Gallery.map((imgSrc, index) => (
                    <img 
                      key={index}
                      src={imgSrc} 
                      alt={index === 0 ? "RAA programs" : "Student projects"} 
                      className="gallery-img"
                      onClick={() => handleCard2ImageSwap(imgSrc)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="activity-card">
              <img 
                src={card3MainImage}
                alt="Swachh Bharat Initiative" 
                className="activity-image"
                onError={(e) => {e.target.src = "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}}
              />
              <div className="activity-content">
                <h3>Swachhata Hi Seva Campaign</h3>
                <p>NIT Goa conducted comprehensive cleanliness drives in collaboration with Cuncolim Municipality Corporation, cleaning Demani Village adjacent to our campus and promoting environmental awareness.</p>
                <div className="activity-gallery">
                  {card3Gallery.map((img, index) => (
                    <img 
                      key={index}
                      src={img} 
                      alt={`Swachhata activity ${index + 1}`} 
                      className="gallery-img" 
                      onClick={() => handleCard3ImageSwap(img)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="activity-card">
              <img 
                src={card4MainImage}
                alt="Arduino Workshop" 
                className="activity-image"
                onError={(e) => {e.target.src = "https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}}
              />
              <div className="activity-content">
                <h3>Arduino & Electronics Workshops</h3>
                <p>Hands-on Arduino workshops introduce school students to basic electronics and programming concepts, fostering understanding of microcontroller applications in modern technology.</p>
                <div className="activity-gallery">
                  {card4Gallery.map((img, index) => (
                    <img 
                      key={index}
                      src={img} 
                      alt={`Arduino workshop ${index + 1}`} 
                      className="gallery-img" 
                      onClick={() => handleCard4ImageSwap(img)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="activity-card">
              <img 
                src={card5MainImage}
                alt="Village Development Programs" 
                className="activity-image"
                onError={(e) => {e.target.src = "https://images.unsplash.com/photo-1594736797933-d0401ba871ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}}
              />
              <div className="activity-content">
                <h3>Village Development Program</h3>
                <p>Through Unnat Bharat Abhiyan, NIT Goa actively engages with adopted villages Kalay and Guirdolim, conducting surveys, participating in Gramsabha meetings, and implementing development initiatives.</p>
                <div className="activity-gallery">
                  {card5Gallery.map((img, index) => (
                    <img 
                      key={index}
                      src={img} 
                      alt={`Village development ${index + 1}`} 
                      className="gallery-img" 
                      onClick={() => handleCard5ImageSwap(img)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="activity-card">
              <img 
                src={card6MainImage}
                alt="Campus Visit Program" 
                className="activity-image"
                onError={(e) => {e.target.src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}}
              />
              <div className="activity-content">
                <h3>School Campus Visit Program</h3>
                <p>Government High School students from Vidhyanagar, Aquem, Margao visited NIT Goa campus as part of the new Education Policy, attending lectures on Experimental Physics, Chemistry, and Mathematics.</p>
                <div className="activity-gallery">
                  {card6Gallery.map((img, index) => (
                    <img 
                      key={index}
                      src={img} 
                      alt={`Campus visit ${index + 1}`} 
                      className="gallery-img" 
                      onClick={() => handleCard6ImageSwap(img)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="activity-card">
              <img 
                src={card7MainImage}
                alt="Health Awareness Programs" 
                className="activity-image"
                onError={(e) => {e.target.src = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}}
              />
              <div className="activity-content">
                <h3>Health & Safety Initiatives</h3>
                <p>NIT Goa organizes blood donation camps, health awareness programs, and Safai Mitra Suraksha Shivirs focusing on worker safety, hygiene, and overall community well-being.</p>
                <div className="activity-gallery">
                  {card7Gallery.map((img, index) => (
                    <img 
                      key={index}
                      src={img} 
                      alt={`Health initiative ${index + 1}`} 
                      className="gallery-img" 
                      onClick={() => handleCard7ImageSwap(img)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="activity-card">
              <img 
                src={card8MainImage}
                alt="Engineering Day Celebrations" 
                className="activity-image"
                onError={(e) => {e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}}
              />
              <div className="activity-content">
                <h3>Engineering Day & Innovation Showcase</h3>
                <p>Annual Engineering Day celebrations feature technical exhibitions, project demonstrations, and interactive sessions with school students, showcasing the latest research and innovations from all departments.</p>
                <div className="activity-gallery">
                  {card8Gallery.map((img, index) => (
                    <img 
                      key={index}
                      src={img} 
                      alt={`Engineering day ${index + 1}`} 
                      className="gallery-img" 
                      onClick={() => handleCard8ImageSwap(img)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="activity-card">
              <img 
                src={card9MainImage}
                alt="STEM Activities" 
                className="activity-image"
                onError={(e) => {e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}}
              />
              <div className="activity-content">
                <h3>STEM Educational Programs</h3>
                <p>Comprehensive STEM programs introducing students to hands-on learning experiences in science, technology, engineering, and mathematics through interactive workshops and demonstrations.</p>
                <div className="activity-gallery">
                  {card9Gallery.map((img, index) => (
                    <img 
                      key={index}
                      src={img} 
                      alt={`STEM activity ${index + 1}`} 
                      className="gallery-img" 
                      onClick={() => handleCard9ImageSwap(img)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="activity-card text-only-card">
              <div className="activity-content">
                <h3>Rural Outreach Programs</h3>
                <p>Rural outreach initiatives focusing on technology transfer, skill development, and infrastructure improvement to enhance quality of life in local villages through sustained community engagement. These programs include community surveys, skill development workshops, digital literacy training, and sustainable development projects that directly benefit rural communities around NIT Goa.</p>
              </div>
            </div>

            <div className="activity-card text-only-card">
              <div className="activity-content">
                <h3>Student Excellence & Recognition</h3>
                <p>NIT Goa students consistently excel in national and international competitions, research projects, and innovation challenges, bringing recognition to the institute through their outstanding achievements. Students have won prestigious awards in robotics competitions, hackathons, research symposiums, and technical festivals across the country, showcasing the quality of education and innovation culture at NIT Goa.</p>
              </div>
            </div>

            <div className="activity-card text-only-card">
              <div className="activity-content">
                <h3>Special Events & Celebrations</h3>
                <p>Cultural festivals, awareness campaigns, and special events that bring together the academic community and local residents in celebration of shared values and community spirit. These events include Independence Day celebrations, Republic Day ceremonies, cultural festivals, environmental awareness campaigns, and community gatherings that strengthen the bond between NIT Goa and the local community.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="impact-section">
          <div className="impact-content">
            <h2>Our Impact</h2>
            <div className="impact-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Students Reached</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">15+</div>
                <div className="stat-label">Schools Visited</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10+</div>
                <div className="stat-label">Communities Served</div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default OutreachActivities;