const express = require('express');
const { executeQuery, withTransaction } = require('../config/database');
const { authenticateToken, requireFacultyOrAdmin } = require('../middleware/auth');

const router = express.Router();

// All faculty routes require authentication
router.use(authenticateToken);

// Get my faculty profile
router.get('/my-profile', async (req, res) => {
  try {
    const [profiles] = await executeQuery(`
      SELECT 
        fp.*,
        e.first_name,
        e.last_name,
        CONCAT(e.first_name, ' ', e.last_name) as full_name,
        e.email,
        e.phone,
        e.date_of_birth,
        e.date_of_joining,
        d.name as department_name,
        d.code as department_code
      FROM faculty_profiles fp
      JOIN employees e ON fp.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
      JOIN user_accounts ua ON e.id = ua.employee_id
      WHERE ua.id = ? AND fp.is_active = 1
    `, [req.user.userId]);
    
    if (profiles.length === 0) {
      return res.status(404).json({ error: 'Faculty profile not found' });
    }
    
    res.json(profiles[0]);
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update my faculty profile
router.put('/my-profile', async (req, res) => {
  try {
    const updates = req.body;
    const allowedFields = [
      'designation', 'specialization', 'bio', 'qualifications',
      'research_interests', 'teaching_areas', 'profile_image_url',
      'personal_website', 'google_scholar_url', 'linkedin_url',
      'researchgate_url', 'orcid_id'
    ];
    
    // Filter only allowed fields
    const updateFields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    // Build dynamic update query
    const setClause = updateFields.map(field => `${field} = ?`).join(', ');
    const values = updateFields.map(field => updates[field]);
    
    await withTransaction(async (connection) => {
      // Get faculty profile ID
      const [profiles] = await connection.execute(`
        SELECT fp.id
        FROM faculty_profiles fp
        JOIN employees e ON fp.employee_id = e.id
        JOIN user_accounts ua ON e.id = ua.employee_id
        WHERE ua.id = ?
      `, [req.user.userId]);
      
      if (profiles.length === 0) {
        throw new Error('Faculty profile not found');
      }
      
      const facultyProfileId = profiles[0].id;
      values.push(facultyProfileId);
      
      // Update faculty profile
      await connection.execute(`
        UPDATE faculty_profiles 
        SET ${setClause}, updated_at = NOW()
        WHERE id = ?
      `, values);
      
      // Log the update
      await connection.execute(`
        INSERT INTO audit_log (user_id, action, entity_type, entity_id, details)
        VALUES (?, 'update', 'faculty_profile', ?, ?)
      `, [req.user.userId, facultyProfileId, JSON.stringify({ fields: updateFields })]);
    });
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get my publications
router.get('/my-publications', async (req, res) => {
  try {
    const [publications] = await executeQuery(`
      SELECT pub.*
      FROM faculty_publications pub
      JOIN faculty_profiles fp ON pub.faculty_profile_id = fp.id
      JOIN employees e ON fp.employee_id = e.id
      JOIN user_accounts ua ON e.id = ua.employee_id
      WHERE ua.id = ? AND pub.is_active = 1
      ORDER BY pub.publication_year DESC, pub.title ASC
    `, [req.user.userId]);
    
    res.json(publications);
  } catch (error) {
    console.error('Get my publications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add publication
router.post('/publications', async (req, res) => {
  try {
    const {
      title,
      authors,
      journal_name,
      publication_year,
      publication_type = 'journal',
      doi,
      url,
      abstract,
      keywords
    } = req.body;
    
    if (!title || !authors || !publication_year) {
      return res.status(400).json({ 
        error: 'Title, authors, and publication year are required' 
      });
    }
    
    await withTransaction(async (connection) => {
      // Get faculty profile ID
      const [profiles] = await connection.execute(`
        SELECT fp.id
        FROM faculty_profiles fp
        JOIN employees e ON fp.employee_id = e.id
        JOIN user_accounts ua ON e.id = ua.employee_id
        WHERE ua.id = ?
      `, [req.user.userId]);
      
      if (profiles.length === 0) {
        throw new Error('Faculty profile not found');
      }
      
      const facultyProfileId = profiles[0].id;
      
      // Insert publication
      const [result] = await connection.execute(`
        INSERT INTO faculty_publications (
          faculty_profile_id, title, authors, journal_name, 
          publication_year, publication_type, doi, url, 
          abstract, keywords, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        facultyProfileId, title, authors, journal_name,
        publication_year, publication_type, doi, url,
        abstract, keywords
      ]);
      
      // Log the addition
      await connection.execute(`
        INSERT INTO audit_log (user_id, action, entity_type, entity_id, details)
        VALUES (?, 'create', 'faculty_publication', ?, ?)
      `, [req.user.userId, result.insertId, JSON.stringify({ title })]);
    });
    
    res.status(201).json({ message: 'Publication added successfully' });
  } catch (error) {
    console.error('Add publication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update publication
router.put('/publications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const allowedFields = [
      'title', 'authors', 'journal_name', 'publication_year',
      'publication_type', 'doi', 'url', 'abstract', 'keywords'
    ];
    
    const updateFields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    await withTransaction(async (connection) => {
      // Verify ownership
      const [publications] = await connection.execute(`
        SELECT pub.id
        FROM faculty_publications pub
        JOIN faculty_profiles fp ON pub.faculty_profile_id = fp.id
        JOIN employees e ON fp.employee_id = e.id
        JOIN user_accounts ua ON e.id = ua.employee_id
        WHERE pub.id = ? AND ua.id = ?
      `, [id, req.user.userId]);
      
      if (publications.length === 0) {
        throw new Error('Publication not found or access denied');
      }
      
      // Build update query
      const setClause = updateFields.map(field => `${field} = ?`).join(', ');
      const values = updateFields.map(field => updates[field]);
      values.push(id);
      
      await connection.execute(`
        UPDATE faculty_publications 
        SET ${setClause}, updated_at = NOW()
        WHERE id = ?
      `, values);
      
      // Log the update
      await connection.execute(`
        INSERT INTO audit_log (user_id, action, entity_type, entity_id, details)
        VALUES (?, 'update', 'faculty_publication', ?, ?)
      `, [req.user.userId, id, JSON.stringify({ fields: updateFields })]);
    });
    
    res.json({ message: 'Publication updated successfully' });
  } catch (error) {
    console.error('Update publication error:', error);
    if (error.message === 'Publication not found or access denied') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete publication
router.delete('/publications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await withTransaction(async (connection) => {
      // Verify ownership
      const [publications] = await connection.execute(`
        SELECT pub.id, pub.title
        FROM faculty_publications pub
        JOIN faculty_profiles fp ON pub.faculty_profile_id = fp.id
        JOIN employees e ON fp.employee_id = e.id
        JOIN user_accounts ua ON e.id = ua.employee_id
        WHERE pub.id = ? AND ua.id = ?
      `, [id, req.user.userId]);
      
      if (publications.length === 0) {
        throw new Error('Publication not found or access denied');
      }
      
      const publication = publications[0];
      
      // Soft delete
      await connection.execute(`
        UPDATE faculty_publications 
        SET is_active = 0, updated_at = NOW()
        WHERE id = ?
      `, [id]);
      
      // Log the deletion
      await connection.execute(`
        INSERT INTO audit_log (user_id, action, entity_type, entity_id, details)
        VALUES (?, 'delete', 'faculty_publication', ?, ?)
      `, [req.user.userId, id, JSON.stringify({ title: publication.title })]);
    });
    
    res.json({ message: 'Publication deleted successfully' });
  } catch (error) {
    console.error('Delete publication error:', error);
    if (error.message === 'Publication not found or access denied') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin only routes
router.use(requireFacultyOrAdmin);

// Get all faculty (admin)
router.get('/all', async (req, res) => {
  try {
    const { department, active = 'true', limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT 
        fp.id,
        fp.faculty_id,
        e.first_name,
        e.last_name,
        CONCAT(e.first_name, ' ', e.last_name) as full_name,
        e.email,
        e.phone,
        fp.designation,
        fp.specialization,
        fp.is_hod,
        fp.is_active,
        fp.display_order,
        d.name as department_name,
        d.code as department_code,
        fp.created_at,
        fp.updated_at
      FROM faculty_profiles fp
      JOIN employees e ON fp.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
    `;
    
    const params = [];
    const conditions = [];
    
    if (active === 'true') {
      conditions.push('fp.is_active = 1');
    } else if (active === 'false') {
      conditions.push('fp.is_active = 0');
    }
    
    if (department) {
      conditions.push('d.code = ?');
      params.push(department);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY d.display_order ASC, fp.display_order ASC, e.last_name ASC';
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [faculty] = await executeQuery(query, params);
    
    res.json(faculty);
  } catch (error) {
    console.error('Get all faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
