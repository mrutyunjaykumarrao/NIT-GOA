const express = require('express');
const { executeQuery, withTransaction } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const [users] = await executeQuery(`
      SELECT 
        ua.id,
        ua.username,
        ua.role,
        ua.is_active,
        ua.last_login,
        ua.created_at,
        CONCAT(e.first_name, ' ', e.last_name) as full_name,
        e.email,
        d.name as department_name
      FROM user_accounts ua
      LEFT JOIN employees e ON ua.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      ORDER BY ua.created_at DESC
    `);
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all faculty (admin view)
router.get('/faculty', async (req, res) => {
  try {
    const [faculty] = await executeQuery(`
      SELECT 
        fp.id,
        fp.faculty_id,
        CONCAT(e.first_name, ' ', e.last_name) as full_name,
        e.email,
        e.phone,
        fp.designation,
        fp.specialization,
        fp.is_hod,
        fp.is_active,
        d.name as department_name,
        fp.created_at,
        fp.updated_at
      FROM faculty_profiles fp
      JOIN employees e ON fp.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
      ORDER BY fp.created_at DESC
    `);
    
    res.json(faculty);
  } catch (error) {
    console.error('Get faculty admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// System settings management
router.get('/settings', async (req, res) => {
  try {
    const [settings] = await executeQuery(`
      SELECT * FROM system_settings 
      ORDER BY category ASC, setting_key ASC
    `);
    
    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update system setting
router.put('/settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    const [result] = await executeQuery(`
      UPDATE system_settings 
      SET setting_value = ?, updated_at = NOW()
      WHERE setting_key = ?
    `, [JSON.stringify(value), key]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
