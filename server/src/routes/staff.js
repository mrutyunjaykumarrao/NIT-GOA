const express = require('express');
const { executeQuery } = require('../config/database');

const router = express.Router();

// Get all administrative staff
router.get('/administrative', async (req, res) => {
  try {
    const [staff] = await executeQuery(`
      SELECT 
        sp.id,
        CONCAT(e.first_name, ' ', e.last_name) as name,
        sp.designation,
        e.email,
        e.phone,
        sp.profile_image_url,
        sp.is_active,
        sp.display_order,
        d.name as department_name
      FROM staff_profiles sp
      JOIN employees e ON sp.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
      WHERE sp.is_active = 1 AND sp.staff_type = 'administrative'
      ORDER BY sp.display_order ASC, e.last_name ASC
    `);
    
    res.json(staff);
  } catch (error) {
    console.error('Get administrative staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all technical staff
router.get('/technical', async (req, res) => {
  try {
    const [staff] = await executeQuery(`
      SELECT 
        sp.id,
        CONCAT(e.first_name, ' ', e.last_name) as name,
        sp.designation,
        e.email,
        e.phone,
        sp.profile_image_url,
        sp.is_active,
        sp.display_order,
        d.name as department_name
      FROM staff_profiles sp
      JOIN employees e ON sp.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
      WHERE sp.is_active = 1 AND sp.staff_type = 'technical'
      ORDER BY sp.display_order ASC, e.last_name ASC
    `);
    
    res.json(staff);
  } catch (error) {
    console.error('Get technical staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get technical staff by department
router.get('/technical/department/:department', async (req, res) => {
  try {
    const { department } = req.params;
    
    const [staff] = await executeQuery(`
      SELECT 
        sp.id,
        CONCAT(e.first_name, ' ', e.last_name) as name,
        sp.designation,
        e.email,
        e.phone,
        sp.profile_image_url,
        sp.is_active,
        sp.display_order,
        d.name as department_name,
        d.code as department_code
      FROM staff_profiles sp
      JOIN employees e ON sp.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
      WHERE sp.is_active = 1 AND sp.staff_type = 'technical' AND d.code = ?
      ORDER BY sp.display_order ASC, e.last_name ASC
    `, [department]);
    
    res.json(staff);
  } catch (error) {
    console.error('Get technical staff by department error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
