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
 * FACULTY RESEARCH GUIDANCE EDIT API
 * Handles research guidance (PhD/MTech students) editing
 */

// GET /api/faculty-edit/:employeeCode/research-guidance - Preload research guidance data
router.get('/:employeeCode/research-guidance', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;

    const students = await executeQuery(`
      SELECT 
        guidance_id,
        student_honorific,
        student_name,
        research_topic,
        status,
        display_order
      FROM faculty_research_guidance 
      WHERE employee_code = ? 
      ORDER BY 
        CASE status 
          WHEN 'ongoing' THEN 1 
          WHEN 'completed' THEN 2 
          ELSE 3 
        END,
        display_order ASC
    `, [employeeCode]);

    res.json(formatSuccessResponse(students));
  } catch (error) {
    console.error('Get research guidance error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

// PUT /api/faculty-edit/:employeeCode/research-guidance - Update research guidance
router.put('/:employeeCode/research-guidance', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { students } = req.body;

    if (!Array.isArray(students)) {
      return res.status(400).json(formatErrorResponse('Students must be an array', 400));
    }

    await withTransaction(async (connection) => {
      // Get existing guidance IDs
      const [existingRecords] = await connection.execute(
        'SELECT guidance_id FROM faculty_research_guidance WHERE employee_code = ?',
        [employeeCode]
      );
      const existingIds = existingRecords.map(r => r.guidance_id);
      const submittedIds = students.filter(s => s.guidance_id).map(s => s.guidance_id);
      
      // Delete records that were removed (exist in DB but not in submitted data)
      const idsToDelete = existingIds.filter(id => !submittedIds.includes(id));
      if (idsToDelete.length > 0) {
        await connection.execute(
          `DELETE FROM faculty_research_guidance WHERE guidance_id IN (${idsToDelete.map(() => '?').join(',')})`,
          idsToDelete
        );
      }

      // Update or insert records
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        
        // Validate required fields
        validateRequired(student.student_name, 'Student name');

        if (student.guidance_id) {
          // Update existing record
          await connection.execute(`
            UPDATE faculty_research_guidance 
            SET student_honorific = ?,
                student_name = ?,
                research_topic = ?,
                status = ?,
                display_order = ?
            WHERE guidance_id = ? AND employee_code = ?
          `, [
            student.student_honorific || null,
            student.student_name,
            student.research_topic || null,
            student.status || 'ongoing',
            student.display_order !== undefined ? student.display_order : i,
            student.guidance_id,
            employeeCode
          ]);
        } else {
          // Insert new record
          await connection.execute(`
            INSERT INTO faculty_research_guidance 
            (employee_code, student_honorific, student_name, research_topic, status, display_order)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [
            employeeCode,
            student.student_honorific || null,
            student.student_name,
            student.research_topic || null,
            student.status || 'ongoing',
            student.display_order !== undefined ? student.display_order : i
          ]);
        }
      }
    });

    res.json(formatSuccessResponse(null, 'Research guidance updated successfully'));
  } catch (error) {
    console.error('Update research guidance error:', error);
    res.status(400).json(formatErrorResponse(error, 400));
  }
});

module.exports = router;
