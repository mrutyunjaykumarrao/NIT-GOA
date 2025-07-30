const express = require('express');
const { executeQuery } = require('../config/database');

const router = express.Router();

// Get all administrative staff
router.get('/administrative', async (req, res) => {
  try {
    const [staff] = await executeQuery(`
      SELECT 
        e.employee_id as id,
        e.full_name as name,
        e.job_title as designation,
        e.email,
        e.extension_no as phone,
        e.image_url as profile_image,
        e.employment_status,
        e.is_active,
        e.display_order,
        COALESCE(d.department_name, 'General Administration') as department_name,
        d.department_code as department_code,
        e.honorific,
        sp.specialty
      FROM employees e
      LEFT JOIN staff_profiles sp ON e.employee_id = sp.employee_id
      LEFT JOIN departments d ON sp.department_id = d.department_id
      WHERE e.is_active = 1 AND e.role = 'Administrative'
      ORDER BY e.display_order ASC, e.full_name ASC
    `);
    
    res.json({ success: true, data: staff });
  } catch (error) {
    console.error('Get administrative staff error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get all technical staff
router.get('/technical', async (req, res) => {
  try {
    const [staff] = await executeQuery(`
      SELECT 
        e.employee_id as id,
        e.full_name as name,
        e.job_title as designation,
        e.email,
        e.extension_no as phone,
        e.image_url as profile_image,
        e.employment_status,
        e.is_active,
        e.display_order,
        d.department_name,
        d.department_code,
        e.honorific,
        sp.specialty
      FROM employees e
      LEFT JOIN staff_profiles sp ON e.employee_id = sp.employee_id
      LEFT JOIN departments d ON sp.department_id = d.department_id
      WHERE e.is_active = 1 AND e.role = 'Technical'
      ORDER BY e.display_order ASC, e.full_name ASC
    `);
    
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
    
    const [staff] = await executeQuery(`
      SELECT 
        e.employee_id as id,
        e.full_name as name,
        e.job_title as designation,
        e.email,
        e.extension_no as phone,
        e.image_url as profile_image,
        e.employment_status,
        e.is_active,
        e.display_order,
        d.department_name,
        d.department_code,
        e.honorific,
        sp.specialty
      FROM employees e
      LEFT JOIN staff_profiles sp ON e.employee_id = sp.employee_id
      LEFT JOIN departments d ON sp.department_id = d.department_id
      WHERE e.is_active = 1 AND e.role = 'Technical' AND d.department_code = ?
      ORDER BY e.display_order ASC, e.full_name ASC
    `, [department]);
    
    res.json({ success: true, data: staff });
  } catch (error) {
    console.error('Get technical staff by department error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
