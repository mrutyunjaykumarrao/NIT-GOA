const multer = require('multer');
const path = require('path');
const { uploadToSupabase, archiveImageInSupabase } = require('../utils/storageHelper');

// Configure multer for memory storage (no disk writes)
const storage = multer.memoryStorage();

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

/**
 * Upload image directly to Supabase Storage (for admin uploads)
 * @param {Buffer} fileBuffer - File data from multer (req.file.buffer)
 * @param {string} nameSlugOrCode - Filename slug or employee code
 * @param {string} role - 'Faculty', 'Technical', or 'Administrative'
 * @param {string} departmentCode - Department code for faculty (optional)
 * @param {string} originalFilename - Original filename for extension
 * @returns {Promise<string>} - Full Supabase public URL
 */
const uploadImageToSupabase = async (fileBuffer, nameSlugOrCode, role, departmentCode = null, originalFilename = '') => {
  const roleFolder = role === 'Faculty' ? 'faculty' : 'staff';
  const staffSubFolder = role === 'Technical' ? 'technical' : 'administrative';
  
  const cleanName = nameSlugOrCode.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  const extension = path.extname(originalFilename) || '.jpg';
  const filename = `${cleanName}${extension}`;
  
  let destinationPath;
  if (role === 'Faculty' && departmentCode) {
    destinationPath = `${roleFolder}/${departmentCode}/${filename}`;
  } else {
    destinationPath = `${roleFolder}/${staffSubFolder}/${filename}`;
  }
  
  const publicUrl = await uploadToSupabase(fileBuffer, destinationPath);
  return publicUrl;
};

/**
 * Upload image to pending folder in Supabase (for faculty self-uploads awaiting approval)
 * @param {Buffer} fileBuffer - File data from multer
 * @param {string} originalFilename - Original filename for extension
 * @returns {Promise<string>} - Full Supabase public URL in pending folder
 */
const uploadToPending = async (fileBuffer, originalFilename = '') => {
  const timestamp = Date.now();
  const extension = path.extname(originalFilename) || '.jpg';
  const filename = `pending_${timestamp}${extension}`;
  const destinationPath = `pending/${filename}`;
  
  const publicUrl = await uploadToSupabase(fileBuffer, destinationPath);
  return publicUrl;
};

module.exports = {
  upload,
  uploadImageToSupabase,
  uploadToPending,
  archiveImageInSupabase
};
