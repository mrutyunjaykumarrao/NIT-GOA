const express = require('express');
const mysql = require('mysql2/promise');
const { executeQuery } = require('../../config/database');

const router = express.Router();

// Import shared middleware from facultyCore
const { authenticateToken, checkEditPermission } = require('./facultyCore');

// GET /api/faculty/:employeeCode/courses - Get faculty courses taught
router.get('/:employeeCode/courses', async (req, res) => {
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

// POST /api/faculty/:employeeCode/courses - Add course to faculty
router.post('/:employeeCode/courses', authenticateToken, checkEditPermission, async (req, res) => {
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
    const tableInfo = await executeQuery(`
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
      const existing = await executeQuery(`
        SELECT * FROM faculty_courses_taught 
        WHERE employee_code = ? AND course_id = ?
      `, [employeeCode, course_id]);
      
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Course already added to faculty' });
      }
    }
    
    // Check if custom course is already added (for custom courses)
    if (custom_course_code && !course_id) {
      const existing = await executeQuery(`
        SELECT * FROM faculty_courses_taught 
        WHERE employee_code = ? AND custom_course_code = ?
      `, [employeeCode, custom_course_code]);
      
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Custom course already added to faculty' });
      }
    }
    
    const result = await executeQuery(`
      INSERT INTO faculty_courses_taught 
      (employee_code, course_id, custom_course_name, custom_course_code, custom_credits, custom_course_level, custom_semester)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [employeeCode, course_id || null, custom_course_name || null, custom_course_code || null, custom_credits || null, custom_course_level || null, custom_semester || null]);
    
    // Return the created entry with course details
    if (course_id) {
      // Regular course from catalog
      const newEntry = await executeQuery(`
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
    res.status(500).json({ 
      error: 'Failed to add course',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/faculty/:employeeCode/courses/:courseId - Remove course from faculty
router.delete('/:employeeCode/courses/:courseId', authenticateToken, checkEditPermission, async (req, res) => {
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

// PUT /api/faculty/:employeeCode/courses/reorder - Reorder courses temporarily
router.put('/:employeeCode/courses/reorder', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { courseOrder } = req.body;
    
    if (!Array.isArray(courseOrder)) {
      return res.status(400).json({ error: 'Course order must be an array' });
    }
    
    // This endpoint updates display_order without committing to database permanently
    // Mainly used for drag-and-drop preview
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'nitgoa_website'
    });

    await connection.beginTransaction();

    try {
      for (let i = 0; i < courseOrder.length; i++) {
        const courseInfo = courseOrder[i];
        const newOrder = i + 1;
        
        if (courseInfo.is_custom) {
          await connection.execute(`
            UPDATE faculty_courses_taught 
            SET display_order = ? 
            WHERE employee_code = ? AND custom_course_code = ?
          `, [newOrder, employeeCode, courseInfo.course_code]);
        } else {
          await connection.execute(`
            UPDATE faculty_courses_taught 
            SET display_order = ? 
            WHERE employee_code = ? AND course_id = ?
          `, [newOrder, employeeCode, courseInfo.course_id]);
        }
      }
      
      await connection.commit();
      await connection.end();
      
      res.json({ 
        success: true, 
        message: 'Course order updated temporarily',
        employee_code: employeeCode 
      });
      
    } catch (error) {
      await connection.rollback();
      await connection.end();
      throw error;
    }

  } catch (error) {
    console.error('Error reordering courses:', error);
    res.status(500).json({ error: 'Failed to reorder courses' });
  }
});

// PUT /api/faculty/:employeeCode/courses/save-order - Save course order permanently
router.put('/:employeeCode/courses/save-order', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { courseOrder } = req.body;
    
    if (!Array.isArray(courseOrder)) {
      return res.status(400).json({ error: 'Course order must be an array' });
    }
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'nitgoa_website'
    });

    await connection.beginTransaction();

    try {
      for (let i = 0; i < courseOrder.length; i++) {
        const courseInfo = courseOrder[i];
        const newOrder = i + 1;
        
        if (courseInfo.is_custom) {
          await connection.execute(`
            UPDATE faculty_courses_taught 
            SET display_order = ? 
            WHERE employee_code = ? AND custom_course_code = ?
          `, [newOrder, employeeCode, courseInfo.course_code]);
        } else {
          await connection.execute(`
            UPDATE faculty_courses_taught 
            SET display_order = ? 
            WHERE employee_code = ? AND course_id = ?
          `, [newOrder, employeeCode, courseInfo.course_id]);
        }
      }
      
      await connection.commit();
      await connection.end();
      
      res.json({ 
        success: true, 
        message: 'Course order saved permanently',
        employee_code: employeeCode 
      });
      
    } catch (error) {
      await connection.rollback();
      await connection.end();
      throw error;
    }

  } catch (error) {
    console.error('Error saving course order:', error);
    res.status(500).json({ error: 'Failed to save course order' });
  }
});

// POST /api/faculty/:employeeCode/course-requests - Request new course creation
router.post('/:employeeCode/course-requests', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { 
      course_code,
      course_name,
      course_level,
      credits,
      semester,
      department_id,
      justification 
    } = req.body;
    
    // Check if course request table exists, if not create it
    const tables = await executeQuery(`
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
          reviewed_by VARCHAR(50),
          review_comments TEXT,
          FOREIGN KEY (employee_code) REFERENCES employees(employee_code),
          FOREIGN KEY (department_id) REFERENCES departments(department_id)
        )
      `);
    }
    
    const result = await executeQuery(`
      INSERT INTO course_requests 
      (employee_code, course_code, course_name, course_level, credits, semester, department_id, justification)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [employeeCode, course_code, course_name, course_level, credits, semester, department_id, justification]);
    
    res.json({ 
      success: true, 
      request_id: result.insertId,
      message: 'Course request submitted successfully' 
    });
    
  } catch (error) {
    console.error('Error creating course request:', error);
    res.status(500).json({ error: 'Failed to create course request' });
  }
});

// GET /api/faculty/:employeeCode/course-requests - Get faculty course requests
router.get('/:employeeCode/course-requests', async (req, res) => {
  try {
    const { employeeCode } = req.params;
    
    const requests = await executeQuery(`
      SELECT 
        cr.*,
        d.department_name,
        e.full_name as reviewed_by_name
      FROM course_requests cr
      LEFT JOIN departments d ON cr.department_id = d.department_id
      LEFT JOIN employees e ON cr.reviewed_by = e.employee_code
      WHERE cr.employee_code = ?
      ORDER BY cr.created_at DESC
    `, [employeeCode]);
    
    res.json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching course requests:', error);
    res.status(500).json({ error: 'Failed to fetch course requests' });
  }
});

// Future endpoints for additional teaching-related features:
// GET /api/faculty/:employeeCode/teaching-evaluations - Get teaching evaluations
// PUT /api/faculty/:employeeCode/teaching-evaluations - Update teaching evaluations
// GET /api/faculty/:employeeCode/course-materials - Get course materials/resources
// PUT /api/faculty/:employeeCode/course-materials - Update course materials

module.exports = router;