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

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Faculty middleware - allows faculty to access their own data
const requireFacultyOrAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }
  
  if (req.user.role === 'faculty') {
    // Faculty can only access their own data
    return next();
  }
  
  return res.status(403).json({ error: 'Faculty or admin access required' });
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireFacultyOrAdmin
};
