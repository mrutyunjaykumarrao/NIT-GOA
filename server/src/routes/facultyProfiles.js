const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Get all faculty profiles (public) - Short data for listing
router.get('/', async (req, res) => {
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
    console.error('Get faculty profiles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get faculty by department - Short data for department-specific listing
router.get('/department/:departmentCode', async (req, res) => {
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
    
    res.json({
      success: true,
      data: faculty
    });
  } catch (error) {
    console.error('Get faculty by department error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
