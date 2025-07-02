import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './Views/Home-Section/HomePage';
import About from './Views/About/About';
import Departments from './Views/Academics-Section/Departments';
import Regulations from './Views/Academics-Section/Regulations';
import DissertationFormats from './Views/Academics-Section/DissertationFormats';
import Syllabus from './Views/Academics-Section/Syllabus';
import RTI from './Views/RTI/RTI';
import NIRF from './Views/NIRF-Section/NIRF';
import ContactUs from './Views/ContactUs/ContactUs';
import Tenders from './Views/Tenders/Tenders';
import AcademicCalendar from './Views/Academics-Section/AcademicCalendar';
import OutreachActivities from './Views/Outreach-Section/OutreachActivities';

// Administration Section imports
import BoardOfGovernors from './Views/Administration-Section/BoardOfGovernors';
import Director from './Views/Administration-Section/Director';
import Registrar from './Views/Administration-Section/Registrar';
import Senate from './Views/Administration-Section/Senate';
import Deans from './Views/Administration-Section/Deans';
import Committees from './Views/Administration-Section/Committees';
import FinanceCommittee from './Views/Administration-Section/FinanceCommittee';
import BuildingWorksCommittee from './Views/Administration-Section/BuildingWorksCommittee';
import HeadsOfDepartments from './Views/Administration-Section/HeadsOfDepartments';
import Reports from './Views/Administration-Section/Reports';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Navbar />
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics/departments" element={<Departments />} />
        <Route path="/academics/regulations" element={<Regulations />} />
        <Route path="/academics/dissertation-formats" element={<DissertationFormats />} />
        <Route path="/academics/syllabus" element={<Syllabus />} />
        <Route path="/academic-calendar" element={<AcademicCalendar />} />
        
        {/* Administration Section Routes */}
        <Route path="/administration/board-of-governors" element={<BoardOfGovernors />} />
        <Route path="/administration/director" element={<Director />} />
        <Route path="/administration/registrar" element={<Registrar />} />
        <Route path="/administration/senate" element={<Senate />} />
        <Route path="/administration/deans" element={<Deans />} />
        <Route path="/administration/committees" element={<Committees />} />
        <Route path="/administration/finance-committee" element={<FinanceCommittee />} />
        <Route path="/administration/building-works-committee" element={<BuildingWorksCommittee />} />
        <Route path="/heads-of-departments" element={<HeadsOfDepartments />} />
        <Route path="/reports" element={<Reports />} />
        
        <Route path="/rti" element={<RTI />} />
        <Route path="/nirf" element={<NIRF />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/tenders" element={<Tenders />} />
        <Route path="/outreach-activities" element={<OutreachActivities />} />
        {/* Additional routes can be added here */}
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </div>
    </ThemeProvider>
  );
}

export default App;