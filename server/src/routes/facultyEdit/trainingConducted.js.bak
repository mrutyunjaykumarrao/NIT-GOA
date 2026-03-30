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
 * FACULTY TRAINING CONDUCTED EDIT API
 * Handles training/conferences/courses conducted editing
 */

// GET /api/faculty-edit/:employeeCode/training-conducted - Preload training conducted data
router.get('/:employeeCode/training-conducted', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;

    const training = await executeQuery(`
      SELECT 
        training_conducted_id,
        month,
        year,
        training_information,
        display_order
      FROM faculty_training_conducted 
      WHERE employee_code = ? 
      ORDER BY display_order ASC
    `, [employeeCode]);

    res.json(formatSuccessResponse(training));
  } catch (error) {
    console.error('Get training conducted error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

// PUT /api/faculty-edit/:employeeCode/training-conducted - Update training conducted
router.put('/:employeeCode/training-conducted', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { training } = req.body;

    if (!Array.isArray(training)) {
      return res.status(400).json(formatErrorResponse('Training must be an array', 400));
    }

    await withTransaction(async (connection) => {
      // Get existing training IDs
      const [existingRecords] = await connection.execute(
        'SELECT training_conducted_id FROM faculty_training_conducted WHERE employee_code = ?',
        [employeeCode]
      );
      const existingIds = existingRecords.map(r => r.training_conducted_id);
      const submittedIds = training.filter(t => t.training_conducted_id).map(t => t.training_conducted_id);
      
      // Delete records that were removed
      const idsToDelete = existingIds.filter(id => !submittedIds.includes(id));
      if (idsToDelete.length > 0) {
        await connection.execute(
          `DELETE FROM faculty_training_conducted WHERE training_conducted_id IN (${idsToDelete.map(() => '?').join(',')})`,
          idsToDelete
        );
      }

      // Update or insert training records
      for (let i = 0; i < training.length; i++) {
        const item = training[i];
        
        // Validate required fields
        validateRequired(item.training_information, 'Training information');
        if (item.year) validateYear(item.year);

        if (item.training_conducted_id) {
          // Update existing record
          await connection.execute(`
            UPDATE faculty_training_conducted 
            SET month = ?,
                year = ?,
                training_information = ?,
                display_order = ?
            WHERE training_conducted_id = ? AND employee_code = ?
          `, [
            item.month || null,
            item.year || null,
            item.training_information,
            item.display_order !== undefined ? item.display_order : i,
            item.training_conducted_id,
            employeeCode
          ]);
        } else {
          // Insert new record
          await connection.execute(`
            INSERT INTO faculty_training_conducted 
            (employee_code, month, year, training_information, display_order)
            VALUES (?, ?, ?, ?, ?)
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

    res.json(formatSuccessResponse(null, 'Training conducted updated successfully'));
  } catch (error) {
    console.error('Update training conducted error:', error);
    res.status(400).json(formatErrorResponse(error, 400));
  }
});

module.exports = router;
