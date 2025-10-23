const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Helper function for database queries
async function executeQuery(query, params = []) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(query, params);
    return [results];
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

// Get all departments
router.get('/departments', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [departments] = await connection.execute(`
      SELECT 
        department_id as id,
        department_name as name,
        department_code as code,
        is_active
      FROM departments 
      WHERE is_active = 1 
      ORDER BY department_name ASC
    `);

    connection.release();
    res.json({ success: true, data: departments });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all faculty profiles (public)
router.get('/faculty', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [faculty] = await connection.execute(`
      SELECT 
        e.employee_id as id,
        e.employee_code,
        e.full_name,
        e.honorific,
        e.email,
        e.extension_no as phone,
        fd.designation_title as designation,
        'Faculty' as employment_status,
        fp.image_url as profile_image,
        fp.is_hod,
        fp.display_order,
        d.department_name,
        d.department_code,
        fp.bio_summary,
        fp.research_interests
      FROM employees e
      LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code
      LEFT JOIN departments d ON fp.department_id = d.department_id
      LEFT JOIN faculty_designations fd ON fp.designation_id = fd.designation_id
      WHERE e.is_active = 1 AND e.role = 'Faculty'
      ORDER BY 
        d.department_id ASC,
        CASE WHEN fp.display_order = 0 THEN 999999 ELSE fp.display_order END ASC,
        fp.is_hod DESC,
        e.full_name ASC
    `);
    
    connection.release();
    
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
    const connection = await pool.getConnection();
    
    const [faculty] = await connection.execute(`
      SELECT 
        e.employee_id as id,
        e.employee_code,
        e.full_name,
        e.honorific,
        e.email,
        e.extension_no as phone,
        fd.designation_title as designation,
        fp.bio_summary,
        fp.image_url as profile_image,
        fp.is_hod,
        fp.display_order,
        d.department_name,
        d.department_code,
        fp.research_interests
      FROM employees e
      LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code
      LEFT JOIN departments d ON fp.department_id = d.department_id
      LEFT JOIN faculty_designations fd ON fp.designation_id = fd.designation_id
      WHERE e.is_active = 1 AND e.role = 'Faculty' AND d.department_code = ?
      ORDER BY 
        CASE WHEN fp.display_order = 0 THEN 999999 ELSE fp.display_order END ASC,
        fp.is_hod DESC,
        e.full_name ASC
    `, [departmentCode]);
    
    connection.release();
    
    if (faculty.length === 0) {
      return res.status(404).json({ error: 'No faculty found for this department' });
    }
    
    res.json({ success: true, data: faculty });
  } catch (error) {
    console.error('Get faculty by department error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single faculty details - redirects to dedicated faculty details endpoint
router.get('/faculty/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    // First check if this is employee_code or employee_id
    let facultyQuery;
    let queryParam;
    
    if (isNaN(id)) {
      // Assume it's employee_code (string format)
      facultyQuery = `
        SELECT 
          e.employee_id,
          e.employee_code,
          e.full_name,
          e.honorific,
          e.email,
          e.extension_no as phone,
          e.date_of_joining,
          fd.designation_title as designation,
          fp.image_url as profile_image,
          fp.bio_summary,
          fp.research_interests,
          fp.is_hod,
          fp.display_order,
          d.department_name,
          d.department_code
        FROM employees e
        LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code
        LEFT JOIN departments d ON fp.department_id = d.department_id
        LEFT JOIN faculty_designations fd ON fp.designation_id = fd.designation_id
        WHERE e.employee_code = ? AND e.is_active = 1 AND e.role = 'Faculty'
      `;
      queryParam = id;
    } else {
      // Assume it's employee_id (numeric)
      facultyQuery = `
        SELECT 
          e.employee_id,
          e.employee_code,
          e.full_name,
          e.honorific,
          e.email,
          e.extension_no as phone,
          e.date_of_joining,
          fd.designation_title as designation,
          fp.image_url as profile_image,
          fp.bio_summary,
          fp.research_interests,
          fp.is_hod,
          fp.display_order,
          d.department_name,
          d.department_code
        FROM employees e
        LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code
        LEFT JOIN departments d ON fp.department_id = d.department_id
        LEFT JOIN faculty_designations fd ON fp.designation_id = fd.designation_id
        WHERE e.employee_id = ? AND e.is_active = 1 AND e.role = 'Faculty'
      `;
      queryParam = parseInt(id);
    }
    
    const [faculty] = await connection.execute(facultyQuery, [queryParam]);
    
    if (faculty.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    // Get faculty publications
    const [publications] = await connection.execute(`
      SELECT 
        publication_id,
        title,
        publication_details,
        publication_year,
        publication_month,
        publication_type,
        journal_name,
        doi,
        impact_factor,
        is_featured
      FROM faculty_publications
      WHERE employee_code = ?
      ORDER BY publication_year DESC, publication_month DESC, title ASC
    `, [faculty[0].employee_code]);
    
    connection.release();
    
    res.json({
      success: true,
      data: {
        ...faculty[0],
        publications
      }
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
    const connection = await pool.getConnection();
    
    // The slug should be the employee_code
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
    `, [facultyId]);
    
    if (facultyBasic.length === 0) {
      connection.release();
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
      WHERE fp.employee_code = ? 
      ORDER BY fp.publication_year DESC, fp.title ASC
    `, [faculty.employee_code]);
    
    // Get faculty education/academic background
    const [education] = await connection.execute(`
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
    
    // Get research areas - disabled until faculty_research_areas table is created
    // const [researchAreas] = await connection.execute(`
    //   SELECT 
    //     ra.area_name
    //   FROM faculty_research_areas fra
    //   JOIN research_areas ra ON fra.area_id = ra.area_id
    //   WHERE fra.employee_id = ?
    // `, [faculty.faculty_id]);
    const researchAreas = []; // Temporary empty array until faculty_research_areas table exists
    
    connection.release();
    
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
        area_id as id,
        area_name as name,
        is_active
      FROM research_areas 
      WHERE is_active = 1 
      ORDER BY area_name ASC
    `);
    
    res.json({ success: true, data: researchAreas });
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
    
    if (department) {
      query += ' AND d.department_code = ?';
      params.push(department);
    }
    
    if (level) {
      query += ' AND c.course_level = ?';
      params.push(level);
    }
    
    query += ' ORDER BY c.semester ASC, c.course_code ASC';
    
    const [courses] = await executeQuery(query, params);
    
    res.json({ success: true, data: courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
