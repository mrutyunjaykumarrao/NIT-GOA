const express = require('express');
const router = express.Router();

// POST /api/upload/image
router.post('/image', (req, res) => {
  // TODO: Implement image upload
  res.json({ message: 'Image upload - To be implemented' });
});

// POST /api/upload/document
router.post('/document', (req, res) => {
  // TODO: Implement document upload
  res.json({ message: 'Document upload - To be implemented' });
});

// DELETE /api/upload/:fileId
router.delete('/:fileId', (req, res) => {
  // TODO: Implement file deletion
  res.json({ message: `Delete file ${req.params.fileId} - To be implemented` });
});

module.exports = router;
