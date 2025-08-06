const express = require('express');
const mysql = require('mysql2/promise');

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

// Get all faculty profiles (public) - Short data for listing
router.get('/', async (req, res) => {
  try {
    const connection = await getDbConnection();
    
    const [faculty] = await connection.execute(`
      SELECT 
        e.employee_id as id,
        e.employee_code,
        e.full_name,
        e.honorific,
        e.email,
        e.extension_no as phone,
        e.job_title as designation,
        e.employment_status,
        e.image_url as profile_image,
        e.is_hod,
        e.display_order,
        d.department_name,
        d.department_code,
        fp.bio_summary,
        fp.research_interests
      FROM employees e
      LEFT JOIN faculty_profiles fp ON e.employee_id = fp.employee_id
      LEFT JOIN departments d ON fp.department_id = d.department_id
      WHERE e.is_active = 1 AND e.role = 'Faculty'
      ORDER BY 
        d.department_id ASC,
        CASE WHEN e.display_order = 0 THEN 999999 ELSE e.display_order END ASC,
        e.is_hod DESC,
        e.full_name ASC
    `);
    
    await connection.end();
    
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
    const connection = await getDbConnection();
    
    const [faculty] = await connection.execute(`
      SELECT 
        e.employee_id as id,
        e.employee_code,
        e.full_name,
        e.honorific,
        e.email,
        e.extension_no as phone,
        e.job_title as designation,
        e.employment_status,
        e.image_url as profile_image,
        e.is_hod,
        e.display_order,
        d.department_name,
        d.department_code,
        fp.bio_summary,
        fp.research_interests
      FROM employees e
      LEFT JOIN faculty_profiles fp ON e.employee_id = fp.employee_id
      LEFT JOIN departments d ON fp.department_id = d.department_id
      WHERE e.is_active = 1 AND e.role = 'Faculty' AND d.department_code = ?
      ORDER BY 
        CASE WHEN e.display_order = 0 THEN 999999 ELSE e.display_order END ASC,
        e.is_hod DESC,
        e.full_name ASC
    `, [departmentCode]);
    
    await connection.end();
    
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
