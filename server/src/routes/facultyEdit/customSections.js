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
 * FACULTY CUSTOM SECTIONS EDIT API
 * Handles dynamic custom sections editing
 * Sections can have multiple fields and entries
 */

// GET /api/faculty-edit/:employeeCode/custom-sections - Preload all custom sections
router.get('/:employeeCode/custom-sections', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;

    // Get all custom sections for this faculty member
    const sections = await executeQuery(`
      SELECT 
        custom_section_id,
        section_title,
        section_type,
        display_order
      FROM faculty_custom_sections 
      WHERE employee_code = $1 
      ORDER BY display_order ASC
    `, [employeeCode]);

    // For each section, get its fields and entries
    const sectionsWithData = [];
    
    for (const section of sections) {
      // Get fields for this section
      const fields = await executeQuery(`
        SELECT 
          field_id,
          field_name,
          field_type,
          display_order
        FROM faculty_custom_section_fields 
        WHERE custom_section_id = $1 
        ORDER BY display_order ASC
      `, [section.custom_section_id]);

      // Get entries for this section (normalized structure)
      const entryRows = await executeQuery(`
        SELECT 
          entry_id,
          field_id,
          row_number,
          field_value
        FROM faculty_custom_section_entries 
        WHERE custom_section_id = $1 
        ORDER BY row_number ASC
      `, [section.custom_section_id]);

      // Transform normalized data to nested structure
      const entriesMap = {};
      for (const row of entryRows) {
        if (!entriesMap[row.row_number]) {
          entriesMap[row.row_number] = {
            entry_id: row.entry_id,
            cell_data: {},
            display_order: row.row_number
          };
        }
        // Find field name for this field_id
        const field = fields.find(f => f.field_id === row.field_id);
        if (field) {
          entriesMap[row.row_number].cell_data[field.field_name] = row.field_value;
        }
      }
      const parsedEntries = Object.values(entriesMap);

      sectionsWithData.push({
        section_id: section.custom_section_id,
        section_title: section.section_title,
        section_type: section.section_type,
        display_order: section.display_order,
        fields: fields,
        entries: parsedEntries
      });
    }

    res.json(formatSuccessResponse(sectionsWithData));
  } catch (error) {
    console.error('Get custom sections error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

// PUT /api/faculty-edit/:employeeCode/custom-sections - Update all custom sections
router.put('/:employeeCode/custom-sections', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { sections } = req.body;

    if (!Array.isArray(sections)) {
      return res.status(400).json(formatErrorResponse('Sections must be an array', 400));
    }

    await withTransaction(async (connection) => {
      // Delete all existing custom sections (cascade will handle fields and entries)
      await connection.query(
        'DELETE FROM faculty_custom_sections WHERE employee_code = $1',
        [employeeCode]
      );

      // Insert new sections with fields and entries
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        
        // Validate section
        validateRequired(section.section_title, 'Section title');

        // Insert section
        const sectionResult = await connection.query(`
          INSERT INTO faculty_custom_sections 
          (employee_code, section_title, section_type, display_order)
          VALUES ($1, $2, $3, $4)
          RETURNING custom_section_id
        `, [
          employeeCode,
          section.section_title,
          section.section_type || 'table',
          section.display_order || i
        ]);

        const sectionId = sectionResult.rows[0].custom_section_id;

        // Insert fields if any and store field mapping
        const fieldIdMap = {}; // Maps field_name to field_id
        if (section.fields && Array.isArray(section.fields)) {
          for (let j = 0; j < section.fields.length; j++) {
            const field = section.fields[j];
            
            validateRequired(field.field_name, 'Field name');

            const fieldResult = await connection.query(`
              INSERT INTO faculty_custom_section_fields 
              (custom_section_id, field_name, field_type, display_order)
              VALUES ($1, $2, $3, $4)
              RETURNING field_id
            `, [
              sectionId,
              field.field_name,
              field.field_type || 'text',
              field.field_order || j
            ]);
            
            fieldIdMap[field.field_name] = fieldResult.rows[0].field_id;
          }
        }

        // Insert entries if any (normalize the data structure)
        if (section.entries && Array.isArray(section.entries)) {
          for (let k = 0; k < section.entries.length; k++) {
            const entry = section.entries[k];
            const rowNumber = k + 1;
            
            // Insert each field value as a separate row
            if (entry.cell_data && typeof entry.cell_data === 'object') {
              for (const [fieldName, fieldValue] of Object.entries(entry.cell_data)) {
                const fieldId = fieldIdMap[fieldName];
                if (fieldId) {
                  await connection.query(`
                    INSERT INTO faculty_custom_section_entries 
                    (custom_section_id, field_id, row_number, field_value)
                    VALUES ($1, $2, $3, $4)
                  `, [
                    sectionId,
                    fieldId,
                    rowNumber,
                    fieldValue || ''
                  ]);
                }
              }
            }
          }
        }
      }
    });

    res.json(formatSuccessResponse(null, 'Custom sections updated successfully'));
  } catch (error) {
    console.error('Update custom sections error:', error);
    res.status(400).json(formatErrorResponse(error, 400));
  }
});

