const express = require('express');
const { executeQuery } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

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
        fct.id,
        fct.employee_code,
        fct.course_id,
        COALESCE(c.course_code, fct.custom_course_code) as course_code,
        COALESCE(c.course_name, fct.custom_course_name) as course_name,
        COALESCE(c.course_level, fct.custom_course_level) as course_level,
        COALESCE(c.credits, fct.custom_credits) as credits,
        COALESCE(c.semester, fct.custom_semester) as semester,
        fct.created_at,
        fct.display_order,
        CASE WHEN fct.course_id IS NULL THEN 1 ELSE 0 END as is_custom
      FROM faculty_courses_taught fct
      LEFT JOIN courses c ON fct.course_id = c.course_id
      WHERE fct.employee_code = ?
      ORDER BY course_level, COALESCE(fct.display_order, 999), course_code
    `, [employeeCode]);
    
    res.json({ success: true, courses });
  } catch (error) {
    console.error('Error fetching faculty courses:', error);
    res.status(500).json({ error: 'Failed to fetch faculty courses' });
  }
});

// Add course to faculty
// Add course to faculty (with authentication)
router.post('/faculty-courses/:employeeCode', authenticateToken, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { 
      course_id, 
      // Custom course fields (for courses not in main catalog)
      custom_course_name,
      custom_course_code, 
      custom_credits,
      custom_course_level,
      custom_semester
    } = req.body;
    
    // Validate required fields for custom courses
    if (!course_id && (!custom_course_name || !custom_course_level)) {
      console.log('Validation failed: Missing required custom course fields');
      return res.status(400).json({ 
        error: 'Custom course name and level are required' 
      });
    }
    
    // Check if we need to add custom course fields to the table
    const [tableInfo] = await executeQuery(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'faculty_courses_taught'
      AND COLUMN_NAME = 'custom_course_name'
    `);
    
    // Add custom course columns if they don't exist
    if (tableInfo.length === 0) {
      await executeQuery(`
        ALTER TABLE faculty_courses_taught 
        ADD COLUMN custom_course_name VARCHAR(255) NULL,
        ADD COLUMN custom_course_code VARCHAR(20) NULL,
        ADD COLUMN custom_credits INT NULL,
        ADD COLUMN custom_course_level ENUM('Undergraduate', 'Postgraduate') NULL,
        ADD COLUMN custom_semester VARCHAR(10) NULL
      `);
      console.log('Added custom course fields to faculty_courses_taught table');
    }
    
    // Check if course is already added (for regular courses)
    if (course_id) {
      const [existing] = await executeQuery(`
        SELECT * FROM faculty_courses_taught 
        WHERE employee_code = ? AND course_id = ?
      `, [employeeCode, course_id]);
      
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Course already added to faculty' });
      }
    }
    
    // Check if custom course is already added (for custom courses)
    if (custom_course_code && !course_id) {
      const [existing] = await executeQuery(`
        SELECT * FROM faculty_courses_taught 
        WHERE employee_code = ? AND custom_course_code = ?
      `, [employeeCode, custom_course_code]);
      
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Custom course already added to faculty' });
      }
    }
    
    const [result] = await executeQuery(`
      INSERT INTO faculty_courses_taught 
      (employee_code, course_id, custom_course_name, custom_course_code, custom_credits, custom_course_level, custom_semester)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [employeeCode, course_id || null, custom_course_name || null, custom_course_code || null, custom_credits || null, custom_course_level || null, custom_semester || null]);
    
    // Return the created entry with course details
    if (course_id) {
      // Regular course from catalog
      const [newEntry] = await executeQuery(`
        SELECT 
          fct.employee_code,
          fct.course_id,
          c.course_code,
          c.course_name,
          c.course_level,
          c.credits,
          c.semester,
          fct.created_at
        FROM faculty_courses_taught fct
        JOIN courses c ON fct.course_id = c.course_id
        WHERE fct.employee_code = ? AND fct.course_id = ?
      `, [employeeCode, course_id]);
      
      res.json({ success: true, course: newEntry[0] });
    } else {
      // Custom course
      const customCourse = {
        employee_code: employeeCode,
        course_id: null,
        course_code: custom_course_code,
        course_name: custom_course_name,
        course_level: custom_course_level,
        credits: custom_credits,
        semester: custom_semester,
        created_at: new Date(),
        is_custom: true
      };
      
      res.json({ success: true, course: customCourse });
    }
  } catch (error) {
    console.error('Error adding faculty course:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({ 
      error: 'Failed to add course',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Remove course from faculty
router.delete('/faculty-courses/:employeeCode/:courseId', authenticateToken, async (req, res) => {
  try {
    const { employeeCode, courseId } = req.params;
    
    // Handle both regular courses (by course_id) and custom courses (by custom_course_code)
    if (courseId.startsWith('custom_')) {
      const customCourseCode = courseId.replace('custom_', '');
      await executeQuery(`
        DELETE FROM faculty_courses_taught 
        WHERE employee_code = ? AND custom_course_code = ?
      `, [employeeCode, customCourseCode]);
    } else {
      await executeQuery(`
        DELETE FROM faculty_courses_taught 
        WHERE employee_code = ? AND course_id = ?
      `, [employeeCode, courseId]);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing faculty course:', error);
    res.status(500).json({ error: 'Failed to remove course' });
  }
});

// Course requests - for faculty to request new courses
router.post('/course-requests', async (req, res) => {
  try {
    const { 
      employee_code,
      course_code,
      course_name,
      course_level,
      credits,
      semester,
      department_id,
      justification 
    } = req.body;
    
    // Check if course request table exists, if not create it
    const [tables] = await executeQuery(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'course_requests'
    `);
    
    if (tables.length === 0) {
      await executeQuery(`
        CREATE TABLE course_requests (
          request_id INT PRIMARY KEY AUTO_INCREMENT,
          employee_code VARCHAR(50) NOT NULL,
          course_code VARCHAR(20) NOT NULL,
          course_name VARCHAR(255) NOT NULL,
          course_level ENUM('Undergraduate', 'Postgraduate') NOT NULL,
          credits INT NOT NULL,
          semester VARCHAR(10),
          department_id INT,
          justification TEXT,
          status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          admin_comments TEXT,
          FOREIGN KEY (employee_code) REFERENCES faculty_profiles(employee_code),
          FOREIGN KEY (department_id) REFERENCES departments(department_id)
        )
      `);
    }
    
    const [result] = await executeQuery(`
      INSERT INTO course_requests 
      (employee_code, course_code, course_name, course_level, credits, semester, department_id, justification)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [employee_code, course_code, course_name, course_level, credits, semester, department_id, justification]);
    
    res.json({ 
      success: true, 
      message: 'Course request submitted successfully',
      request_id: result.insertId 
    });
  } catch (error) {
    console.error('Error submitting course request:', error);
    res.status(500).json({ error: 'Failed to submit course request' });
  }
});

// Get course requests for faculty
router.get('/course-requests/:employeeCode', async (req, res) => {
  try {
    const { employeeCode } = req.params;
    
    const [requests] = await executeQuery(`
      SELECT 
        cr.*,
        d.department_name
      FROM course_requests cr
      LEFT JOIN departments d ON cr.department_id = d.department_id
      WHERE cr.employee_code = ?
      ORDER BY cr.created_at DESC
    `, [employeeCode]);
    
    res.json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching course requests:', error);
    res.status(500).json({ error: 'Failed to fetch course requests' });
  }
});

// Update course display order
router.put('/faculty-courses/:employeeCode/reorder', authenticateToken, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { courseId, direction, isCustom } = req.body; // direction: 'up' or 'down'
    
    // Get current course and its order
    const [currentCourse] = await executeQuery(`
      SELECT id, display_order 
      FROM faculty_courses_taught 
      WHERE employee_code = ? AND ${isCustom ? 'custom_course_code = ?' : 'id = ?'}
    `, [employeeCode, courseId]);
    
    if (currentCourse.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const currentOrder = currentCourse[0].display_order;
    const currentId = currentCourse[0].id;
    
    // Find the course to swap with
    const swapDirection = direction === 'up' ? '<' : '>';
    const sortOrder = direction === 'up' ? 'DESC' : 'ASC';
    
    const [swapCourse] = await executeQuery(`
      SELECT id, display_order 
      FROM faculty_courses_taught 
      WHERE employee_code = ? AND display_order ${swapDirection} ?
      ORDER BY display_order ${sortOrder}
      LIMIT 1
    `, [employeeCode, currentOrder]);
    
    if (swapCourse.length === 0) {
      return res.status(400).json({ error: `Cannot move course ${direction}` });
    }
    
    const swapOrder = swapCourse[0].display_order;
    const swapId = swapCourse[0].id;
    
    // Perform the swap
    await executeQuery(`
      UPDATE faculty_courses_taught 
      SET display_order = ? 
      WHERE id = ?
    `, [swapOrder, currentId]);
    
    await executeQuery(`
      UPDATE faculty_courses_taught 
      SET display_order = ? 
      WHERE id = ?
    `, [currentOrder, swapId]);
    
    res.json({ success: true, message: `Course moved ${direction} successfully` });
  } catch (error) {
    console.error('Error reordering courses:', error);
    res.status(500).json({ error: 'Failed to reorder courses' });
  }
});

// Save complete course order
router.put('/faculty-courses/:employeeCode/save-order', authenticateToken, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { courseOrder } = req.body; // Array of {id, isCustom, displayOrder}
    
    console.log('Saving course order for', employeeCode, ':', courseOrder);
    
    // Update each course's display order
    for (const courseData of courseOrder) {
      if (courseData.isCustom) {
        // For custom courses, use the database id from the course data
        // The frontend should send the database id, not the course_code
        await executeQuery(`
          UPDATE faculty_courses_taught 
          SET display_order = ? 
          WHERE employee_code = ? AND id = ? AND course_id IS NULL
        `, [courseData.displayOrder, employeeCode, courseData.id]);
      } else {
        // For regular courses, use the database id
        await executeQuery(`
          UPDATE faculty_courses_taught 
          SET display_order = ? 
          WHERE employee_code = ? AND id = ?
        `, [courseData.displayOrder, employeeCode, courseData.id]);
      }
    }
    
    res.json({ success: true, message: 'Course order saved successfully' });
  } catch (error) {
    console.error('Error saving course order:', error);
    res.status(500).json({ error: 'Failed to save course order' });
  }
});

module.exports = router;