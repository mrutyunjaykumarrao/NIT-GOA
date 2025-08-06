const express = require('express');
const mysql = require('mysql2/promise');
const { executeQuery } = require('../config/database');

const router = express.Router();

// Database connection function
async function getDbConnection() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mrutyu@2026',
    database: 'updated_nitgoa'
  });
}

// Get all departments
router.get('/departments', async (req, res) => {
  try {
    const connection = await getDbConnection();
    
    const [departments] = await connection.execute(`
      SELECT 
        department_id as id,
        department_name as name,
        department_code as code,
        description,
        is_active,
        display_order
      FROM departments 
      WHERE is_active = 1 
      ORDER BY display_order ASC, department_name ASC
    `);

    await connection.end();
    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Redirect old faculty routes to new endpoints
router.use('/faculty', (req, res, next) => {
  // Redirect to faculty profiles or details endpoints
  if (req.path.includes('/details')) {
    // Redirect to faculty details
    return res.redirect(`/api/faculty-details${req.path}`);
  } else {
    // Redirect to faculty profiles
    return res.redirect(`/api/faculty-profiles${req.path}`);
  }
});

module.exports = router;
