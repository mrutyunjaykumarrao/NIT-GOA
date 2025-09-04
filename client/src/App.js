import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorProvider } from './contexts/ErrorContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Toast from './components/Toast/Toast';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import RoleBasedRoute from './components/ProtectedRoute/RoleBasedRoute';
import PublicRoute from './components/ProtectedRoute/PublicRoute';

// Error Pages
import { ErrorBoundary, ErrorPage404, ErrorPage403, ErrorPage500, NetworkError } from './components/ErrorPages';

// Auth components
import LoginWrapper from './Views/Auth/LoginWrapper';
import PasswordReset from './Views/Auth/PasswordReset';
import AdminDashboard from './Views/Admin/AdminDashboard';
import HomePage from './Views/Home-Section/HomePage';
import About from './Views/About/About';
import Departments from './Views/Academics-Section/Departments/Departments';
import Regulations from './Views/Academics-Section/Regulations';
import DissertationFormats from './Views/Academics-Section/DissertationFormats';
// import Syllabus from './Views/Academics-Section/Syllabus';
import RTI from './Views/RTI/RTI';
import NIRF from './Views/NIRF-Section/NIRF';
import ContactUs from './Views/ContactUs/ContactUs';
import Tenders from './Views/Tenders/Tenders';
import AcademicCalendar from './Views/Academics-Section/AcademicCalendar';
import OutreachActivities from './Views/Outreach-Section/OutreachActivities';

// Additional pages that exist but were missing from imports
import GIAN from './Views//GIAN/GIAN';
import BTechJosaa from './Views/Admission-Section/BTech/BTechJosaa';
import BTechDasa from './Views/Admission-Section/BTech/BTechDasa';

import BTechFacilities from './Views/Admission-Section/BTech/BTechFacilities';
import BTechStrengths from './Views/Admission-Section/BTech/BTechStrengths';
import MTech from './Views/Admission-Section/MTech';
import PhD from './Views/Admission-Section/PhD';
import Faculty from './Views/People-Section/Faculty/Faculty';
import FacultyDetails from './Views/People-Section/Faculty/FacultyDetails/FacultyDetails';
import FacultyEdit from './Views/People-Section/Faculty/FacultyEdit/FacultyEdit';
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

// Department Pages
import ComputerScience from './Views/Academics-Section/Departments/ComputerScience/ComputerScience';
import ElectronicsAndCommunication from './Views/Academics-Section/Departments/ElectronicsAndCommunication/ElectronicsAndCommunication';
import ElectricalAndElectronics from './Views/Academics-Section/Departments/ElectricalAndElectronics/ElectricalAndElectronics';
import MechanicalEngineering from './Views/Academics-Section/Departments/MechanicalEngineering/MechanicalEngineering';
import CivilEngineering from './Views/Academics-Section/Departments/CivilEngineering/CivilEngineering';
import AppliedSciences from './Views/Academics-Section/Departments/AppliedSciences/AppliedSciences';
import HumanitiesSocialSciences from './Views/Academics-Section/Departments/HumanitiesSocialSciences/HumanitiesSocialSciences';

// e-Downloads Page
import EDownloads from './Views/e-Downloads/EDownloads';

// Training & Placement Section
import FormsGuidelines from './Views/TnP-Section/FormsGuidelines';
import TrainingPlacement from './Views/TnP-Section/TrainingPlacement';

// Hostels Section
import Hostels from './Views/Hostels-Section/Hostels';

