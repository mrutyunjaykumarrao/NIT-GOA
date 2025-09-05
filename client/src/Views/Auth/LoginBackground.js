import React from 'react';
import { useLocation } from 'react-router-dom';
import PublicRoute from '../../components/ProtectedRoute/PublicRoute';

// Import all the page components that could be backgrounds
import HomePage from '../Home-Section/HomePage';
import About from '../About/About';
import GIAN from '../GIAN/GIAN';
import Departments from '../Academics-Section/Departments/Departments';
import ComputerScience from '../Academics-Section/Departments/ComputerScience/ComputerScience';
import ElectronicsAndCommunication from '../Academics-Section/Departments/ElectronicsAndCommunication/ElectronicsAndCommunication';
import ElectricalAndElectronics from '../Academics-Section/Departments/ElectricalAndElectronics/ElectricalAndElectronics';
import MechanicalEngineering from '../Academics-Section/Departments/MechanicalEngineering/MechanicalEngineering';
import CivilEngineering from '../Academics-Section/Departments/CivilEngineering/CivilEngineering';
import AppliedSciences from '../Academics-Section/Departments/AppliedSciences/AppliedSciences';
import HumanitiesSocialSciences from '../Academics-Section/Departments/HumanitiesSocialSciences/HumanitiesSocialSciences';
import Regulations from '../Academics-Section/Regulations';
import DissertationFormats from '../Academics-Section/DissertationFormats';
import AcademicCalendar from '../Academics-Section/AcademicCalendar';
import EDownloads from '../e-Downloads/EDownloads';
import FormsGuidelines from '../TnP-Section/FormsGuidelines';
import TrainingPlacement from '../TnP-Section/TrainingPlacement';
import Hostels from '../Hostels-Section/Hostels';
import BTechJosaa from '../Admission-Section/BTech/BTechJosaa';
import BTechDasa from '../Admission-Section/BTech/BTechDasa';
import BTechFacilities from '../Admission-Section/BTech/BTechFacilities';
import BTechStrengths from '../Admission-Section/BTech/BTechStrengths';
import MTech from '../Admission-Section/MTech';
import PhD from '../Admission-Section/PhD';
import Faculty from '../People-Section/Faculty/Faculty';
import FacultyDetails from '../People-Section/Faculty/FacultyDetails/FacultyDetails';
import AdministrativeStaff from '../People-Section/AdministrativeStaff/AdministrativeStaff';
import TechnicalStaff from '../People-Section/TechnicalStaff/TechnicalStaff';
import RDProjects from '../Research-Section/RDProjects';
import MoUDetails from '../Research-Section/MoUDetails';
import BoardOfGovernors from '../Administration-Section/BoardOfGovernors';
import Director from '../Administration-Section/Director';
import Registrar from '../Administration-Section/Registrar';
import Senate from '../Administration-Section/Senate';
import Deans from '../Administration-Section/Deans';
import Committees from '../Administration-Section/Committees';
import FinanceCommittee from '../Administration-Section/FinanceCommittee';
import BuildingWorksCommittee from '../Administration-Section/BuildingWorksCommittee';
import HeadsOfDepartments from '../Administration-Section/HeadsOfDepartments';
import AnnualReports from '../Administration-Section/AnnualReports';
import RTI from '../RTI/RTI';
import SCSTCell from '../SC-ST-Cell/SCSTCell';
import NIRF from '../NIRF-Section/NIRF';
import ContactUs from '../ContactUs/ContactUs';
import Tenders from '../Tenders/Tenders';
import OutreachActivities from '../Outreach-Section/OutreachActivities';

