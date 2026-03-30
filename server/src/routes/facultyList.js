const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

/**
 * FACULTY LIST API
 * Provides minimal data for faculty profile cards display
 * Used in: Faculty listing page, department-wise faculty display
 * No authentication required - public endpoint
 */

// Helper function for database queries
async function executeQuery(query, params = []) {
  const connection = await pool.connect();
  try {
    const result = await connection.query(query, params);
    return result.rows;
  } finally {
    connection.release();
  }
}

// GET /api/faculty-list - Get all active faculty with basic card data
router.get('/', async (req, res) => {
  try {
    const faculty = await executeQuery(`
      SELECT 
        e.employee_code,
        e.full_name,
        e.honorific,
        e.email,
        e.extension_no as phone,
        fd.designation_title as designation,
        fp.image_url as profile_image,
        fp.is_hod,
        fp.display_order,
        d.department_name,
        d.department_code,
        d.department_id,
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
    
    res.json({
      success: true,
      data: faculty
    });
  } catch (error) {
    console.error('Get faculty list error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch faculty list' 
    });
  }
});

// GET /api/faculty-list/department/:departmentCode - Get faculty by department with basic card data
router.get('/department/:departmentCode', async (req, res) => {
  try {
    const { departmentCode } = req.params;
    
    const faculty = await executeQuery(`
      SELECT 
        e.employee_code,
        e.full_name,
        e.honorific,
        e.email,
        e.extension_no as phone,
        fd.designation_title as designation,
        fp.image_url as profile_image,
        fp.is_hod,
        fp.display_order,
        d.department_name,
        d.department_code,
        d.department_id,
        fp.bio_summary,
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
    
    if (faculty.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'No faculty found for this department' 
      });
    }
    
    res.json({
      success: true,
      data: faculty
    });
  } catch (error) {
    console.error('Get faculty by department error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch faculty by department' 
    });
  }
});

module.exports = router;
