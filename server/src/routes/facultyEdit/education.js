const express = require('express');
const {
  executeQuery,
  withTransaction,
  authenticateToken,
  checkEditPermission,
  validateRequired,
  validateYear,
  formatSuccessResponse,
  formatErrorResponse
} = require('./_middleware');

const router = express.Router();

/**
 * FACULTY EDUCATION EDIT API
 * Handles education/academic background editing
 */

// GET /api/faculty-edit/:employeeCode/education - Preload education data
router.get('/:employeeCode/education', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;

    const education = await executeQuery(`
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
    `, [employeeCode]);

    res.json(formatSuccessResponse(education));
  } catch (error) {
    console.error('Get education error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

// PUT /api/faculty-edit/:employeeCode/education - Update education information
router.put('/:employeeCode/education', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { education } = req.body;

    if (!Array.isArray(education)) {
      return res.status(400).json(formatErrorResponse('Education must be an array', 400));
    }

    await withTransaction(async (connection) => {
      // Delete existing education records
      await connection.execute(
        'DELETE FROM faculty_education WHERE employee_code = ?',
        [employeeCode]
      );

      // Insert new education records
      for (let i = 0; i < education.length; i++) {
        const edu = education[i];
        
        // Validate required fields
        validateRequired(edu.degree, 'Degree');
        validateRequired(edu.institute, 'Institute');
        if (edu.graduation_year) validateYear(edu.graduation_year);

        await connection.execute(`
          INSERT INTO faculty_education 
          (employee_code, degree, discipline, institute, graduation_year, display_order)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          employeeCode,
          edu.degree,
          edu.discipline || null,
          edu.institute,
          edu.graduation_year || null,
          edu.display_order || i
        ]);
      }
    });

    res.json(formatSuccessResponse(null, 'Education updated successfully'));
  } catch (error) {
    console.error('Update education error:', error);
    res.status(400).json(formatErrorResponse(error, 400));
  }
});

module.exports = router;
