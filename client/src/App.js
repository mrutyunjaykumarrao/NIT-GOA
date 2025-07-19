import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LoginModalProvider } from './contexts/LoginModalContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Auth components
import LoginWrapper from './Views/Auth/LoginWrapper';
import AdminDashboard from './Views/Admin/AdminDashboard';
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

// Additional pages that exist but were missing from imports
import GIAN from './Views/About/GIAN/GIAN';
import BTechJosaa from './Views/Admission-Section/BTech/BTechJosaa';
import BTechDasa from './Views/Admission-Section/BTech/BTechDasa';
import BTechFacilities from './Views/Admission-Section/BTech/BTechFacilities';
import BTechStrengths from './Views/Admission-Section/BTech/BTechStrengths';
import MTech from './Views/Admission-Section/MTech';
import PhD from './Views/Admission-Section/PhD';
import Faculty from './Views/People-Section/Faculty/Faculty';
import AdministrativeStaff from './Views/People-Section/AdministrativeStaff/AdministrativeStaff';
import TechnicalStaff from './Views/People-Section/TechnicalStaff/TechnicalStaff';
import RDProjects from './Views/Research-Section/RDProjects';
import MoUDetails from './Views/Research-Section/MoUDetails';

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
import AnnualReports from './Views/Administration-Section/AnnualReports';
import SCSTCell from './Views/SC-ST-Cell/SCSTCell';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LoginModalProvider>
          <AppContent />
        </LoginModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  return (
    <div className="App">
      <Navbar />
      <LoginWrapper />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/gian" element={<GIAN />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<div />} /> {/* Handled by LoginWrapper */}
        
        {/* Protected Admin Route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Academics Section Routes */}
        <Route path="/academics/departments" element={<Departments />} />
        <Route path="/academics/regulations" element={<Regulations />} />
        <Route path="/academics/dissertation-formats" element={<DissertationFormats />} />
        <Route path="/academics/syllabus" element={<Syllabus />} />
        <Route path="/academic-calendar" element={<AcademicCalendar />} />
        
        {/* Admissions Section Routes */}
        <Route path="/admissions/btech/josaa-csab" element={<BTechJosaa />} />
        <Route path="/admissions/btech/dasa" element={<BTechDasa />} />
        <Route path="/admissions/btech/facilities" element={<BTechFacilities />} />
        <Route path="/admissions/btech/strengths" element={<BTechStrengths />} />
        <Route path="/admissions/mtech" element={<MTech />} />
        <Route path="/admissions/phd" element={<PhD />} />
        
        {/* People Section Routes */}
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/administrative-staff" element={<AdministrativeStaff />} />
        <Route path="/technical-staff" element={<TechnicalStaff />} />
        
        {/* Research Section Routes */}
        <Route path="/research/rd-projects" element={<RDProjects />} />
        <Route path="/research/mou-details" element={<MoUDetails />} />
        
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
        <Route path="/reports" element={<AnnualReports />} />
        
        <Route path="/rti" element={<RTI />} />
        <Route path="/sc-st-cell" element={<SCSTCell />} />
        <Route path="/nirf" element={<NIRF />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/tenders" element={<Tenders />} />
        <Route path="/outreach-activities" element={<OutreachActivities />} />
        {/* Additional routes can be added here */}
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;