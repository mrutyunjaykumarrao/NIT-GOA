const { pool } = require('../config/database');

/**
 * Centralized API Helper Functions
 * This file contains reusable database query functions and data formatting utilities
 * to ensure consistency across all API endpoints and improve maintainability.
 */

// Helper function for database queries with connection pooling
async function executeQuery(query, params = []) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(query, params);
    return [results];
  } finally {
    connection.release();
  }
}

// Helper function for database transactions
async function withTransaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Helper function to format dates from database for output (prevents timezone issues)
function formatDateForOutput(dateValue) {
  if (!dateValue) return null;
  
  // With dateStrings: true, dates should come as strings from MySQL
  // If it's already a string in YYYY-MM-DD format, return as is
  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }
  
  // If it's an ISO string with time, extract just the date part
  if (typeof dateValue === 'string' && dateValue.includes('T')) {
    return dateValue.split('T')[0];
  }
  
  // Fallback: if it's still a JavaScript Date object (shouldn't happen with dateStrings: true)
  if (dateValue instanceof Date) {
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  return null;
}

// Helper function to format dates for MySQL input
function formatDateForInput(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
}

/**
 * PUBLIC DISPLAY APIs - For People Section Cards
 * These functions return only the basic data needed to render profile cards
 */

// Get faculty for public display cards (minimal data for performance)
async function getFacultyForCards() {
  const [faculty] = await executeQuery(`
    SELECT 
      e.employee_code,
      e.full_name,
      e.honorific,
      e.extension_no,
      fd.designation_title as designation,
      d.department_name,
      d.department_code,
      fp.image_url as profile_image,
      fp.is_hod,
      fp.display_order,
      'Faculty' as employment_status
    FROM employees e
    LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code
    LEFT JOIN departments d ON fp.department_id = d.department_id
    LEFT JOIN faculty_designations fd ON fp.designation_id = fd.designation_id
    WHERE e.is_active = 1 AND e.is_public_visible = 1 AND e.role = 'Faculty'
    ORDER BY 
      d.department_id ASC,
      CASE WHEN fp.display_order = 0 THEN 999999 ELSE fp.display_order END ASC,
      fp.is_hod DESC,
      e.full_name ASC
  `);
  
  return faculty;
}

// Get faculty by department for public display cards
async function getFacultyCardsByDepartment(departmentCode) {
  const [faculty] = await executeQuery(`
    SELECT 
      e.employee_code,
      e.full_name,
      e.honorific,
      e.extension_no,
      fd.designation_title as designation,
      d.department_name,
      d.department_code,
      fp.image_url as profile_image,
      fp.is_hod,
      fp.display_order,
      'Faculty' as employment_status
    FROM employees e
    LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code
    LEFT JOIN departments d ON fp.department_id = d.department_id
    LEFT JOIN faculty_designations fd ON fp.designation_id = fd.designation_id
    WHERE e.is_active = 1 AND e.is_public_visible = 1 AND e.role = 'Faculty' AND d.department_code = ?
    ORDER BY 
      CASE WHEN fp.display_order = 0 THEN 999999 ELSE fp.display_order END ASC,
      fp.is_hod DESC,
      e.full_name ASC
  `, [departmentCode]);
  
  return faculty;
}

// Get technical staff for public display cards
async function getTechnicalStaffForCards() {
  const [staff] = await executeQuery(`
    SELECT 
      e.employee_code,
      e.full_name,
      e.honorific,
      e.extension_no,
      sp.job_title as designation,
      d.department_name,
      d.department_code,
      sp.image_url as profile_image,
      sp.responsibilities,
      sp.employment_status,
      sp.display_order
    FROM employees e
    LEFT JOIN staff_profiles sp ON e.employee_code = sp.employee_code
    LEFT JOIN departments d ON sp.department_id = d.department_id
    WHERE e.is_active = 1 AND e.is_public_visible = 1 AND e.role = 'Technical'
    ORDER BY 
      d.department_id ASC,
      CASE WHEN sp.display_order = 0 THEN 999999 ELSE sp.display_order END ASC,
      e.full_name ASC
  `);
  
  return staff;
}