// Example component for testing permissions
import PermissionsExample from './Views/PermissionsExample/PermissionsExample';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ErrorProvider>
            <AppContent />
            <Toast />
          </ErrorProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const location = useLocation();

  // Log route changes
  useEffect(() => {
    console.log('🛣️ ROUTE CHANGE:', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      timestamp: new Date().toISOString()
    });
  }, [location]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Check if current route should hide navbar and footer
  const shouldHideNavAndFooter = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!shouldHideNavAndFooter && <Navbar />}
      {!shouldHideNavAndFooter && <LoginWrapper />}
      <Routes>
        {/* PUBLIC ROUTES - Accessible to everyone (authenticated or not) */}
        <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
        <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
        <Route path="/gian" element={<PublicRoute><GIAN /></PublicRoute>} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<div />} /> {/* Handled by LoginWrapper */}
        <Route path="/reset-password" element={<PasswordReset />} />
        
        {/* ADMIN-ONLY ROUTES */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* PUBLIC ACADEMIC ROUTES - Everyone can view these */}
        <Route path="/academics/departments" element={<PublicRoute><Departments /></PublicRoute>} />
        <Route path="/academics/computer-science" element={<PublicRoute><ComputerScience /></PublicRoute>} />
        <Route path="/academics/electronics-communication" element={<PublicRoute><ElectronicsAndCommunication /></PublicRoute>} />
        <Route path="/academics/electrical-electronics" element={<PublicRoute><ElectricalAndElectronics /></PublicRoute>} />
        <Route path="/academics/mechanical-engineering" element={<PublicRoute><MechanicalEngineering /></PublicRoute>} />
        <Route path="/academics/civil-engineering" element={<PublicRoute><CivilEngineering /></PublicRoute>} />
        <Route path="/academics/applied-sciences" element={<PublicRoute><AppliedSciences /></PublicRoute>} />
        <Route path="/academics/humanities-social-sciences" element={<PublicRoute><HumanitiesSocialSciences /></PublicRoute>} />
        <Route path="/academics/regulations" element={<PublicRoute><Regulations /></PublicRoute>} />
        <Route path="/academics/dissertation-formats" element={<PublicRoute><DissertationFormats /></PublicRoute>} />
        <Route path="/academic-calendar" element={<PublicRoute><AcademicCalendar /></PublicRoute>} />
        
        {/* PUBLIC DOWNLOADS */}
        <Route path="/e-downloads" element={<PublicRoute><EDownloads /></PublicRoute>} />
        
        {/* PUBLIC TRAINING & PLACEMENT */}
        <Route path="/forms-guidelines" element={<PublicRoute><FormsGuidelines /></PublicRoute>} />
        <Route path="/training-placement" element={<PublicRoute><TrainingPlacement /></PublicRoute>} />
        
        {/* PUBLIC HOSTEL INFO */}
        <Route path="/hostels" element={<PublicRoute><Hostels /></PublicRoute>} />
        
        {/* PUBLIC ADMISSIONS - Everyone can view these */}
        <Route path="/admissions/btech/josaa-csab" element={<PublicRoute><BTechJosaa /></PublicRoute>} />
        <Route path="/admissions/btech/dasa" element={<PublicRoute><BTechDasa /></PublicRoute>} />
        <Route path="/admissions/btech/facilities" element={<PublicRoute><BTechFacilities /></PublicRoute>} />
        <Route path="/admissions/btech/strengths" element={<PublicRoute><BTechStrengths /></PublicRoute>} />
        <Route path="/admissions/mtech" element={<PublicRoute><MTech /></PublicRoute>} />
        <Route path="/admissions/phd" element={<PublicRoute><PhD /></PublicRoute>} />
        
        {/* PUBLIC PEOPLE SECTION - Everyone can view faculty and staff */}
        <Route path="/faculty" element={<PublicRoute><Faculty /></PublicRoute>} />
        <Route path="/faculty/:id" element={<PublicRoute><FacultyDetails /></PublicRoute>} />
        <Route path="/people/faculty/:id" element={<PublicRoute><FacultyDetails /></PublicRoute>} />
        <Route path="/administrative-staff" element={<PublicRoute><AdministrativeStaff /></PublicRoute>} />
        <Route path="/technical-staff" element={<PublicRoute><TechnicalStaff /></PublicRoute>} />
        
        {/* ROLE-BASED FACULTY EDIT ROUTES */}
        <Route 
          path="/faculty/:id/edit" 
          element={
            <RoleBasedRoute 
              allowedRoles={['Admin', 'Faculty']}
              customAuthCheck={(user, location) => {
                const facultyId = location.pathname.split('/')[2];
                // Admin can edit any faculty
                if (user.role === 'Admin') return true;
                // Faculty can only edit their own profile
                if (user.role === 'Faculty') {
                  return facultyId === user.employee_code || 
                         facultyId === user.employee_id?.toString() ||
                         facultyId === user.id?.toString();
                }
                return false;
              }}
            >
              <FacultyEdit />
            </RoleBasedRoute>
          } 
        />
        
        {/* PUBLIC RESEARCH SECTION */}
        <Route path="/research/rd-projects" element={<PublicRoute><RDProjects /></PublicRoute>} />
        <Route path="/research/mou-details" element={<PublicRoute><MoUDetails /></PublicRoute>} />
        
        {/* PUBLIC ADMINISTRATION SECTION */}
        <Route path="/administration/board-of-governors" element={<PublicRoute><BoardOfGovernors /></PublicRoute>} />
        <Route path="/administration/director" element={<PublicRoute><Director /></PublicRoute>} />
        <Route path="/administration/registrar" element={<PublicRoute><Registrar /></PublicRoute>} />
        <Route path="/administration/senate" element={<PublicRoute><Senate /></PublicRoute>} />
        <Route path="/administration/deans" element={<PublicRoute><Deans /></PublicRoute>} />
        <Route path="/administration/committees" element={<PublicRoute><Committees /></PublicRoute>} />
        <Route path="/administration/finance-committee" element={<PublicRoute><FinanceCommittee /></PublicRoute>} />
        <Route path="/administration/building-works-committee" element={<PublicRoute><BuildingWorksCommittee /></PublicRoute>} />
        <Route path="/heads-of-departments" element={<PublicRoute><HeadsOfDepartments /></PublicRoute>} />
        <Route path="/reports" element={<PublicRoute><AnnualReports /></PublicRoute>} />
        
        {/* PUBLIC INFORMATION PAGES */}
        <Route path="/rti" element={<PublicRoute><RTI /></PublicRoute>} />
        <Route path="/sc-st-cell" element={<PublicRoute><SCSTCell /></PublicRoute>} />
        <Route path="/nirf" element={<PublicRoute><NIRF /></PublicRoute>} />
        <Route path="/contact-us" element={<PublicRoute><ContactUs /></PublicRoute>} />
        <Route path="/tenders" element={<PublicRoute><Tenders /></PublicRoute>} />
        <Route path="/outreach-activities" element={<PublicRoute><OutreachActivities /></PublicRoute>} />
        
        {/* ERROR PAGES */}
        <Route path="/error/404" element={<ErrorPage404 />} />
        <Route path="/error/403" element={<ErrorPage403 />} />
        <Route path="/error/500" element={<ErrorPage500 />} />
        <Route path="/error/network" element={<NetworkError />} />
        

        
        {/* 404 CATCH-ALL ROUTE - Must be last */}
        <Route path="*" element={<ErrorPage404 />} />
      </Routes>
      {!shouldHideNavAndFooter && <Footer />}
    </div>
  );
}

export default App;