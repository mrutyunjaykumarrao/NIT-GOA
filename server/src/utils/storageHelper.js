/**
 * Supabase Storage Helper
 * 
 * Provides utility functions for interacting with Supabase Storage
 * Used for all image upload, move, and delete operations
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'nitgoa-images';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in environment variables!');
  console.error('   Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Upload file buffer to Supabase Storage
 * @param {Buffer} fileBuffer - File data as buffer
 * @param {string} destinationPath - Full path in bucket (e.g., "faculty/CSE/name.jpg")
 * @param {string} contentType - MIME type (e.g., "image/jpeg")
 * @returns {Promise<string>} - Public URL of uploaded file
 */
async function uploadToSupabase(fileBuffer, destinationPath, contentType = 'image/jpeg') {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(destinationPath, fileBuffer, {
        contentType,
        cacheControl: '31536000', // 1 year
        upsert: true // Overwrite if exists
      });

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(destinationPath);

    if (!urlData || !urlData.publicUrl) {
      throw new Error('Failed to generate public URL');
    }

    return urlData.publicUrl;

  } catch (error) {
    console.error('Upload to Supabase error:', error);
    throw error;
  }
}

/**
 * Move file within Supabase Storage (copy + delete)
 * @param {string} fromPath - Source path in bucket
 * @param {string} toPath - Destination path in bucket
 * @returns {Promise<string>} - New public URL
 */
async function moveInSupabase(fromPath, toPath) {
  try {
    // Download file from current location
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(BUCKET_NAME)
      .download(fromPath);

    if (downloadError) {
      throw new Error(`Download failed: ${downloadError.message}`);
    }

    // Upload to new location
    const fileBuffer = await fileData.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(toPath, fileBuffer, {
        contentType: fileData.type || 'image/jpeg',
        cacheControl: '31536000',
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Upload to new location failed: ${uploadError.message}`);
    }

    // Delete from old location
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fromPath]);

    if (deleteError) {
      console.warn(`Warning: Failed to delete old file at ${fromPath}:`, deleteError.message);
      // Don't throw - file was copied successfully
    }

    // Get new public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(toPath);

    return urlData.publicUrl;

  } catch (error) {
    console.error('Move in Supabase error:', error);
    throw error;
  }
}

/**
 * Delete file from Supabase Storage
 * @param {string} filePath - Path to file in bucket
 * @returns {Promise<void>}
 */
async function deleteFromSupabase(filePath) {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }

  } catch (error) {
    console.error('Delete from Supabase error:', error);
    throw error;
  }
}

/**
 * Get public URL for a file path
 * @param {string} filePath - Path in bucket
 * @returns {string} - Full public URL
 */
function getPublicUrl(filePath) {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Extract file path from Supabase URL
 * @param {string} url - Full Supabase URL
 * @returns {string|null} - File path within bucket, or null if not a Supabase URL
 */
function extractPathFromUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Pattern: https://.../storage/v1/object/public/nitgoa-images/path/to/file.jpg
  const match = url.match(/\/storage\/v1\/object\/public\/nitgoa-images\/(.+)$/);
  return match ? match[1] : null;
}

/**
 * Archive an image by moving it to the deleted folder
 * @param {string} imageUrl - Current Supabase URL of the image
 * @returns {Promise<string|null>} - URL in deleted folder, or null if URL invalid
 */
async function archiveImageInSupabase(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith('https://')) {
    return null; // Not a Supabase URL, skip
  }

  try {
    const filePath = extractPathFromUrl(imageUrl);
    if (!filePath) {
      console.warn('Could not extract path from URL:', imageUrl);
      return null;
    }

    const filename = filePath.split('/').pop();
    const timestamp = Date.now();
    const deletedPath = `deleted/${timestamp}_${filename}`;

    const newUrl = await moveInSupabase(filePath, deletedPath);
    return newUrl;

  } catch (error) {
    console.error('Archive image error:', error);
    // Don't throw - archiving is not critical
    return null;
  }
}

module.exports = {
  uploadToSupabase,
  moveInSupabase,
  deleteFromSupabase,
  getPublicUrl,
  extractPathFromUrl,
  archiveImageInSupabase,
  BUCKET_NAME
};
