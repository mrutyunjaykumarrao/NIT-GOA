const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin-only middleware
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role.toLowerCase() !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Faculty middleware - allows faculty to access their own data
// Faculty or Admin middleware  
const requireFacultyOrAdmin = (req, res, next) => {
  if (!req.user || !['admin', 'faculty'].includes(req.user.role.toLowerCase())) {
    return res.status(403).json({ error: 'Faculty or Admin access required' });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireFacultyOrAdmin
};
