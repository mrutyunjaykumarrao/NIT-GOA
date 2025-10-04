const express = require('express');
const { executeQuery } = require('../../config/database');

const router = express.Router();

// Import shared middleware from facultyCore
const { authenticateToken, checkEditPermission } = require('./facultyCore');

// Helper function to format dates for MySQL
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
};

// GET /api/faculty/:employeeCode/education - Get education information
router.get('/:employeeCode/education', async (req, res) => {
  try {
    const { employeeCode } = req.params;

    const query = `
      SELECT 
        education_id,
        degree,
        discipline,
        institute,
        graduation_year,
        display_order
      FROM faculty_education 
      WHERE employee_code = ? 
      ORDER BY display_order ASC, graduation_year DESC
    `;

    const [education] = await executeQuery(query, [employeeCode]);

    res.json(education);
  } catch (error) {
    console.error('Get education error:', error);
    res.status(500).json({ error: 'Failed to fetch education information' });
  }
});

// PUT /api/faculty/:employeeCode/education - Update education information
router.put('/:employeeCode/education', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { education } = req.body;

    if (!Array.isArray(education)) {
      return res.status(400).json({ error: 'Education data must be an array' });
    }

    // Delete existing education records
    await executeQuery(`DELETE FROM faculty_education WHERE employee_code = ?`, [employeeCode]);

    // Insert new education records
    for (const edu of education) {
      if (edu.degree || edu.institute || edu.discipline || edu.graduation_year) {
        await executeQuery(`
          INSERT INTO faculty_education (employee_code, degree, institute, discipline, graduation_year, display_order)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [employeeCode, edu.degree || null, edu.institute || null, edu.discipline || null, 
            edu.graduation_year || null, edu.display_order || null]);
      }
    }

    res.json({
      message: 'Education information updated successfully',
      employee_code: employeeCode
    });

  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({ error: 'Failed to update education information' });
  }
});

// POST /api/faculty/:employeeCode/education - Add single education entry
router.post('/:employeeCode/education', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { degree, discipline, institute, graduation_year, display_order } = req.body;

    if (!degree && !institute && !discipline && !graduation_year) {
      return res.status(400).json({ error: 'At least one education field is required' });
    }

    const insertQuery = `
      INSERT INTO faculty_education (employee_code, degree, institute, discipline, graduation_year, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await executeQuery(insertQuery, [
      employeeCode, 
      degree || null, 
      institute || null, 
      discipline || null, 
      graduation_year || null, 
      display_order || null
    ]);

    res.json({
      message: 'Education entry added successfully',
      education_id: result.insertId,
      employee_code: employeeCode
    });

  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({ error: 'Failed to add education entry' });
  }
});

// DELETE /api/faculty/:employeeCode/education/:educationId - Delete education entry
router.delete('/:employeeCode/education/:educationId', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode, educationId } = req.params;

    const deleteQuery = `
      DELETE FROM faculty_education 
      WHERE education_id = ? AND employee_code = ?
    `;

    const result = await executeQuery(deleteQuery, [educationId, employeeCode]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Education entry not found' });
    }

    res.json({
      message: 'Education entry deleted successfully',
      education_id: educationId,
      employee_code: employeeCode
    });

  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({ error: 'Failed to delete education entry' });
  }
});

// GET /api/faculty/:employeeCode/research-areas - Get research areas
router.get('/:employeeCode/research-areas', async (req, res) => {
  try {
    const { employeeCode } = req.params;

    // Get research areas from faculty_profiles.research_interests (text field)
    const profileQuery = `
      SELECT research_interests
      FROM faculty_profiles
      WHERE employee_code = ?
    `;

    const [profileResult] = await executeQuery(profileQuery, [employeeCode]);

    let researchAreas = [];

    if (profileResult.length > 0 && profileResult[0].research_interests) {
      const researchInterests = profileResult[0].research_interests;
      
      // Try to parse as JSON array, otherwise split by comma
      try {
        if (researchInterests.startsWith('[') && researchInterests.endsWith(']')) {
          researchAreas = JSON.parse(researchInterests);
        } else {
          researchAreas = researchInterests.split(',').map(item => item.trim()).filter(item => item);
        }
      } catch (parseError) {
        // Fallback to comma-separated parsing
        researchAreas = researchInterests.split(',').map(item => item.trim()).filter(item => item);
      }
    }

    res.json({ research_areas: researchAreas });
  } catch (error) {
    console.error('Get research areas error:', error);
    res.status(500).json({ error: 'Failed to fetch research areas' });
  }
});

