import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './Views/HomePage';
import About from './Views/About';
import Admissions from './Views/Admissions';
import BTechJosaa from './Views/BTechJosaa';
import BTechDasa from './Views/BTechDasa';
import BTechFacilities from './Views/BTechFacilities';
import BTechStrengths from './Views/BTechStrengths';
import PhD from './Views/PhD';
import Academics from './Views/Academics';
import Departments from './Views/Departments';
import Programs from './Views/Programs';
import Regulations from './Views/Regulations';
import Results from './Views/Results';
import Library from './Views/Library';
import DissertationFormats from './Views/DissertationFormats';
import Research from './Views/Research';
import RDProjects from './Views/RDProjects';
import MoUDetails from './Views/MoUDetails';
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
import Hostel from './Views/Hostel';
import BTechHostel from './Views/BTechHostel';
import MTechHostel from './Views/MTechHostel';
import Director from './Views/Director';
import Registrar from './Views/Registrar';
import Deans from './Views/Deans';
import Senate from './Views/Senate';
import BoardOfGovernors from './Views/BoardOfGovernors';
import Committees from './Views/Committees';
import FinanceCommittee from './Views/FinanceCommittee';
import BuildingWorksCommittee from './Views/BuildingWorksCommittee';
import HeadsOfDepartments from './Views/HeadsOfDepartments';
import AnnualReports from './Views/AnnualReports';

function App() {
  return (
    <div className="App">
      <Navbar />      <Routes>
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
        <Route path="/administration/director" element={<Director />} />
        <Route path="/administration/registrar" element={<Registrar />} />
        <Route path="/administration/deans" element={<Deans />} />
        <Route path="/administration/senate" element={<Senate />} />
        <Route path="/administration/board-of-governors" element={<BoardOfGovernors />} />
        <Route path="/administration/committees" element={<Committees />} />
        <Route path="/administration/finance-committee" element={<FinanceCommittee />} />
        <Route path="/administration/building-works-committee" element={<BuildingWorksCommittee />} />
        <Route path="/administration/heads-of-departments" element={<HeadsOfDepartments />} />
        <Route path="/administration/annual-reports" element={<AnnualReports />} />
        {/* Additional routes can be added here */}
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;