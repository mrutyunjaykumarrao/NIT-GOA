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
 * FACULTY PUBLICATIONS EDIT API
 * Handles publications editing
 */

// GET /api/faculty-edit/:employeeCode/publications - Preload publications
router.get('/:employeeCode/publications', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;

    const publications = await executeQuery(`
      SELECT 
        publication_id,
        title,
        publication_year,
        publication_month,
        publication_type,
        display_order
      FROM faculty_publications 
      WHERE employee_code = $1 
      ORDER BY publication_year DESC, display_order ASC, title ASC
    `, [employeeCode]);

    res.json(formatSuccessResponse(publications));
  } catch (error) {
    console.error('Get publications error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

// PUT /api/faculty-edit/:employeeCode/publications - Update publications
router.put('/:employeeCode/publications', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { publications } = req.body;

    if (!Array.isArray(publications)) {
      return res.status(400).json(formatErrorResponse('Publications must be an array', 400));
    }

    await withTransaction(async (connection) => {
      // Get existing publication IDs
      const existingRecords = await connection.query(
        'SELECT publication_id FROM faculty_publications WHERE employee_code = $1',
        [employeeCode]
      );
      const existingIds = existingRecords.rows.map(r => r.publication_id);
      const submittedIds = publications.filter(p => p.publication_id).map(p => p.publication_id);
      
      // Delete records that were removed
      const idsToDelete = existingIds.filter(id => !submittedIds.includes(id));
      if (idsToDelete.length > 0) {
        await connection.query(
          `DELETE FROM faculty_publications WHERE publication_id IN (${idsToDelete.map((_, idx) => `$${idx + 1}`).join(',')})`,
          idsToDelete
        );
      }

      // Update or insert publications
      for (let i = 0; i < publications.length; i++) {
        const pub = publications[i];
        
        // Validate required fields
        validateRequired(pub.title, 'Publication title');
        if (pub.publication_year) validateYear(pub.publication_year);

        if (pub.publication_id) {
          // Update existing record
          await connection.query(`
            UPDATE faculty_publications 
            SET title = $1,
                publication_year = $2,
                publication_month = $3,
                publication_type = $4,
                display_order = $5
            WHERE publication_id = $6 AND employee_code = $7
          `, [
            pub.title,
            pub.publication_year || null,
            pub.publication_month || null,
            pub.publication_type || 'journal',
            pub.display_order !== undefined ? pub.display_order : i,
            pub.publication_id,
            employeeCode
          ]);
        } else {
          // Insert new record
          await connection.query(`
            INSERT INTO faculty_publications 
            (employee_code, title, publication_year, publication_month, publication_type, display_order)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [
            employeeCode,
            pub.title,
            pub.publication_year || null,
            pub.publication_month || null,
            pub.publication_type || 'journal',
            pub.display_order !== undefined ? pub.display_order : i
          ]);
        }
      }
    });

    res.json(formatSuccessResponse(null, 'Publications updated successfully'));
  } catch (error) {
    console.error('Update publications error:', error);
    res.status(400).json(formatErrorResponse(error, 400));
  }
});

module.exports = router;
