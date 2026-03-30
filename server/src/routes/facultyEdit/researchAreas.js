const express = require('express');
const {
  executeQuery,
  authenticateToken,
  checkEditPermission,
  formatSuccessResponse,
  formatErrorResponse
} = require('./_middleware');

const router = express.Router();

/**
 * FACULTY RESEARCH AREAS EDIT API
 * Handles research interests editing
 */

// GET /api/faculty-edit/:employeeCode/research-areas - Preload research interests
router.get('/:employeeCode/research-areas', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;

    const result = await executeQuery(`
      SELECT research_interests
      FROM faculty_profiles
      WHERE employee_code = $1
    `, [employeeCode]);

    if (result.length === 0) {
      return res.status(404).json(formatErrorResponse('Faculty not found', 404));
    }

    res.json(formatSuccessResponse({ 
      research_interests: result[0].research_interests || '' 
    }));
  } catch (error) {
    console.error('Get research areas error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

// PUT /api/faculty-edit/:employeeCode/research-areas - Update research interests
router.put('/:employeeCode/research-areas', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { research_interests } = req.body;

    await executeQuery(`
      UPDATE faculty_profiles 
      SET research_interests = $1
      WHERE employee_code = $2
    `, [research_interests || null, employeeCode]);

    res.json(formatSuccessResponse(null, 'Research interests updated successfully'));
  } catch (error) {
    console.error('Update research areas error:', error);
    res.status(400).json(formatErrorResponse(error, 400));
  }
});

module.exports = router;
