const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Get all administrative staff
router.get('/administrative', async (req, res) => {
  try {
    const connection = await pool.connect();
    
    const result = await connection.query(`
      SELECT 
        e.employee_id as id,
        e.employee_code,
        e.full_name as name,
        sp.job_title as designation,
        e.email,
        e.extension_no as phone,
        sp.image_url as profile_image,
        sp.employment_status,
        e.is_active,
        sp.display_order,
        COALESCE(d.department_name, 'General Administration') as department_name,
        d.department_code as department_code,
        e.honorific,
        sp.responsibilities
      FROM employees e
      LEFT JOIN staff_profiles sp ON e.employee_code = sp.employee_code
      LEFT JOIN departments d ON sp.department_id = d.department_id
      WHERE e.is_active = 1 AND e.role = 'Administrative'
      ORDER BY sp.display_order ASC, e.full_name ASC
    `);
    
    connection.release();
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get administrative staff error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get all technical staff
router.get('/technical', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [staff] = await connection.execute(`
      SELECT 
        e.employee_id as id,
        e.employee_code,
        e.full_name as name,
        sp.job_title as designation,
        e.email,
        e.extension_no as phone,
        sp.image_url as profile_image,
        sp.employment_status,
        e.is_active,
        sp.display_order,
        d.department_name,
        d.department_code,
        e.honorific,
        sp.responsibilities
      FROM employees e
      LEFT JOIN staff_profiles sp ON e.employee_code = sp.employee_code
      LEFT JOIN departments d ON sp.department_id = d.department_id
      WHERE e.is_active = 1 AND e.role = 'Technical'
      ORDER BY sp.display_order ASC, e.full_name ASC
    `);
    
    connection.release();
    res.json({ success: true, data: staff });
  } catch (error) {
    console.error('Get technical staff error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get technical staff by department
router.get('/technical/department/:department', async (req, res) => {
  try {
    const { department } = req.params;
    const connection = await pool.getConnection();
    
    const [staff] = await connection.execute(`
      SELECT 
        e.employee_id as id,
        e.employee_code,
        e.full_name as name,
        sp.job_title as designation,
        e.email,
        e.extension_no as phone,
        sp.image_url as profile_image,
        sp.employment_status,
        e.is_active,
        sp.display_order,
        d.department_name,
        d.department_code,
        e.honorific,
        sp.responsibilities
      FROM employees e
      LEFT JOIN staff_profiles sp ON e.employee_code = sp.employee_code
      LEFT JOIN departments d ON sp.department_id = d.department_id
      WHERE e.is_active = 1 AND e.role = 'Technical' AND d.department_code = ?
      ORDER BY sp.display_order ASC, e.full_name ASC
    `, [department]);
    
    connection.release();
    res.json({ success: true, data: staff });
  } catch (error) {
    console.error('Get technical staff by department error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
