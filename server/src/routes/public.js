const express = require('express');
const mysql = require('mysql2/promise');
const { executeQuery } = require('../config/database');

const router = express.Router();

// Database connection function
async function getDbConnection() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mrutyu@2026',
    database: 'updated_nitgoa',
    timezone: '+00:00', // Use UTC to avoid timezone conversion issues
    dateStrings: true   // Return dates as strings instead of Date objects
  });
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

// Get all departments
router.get('/departments', async (req, res) => {
  try {
    const connection = await getDbConnection();
    
    const [departments] = await connection.execute(`
      SELECT 
        department_id as id,
        department_name as name,
        department_code as code,
        description,
        is_active,
        display_order
      FROM departments 
      WHERE is_active = 1 
      ORDER BY display_order ASC, department_name ASC
    `);

    await connection.end();
    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all faculty profiles (public)
router.get('/faculty', async (req, res) => {
  try {
    const connection = await getDbConnection();
    
    const [faculty] = await connection.execute(`
      SELECT 
        e.employee_id as id,
        e.employee_code,
        e.full_name,
        e.honorific,
        e.email,
        e.extension_no as phone,
        e.job_title as designation,
        e.employment_status,
        e.image_url as profile_image,
        e.is_hod,
        e.display_order,
        d.department_name,
        d.department_code,
        fp.bio_summary,
        fp.research_interests
      FROM employees e
      LEFT JOIN faculty_profiles fp ON e.employee_id = fp.employee_id
      LEFT JOIN departments d ON fp.department_id = d.department_id
      WHERE e.is_active = 1 AND e.role = 'Faculty'
      ORDER BY 
        d.department_id ASC,
        CASE WHEN e.display_order = 0 THEN 999999 ELSE e.display_order END ASC,
        e.is_hod DESC,
        e.full_name ASC
    `);
    
    await connection.end();
    
    res.json({
      success: true,
      data: faculty
    });
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get faculty by department
router.get('/faculty/department/:departmentCode', async (req, res) => {
  try {
    const { departmentCode } = req.params;
    
    const [faculty] = await executeQuery(`
      SELECT 
        fp.id,
        fp.faculty_id,
        e.first_name,
        e.last_name,
        CONCAT(e.first_name, ' ', e.last_name) as full_name,
        e.email,
        e.phone,
        fp.designation,
        fp.specialization,
        fp.bio,
        fp.profile_image_url,
        fp.is_hod,
        fp.display_order,
        d.name as department_name,
        d.code as department_code
      FROM faculty_profiles fp
      JOIN employees e ON fp.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
      WHERE fp.is_active = 1 AND e.is_active = 1 AND d.code = ?
      ORDER BY fp.display_order ASC, e.last_name ASC
    `, [departmentCode]);
    
    if (faculty.length === 0) {
      return res.status(404).json({ error: 'No faculty found for this department' });
    }
    
    res.json(faculty);
  } catch (error) {
    console.error('Get faculty by department error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single faculty details
router.get('/faculty/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [faculty] = await executeQuery(`
      SELECT 
        fp.*,
        e.first_name,
        e.last_name,
        CONCAT(e.first_name, ' ', e.last_name) as full_name,
        e.email,
        e.phone,
        e.date_of_birth,
        e.date_of_joining,
        d.name as department_name,
        d.code as department_code
      FROM faculty_profiles fp
      JOIN employees e ON fp.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
      WHERE fp.id = ? AND fp.is_active = 1 AND e.is_active = 1
    `, [id]);
    
    if (faculty.length === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    // Get faculty publications
    const [publications] = await executeQuery(`
      SELECT 
        title,
        authors,
        journal_name,
        publication_year,
        publication_type,
        doi,
        url
      FROM faculty_publications
      WHERE faculty_profile_id = ? AND is_active = 1
      ORDER BY publication_year DESC, title ASC
    `, [id]);
    
    res.json({
      ...faculty[0],
      publications
    });
  } catch (error) {
    console.error('Get faculty details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get comprehensive faculty details with all related data
router.get('/faculty/:slug/details', async (req, res) => {
  try {
    const { slug } = req.params;
    const connection = await getDbConnection();
    
    // Convert slug back to ID or match by slug/name
    // For now, let's assume the slug is the employee_id
    const facultyId = slug;
    
    // Get basic faculty information
    const [facultyBasic] = await connection.execute(`
      SELECT 
        e.employee_id as faculty_id,
        e.employee_code,
        e.full_name,
        e.honorific,
        e.email,
        e.phone_mobile,
        e.extension_no as phone,
        e.job_title as designation,
        e.employment_status,
        e.image_url as profile_image,
        e.is_hod,
        e.display_order,
        e.date_of_joining,
        fp.gender,
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
      LEFT JOIN faculty_profiles fp ON e.employee_id = fp.employee_id
      LEFT JOIN departments d ON fp.department_id = d.department_id
      WHERE e.employee_code = ? AND e.is_active = 1 AND e.role = 'Faculty'
    `, [facultyId]);
    
    if (facultyBasic.length === 0) {
      await connection.end();
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    const faculty = facultyBasic[0];
    
    // Get faculty publications
    const [publications] = await connection.execute(`
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
      WHERE fp.employee_id = ? 
      ORDER BY fp.publication_year DESC, fp.title ASC
    `, [faculty.faculty_id]);
    
    // Get faculty education/academic background
    const [education] = await connection.execute(`
      SELECT 
        fe.degree,
        fe.institute,
        fe.subject,
        fe.completion_year as year,
        fe.grade_percentage
      FROM faculty_education fe
      WHERE fe.employee_id = ?
      ORDER BY fe.completion_year DESC
    `, [faculty.faculty_id]);
    
    // Get research areas - disabled until faculty_research_areas table is created
    // const [researchAreas] = await connection.execute(`
    //   SELECT 
    //     ra.area_name
    //   FROM faculty_research_areas fra
    //   JOIN research_areas ra ON fra.area_id = ra.area_id
    //   WHERE fra.employee_id = ?
    // `, [faculty.faculty_id]);
    const researchAreas = []; // Temporary empty array until faculty_research_areas table exists
    
    await connection.end();
    
    // Structure the response data
    const profileData = {
      profile: {
        faculty_id: faculty.faculty_id,
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
      ...(education.length > 0 && {
        academicInformation: education
      }),
      ...(publications.length > 0 && {
        publications: {
          journal: publications.filter(p => p.publication_type === 'Journal Paper'),
          proceedings: publications.filter(p => p.publication_type === 'Conference Proceeding'),
          bookChapters: publications.filter(p => p.publication_type === 'Book Chapter'),
          booksAuthored: publications.filter(p => p.publication_type === 'Book Authored')
        }
      }),
      // Add bio/specialization if available
      ...(faculty.bio_summary && {
        biography: faculty.bio_summary
      }),
      // Research areas from the dedicated table
      ...(researchAreas.length > 0 && {
        researchAreas: researchAreas.map(ra => ra.area_name)
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
    
    res.json(profileData);
  } catch (error) {
    console.error('Get comprehensive faculty details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get research areas
router.get('/research-areas', async (req, res) => {
  try {
    const [researchAreas] = await executeQuery(`
      SELECT 
        id,
        name,
        description,
        parent_id
      FROM research_areas 
      WHERE is_active = 1 
      ORDER BY name ASC
    `);
    
    res.json(researchAreas);
  } catch (error) {
    console.error('Get research areas error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get courses
router.get('/courses', async (req, res) => {
  try {
    const { department, level } = req.query;
    
    let query = `
      SELECT 
        c.id,
        c.course_code,
        c.course_name,
        c.course_type,
        c.credits,
        c.semester,
        c.academic_level,
        d.name as department_name,
        d.code as department_code
      FROM courses c
      JOIN departments d ON c.department_id = d.id
      WHERE c.is_active = 1
    `;
    
    const params = [];
    
    if (department) {
      query += ' AND d.code = ?';
      params.push(department);
    }
    
    if (level) {
      query += ' AND c.academic_level = ?';
      params.push(level);
    }
    
    query += ' ORDER BY c.semester ASC, c.course_code ASC';
    
    const [courses] = await executeQuery(query, params);
    
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