// POST /api/faculty-edit/:employeeCode/custom-sections - Add single custom section
router.post('/:employeeCode/custom-sections', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { section_title, section_type, fields, entries, display_order } = req.body;

    validateRequired(section_title, 'Section title');

    let sectionId;

    await withTransaction(async (connection) => {
      // Insert section
      const sectionResult = await connection.query(`
        INSERT INTO faculty_custom_sections 
        (employee_code, section_title, section_type, display_order)
        VALUES ($1, $2, $3, $4)
        RETURNING custom_section_id
      `, [
        employeeCode,
        section_title,
        section_type || 'table',
        display_order || 0
      ]);

      sectionId = sectionResult.rows[0].custom_section_id;

      // Insert fields if provided and store field mapping
      const fieldIdMap = {};
      if (fields && Array.isArray(fields)) {
        for (let i = 0; i < fields.length; i++) {
          const field = fields[i];
          validateRequired(field.field_name, 'Field name');

          const fieldResult = await connection.query(`
            INSERT INTO faculty_custom_section_fields 
            (custom_section_id, field_name, field_type, display_order)
            VALUES ($1, $2, $3, $4)
            RETURNING field_id
          `, [
            sectionId,
            field.field_name,
            field.field_type || 'text',
            field.field_order || i
          ]);
          
          fieldIdMap[field.field_name] = fieldResult.rows[0].field_id;
        }
      }

      // Insert entries if provided (normalize the data)
      if (entries && Array.isArray(entries)) {
        for (let j = 0; j < entries.length; j++) {
          const entry = entries[j];
          const rowNumber = j + 1;
          
          // Insert each field value as a separate row
          if (entry.cell_data && typeof entry.cell_data === 'object') {
            for (const [fieldName, fieldValue] of Object.entries(entry.cell_data)) {
              const fieldId = fieldIdMap[fieldName];
              if (fieldId) {
                await connection.query(`
                  INSERT INTO faculty_custom_section_entries 
                  (custom_section_id, field_id, row_number, field_value)
                  VALUES ($1, $2, $3, $4)
                `, [
                  sectionId,
                  fieldId,
                  rowNumber,
                  fieldValue || ''
                ]);
              }
            }
          }
        }
      }
    });

    res.json(formatSuccessResponse({ section_id: sectionId }, 'Custom section added successfully'));
  } catch (error) {
    console.error('Add custom section error:', error);
    res.status(400).json(formatErrorResponse(error, 400));
  }
});

// DELETE /api/faculty-edit/:employeeCode/custom-sections/:sectionId - Delete single section
router.delete('/:employeeCode/custom-sections/:sectionId', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode, sectionId } = req.params;

    // Verify section belongs to this employee
    const section = await executeQuery(`
      SELECT custom_section_id 
      FROM faculty_custom_sections 
      WHERE custom_section_id = $1 AND employee_code = $2
    `, [sectionId, employeeCode]);

    if (section.length === 0) {
      return res.status(404).json(formatErrorResponse('Section not found or does not belong to this faculty', 404));
    }

    // Delete section (cascade will handle fields and entries)
    await executeQuery(
      'DELETE FROM faculty_custom_sections WHERE custom_section_id = $1',
      [sectionId]
    );

    res.json(formatSuccessResponse(null, 'Custom section deleted successfully'));
  } catch (error) {
    console.error('Delete custom section error:', error);
    res.status(400).json(formatErrorResponse(error, 400));
  }
});

module.exports = router;
