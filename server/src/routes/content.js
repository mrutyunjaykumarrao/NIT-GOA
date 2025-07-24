const express = require('express');
const router = express.Router();

// Simple content route for future use
router.get('/', (req, res) => {
  res.json({ message: 'Content API endpoint - Coming soon' });
});

module.exports = router;
