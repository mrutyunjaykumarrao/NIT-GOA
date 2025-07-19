const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const { uploadImage, deleteImage } = require('../controllers/uploadController');

// Image upload route (admin only)
router.post('/image', authenticateToken, requireAdmin, upload.single('image'), handleUploadError, uploadImage);

// Image delete route (admin only)
router.delete('/image', authenticateToken, requireAdmin, deleteImage);

module.exports = router;
