const express = require('express');
const mysql = require('mysql2/promise');

const router = express.Router();

// Database connection function
async function getDbConnection() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mrutyu@2026',
    database: 'updated_nitgoa'
  });
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
