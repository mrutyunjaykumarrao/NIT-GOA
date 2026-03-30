const express = require('express');
const {
  executeQuery,
  withTransaction,
  authenticateToken,
  checkEditPermission,
  validateRequired,
  formatSuccessResponse,
  formatErrorResponse
} = require('./_middleware');

const router = express.Router();

/**
 * FACULTY COURSES TAUGHT EDIT API
 * Handles courses taught editing
 */

// GET /api/faculty-edit/:employeeCode/courses-taught - Preload courses taught data
router.get('/:employeeCode/courses-taught', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;

    const courses = await executeQuery(`
      SELECT 
        fct.id,
        fct.employee_code,
        fct.course_id,
        COALESCE(c.course_code, fct.custom_course_code) as course_code,
        COALESCE(c.course_name, fct.custom_course_name) as course_name,
        COALESCE(c.course_level, fct.custom_course_level) as course_level,
        COALESCE(c.credits, fct.custom_credits) as credits,
        COALESCE(c.semester, fct.custom_semester) as semester,
        fct.display_order,
        CASE WHEN fct.course_id IS NULL THEN 1 ELSE 0 END as is_custom
      FROM faculty_courses_taught fct
      LEFT JOIN courses c ON fct.course_id = c.course_id
      WHERE fct.employee_code = $1
      ORDER BY COALESCE(fct.display_order, 999), course_level, course_code
    `, [employeeCode]);

    res.json(formatSuccessResponse(courses));
  } catch (error) {
    console.error('Get courses taught error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

// PUT /api/faculty-edit/:employeeCode/courses-taught - Update courses taught
router.put('/:employeeCode/courses-taught', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { courses } = req.body;

    if (!Array.isArray(courses)) {
      return res.status(400).json(formatErrorResponse('Courses must be an array', 400));
    }

    await withTransaction(async (connection) => {
      // Get existing IDs to compare
      const existingRecords = await connection.query(
        'SELECT id FROM faculty_courses_taught WHERE employee_code = $1',
        [employeeCode]
      );
      const existingIds = existingRecords.rows.map(r => r.id);
      const submittedIds = courses.filter(c => c.id).map(c => c.id);

      // Delete removed courses
      const idsToDelete = existingIds.filter(id => !submittedIds.includes(id));
      if (idsToDelete.length > 0) {
        await connection.query(
          `DELETE FROM faculty_courses_taught WHERE id IN (${idsToDelete.map((_, idx) => `$${idx + 1}`).join(',')})`,
          idsToDelete
        );
      }

      // Update or insert courses
      for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        
        // Validate: must have course_name (from custom field or from database)
        if (!course.course_name) {
          throw new Error('Course name is required');
        }

        if (course.id) {
          // UPDATE existing course
          await connection.query(`
            UPDATE faculty_courses_taught 
            SET 
              custom_course_code = $1,
              custom_course_name = $2,
              custom_course_level = $3,
              custom_credits = $4,
              custom_semester = $5,
              display_order = $6
            WHERE id = $7 AND employee_code = $8
          `, [
            course.course_code || null,
            course.course_name,
            course.course_level,
            course.credits || null,
            course.semester || null,
            course.display_order !== undefined ? course.display_order : i + 1,
            course.id,
            employeeCode
          ]);
        } else {
          // INSERT new course (always as custom, course_id will be NULL)
          await connection.query(`
            INSERT INTO faculty_courses_taught 
            (employee_code, course_id, custom_course_code, custom_course_name, custom_course_level, custom_credits, custom_semester, display_order)
            VALUES ($1, NULL, $2, $3, $4, $5, $6, $7)
          `, [
            employeeCode,
            course.course_code || null,
            course.course_name,
            course.course_level,
            course.credits || null,
            course.semester || null,
            course.display_order !== undefined ? course.display_order : i + 1
          ]);
        }
      }
    });

    res.json(formatSuccessResponse(null, 'Courses taught updated successfully'));
  } catch (error) {
    console.error('Update courses taught error:', error);
    res.status(400).json(formatErrorResponse(error, 400));
  }
});

module.exports = router;
