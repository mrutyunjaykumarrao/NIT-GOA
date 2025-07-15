const express = require('express');
const router = express.Router();

// GET /api/content/hero-images
router.get('/hero-images', (req, res) => {
  // TODO: Get hero images
  res.json({ message: 'Get hero images - To be implemented' });
});

// POST /api/content/hero-images
router.post('/hero-images', (req, res) => {
  // TODO: Add hero image
  res.json({ message: 'Add hero image - To be implemented' });
});

// GET /api/content/notices
router.get('/notices', (req, res) => {
  // TODO: Get notices
  res.json({ message: 'Get notices - To be implemented' });
});

// POST /api/content/notices
router.post('/notices', (req, res) => {
  // TODO: Add notice
  res.json({ message: 'Add notice - To be implemented' });
});

module.exports = router;
