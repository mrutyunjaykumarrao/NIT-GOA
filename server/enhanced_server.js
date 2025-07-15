const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// CORS configuration for development and production
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://nitgoa-website.web.app',
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads', 'faculty-images');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'faculty-' + uniqueSuffix + extension);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nitgoa_db',
  port: process.env.DB_PORT || 3306,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create database connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

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

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1 as test');
    res.json({ message: 'Database connection successful', data: rows });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Auth Routes

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const [users] = await pool.execute(
      `SELECT u.*, f.first_name, f.last_name, f.employee_id, f.department_id, d.code as department_code
       FROM users u 
       LEFT JOIN faculty f ON u.id = f.user_id 
       LEFT JOIN departments d ON f.department_id = d.id
       WHERE u.email = ? AND u.status = 'active'`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        employee_id: user.employee_id,
        department_code: user.department_code
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        employee_id: user.employee_id,
        department_code: user.department_code,
        name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Faculty Routes

// Get all faculty (public)
app.get('/api/faculty', async (req, res) => {
  try {
    const { department } = req.query;
    
    let query = `
      SELECT f.id, f.employee_id, f.first_name, f.last_name, f.title, f.designation, 
             f.phone, f.office_location, f.specialization, f.research_interests, 
             f.profile_image_url, f.is_hod, f.display_order, f.is_active,
             d.code as department_code, d.name as department_name,
             f.linkedin_url, f.google_scholar_url, f.orcid_url, f.researchgate_url
      FROM faculty f
      JOIN departments d ON f.department_id = d.id
      WHERE f.is_active = 1
    `;
    
    const params = [];
    
    if (department) {
      query += ' AND d.code = ?';
      params.push(department);
    }
    
    query += ' ORDER BY d.name, f.display_order, f.first_name';
    
    const [faculty] = await pool.execute(query, params);
    res.json(faculty);
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single faculty by ID (public)
app.get('/api/faculty/:id', async (req, res) => {
  try {
    const [faculty] = await pool.execute(
      `SELECT f.*, d.code as department_code, d.name as department_name
       FROM faculty f
       JOIN departments d ON f.department_id = d.id
       WHERE f.id = ? AND f.is_active = 1`,
      [req.params.id]
    );
    
    if (faculty.length === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    // Get publications
    const [publications] = await pool.execute(
      'SELECT * FROM faculty_publications WHERE faculty_id = ? ORDER BY publication_year DESC',
      [req.params.id]
    );
    
    // Get awards
    const [awards] = await pool.execute(
      'SELECT * FROM faculty_awards WHERE faculty_id = ? ORDER BY award_year DESC',
      [req.params.id]
    );
    
    // Get custom sections with items
    const [sections] = await pool.execute(
      `SELECT cs.*, 
       JSON_ARRAYAGG(
         JSON_OBJECT('id', csi.id, 'title', csi.item_title, 'content', csi.item_content, 'url', csi.item_url, 'display_order', csi.display_order)
       ) as items
       FROM faculty_custom_sections cs
       LEFT JOIN faculty_custom_section_items csi ON cs.id = csi.section_id
       WHERE cs.faculty_id = ? AND cs.is_active = 1
       GROUP BY cs.id
       ORDER BY cs.display_order`,
      [req.params.id]
    );
    
    const facultyData = {
      ...faculty[0],
      publications,
      awards,
      custom_sections: sections
    };
    
    res.json(facultyData);
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Departments Routes

// Get all departments (public)
app.get('/api/departments', async (req, res) => {
  try {
    const [departments] = await pool.execute(
      `SELECT d.*, f.first_name as hod_first_name, f.last_name as hod_last_name,
              f.title as hod_title, f.profile_image_url as hod_image
       FROM departments d
       LEFT JOIN faculty f ON d.head_of_department = f.id
       ORDER BY d.name`
    );
    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Content Routes

// Get published content (public)
app.get('/api/content', async (req, res) => {
  try {
    const { type, limit = 10 } = req.query;
    
    let query = `
      SELECT c.*, u.email as author_email
      FROM content c
      LEFT JOIN users u ON c.author_id = u.id
      WHERE c.is_published = 1 
      AND (c.publish_date IS NULL OR c.publish_date <= NOW())
      AND (c.expire_date IS NULL OR c.expire_date > NOW())
    `;
    
    const params = [];
    
    if (type) {
      query += ' AND c.type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY c.display_order ASC, c.publish_date DESC LIMIT ?';
    params.push(parseInt(limit));
    
    const [content] = await pool.execute(query, params);
    res.json(content);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Settings Routes

// Get public settings
app.get('/api/settings', async (req, res) => {
  try {
    const [settings] = await pool.execute(
      'SELECT setting_key, setting_value, setting_type FROM settings WHERE is_public = 1'
    );
    
    const settingsObject = settings.reduce((acc, setting) => {
      let value = setting.setting_value;
      
      // Convert based on type
      if (setting.setting_type === 'number') {
        value = parseInt(value);
      } else if (setting.setting_type === 'boolean') {
        value = value === 'true';
      } else if (setting.setting_type === 'json') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = setting.setting_value;
        }
      }
      
      acc[setting.setting_key] = value;
      return acc;
    }, {});
    
    res.json(settingsObject);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected Admin Routes

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT u.id, u.email, u.role, u.status, u.created_at, u.email_verified,
              f.first_name, f.last_name, f.employee_id
       FROM users u
       LEFT JOIN faculty f ON u.id = f.user_id
       ORDER BY u.created_at DESC`
    );
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new faculty (admin only)
app.post('/api/admin/faculty', authenticateToken, requireAdmin, upload.single('profile_image'), async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const {
      email, password, employee_id, department_id,
      first_name, last_name, title, designation,
      phone, office_location, qualification, specialization,
      research_interests, experience_years, joining_date, bio
    } = req.body;
    
    // Create user account
    const hashedPassword = await bcrypt.hash(password, 12);
    const [userResult] = await connection.execute(
      'INSERT INTO users (email, password_hash, role, status, email_verified) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, 'faculty', 'active', true]
    );
    
    const userId = userResult.insertId;
    
    // Handle profile image
    let profileImageUrl = null;
    if (req.file) {
      profileImageUrl = `/uploads/faculty-images/${req.file.filename}`;
    }
    
    // Create faculty profile
    await connection.execute(
      `INSERT INTO faculty (
        user_id, employee_id, department_id, first_name, last_name, title, designation,
        phone, office_location, qualification, specialization, research_interests,
        experience_years, joining_date, bio, profile_image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, employee_id, department_id, first_name, last_name, title, designation,
       phone, office_location, qualification, specialization, research_interests,
       experience_years, joining_date, bio, profileImageUrl]
    );
    
    await connection.commit();
    res.json({ message: 'Faculty created successfully', user_id: userId });
    
  } catch (error) {
    await connection.rollback();
    console.error('Create faculty error:', error);
    res.status(500).json({ error: 'Failed to create faculty' });
  } finally {
    connection.release();
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NIT Goa Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
});

module.exports = app;
