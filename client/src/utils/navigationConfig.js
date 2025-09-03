// Navigation configuration for NIT Goa website
// This file defines all navigation routes and external links

export const navigationConfig = {
  // Internal routes (will use React Router)
  internal: {
    home: '/',
    about: '/about',
    admissions: '/admissions',
    academics: '/academics',
    research: '/research',
    placement: '/placement',
    campus: '/campus',
    faculty: '/faculty',
    hostel: '/hostel',
    nirf: '/nirf',
    outreach: '/outreach',
    rti: '/rti',
    scstCell: '/sc-st-cell',
    contactUs: '/contact-us',
    tenders: '/tenders',
    gian: '/gian',
    facilities: '/facilities',
    academicCalendar: '/academic-calendar',
    outreachActivities: '/outreach-activities'
  },
  
  // External links
  external: {
    facultyStaff: 'https://www.nitgoa.ac.in/faculty-staff',
    alumni: 'https://www.nitgoa.ac.in/alumni',
    feePayment: 'https://mis.nitgoa.ac.in/misnitgoa/academic/ONLINEFEESCOLLECTION/Payment.aspx',
    gian: 'https://www.gian.iitkgp.ac.in/',
    rajbhasha: 'https://www.nitgoa.ac.in/rajbhasha',
    privacyPolicy: 'https://www.nitgoa.ac.in/privacy-policy',
    termsOfUse: 'https://www.nitgoa.ac.in/terms-of-use',
    sitemap: 'https://www.nitgoa.ac.in/sitemap'
  },
  
  // Dropdown menu configurations
  dropdowns: {
    administration: {
      director: '/administration/director',
      registrar: '/administration/registrar',
      deans: '/administration/deans',
      hods: '/administration/heads-of-departments',
      adminStaff: '/administration/administrative-staff'
    },
    academics: {
      departments: '/academics/departments',
      programs: '/academics/programs',
      calendar: '/academic-calendar',
      syllabus: '/academics/syllabus',
      regulations: '/academics/regulations'
    },
    admission: {
      btechJosaa: '/admissions/btech/josaa-csab',
      btechDasa: '/admissions/btech/dasa',
      btechFacilities: '/admissions/btech/facilities',
      btechStrengths: '/admissions/btech/strengths',
      mtech: '/admissions/mtech',
      phd: '/admissions/phd',
      hostel: '/admissions/hostel',
      btechHostel: '/pdf/admission/hostels/Btech-Hostel/Hostel_Rules__Regulations_23march2016.pdf',
      mtechHostel: 'https://www.nitgoa.ac.in/static/Rules_mtech_hostel_20june16.pdf',
      brochure: '/pdf/admission/admission-brochure/AdmissionBrochure2024.pdf',
      fees: '/pdf/admission/fee-structure/fee_structure_23-24_25july2023.pdf'
    },
    training: {
      statistics: '/placement/statistics',
      programs: '/placement/training-programs',
      industry: '/placement/industry-relations',
      career: '/placement/career-services'
    },
    research: {
      rdProjects: '/research/rd-projects',
      researchConsultancy: 'https://www.nitgoa.ac.in/research/Research_Consultancy/research_consultancy.html',
      mouDetails: '/research/mou-details',
      iprPolicy: '/pdf/research/IPR-policy/NIT_Goa_IPR_10Nov2015.pdf'
    },
    resources: {
      facilities: '/facilities',
      tenders: '/tenders',
      rti: '/rti',
      feePayment: 'https://mis.nitgoa.ac.in/misnitgoa/academic/ONLINEFEESCOLLECTION/Payment.aspx',
      contactUs: '/contact-us',
      academicCalendar: '/academic-calendar'
    },
    quickLinks: {
      about: '/about',
      admissions: '/admissions',
      academicPrograms: '/academics/programs',
      research: '/research',
      campusLife: '/campus',
      careerServices: '/placement/career-services'
    },
    people: {
      telephoneDirectory: '/pdf/People/Telephone-Directory/TelephoneDirectory.pdf'
    },
    departments: {
      cse: '/academics/departments/computer-science',
      ece: '/academics/departments/electronics-communication',
      me: '/academics/departments/mechanical',
      ce: '/academics/departments/civil',
      ee: '/academics/departments/electrical',
      mac: '/academics/departments/mathematics-computing'
    }
  }
};

// Helper functions for navigation
export const isExternalLink = (url) => {
  return url.startsWith('http://') || url.startsWith('https://');
};

export const handleNavigation = (url, navigate = null) => {
  if (isExternalLink(url)) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else if (navigate) {
    navigate(url);
  } else {
    // Fallback for components not using useNavigate
    window.location.href = url;
  }
};

export const getNavigationUrl = (section, item = null) => {
  if (item && navigationConfig.dropdowns[section]) {
    return navigationConfig.dropdowns[section][item];
  }
  return navigationConfig.internal[section] || navigationConfig.external[section] || '#';
};
