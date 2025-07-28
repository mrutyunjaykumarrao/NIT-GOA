const express = require('express');
const { executeQuery } = require('../config/database');

const router = express.Router();

// Get all departments
router.get('/departments', async (req, res) => {
  try {
    const [departments] = await executeQuery(`
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

    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all faculty profiles (public)
router.get('/faculty', async (req, res) => {
  try {
    const { department, search, limit = 50, offset = 0 } = req.query;
    
    let query = `
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
        fp.profile_image_url,
        fp.is_hod,
        fp.display_order,
        d.name as department_name,
        d.code as department_code
      FROM faculty_profiles fp
      JOIN employees e ON fp.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
      WHERE fp.is_active = 1 AND e.is_active = 1
    `;
    
    const params = [];
    
    if (department) {
      query += ' AND d.code = ?';
      params.push(department);
    }
    
    if (search) {
      query += ' AND (e.first_name LIKE ? OR e.last_name LIKE ? OR fp.designation LIKE ? OR fp.specialization LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    query += ' ORDER BY d.display_order ASC, fp.display_order ASC, e.last_name ASC';
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [faculty] = await executeQuery(query, params);
    
    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM faculty_profiles fp
      JOIN employees e ON fp.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
      WHERE fp.is_active = 1 AND e.is_active = 1
    `;
    
    const countParams = [];
    if (department) {
      countQuery += ' AND d.code = ?';
      countParams.push(department);
    }
    
    if (search) {
      countQuery += ' AND (e.first_name LIKE ? OR e.last_name LIKE ? OR fp.designation LIKE ? OR fp.specialization LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    const [countResult] = await executeQuery(countQuery, countParams);
    
    res.json({
      faculty,
      pagination: {
        total: countResult[0].total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < countResult[0].total
      }
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
