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
 * FACULTY MEMBERSHIPS EDIT API
 * Handles professional memberships editing
 */

// GET /api/faculty-edit/:employeeCode/memberships - Preload memberships data
router.get('/:employeeCode/memberships', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;

    const memberships = await executeQuery(`
      SELECT 
        membership_id,
        organization_name,
        membership_type,
        is_active
      FROM faculty_professional_memberships 
      WHERE employee_code = ? 
      ORDER BY created_at DESC
    `, [employeeCode]);

    res.json(formatSuccessResponse(memberships));
  } catch (error) {
    console.error('Get memberships error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

// PUT /api/faculty-edit/:employeeCode/memberships - Update memberships
router.put('/:employeeCode/memberships', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { memberships } = req.body;

    if (!Array.isArray(memberships)) {
      return res.status(400).json(formatErrorResponse('Memberships must be an array', 400));
    }

    await withTransaction(async (connection) => {
      // Get existing membership IDs
      const [existingRecords] = await connection.execute(
        'SELECT membership_id FROM faculty_professional_memberships WHERE employee_code = ?',
        [employeeCode]
      );
      const existingIds = existingRecords.map(r => r.membership_id);
      const submittedIds = memberships.filter(m => m.membership_id).map(m => m.membership_id);
      
      // Delete records that were removed
      const idsToDelete = existingIds.filter(id => !submittedIds.includes(id));
      if (idsToDelete.length > 0) {
        await connection.execute(
          `DELETE FROM faculty_professional_memberships WHERE membership_id IN (${idsToDelete.map(() => '?').join(',')})`,
          idsToDelete
        );
      }

      // Update or insert memberships
      for (let i = 0; i < memberships.length; i++) {
        const membership = memberships[i];
        
        // Validate required fields
        validateRequired(membership.organization_name, 'Organization name');

        // Convert status to is_active (1 for Active, 0 for Inactive)
        const isActive = membership.status === 'Active' || membership.is_active === 1 ? 1 : 0;

        if (membership.membership_id) {
          // Update existing record
          await connection.execute(`
            UPDATE faculty_professional_memberships 
            SET organization_name = ?,
                membership_type = ?,
                is_active = ?
            WHERE membership_id = ? AND employee_code = ?
          `, [
            membership.organization_name,
            membership.membership_type || null,
            isActive,
            membership.membership_id,
            employeeCode
          ]);
        } else {
          // Insert new record
          await connection.execute(`
            INSERT INTO faculty_professional_memberships 
            (employee_code, organization_name, membership_type, is_active)
            VALUES (?, ?, ?, ?)
          `, [
            employeeCode,
            membership.organization_name,
            membership.membership_type || null,
            isActive
          ]);
        }
      }
    });

    res.json(formatSuccessResponse(null, 'Memberships updated successfully'));
  } catch (error) {
    console.error('Update memberships error:', error);
    res.status(400).json(formatErrorResponse(error, 400));
  }
});

module.exports = router;