// Get administrative staff for public display cards
async function getAdministrativeStaffForCards() {
  const [staff] = await executeQuery(`
    SELECT 
      e.employee_code,
      e.full_name,
      e.honorific,
      e.extension_no,
      sp.job_title as designation,
      d.department_name,
      d.department_code,
      sp.image_url as profile_image,
      sp.responsibilities,
      sp.employment_status,
      sp.display_order
    FROM employees e
    LEFT JOIN staff_profiles sp ON e.employee_code = sp.employee_code
    LEFT JOIN departments d ON sp.department_id = d.department_id
    WHERE e.is_active = 1 AND e.is_public_visible = 1 AND e.role = 'Administrative'
    ORDER BY 
      d.department_id ASC,
      CASE WHEN sp.display_order = 0 THEN 999999 ELSE sp.display_order END ASC,
      e.full_name ASC
  `);
  
  return staff;
}

/**
 * FACULTY DETAILS APIs - For Faculty Detail Pages (View + Edit)
 */

// Get detailed faculty information by employee_code
async function getFacultyDetails(employeeCode) {
  const [facultyBasic] = await executeQuery(`
    SELECT 
      e.employee_id as faculty_id,
      e.employee_code,
      e.full_name,
      e.honorific,
      e.email,
      e.phone_mobile,
      e.extension_no as phone,
      fd.designation_title as designation,
      'Faculty' as employment_status,
      fp.image_url as profile_image,
      fp.is_hod,
      fp.display_order,
      e.date_of_joining,
      e.gender,
      fp.date_of_birth,
      fp.research_teaching_experience,
      fp.address,
      fp.office_location,
      fp.office_hours,
      fp.linkedin_url,
      fp.personal_website_url,
      fp.google_scholar_url,
      fp.orcid_id,
      fp.scopus_id,
      fp.research_gate_url,
      d.department_name,
      d.department_code,
      fp.bio_summary,
      fp.research_interests
    FROM employees e
    LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code
    LEFT JOIN departments d ON fp.department_id = d.department_id
    LEFT JOIN faculty_designations fd ON fp.designation_id = fd.designation_id
    WHERE e.employee_code = ? AND e.is_active = 1 AND e.role = 'Faculty'
  `, [employeeCode]);

  if (facultyBasic.length === 0) {
    return null;
  }

  const faculty = facultyBasic[0];

  // Get faculty publications
  const [publications] = await executeQuery(`
    SELECT 
      fp.publication_id,
      fp.title,
      fp.publication_details,
      fp.journal_name,
      fp.publication_year,
      fp.publication_month,
      fp.publication_type,
      fp.doi,
      fp.impact_factor,
      fp.volume,
      fp.issue,
      fp.pages
    FROM faculty_publications fp
    WHERE fp.employee_code = ? 
    ORDER BY fp.publication_year DESC, fp.title ASC
  `, [faculty.employee_code]);

  // Get faculty education
  const [education] = await executeQuery(`
    SELECT 
      fe.education_id,
      fe.degree,
      fe.institute,
      fe.discipline,
      fe.graduation_year,
      fe.display_order
    FROM faculty_education fe
    WHERE fe.employee_code = ?
    ORDER BY fe.display_order ASC, fe.graduation_year DESC
  `, [faculty.employee_code]);

  // Get faculty courses taught
  const [courses] = await executeQuery(`
    SELECT 
      fct.id,
      fct.employee_code,
      fct.course_id,
      COALESCE(c.course_code, fct.custom_course_code) as course_code,
      COALESCE(c.course_name, fct.custom_course_name) as course_name,
      COALESCE(c.course_level, fct.custom_course_level) as course_level,
      COALESCE(c.credits, fct.custom_credits) as credits,
      COALESCE(c.semester, fct.custom_semester) as semester
    FROM faculty_courses_taught fct
    LEFT JOIN courses c ON fct.course_id = c.course_id
    WHERE fct.employee_code = ?
    ORDER BY course_level, course_code
  `, [faculty.employee_code]);

  return {
    ...faculty,
    publications,
    education,
    courses_taught: courses
  };
}

