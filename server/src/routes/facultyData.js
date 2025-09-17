const express = require('express');
const { executeQuery } = require('../config/database');

const router = express.Router();

// Get all courses with search capability
router.get('/courses', async (req, res) => {
  try {
    const { search = '', level = '' } = req.query;
    
    let query = `
      SELECT 
        c.course_id,
        c.course_code,
        c.course_name,
        c.credit_hours,
        c.course_type,
        c.semester,
        c.academic_level,
        d.department_name
      FROM courses c
      LEFT JOIN departments d ON c.department_id = d.department_id
      WHERE c.is_active = 1
    `;
    
    const params = [];
    
    if (search) {
      query += ` AND (c.course_code LIKE ? OR c.course_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (level) {
      query += ` AND c.academic_level = ?`;
      params.push(level);
    }
    
    query += ` ORDER BY c.academic_level, c.course_code`;
    
    const [courses] = await executeQuery(query, params);
    res.json({ success: true, courses });
    
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get all departments
router.get('/departments', async (req, res) => {
  try {
    const [departments] = await executeQuery(`
      SELECT department_id, department_name, department_code
      FROM departments 
      WHERE is_active = 1
      ORDER BY department_name
    `);
    
    res.json({ success: true, departments });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// Get faculty designations
router.get('/designations', async (req, res) => {
  try {
    console.log('Fetching designations...');
    const query = 'SELECT designation_id, designation_title FROM faculty_designations WHERE is_active = 1 ORDER BY designation_id';
    const [designations] = await executeQuery(query);
    console.log('Designations fetched:', designations);
    res.json({ success: true, designations });
  } catch (error) {
    console.error('Error fetching designations:', error);
    res.status(500).json({ error: 'Failed to fetch designations' });
  }
});

// Get research areas (create if doesn't exist)
router.get('/research-areas', async (req, res) => {
  try {
    // First check if research_areas table exists
    const [tables] = await executeQuery(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'research_areas'
    `);
    
    if (tables.length === 0) {
      // Create research_areas table if it doesn't exist
      await executeQuery(`
        CREATE TABLE research_areas (
          area_id INT PRIMARY KEY AUTO_INCREMENT,
          area_name VARCHAR(255) NOT NULL UNIQUE,
          description TEXT,
          is_active TINYINT(1) DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      // Insert some default research areas
      const defaultAreas = [
        'Artificial Intelligence',
        'Machine Learning', 
        'Data Science',
        'Computer Networks',
        'Cybersecurity',
        'Software Engineering',
        'Database Systems',
        'Web Development',
        'Mobile Application Development',
        'Internet of Things (IoT)',
        'Cloud Computing',
        'Big Data Analytics',
        'Computer Vision',
        'Natural Language Processing',
        'Robotics',
        'Blockchain Technology',
        'Human-Computer Interaction',
        'Computer Graphics',
        'Distributed Systems',
        'Algorithm Design'
      ];
      
      for (const area of defaultAreas) {
        await executeQuery(`
          INSERT INTO research_areas (area_name) VALUES (?)
        `, [area]);
      }
    }
    
    const [researchAreas] = await executeQuery(`
      SELECT area_id, area_name, description
      FROM research_areas 
      WHERE is_active = 1
      ORDER BY area_name
    `);
    
    res.json({ success: true, researchAreas });
  } catch (error) {
    console.error('Error fetching research areas:', error);
    res.status(500).json({ error: 'Failed to fetch research areas' });
  }
});

// Add new research area
router.post('/research-areas', async (req, res) => {
  try {
    const { area_name, description } = req.body;
    
    if (!area_name) {
      return res.status(400).json({ error: 'Area name is required' });
    }
    
    const [result] = await executeQuery(`
      INSERT INTO research_areas (area_name, description) VALUES (?, ?)
    `, [area_name, description || null]);
    
    const [newArea] = await executeQuery(`
      SELECT area_id, area_name, description
      FROM research_areas WHERE area_id = ?
    `, [result.insertId]);
    
    res.json({ success: true, researchArea: newArea[0] });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Research area already exists' });
    } else {
      console.error('Error adding research area:', error);
      res.status(500).json({ error: 'Failed to add research area' });
    }
  }
});

// Get faculty courses taught
router.get('/faculty-courses/:employeeCode', async (req, res) => {
  try {
    const { employeeCode } = req.params;
    
    const [courses] = await executeQuery(`
      SELECT 
        fct.course_taught_id,
        c.course_id,
        c.course_code,
        c.course_name,
        c.academic_level,
        fct.semester,
        fct.academic_year,
        fct.student_count,
        fct.additional_info
      FROM faculty_courses_taught fct
      JOIN courses c ON fct.course_id = c.course_id
      WHERE fct.employee_code = ?
      ORDER BY fct.academic_year DESC, fct.semester, c.course_code
    `, [employeeCode]);
    
    res.json({ success: true, courses });
  } catch (error) {
    console.error('Error fetching faculty courses:', error);
    res.status(500).json({ error: 'Failed to fetch faculty courses' });
  }
});

// Add course to faculty
router.post('/faculty-courses/:employeeCode', async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { course_id, semester, academic_year, student_count, additional_info } = req.body;
    
    const [result] = await executeQuery(`
      INSERT INTO faculty_courses_taught 
      (employee_code, course_id, semester, academic_year, student_count, additional_info)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [employeeCode, course_id, semester, academic_year, student_count || null, additional_info || null]);
    
    // Return the created entry with course details
    const [newEntry] = await executeQuery(`
      SELECT 
        fct.course_taught_id,
        c.course_id,
        c.course_code,
        c.course_name,
        c.academic_level,
        fct.semester,
        fct.academic_year,
        fct.student_count,
        fct.additional_info
      FROM faculty_courses_taught fct
      JOIN courses c ON fct.course_id = c.course_id
      WHERE fct.course_taught_id = ?
    `, [result.insertId]);
    
    res.json({ success: true, course: newEntry[0] });
  } catch (error) {
    console.error('Error adding faculty course:', error);
    res.status(500).json({ error: 'Failed to add course' });
  }
});

// Remove course from faculty
router.delete('/faculty-courses/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    
    await executeQuery(`
      DELETE FROM faculty_courses_taught WHERE course_taught_id = ?
    `, [courseId]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing faculty course:', error);
    res.status(500).json({ error: 'Failed to remove course' });
  }
});

module.exports = router;