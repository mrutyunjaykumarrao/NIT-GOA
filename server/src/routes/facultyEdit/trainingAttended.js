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
 * FACULTY TRAINING ATTENDED EDIT API
 * Handles training/conferences/courses attended editing
 */

// GET /api/faculty-edit/:employeeCode/training-attended - Preload training attended data
router.get('/:employeeCode/training-attended', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;

    const training = await executeQuery(`
      SELECT 
        training_attended_id,
        month,
        year,
        training_information,
        display_order
      FROM faculty_training_attended 
      WHERE employee_code = $1 
      ORDER BY display_order ASC
    `, [employeeCode]);

    res.json(formatSuccessResponse(training));
  } catch (error) {
    console.error('Get training attended error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

// PUT /api/faculty-edit/:employeeCode/training-attended - Update training attended
router.put('/:employeeCode/training-attended', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { training } = req.body;

    if (!Array.isArray(training)) {
      return res.status(400).json(formatErrorResponse('Training must be an array', 400));
    }

    await withTransaction(async (connection) => {
      // Get existing training IDs
      const existingRecords = await connection.query(
        'SELECT training_attended_id FROM faculty_training_attended WHERE employee_code = $1',
        [employeeCode]
      );
      const existingIds = existingRecords.rows.map(r => r.training_attended_id);
      const submittedIds = training.filter(t => t.training_attended_id).map(t => t.training_attended_id);
      
      // Delete records that were removed
      const idsToDelete = existingIds.filter(id => !submittedIds.includes(id));
      if (idsToDelete.length > 0) {
        await connection.query(
          `DELETE FROM faculty_training_attended WHERE training_attended_id IN (${idsToDelete.map((_, idx) => `$${idx + 1}`).join(',')})`,
          idsToDelete
        );
      }

      // Update or insert training records
      for (let i = 0; i < training.length; i++) {
        const item = training[i];
        
        // Validate required fields
        validateRequired(item.training_information, 'Training information');
        if (item.year) validateYear(item.year);

        if (item.training_attended_id) {
          // Update existing record
          await connection.query(`
            UPDATE faculty_training_attended 
            SET month = $1,
                year = $2,
                training_information = $3,
                display_order = $4
            WHERE training_attended_id = $5 AND employee_code = $6
          `, [
            item.month || null,
            item.year || null,
            item.training_information,
            item.display_order !== undefined ? item.display_order : i,
            item.training_attended_id,
            employeeCode
          ]);
        } else {
          // Insert new record
          await connection.query(`
            INSERT INTO faculty_training_attended 
            (employee_code, month, year, training_information, display_order)
            VALUES ($1, $2, $3, $4, $5)
          `, [
            employeeCode,
            item.month || null,
            item.year || null,
            item.training_information,
            item.display_order !== undefined ? item.display_order : i
          ]);
        }
      }
    });

    res.json(formatSuccessResponse(null, 'Training attended updated successfully'));
  } catch (error) {
    console.error('Update training attended error:', error);
    res.status(400).json(formatErrorResponse(error, 400));
  }
});

module.exports = router;
