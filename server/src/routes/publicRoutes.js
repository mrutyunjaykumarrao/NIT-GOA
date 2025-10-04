const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Get all departments
router.get('/departments', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [departments] = await connection.execute(`
      SELECT 
        department_id as id,
        department_name as name,
        department_code as code,
        is_active
      FROM departments 
      WHERE is_active = 1 
      ORDER BY department_name ASC
    `);

    connection.release();
    res.json({ success: true, data: departments });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all employees (faculty + staff)
router.get('/employees', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [employees] = await connection.execute(`
      SELECT 
        e.employee_id as id,
        e.employee_code,
        e.full_name as name,
        e.honorific,
        e.role,
        e.email,
        e.extension_no as phone,
        e.is_active,
        CASE 
          WHEN e.role = 'Faculty' THEN fp.bio_summary
          WHEN e.role IN ('Administrative', 'Technical') THEN sp.responsibilities
          ELSE NULL
        END as description,
        CASE 
          WHEN e.role = 'Faculty' THEN fp.image_url
          WHEN e.role IN ('Administrative', 'Technical') THEN sp.image_url
          ELSE NULL
        END as profile_image,
        CASE 
          WHEN e.role = 'Faculty' THEN d1.department_name
          WHEN e.role IN ('Administrative', 'Technical') THEN d2.department_name
          ELSE 'General Administration'
        END as department_name,
        CASE 
          WHEN e.role = 'Faculty' THEN d1.department_code
          WHEN e.role IN ('Administrative', 'Technical') THEN d2.department_code
          ELSE 'ADMIN'
        END as department_code
      FROM employees e
      LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code AND e.role = 'Faculty'
      LEFT JOIN staff_profiles sp ON e.employee_code = sp.employee_code AND e.role IN ('Administrative', 'Technical')
      LEFT JOIN departments d1 ON fp.department_id = d1.department_id
      LEFT JOIN departments d2 ON sp.department_id = d2.department_id
      WHERE e.is_active = 1
      ORDER BY e.role ASC, e.full_name ASC
    `);

    connection.release();
    res.json({ success: true, data: employees, total: employees.length });
  } catch (error) {
    console.error('Get employees error:', error);
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
