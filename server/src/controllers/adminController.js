const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

// Get all faculty (admin only)
const getAllFacultyAdmin = async (req, res) => {
  try {
    const [faculty] = await pool.execute(
      'SELECT * FROM faculty_profiles ORDER BY created_at DESC'
    );
    res.json(faculty);
  } catch (error) {
    console.error('Get all faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new faculty (admin only)
const createFaculty = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const facultyData = { ...req.body };

    // Generate login credentials
    const username = facultyData.email ? facultyData.email.split('@')[0] : facultyData.employee_id;
    const password = 'faculty123'; // Default password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user first
    const [userResult] = await connection.execute(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, facultyData.email, hashedPassword, 'faculty']
    );

    const userId = userResult.insertId;

    // Insert faculty profile
    const [result] = await connection.execute(
      `INSERT INTO faculty_profiles (
        user_id, employee_id, first_name, last_name, full_name, email, phone, 
        department, designation, qualification, specialization, research_areas, 
        experience_years, date_of_joining, date_of_birth, address, bio, 
        profile_image, is_hod, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        facultyData.employee_id, 
        facultyData.first_name, 
        facultyData.last_name,
        facultyData.full_name || `${facultyData.first_name} ${facultyData.last_name}`,
        facultyData.email, 
        facultyData.phone, 
        facultyData.department,
        facultyData.designation, 
        facultyData.qualification, 
        facultyData.specialization,
        facultyData.research_areas, 
        facultyData.experience_years || 0, 
        facultyData.date_of_joining,
        facultyData.date_of_birth, 
        facultyData.address, 
        facultyData.bio,
        facultyData.profile_image,
        facultyData.is_hod || false,
        facultyData.display_order || 999
      ]
    );

    await connection.commit();

    res.json({
      message: 'Faculty created successfully',
      faculty_id: result.insertId,
      login_credentials: {
        username: username,
        password: password
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};

// Update faculty (admin only)
const updateFaculty = async (req, res) => {
  try {
    const facultyId = req.params.id;
    const updateData = { ...req.body };
    
    // Remove unwanted fields
    delete updateData.id;
    delete updateData.user_id;
    delete updateData.created_at;
    delete updateData.updated_at;

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

// Delete faculty (admin only)
const deleteFaculty = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const facultyId = req.params.id;
    
    // Get user_id first
    const [faculty] = await connection.execute(
      'SELECT user_id FROM faculty_profiles WHERE id = ?',
      [facultyId]
    );
    
    if (faculty.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    const userId = faculty[0].user_id;
    
    // Delete faculty profile first
    await connection.execute('DELETE FROM faculty_profiles WHERE id = ?', [facultyId]);
    
    // Delete user account
    if (userId) {
      await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
    }
    
    await connection.commit();
    res.json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Delete faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT u.id, u.username, u.email, u.role, u.is_active, u.created_at,
              fp.full_name, fp.employee_id, fp.department
       FROM users u
       LEFT JOIN faculty_profiles fp ON u.id = fp.user_id
       ORDER BY u.created_at DESC`
    );
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new user (admin only)
const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );

    res.json({
      message: 'User created successfully',
      user_id: result.insertId
    });
  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Reset user password (admin only)
const resetUserPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { newPassword } = req.body;
    
    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllFacultyAdmin,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getAllUsers,
  createUser,
  resetUserPassword
};