const LoginBackground = () => {
  const location = useLocation();
  
  // Get the previous page from location state, default to homepage
  const previousPath = location.state?.from?.pathname || '/';
  
  // Helper function to get the appropriate component based on path
  const getBackgroundComponent = (path) => {
    const basePath = path.split('?')[0]; // Remove query parameters
    
    switch (basePath) {
      case '/about':
        return <PublicRoute><About /></PublicRoute>;
      case '/gian':
        return <PublicRoute><GIAN /></PublicRoute>;
      case '/academics/departments':
        return <PublicRoute><Departments /></PublicRoute>;
      case '/academics/computer-science':
        return <PublicRoute><ComputerScience /></PublicRoute>;
      case '/academics/electronics-communication':
        return <PublicRoute><ElectronicsAndCommunication /></PublicRoute>;
      case '/academics/electrical-electronics':
        return <PublicRoute><ElectricalAndElectronics /></PublicRoute>;
      case '/academics/mechanical-engineering':
        return <PublicRoute><MechanicalEngineering /></PublicRoute>;
      case '/academics/civil-engineering':
        return <PublicRoute><CivilEngineering /></PublicRoute>;
      case '/academics/applied-sciences':
        return <PublicRoute><AppliedSciences /></PublicRoute>;
      case '/academics/humanities-social-sciences':
        return <PublicRoute><HumanitiesSocialSciences /></PublicRoute>;
      case '/academics/regulations':
        return <PublicRoute><Regulations /></PublicRoute>;
      case '/academics/dissertation-formats':
        return <PublicRoute><DissertationFormats /></PublicRoute>;
      case '/academic-calendar':
        return <PublicRoute><AcademicCalendar /></PublicRoute>;
      case '/e-downloads':
        return <PublicRoute><EDownloads /></PublicRoute>;
      case '/forms-guidelines':
        return <PublicRoute><FormsGuidelines /></PublicRoute>;
      case '/training-placement':
        return <PublicRoute><TrainingPlacement /></PublicRoute>;
      case '/hostels':
        return <PublicRoute><Hostels /></PublicRoute>;
      case '/admissions/btech/josaa-csab':
        return <PublicRoute><BTechJosaa /></PublicRoute>;
      case '/admissions/btech/dasa':
        return <PublicRoute><BTechDasa /></PublicRoute>;
      case '/admissions/btech/facilities':
        return <PublicRoute><BTechFacilities /></PublicRoute>;
      case '/admissions/btech/strengths':
        return <PublicRoute><BTechStrengths /></PublicRoute>;
      case '/admissions/mtech':
        return <PublicRoute><MTech /></PublicRoute>;
      case '/admissions/phd':
        return <PublicRoute><PhD /></PublicRoute>;
      case '/faculty':
        return <PublicRoute><Faculty /></PublicRoute>;
      case '/administrative-staff':
        return <PublicRoute><AdministrativeStaff /></PublicRoute>;
      case '/technical-staff':
        return <PublicRoute><TechnicalStaff /></PublicRoute>;
      case '/research/rd-projects':
        return <PublicRoute><RDProjects /></PublicRoute>;
      case '/research/mou-details':
        return <PublicRoute><MoUDetails /></PublicRoute>;
      case '/administration/board-of-governors':
        return <PublicRoute><BoardOfGovernors /></PublicRoute>;
      case '/administration/director':
        return <PublicRoute><Director /></PublicRoute>;
      case '/administration/registrar':
        return <PublicRoute><Registrar /></PublicRoute>;
      case '/administration/senate':
        return <PublicRoute><Senate /></PublicRoute>;
      case '/administration/deans':
        return <PublicRoute><Deans /></PublicRoute>;
      case '/administration/committees':
        return <PublicRoute><Committees /></PublicRoute>;
      case '/administration/finance-committee':
        return <PublicRoute><FinanceCommittee /></PublicRoute>;
      case '/administration/building-works-committee':
        return <PublicRoute><BuildingWorksCommittee /></PublicRoute>;
      case '/heads-of-departments':
        return <PublicRoute><HeadsOfDepartments /></PublicRoute>;
      case '/reports':
        return <PublicRoute><AnnualReports /></PublicRoute>;
      case '/rti':
        return <PublicRoute><RTI /></PublicRoute>;
      case '/sc-st-cell':
        return <PublicRoute><SCSTCell /></PublicRoute>;
      case '/nirf':
        return <PublicRoute><NIRF /></PublicRoute>;
      case '/contact-us':
        return <PublicRoute><ContactUs /></PublicRoute>;
      case '/tenders':
        return <PublicRoute><Tenders /></PublicRoute>;
      case '/outreach-activities':
        return <PublicRoute><OutreachActivities /></PublicRoute>;
      default:
        // Handle dynamic routes
        if (basePath.startsWith('/faculty/') && basePath !== '/faculty') {
          return <PublicRoute><FacultyDetails /></PublicRoute>;
        }
        if (basePath.startsWith('/people/faculty/')) {
          return <PublicRoute><FacultyDetails /></PublicRoute>;
        }
        
        // Default to homepage for unknown routes or '/'
        return <PublicRoute><HomePage /></PublicRoute>;
    }
  };

  return getBackgroundComponent(previousPath);
};

export default LoginBackground;
