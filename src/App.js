import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './Views/HomePage';
import About from './Views/About';
import Admissions from './Views/Admissions';
import Research from './Views/Research';
import Campus from './Views/Campus';
import Placement from './Views/Placement';
import Faculty from './Views/Faculty';
import RTI from './Views/RTI';
import NIRF from './Views/NIRF';
import ContactUs from './Views/ContactUs';
import Tenders from './Views/Tenders';
import GIAN from './Views/GIAN';
import Facilities from './Views/Facilities';
import AcademicCalendar from './Views/AcademicCalendar';
import OutreachActivities from './Views/OutreachActivities';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/research" element={<Research />} />
        <Route path="/campus" element={<Campus />} />
        <Route path="/placement" element={<Placement />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/rti" element={<RTI />} />
        <Route path="/nirf" element={<NIRF />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/tenders" element={<Tenders />} />
        <Route path="/gian" element={<GIAN />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/academic-calendar" element={<AcademicCalendar />} />
        <Route path="/outreach-activities" element={<OutreachActivities />} />
        {/* Additional routes can be added here */}
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;