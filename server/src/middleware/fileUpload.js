const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

// Ensure upload directories exist
const ensureDir = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // Create temporary upload directory for pending approvals
    const tempDir = path.join(__dirname, '../../uploads/temp');
    await ensureDir(tempDir);
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file at a time
  }
});

// Helper function to move approved images to public directory
const moveImageToPublic = async (tempPath, employeeCode, role) => {
  const publicDir = path.join(__dirname, '../../uploads/public/images');
  const roleDir = role === 'Faculty' ? 'Faculty' : 'Technical Staff';
  const finalDir = path.join(publicDir, roleDir);
  
  await ensureDir(finalDir);
  
  const filename = `${employeeCode}${path.extname(tempPath)}`;
  const finalPath = path.join(finalDir, filename);
  
  // Move file from temp to public
  await fs.rename(tempPath, finalPath);
  
  // Return the public URL
  return `/uploads/public/images/${roleDir}/${filename}`;
};

// Helper function to move rejected images to deleted directory
const moveImageToDeleted = async (tempPath) => {
  const deletedDir = path.join(__dirname, '../../uploads/deleted');
  await ensureDir(deletedDir);
  
  const filename = path.basename(tempPath);
  const deletedPath = path.join(deletedDir, filename);
  
  await fs.rename(tempPath, deletedPath);
};

// Helper function to move old images to archive
const archiveOldImage = async (oldImagePath) => {
  if (!oldImagePath) return;
  
  const archiveDir = path.join(__dirname, '../../uploads/archived');
  await ensureDir(archiveDir);
  
  const oldFullPath = path.join(__dirname, '../../uploads/public', oldImagePath);
  const filename = `archived-${Date.now()}-${path.basename(oldImagePath)}`;
  const archivePath = path.join(archiveDir, filename);
  
  try {
    await fs.access(oldFullPath);
    await fs.rename(oldFullPath, archivePath);
  } catch (error) {
    console.log('Old image not found or already moved:', oldImagePath);
  }
};

module.exports = {
  upload,
  moveImageToPublic,
  moveImageToDeleted,
  archiveOldImage,
  ensureDir
};