// PUT /api/faculty/:employeeCode/research-areas - Update research areas
router.put('/:employeeCode/research-areas', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { research_areas } = req.body;

    if (!Array.isArray(research_areas)) {
      return res.status(400).json({ error: 'Research areas must be an array' });
    }

    // Store as JSON string in the research_interests field
    const researchInterestsJson = JSON.stringify(research_areas);

    const updateQuery = `
      UPDATE faculty_profiles 
      SET research_interests = ?, updated_at = NOW()
      WHERE employee_code = ?
    `;

    const result = await executeQuery(updateQuery, [researchInterestsJson, employeeCode]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Faculty profile not found' });
    }

    res.json({
      message: 'Research areas updated successfully',
      employee_code: employeeCode,
      research_areas: research_areas
    });

  } catch (error) {
    console.error('Update research areas error:', error);
    res.status(500).json({ error: 'Failed to update research areas' });
  }
});

// GET /api/faculty/:employeeCode/publications - Get publications (future implementation)
router.get('/:employeeCode/publications', async (req, res) => {
  try {
    const { employeeCode } = req.params;

    const query = `
      SELECT 
        publication_id,
        title,
        authors,
        publication_type,
        journal_name,
        conference_name,
        publication_year,
        volume,
        issue,
        pages,
        doi,
        isbn,
        url,
        display_order
      FROM faculty_publications
      WHERE employee_code = ?
      ORDER BY publication_year DESC, display_order ASC
    `;

    const [publications] = await executeQuery(query, [employeeCode]);
    console.log('Publications query result:', publications);

    // Group publications by type
    const groupedPublications = {
      journal: publications.filter(p => p.publication_type === 'Journal Paper'),
      conference: publications.filter(p => p.publication_type === 'Conference Proceeding'),
      book_chapter: publications.filter(p => p.publication_type === 'Book Chapter'),
      book: publications.filter(p => p.publication_type === 'Book Authored')
    };

    res.json(groupedPublications);
  } catch (error) {
    console.error('Get publications error:', error);
    res.status(500).json({ error: 'Failed to fetch publications' });
  }
});

// PUT /api/faculty/:employeeCode/publications - Update publications (future implementation)
router.put('/:employeeCode/publications', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { publications } = req.body;

    // This will be implemented when publications management is added
    res.status(501).json({ 
      message: 'Publications management not yet implemented',
      employee_code: employeeCode 
    });

  } catch (error) {
    console.error('Update publications error:', error);
    res.status(500).json({ error: 'Failed to update publications' });
  }
});

// GET /api/faculty/:employeeCode/research-projects - Get research projects (future implementation)
router.get('/:employeeCode/research-projects', async (req, res) => {
  try {
    const { employeeCode } = req.params;

    // This will be implemented when research projects management is added
    res.status(501).json({ 
      message: 'Research projects management not yet implemented',
      employee_code: employeeCode 
    });

  } catch (error) {
    console.error('Get research projects error:', error);
    res.status(500).json({ error: 'Failed to fetch research projects' });
  }
});

// PUT /api/faculty/:employeeCode/research-projects - Update research projects (future implementation)
router.put('/:employeeCode/research-projects', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { projects } = req.body;

    // This will be implemented when research projects management is added
    res.status(501).json({ 
      message: 'Research projects management not yet implemented',
      employee_code: employeeCode 
    });

  } catch (error) {
    console.error('Update research projects error:', error);
    res.status(500).json({ error: 'Failed to update research projects' });
  }
});

module.exports = router;