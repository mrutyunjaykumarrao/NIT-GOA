import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './Views/Home-Section/HomePage';
import About from './Views/About/About';
import Admissions from './Views/Admission-Section/Admissions';
import BTechJosaa from './Views/Admission-Section/BTech/BTechJosaa';
import BTechDasa from './Views/Admission-Section/BTech/BTechDasa';
import BTechFacilities from './Views/Admission-Section/BTech/BTechFacilities';
import BTechStrengths from './Views/Admission-Section/BTech/BTechStrengths';
import PhD from './Views/Admission-Section/PhD';
import Academics from './Views/Academics-Section/Academics';
import Departments from './Views/Academics-Section/Departments';
import Programs from './Views/Academics-Section/Programs';
import Regulations from './Views/Academics-Section/Regulations';
import Results from './Views/Reults/Results';
import Library from './Views/Academics-Section/Library';
import DissertationFormats from './Views/Academics-Section/DissertationFormats';
import Syllabus from './Views/Academics-Section/Syllabus';
import Research from './Views/Research-Section/Research';
import RDProjects from './Views/Research-Section/RDProjects';
import MoUDetails from './Views/Research-Section/MoUDetails';
import Campus from './Views/Hostels-Section/Campus';
import Placement from './Views/Training&Placement-Section/Placement';
import Faculty from './Views/People-Section/Faculty';
import RTI from './Views/RTI/RTI';
import NIRF from './Views/NIRF-Section/NIRF';
import ContactUs from './Views/ContactUs/ContactUs';
import Tenders from './Views/Tenders/Tenders';
import GIAN from './Views/About/GIAN/GIAN';
import Facilities from './Views/Hostels-Section/Facilities';
import AcademicCalendar from './Views/Academics-Section/AcademicCalendar';
import OutreachActivities from './Views/Outreach-Section/OutreachActivities';
import Hostel from './Views/Hostels-Section/Hostel';
import BTechHostel from './Views/Admission-Section/Hostels/BTechHostel';
import MTechHostel from './Views/Admission-Section/Hostels/MTechHostel';

// Administration Section imports
import BoardOfGovernors from './Views/Administration-Section/BoardOfGovernors';
import Director from './Views/Administration-Section/Director';
import Registrar from './Views/Administration-Section/Registrar';
import Senate from './Views/Administration-Section/Senate';
import Deans from './Views/Administration-Section/Deans';
import Committees from './Views/Administration-Section/Committees';
import FinanceCommittee from './Views/Administration-Section/FinanceCommittee';
import BuildingWorksCommittee from './Views/Administration-Section/BuildingWorksCommittee';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Navbar />
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/admissions/btech/josaa-csab" element={<BTechJosaa />} />
        <Route path="/admissions/btech/dasa" element={<BTechDasa />} />
        <Route path="/admissions/btech/facilities" element={<BTechFacilities />} />
        <Route path="/admissions/btech/strengths" element={<BTechStrengths />} />
        <Route path="/admissions/*" element={<Admissions />} />
        <Route path="/admissions/phd" element={<PhD />} />
        <Route path="/admissions/hostel" element={<Hostel />} />
        <Route path="/admissions/hostel/btech" element={<BTechHostel />} />
        <Route path="/admissions/hostel/mtech" element={<MTechHostel />} />
        <Route path="/admissions/hostel/*" element={<Hostel />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/academics/departments" element={<Departments />} />
        <Route path="/academics/programs" element={<Programs />} />
        <Route path="/academics/regulations" element={<Regulations />} />
        <Route path="/academics/results" element={<Results />} />
        <Route path="/academics/library" element={<Library />} />
        <Route path="/academics/dissertation-formats" element={<DissertationFormats />} />
        <Route path="/academics/syllabus" element={<Syllabus />} />
        
        {/* Administration Section Routes */}
        <Route path="/administration/board-of-governors" element={<BoardOfGovernors />} />
        <Route path="/administration/director" element={<Director />} />
        <Route path="/administration/registrar" element={<Registrar />} />
        <Route path="/administration/senate" element={<Senate />} />
        <Route path="/administration/deans" element={<Deans />} />
        <Route path="/administration/committees" element={<Committees />} />
        <Route path="/administration/finance-committee" element={<FinanceCommittee />} />
        <Route path="/administration/building-works-committee" element={<BuildingWorksCommittee />} />
        
        <Route path="/research" element={<Research />} />
        <Route path="/research/rd-projects" element={<RDProjects />} />
        <Route path="/research/mou-details" element={<MoUDetails />} />
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
        {/* Administration routes */}
        <Route path="/administration/board-of-governors" element={<BoardOfGovernors />} />
        <Route path="/administration/director" element={<Director />} />
        <Route path="/administration/registrar" element={<Registrar />} />
        <Route path="/administration/senate" element={<Senate />} />
        <Route path="/administration/deans" element={<Deans />} />
        <Route path="/administration/committees" element={<Committees />} />
        <Route path="/administration/finance-committee" element={<FinanceCommittee />} />
        <Route path="/administration/building-works-committee" element={<BuildingWorksCommittee />} />
        {/* Additional routes can be added here */}
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </div>
    </ThemeProvider>
  );
}

export default App;