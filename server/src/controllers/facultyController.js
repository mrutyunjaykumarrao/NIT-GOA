const { pool } = require('../config/database');

// Get all faculty (public)
const getAllFaculty = async (req, res) => {
  try {
    const { department } = req.query;
    
    let query = `
      SELECT id, employee_id, full_name, email, phone, department, designation, 
             research_areas, profile_image, is_hod, display_order, is_active
      FROM faculty_profiles 
      WHERE is_active = 1
    `;
    
    const params = [];
    
    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }
    
    query += ' ORDER BY department, display_order, full_name';
    
    const [faculty] = await pool.execute(query, params);
    res.json(faculty);
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single faculty by ID (public)
const getFacultyById = async (req, res) => {
  try {
    const [faculty] = await pool.execute(
      'SELECT * FROM faculty_profiles WHERE id = ? AND is_active = 1',
      [req.params.id]
    );
    
    if (faculty.length === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    res.json(faculty[0]);
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get faculty by department (public)
const getFacultyByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    
    const [faculty] = await pool.execute(
      `SELECT id, employee_id, full_name, email, phone, department, designation, 
              research_areas, profile_image, is_hod, display_order
       FROM faculty_profiles 
       WHERE department = ? AND is_active = 1 
       ORDER BY display_order, full_name`,
      [department.toUpperCase()]
    );
    
    res.json(faculty);
  } catch (error) {
    console.error('Get faculty by department error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update faculty profile (faculty or admin)
const updateFacultyProfile = async (req, res) => {
  try {
    const facultyId = parseInt(req.params.id);
    
    // Check if user can edit this profile
    if (req.user.role !== 'admin') {
      // For faculty users, find their profile ID via user_id
      const [userFaculty] = await pool.execute(
        'SELECT id FROM faculty_profiles WHERE user_id = ?',
        [req.user.id]
      );
      
      if (userFaculty.length === 0 || userFaculty[0].id !== facultyId) {
        return res.status(403).json({ error: 'You can only edit your own profile' });
      }
    }

    const updateData = { ...req.body };
    
    // Remove empty fields and unwanted fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === '' || updateData[key] === null || 
          ['id', 'user_id', 'created_at', 'updated_at'].includes(key)) {
        delete updateData[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(facultyId);

    await pool.execute(
      `UPDATE faculty_profiles SET ${setClause} WHERE id = ?`,
      values
    );

    // Get updated faculty data
    const [faculty] = await pool.execute(
      'SELECT * FROM faculty_profiles WHERE id = ?',
      [facultyId]
    );

    res.json(faculty[0]);
  } catch (error) {
    console.error('Update faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get faculty profile for current user
const getMyProfile = async (req, res) => {
  try {
    const [faculty] = await pool.execute(
      'SELECT * FROM faculty_profiles WHERE user_id = ?',
      [req.user.id]
    );
    
    if (faculty.length === 0) {
      return res.status(404).json({ error: 'Faculty profile not found' });
    }
    
    res.json(faculty[0]);
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllFaculty,
  getFacultyById,
  getFacultyByDepartment,
  updateFacultyProfile,
  getMyProfile
};
