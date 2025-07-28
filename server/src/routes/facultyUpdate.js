const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Update faculty profile information
router.put('/faculty/:id/update', async (req, res) => {
  const facultyId = req.params.id;
  const updateData = req.body;

  try {
    // Prepare the SQL query dynamically based on provided fields
    const updateFields = [];
    const updateValues = [];

    // List of allowed fields for update
    const allowedFields = [
      'full_name', 'designation', 'department', 'qualification', 
      'specialization', 'bio', 'experience_years', 'date_of_joining', 
      'date_of_birth', 'email', 'phone', 'mobile', 'office_location', 
      'address', 'personal_website', 'linkedin_url', 'google_scholar_url', 
      'researchgate_url', 'orcid_url', 'research_areas'
    ];

    // Build the update query dynamically
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updateData[key] || null);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields provided for update'
      });
    }

    // Add the faculty ID to the values array
    updateValues.push(facultyId);

    // Construct and execute the update query
    const updateQuery = `
      UPDATE faculty_profiles 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await db.query(updateQuery, updateValues);

    // Fetch the updated faculty data to return
    const [rows] = await db.query(
      'SELECT * FROM faculty_profiles WHERE id = ?',
      [facultyId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Faculty not found'
      });
    }

    res.json({
      success: true,
      message: 'Faculty profile updated successfully',
      data: rows[0]
    });

  } catch (error) {
    console.error('Error updating faculty profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update faculty profile'
    });
  }
});

module.exports = router;
