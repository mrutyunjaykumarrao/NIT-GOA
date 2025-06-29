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
    feePayment: '/fee-payment',
    rti: '/rti',
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
      btech: '/admissions/btech',
      btechJosaa: '/admissions/btech/josaa-csab',
      btechDasa: '/admissions/btech/dasa',
      btechFacilities: '/admissions/btech/facilities',
      btechStrengths: '/admissions/btech/strengths',
      mtech: '/admissions/mtech',
      phd: '/admissions/phd',
      hostel: '/admissions/hostel',
      btechHostel: 'https://www.nitgoa.ac.in/static/Rules_of_NIT_Goa_Hostel_18July2022.pdf',
      mtechHostel: 'https://www.nitgoa.ac.in/static/Rules_mtech_hostel_20june16.pdf',
      process: '/admissions/process',
      fees: 'https://www.nitgoa.ac.in/static/fee_structure_23-24_25july2023.pdf'
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
      iprPolicy: 'https://www.nitgoa.ac.in/static/NIT_Goa_IPR_10Nov2015.pdf'
    },
    resources: {
      facilities: '/facilities',
      tenders: '/tenders',
      rti: '/rti',
      feePayment: '/fee-payment',
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
