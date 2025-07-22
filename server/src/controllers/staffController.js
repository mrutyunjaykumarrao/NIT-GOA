const { pool } = require('../config/database');

// Get all administrative staff
const getAllAdministrativeStaff = async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        name,
        designation,
        department,
        email,
        phone,
        profile_image,
        employment_status,
        is_active,
        display_order
      FROM administrative_staff 
      WHERE is_active = 1 
      ORDER BY display_order ASC, name ASC
    `;
    
    const [results] = await pool.execute(query);
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching administrative staff:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch administrative staff data',
      error: error.message
    });
  }
};

// Get all technical staff
const getAllTechnicalStaff = async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        name,
        designation,
        department,
        email,
        phone,
        speciality,
        profile_image,
        is_active,
        display_order
      FROM technical_staff 
      WHERE is_active = 1 
      ORDER BY department ASC, display_order ASC, name ASC
    `;
    
    const [results] = await pool.execute(query);
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching technical staff:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch technical staff data',
      error: error.message
    });
  }
};

// Get technical staff by department
const getTechnicalStaffByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    
    const query = `
      SELECT 
        id,
        name,
        designation,
        department,
        email,
        phone,
        speciality,
        profile_image,
        is_active,
        display_order
      FROM technical_staff 
      WHERE is_active = 1 AND department = ?
      ORDER BY display_order ASC, name ASC
    `;
    
    const [results] = await pool.execute(query, [department]);
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching technical staff by department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch technical staff data by department',
      error: error.message
    });
  }
};

module.exports = {
  getAllAdministrativeStaff,
  getAllTechnicalStaff,
  getTechnicalStaffByDepartment
};