/**
 * DEPARTMENT DATA FUNCTIONS
 */

// Get all active departments
async function getAllDepartments() {
  const [departments] = await executeQuery(`
    SELECT 
      department_id as id,
      department_name as name,
      department_code as code,
      is_active
    FROM departments 
    WHERE is_active = 1 
    ORDER BY department_name ASC
  `);
  
  return departments;
}

/**
 * COURSE DATA FUNCTIONS
 */

// Get all courses with optional filtering
async function getCourses(filters = {}) {
  let query = `
    SELECT 
      c.course_id as id,
      c.course_code,
      c.course_name,
      c.credits,
      c.semester,
      c.course_level,
      d.department_name,
      d.department_code
    FROM courses c
    LEFT JOIN departments d ON c.department_id = d.department_id
    WHERE c.is_active = 1
  `;
  
  const params = [];
  
  if (filters.search) {
    query += ` AND (c.course_code LIKE ? OR c.course_name LIKE ?)`;
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  
  if (filters.department) {
    query += ` AND d.department_code = ?`;
    params.push(filters.department);
  }
  
  if (filters.level) {
    query += ` AND c.course_level = ?`;
    params.push(filters.level);
  }
  
  query += ` ORDER BY c.course_code ASC`;
  
  const [courses] = await executeQuery(query, params);
  
  return courses;
}

/**
 * RESEARCH AREAS FUNCTIONS
 */

// Get all research areas
async function getResearchAreas() {
  const [researchAreas] = await executeQuery(`
    SELECT 
      area_id as id,
      area_name as name,
      is_active
    FROM research_areas 
    WHERE is_active = 1 
    ORDER BY area_name ASC
  `);
  
  return researchAreas;
}

/**
 * ADMIN MANAGEMENT APIs - For Admin Dashboard CRUD Operations
 */

// Get all employees for admin management (includes inactive employees)
async function getEmployeesForAdmin() {
  const [employees] = await executeQuery(`
    SELECT 
      e.employee_id as id,
      e.employee_code,
      e.full_name,
      e.honorific,
      e.email,
      e.phone_mobile as phone,
      e.phone_residence,
      e.extension_no,
      e.date_of_joining,
      e.role,
      CASE 
        WHEN e.role = 'Faculty' THEN fd.designation_title
        WHEN e.role IN ('Administrative', 'Technical') THEN sp.job_title
        ELSE NULL
      END as position,
      CASE 
        WHEN e.role = 'Faculty' THEN fp.is_hod
        ELSE 0
      END as is_hod,
      CASE 
        WHEN e.role = 'Faculty' THEN 'Active'
        WHEN e.role IN ('Administrative', 'Technical') THEN sp.employment_status
        ELSE NULL
      END as employment_status,
      CASE 
        WHEN e.role = 'Faculty' THEN fp.image_url
        WHEN e.role IN ('Administrative', 'Technical') THEN sp.image_url
        ELSE NULL
      END as image_url,
      e.is_active,
      e.is_public_visible,
      CASE 
        WHEN e.role = 'Faculty' THEN fp.display_order
        WHEN e.role IN ('Administrative', 'Technical') THEN sp.display_order
        ELSE 0
      END as display_order,
      e.created_at,
      e.updated_at,
      CASE 
        WHEN e.role = 'Faculty' THEN d_f.department_name
        WHEN e.role IN ('Administrative', 'Technical') THEN d_s.department_name
        ELSE NULL
      END as department_name,
      CASE 
        WHEN e.role = 'Faculty' THEN d_f.department_id
        WHEN e.role IN ('Administrative', 'Technical') THEN d_s.department_id
        ELSE NULL
      END as department_id,
      ua.username,
      ua.access_level as user_role,
      ua.is_active as user_active
    FROM employees e
    LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code AND e.role = 'Faculty'
    LEFT JOIN staff_profiles sp ON e.employee_code = sp.employee_code AND e.role IN ('Administrative', 'Technical')
    LEFT JOIN departments d_f ON fp.department_id = d_f.department_id
    LEFT JOIN departments d_s ON sp.department_id = d_s.department_id
    LEFT JOIN faculty_designations fd ON fp.designation_id = fd.designation_id
    LEFT JOIN user_accounts ua ON ua.username = e.employee_code
    ORDER BY e.created_at DESC
  `);
  
  return employees;
}

// Get faculty for admin management
async function getFacultyForAdmin() {
  const [faculty] = await executeQuery(`
    SELECT 
      e.employee_id as id,
      e.employee_code,
      e.full_name,
      e.honorific,
      e.email,
      e.phone_mobile as phone,
      e.phone_residence,
      e.extension_no,
      e.date_of_joining,
      e.role,
      fd.designation_title as position,
      fp.is_hod,
      'Active' as employment_status,
      fp.image_url,
      e.is_active,
      e.is_public_visible,
      fp.display_order,
      e.created_at,
      e.updated_at,
      fp.department_id,
      fp.designation_id,
      e.gender,
      fp.date_of_birth,
      fp.research_teaching_experience,
      fp.address,
      fp.office_location,
      fp.office_hours,
      fp.linkedin_url,
      fp.personal_website_url,
      fp.google_scholar_url,
      fp.orcid_id,
      fp.scopus_id,
      fp.research_gate_url,
      fp.bio_summary,
      fp.research_interests,
      d.department_name,
      ua.username,
      ua.access_level as user_role,
      ua.is_active as user_active
    FROM employees e
    JOIN faculty_profiles fp ON e.employee_code = fp.employee_code
    LEFT JOIN departments d ON fp.department_id = d.department_id
    LEFT JOIN faculty_designations fd ON fp.designation_id = fd.designation_id
    LEFT JOIN user_accounts ua ON ua.username = e.employee_code
    WHERE e.role = 'Faculty'
    ORDER BY e.created_at DESC
  `);
  
  return faculty;
}

// Get staff for admin management
async function getStaffForAdmin() {
  const [staff] = await executeQuery(`
    SELECT 
      e.employee_id as id,
      e.employee_code,
      e.full_name,
      e.honorific,
      e.email,
      e.phone_mobile as phone,
      e.phone_residence,
      e.extension_no,
      e.date_of_joining,
      e.role,
      sp.job_title as position,
      sp.employment_status,
      sp.image_url,
      e.is_active,
      e.is_public_visible,
      sp.display_order,
      e.created_at,
      e.updated_at,
      sp.department_id,
      e.gender,
      sp.responsibilities,
      d.department_name,
      ua.username,
      ua.access_level as user_role,
      ua.is_active as user_active
    FROM employees e
    JOIN staff_profiles sp ON e.employee_code = sp.employee_code
    LEFT JOIN departments d ON sp.department_id = d.department_id
    LEFT JOIN user_accounts ua ON ua.username = e.employee_code
    WHERE e.role IN ('Administrative', 'Technical')
    ORDER BY e.created_at DESC
  `);
  
  return staff;
}

/**
 * ANALYTICS APIs - For Admin Dashboard and Footer
 */

// Get website analytics for admin dashboard
async function getWebsiteAnalytics(days = 30) {
  // Get daily analytics data for chart
  const [websiteStats] = await executeQuery(`
    SELECT 
      DATE(date_recorded) as analytics_date,
      daily_visitors as daily_count
    FROM site_analytics 
    WHERE date_recorded >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    ORDER BY date_recorded DESC
  `, [days]);

  // Get today's stats
  const [todayStats] = await executeQuery(`
    SELECT total_visitors, daily_visitors, desktop_visits, mobile_visits
    FROM site_analytics 
    WHERE date_recorded = CURDATE()
  `);

  // Get all-time stats
  const [allTimeStats] = await executeQuery(`
    SELECT 
      MAX(total_visitors) as total_visitors,
      SUM(desktop_visits) as total_desktop,
      SUM(mobile_visits) as total_mobile
    FROM site_analytics
  `);

  return {
    allTime: {
      total_visitors: allTimeStats[0]?.total_visitors || 0
    },
    today: {
      daily_visitors: todayStats[0]?.daily_visitors || 0
    },
    deviceBreakdown: {
      desktop: allTimeStats[0]?.total_desktop || 0,
      mobile: allTimeStats[0]?.total_mobile || 0
    },
    chartData: {
      visitors: websiteStats.map(row => ({
        date: row.analytics_date,
        visitors: row.daily_count || 0
      }))
    }
  };
}

// Get system analytics for admin dashboard
async function getSystemAnalytics() {
  const [analytics] = await executeQuery(`
    SELECT 
      (SELECT COUNT(*) FROM user_accounts) as total_users,
      (SELECT COUNT(*) FROM employees) as total_employees,
      (SELECT COUNT(*) FROM faculty_profiles) as total_faculty,
      (SELECT COUNT(*) FROM staff_profiles) as total_staff,
      (SELECT COUNT(*) FROM departments WHERE is_active = 1) as active_departments,
      (SELECT COUNT(*) FROM user_accounts WHERE is_active = 1) as active_users,
      (SELECT COUNT(*) FROM employees WHERE is_active = 1) as active_employees,
      (SELECT COUNT(*) FROM user_accounts WHERE last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as recent_logins,
      (SELECT COUNT(*) FROM pending_approvals WHERE status = 'pending') as pending_approvals,
      (SELECT COUNT(*) FROM faculty_publications WHERE publication_year = YEAR(NOW())) as publications_this_year
  `);
  
  return analytics[0];
}

// Get visitor count for footer (simplified)
async function getVisitorCount() {
  const [result] = await executeQuery(`
    SELECT MAX(total_visitors) as total_visitors
    FROM site_analytics
  `);
  
  return result[0]?.total_visitors || 0;
}

/**
 * PENDING APPROVALS APIs - For Admin Dashboard
 */

// Get all pending approvals
async function getPendingApprovals() {
  const [approvals] = await executeQuery(`
    SELECT 
      pa.approval_id,
      pa.employee_code,
      pa.approval_type,
      pa.current_value as current_image_url,
      pa.requested_value,
      pa.temp_file_path,
      pa.requested_by,
      pa.requested_at,
      pa.status,
      pa.admin_notes,
      e.full_name,
      e.role,
      d.department_code,
      d.department_name
    FROM pending_approvals pa
    JOIN employees e ON pa.employee_code = e.employee_code
    LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code
    LEFT JOIN departments d ON fp.department_id = d.department_id
    WHERE pa.status = 'pending'
    ORDER BY pa.requested_at DESC
  `);
  
  return approvals;
}

/**
 * RESPONSE FORMATTING FUNCTIONS
 */

// Standard success response format
function formatSuccessResponse(data, message = null) {
  return {
    success: true,
    ...(message && { message }),
    data
  };
}

// Standard error response format
function formatErrorResponse(error, status = 500) {
  return {
    success: false,
    error: typeof error === 'string' ? error : error.message || 'Internal server error',
    status
  };
}

// Format faculty profile for detailed view
function formatFacultyProfile(faculty) {
  if (!faculty) return null;
  
  return {
    profile: {
      faculty_id: faculty.employee_code,
      name: faculty.honorific ? `${faculty.honorific} ${faculty.full_name}` : faculty.full_name,
      designation: faculty.designation,
      department: faculty.department_name,
      email: faculty.email,
      profile_image: faculty.profile_image,
      researchAreaSummary: faculty.research_interests ? 
        (Array.isArray(faculty.research_interests) ? faculty.research_interests : 
         (faculty.research_interests.includes('[') && faculty.research_interests.includes(']') ? 
          JSON.parse(faculty.research_interests) : 
          faculty.research_interests.split(',').map(item => item.trim()).filter(item => item))) : []
    },
    personalInformation: {
      name: faculty.honorific ? `${faculty.honorific} ${faculty.full_name}` : faculty.full_name,
      gender: faculty.gender,
      birthDate: faculty.date_of_birth ? formatDateForOutput(faculty.date_of_birth) : null,
      designation: faculty.designation,
      department: faculty.department_name,
      dateOfJoining: faculty.date_of_joining ? formatDateForOutput(faculty.date_of_joining) : null,
      experience: faculty.research_teaching_experience
    },
    contactInformation: {
      email: faculty.email,
      phoneMobile: faculty.phone_mobile,
      address: faculty.address,
      officeLocation: faculty.office_location,
      officeHours: faculty.office_hours
    },
    // Only include sections that have data
    ...(faculty.education && faculty.education.length > 0 && {
      academicInformation: faculty.education
    }),
    ...(faculty.publications && faculty.publications.length > 0 && {
      publications: {
        journal: faculty.publications.filter(p => p.publication_type === 'Journal Paper'),
        proceedings: faculty.publications.filter(p => p.publication_type === 'Conference Proceeding'),
        bookChapters: faculty.publications.filter(p => p.publication_type === 'Book Chapter'),
        booksAuthored: faculty.publications.filter(p => p.publication_type === 'Book Authored')
      }
    }),
    ...(faculty.courses_taught && faculty.courses_taught.length > 0 && {
      coursesTaught: {
        ug: faculty.courses_taught.filter(c => c.course_level === 'Undergraduate'),
        pg: faculty.courses_taught.filter(c => c.course_level === 'Postgraduate')
      }
    }),
    // Add bio/specialization if available
    ...(faculty.bio_summary && {
      biography: faculty.bio_summary
    }),
    // Social links
    socialLinks: {
      ...(faculty.linkedin_url && { linkedin: faculty.linkedin_url }),
      ...(faculty.personal_website_url && { website: faculty.personal_website_url }),
      ...(faculty.google_scholar_url && { googleScholar: faculty.google_scholar_url }),
      ...(faculty.orcid_id && { orcid: faculty.orcid_id }),
      ...(faculty.research_gate_url && { researchGate: faculty.research_gate_url })
    }
  };
}

module.exports = {
  // Database utilities
  executeQuery,
  withTransaction,
  
  // Date formatting
  formatDateForOutput,
  formatDateForInput,
  
  // Public Display APIs (for people section cards)
  getFacultyForCards,
  getFacultyCardsByDepartment,
  getTechnicalStaffForCards,
  getAdministrativeStaffForCards,
  
  // Faculty Detail APIs (for faculty detail pages)
  getFacultyDetails,
  
  // Admin Management APIs (for admin dashboard CRUD)
  getEmployeesForAdmin,
  getFacultyForAdmin,
  getStaffForAdmin,
  
  // Analytics APIs (for dashboard and footer)
  getWebsiteAnalytics,
  getSystemAnalytics,
  getVisitorCount,
  
  // Pending Approvals APIs (for admin dashboard)
  getPendingApprovals,
  
  // Common data functions
  getAllDepartments,
  getCourses,
  getResearchAreas,
  
  // Response formatting
  formatSuccessResponse,
  formatErrorResponse,
  formatFacultyProfile
};