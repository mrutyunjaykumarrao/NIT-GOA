const express = require('express');
const { executeQuery } = require('../../config/database');

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
        c.credits,
        c.semester,
        c.course_level,
        d.department_name,
        CASE 
          WHEN c.course_code LIKE ? THEN 1
          WHEN c.course_name LIKE ? THEN 2
          ELSE 3
        END as priority
      FROM courses c
      LEFT JOIN departments d ON c.department_id = d.department_id
      WHERE c.is_active = 1
    `;
    
    const params = [];
    
    if (search) {
      query += ` AND (c.course_code LIKE ? OR c.course_name LIKE ?)`;
      params.push(`${search}%`, `%${search}%`, `${search}%`, `%${search}%`);
    } else {
      // If no search term, still need to provide params for priority calculation
      params.push('', '');
    }
    
    if (level) {
      query += ` AND c.course_level = ?`;
      params.push(level);
    }
    
    query += ` ORDER BY priority ASC, c.course_code ASC`;
    
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
    const tables = await executeQuery(`
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
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      // Insert some default research areas
      const defaultAreas = [
        'Artificial Intelligence',
        'Machine Learning',
        'Deep Learning',
        'Computer Vision',
        'Natural Language Processing',
        'Data Science',
        'Cybersecurity',
        'Software Engineering',
        'Database Systems',
        'Computer Networks',
        'Human-Computer Interaction',
        'Algorithms',
        'Computer Graphics',
        'Distributed Systems',
        'Operating Systems'
      ];
      
      for (const area of defaultAreas) {
        await executeQuery(`
          INSERT IGNORE INTO research_areas (area_name) VALUES (?)
        `, [area]);
      }
    }
    
    const areas = await executeQuery(`
      SELECT area_id, area_name, description
      FROM research_areas 
      WHERE is_active = 1
      ORDER BY area_name
    `);
    
    res.json({ success: true, research_areas: areas });
  } catch (error) {
    console.error('Error fetching research areas:', error);
    res.status(500).json({ error: 'Failed to fetch research areas' });
  }
});

// Add new research area (for admin/faculty use)
router.post('/research-areas', async (req, res) => {
  try {
    const { area_name, description } = req.body;
    
    if (!area_name) {
      return res.status(400).json({ error: 'Research area name is required' });
    }
    
    // Check if research area already exists
    const existing = await executeQuery(`
      SELECT area_id FROM research_areas WHERE area_name = ?
    `, [area_name]);
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Research area already exists' });
    }
    
    const result = await executeQuery(`
      INSERT INTO research_areas (area_name, description) VALUES (?, ?)
    `, [area_name, description || null]);
    
    res.json({ 
      success: true, 
      area_id: result.insertId,
      message: 'Research area added successfully' 
    });
  } catch (error) {
    console.error('Error adding research area:', error);
    res.status(500).json({ error: 'Failed to add research area' });
  }
});

// Get universities (for education dropdown)
router.get('/universities', async (req, res) => {
  try {
    // This could be populated from a universities table or predefined list
    const universities = await executeQuery(`
      SELECT DISTINCT institute as university_name
      FROM faculty_education 
      WHERE institute IS NOT NULL AND institute != ''
      ORDER BY institute
    `);
    
    // Add some common universities if the list is empty
    if (universities.length === 0) {
      const commonUniversities = [
        'Indian Institute of Technology (IIT)',
        'Indian Institute of Science (IISc)',
        'National Institute of Technology (NIT)',
        'Indian Statistical Institute (ISI)',
        'Birla Institute of Technology and Science (BITS)',
        'International Institute of Information Technology (IIIT)',
        'Delhi University',
        'Mumbai University',
        'Pune University',
        'Anna University'
      ];
      
      res.json({ 
        success: true, 
        universities: commonUniversities.map(name => ({ university_name: name }))
      });
    } else {
      res.json({ success: true, universities });
    }
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
});

// Get degree types (for education dropdown)
router.get('/degrees', async (req, res) => {
  try {
    const degrees = await executeQuery(`
      SELECT DISTINCT degree
      FROM faculty_education 
      WHERE degree IS NOT NULL AND degree != ''
      ORDER BY degree
    `);
    
    // Add common degrees if the list is empty
    if (degrees.length === 0) {
      const commonDegrees = [
        'Ph.D',
        'M.Tech',
        'M.S',
        'M.E',
        'B.Tech',
        'B.E',
        'B.Sc',
        'M.Sc',
        'M.Phil',
        'MBA',
        'MCA',
        'BCA'
      ];
      
      res.json({ 
        success: true, 
        degrees: commonDegrees.map(name => ({ degree: name }))
      });
    } else {
      res.json({ success: true, degrees });
    }
  } catch (error) {
    console.error('Error fetching degrees:', error);
    res.status(500).json({ error: 'Failed to fetch degrees' });
  }
});

// Get disciplines/subjects (for education dropdown)
router.get('/disciplines', async (req, res) => {
  try {
    const disciplines = await executeQuery(`
      SELECT DISTINCT discipline
      FROM faculty_education 
      WHERE discipline IS NOT NULL AND discipline != ''
      ORDER BY discipline
    `);
    
    // Add common disciplines if the list is empty
    if (disciplines.length === 0) {
      const commonDisciplines = [
        'Computer Science and Engineering',
        'Electronics and Communication Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Electrical Engineering',
        'Chemical Engineering',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Materials Science',
        'Biomedical Engineering',
        'Aerospace Engineering',
        'Information Technology',
        'Data Science',
        'Artificial Intelligence'
      ];
      
      res.json({ 
        success: true, 
        disciplines: commonDisciplines.map(name => ({ discipline: name }))
      });
    } else {
      res.json({ success: true, disciplines });
    }
  } catch (error) {
    console.error('Error fetching disciplines:', error);
    res.status(500).json({ error: 'Failed to fetch disciplines' });
  }
});

// Get course levels (static data)
router.get('/course-levels', async (req, res) => {
  try {
    const courseLevels = [
      { level: 'Undergraduate', description: 'Bachelor degree level courses' },
      { level: 'Postgraduate', description: 'Master and PhD level courses' }
    ];
    
    res.json({ success: true, course_levels: courseLevels });
  } catch (error) {
    console.error('Error fetching course levels:', error);
    res.status(500).json({ error: 'Failed to fetch course levels' });
  }
});

// Get employment statuses (static data)
router.get('/employment-statuses', async (req, res) => {
  try {
    const employmentStatuses = [
      { status: 'Permanent', description: 'Permanent faculty position' },
      { status: 'Contract', description: 'Contract-based faculty position' },
      { status: 'Visiting', description: 'Visiting faculty position' },
      { status: 'Adjunct', description: 'Adjunct faculty position' },
      { status: 'Guest', description: 'Guest faculty position' }
    ];
    
    res.json({ success: true, employment_statuses: employmentStatuses });
  } catch (error) {
    console.error('Error fetching employment statuses:', error);
    res.status(500).json({ error: 'Failed to fetch employment statuses' });
  }
});

module.exports = router;