#!/usr/bin/env node

/**
 * Supabase Storage Connection Test
 * 
 * Purpose: Verify Supabase Storage connectivity before migration
 * Tests: Upload, retrieve URL, public access, and delete operations
 * Exit: Code 0 on success, 1 on failure
 */

require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'nitgoa-images';
const TEST_FOLDER = 'test';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function info(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function warn(message) {
  log(`⚠️  ${message}`, 'yellow');
}

async function testHttpAccess(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.resume(); // Consume response to free up memory
    }).on('error', reject);
  });
}

async function main() {
  console.log('\n' + '='.repeat(60));
  log('🧪 Supabase Storage Connection Test', 'cyan');
  console.log('='.repeat(60) + '\n');

  // Step 1: Verify environment variables
  info('Step 1/6: Verifying environment variables...');
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    error('Missing required environment variables!');
    error('Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  success(`SUPABASE_URL: ${SUPABASE_URL}`);
  success(`SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...`);

  // Step 2: Initialize Supabase client
  info('\nStep 2/6: Initializing Supabase client...');
  let supabase;
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    success('Supabase client initialized');
  } catch (err) {
    error(`Failed to initialize client: ${err.message}`);
    process.exit(1);
  }

  // Step 3: Check if bucket exists
  info('\nStep 3/6: Checking for bucket "nitgoa-images"...');
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      error(`Failed to list buckets: ${listError.message}`);
      warn('This might be a permissions issue with the SERVICE_ROLE_KEY');
      process.exit(1);
    }

    const bucketExists = buckets.some(b => b.name === BUCKET_NAME);
    
    if (!bucketExists) {
      warn(`Bucket "${BUCKET_NAME}" does not exist!`);
      info('Creating bucket now...');
      
      const { data: newBucket, error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      });

      if (createError) {
        error(`Failed to create bucket: ${createError.message}`);
        info('Please create the bucket manually via Supabase Dashboard:');
        info('  1. Go to Storage section');
        info(`  2. Create bucket "${BUCKET_NAME}"`);
        info('  3. Set as Public bucket');
        info('  4. Re-run this test');
        process.exit(1);
      }

      success(`Bucket "${BUCKET_NAME}" created successfully`);
    } else {
      success(`Bucket "${BUCKET_NAME}" exists`);
      
      // Get bucket details
      const bucket = buckets.find(b => b.name === BUCKET_NAME);
      info(`  - Public: ${bucket.public ? 'Yes' : 'No'}`);
      info(`  - Created: ${new Date(bucket.created_at).toLocaleDateString()}`);
    }
  } catch (err) {
    error(`Bucket check failed: ${err.message}`);
    process.exit(1);
  }

  // Step 4: Create and upload test image
  info('\nStep 4/6: Uploading test image...');
  
  // Create a simple test image (1x1 pixel PNG - smallest valid image)
  const testImageBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  
  const timestamp = Date.now();
  const testFileName = `test-image-${timestamp}.png`;
  const testFilePath = `${TEST_FOLDER}/${testFileName}`;

  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(testFilePath, testImageBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      error(`Upload failed: ${uploadError.message}`);
      if (uploadError.message.includes('already exists')) {
        warn('File already exists - this is OK for testing');
      } else {
        process.exit(1);
      }
    } else {
      success(`Uploaded: ${testFilePath}`);
      info(`  - File size: ${testImageBuffer.length} bytes`);
    }
  } catch (err) {
    error(`Upload error: ${err.message}`);
    process.exit(1);
  }

  // Step 5: Retrieve and verify public URL
  info('\nStep 5/6: Retrieving and testing public URL...');
  try {
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(testFilePath);

    if (!urlData || !urlData.publicUrl) {
      error('Failed to get public URL');
      process.exit(1);
    }

    const publicUrl = urlData.publicUrl;
    success(`Public URL generated:`);
    log(`  ${publicUrl}`, 'gray');

    // Test HTTP access
    info('  Testing HTTP access...');
    try {
      await testHttpAccess(publicUrl);
      success('  ✓ Public URL is accessible (HTTP 200)');
    } catch (httpErr) {
      error(`  ✗ Public URL not accessible: ${httpErr.message}`);
      warn('  Bucket might not be set to public!');
      info('  Fix: Go to Storage → nitgoa-images → Settings → Make Public');
      process.exit(1);
    }
  } catch (err) {
    error(`Public URL test failed: ${err.message}`);
    process.exit(1);
  }

  // Step 6: Clean up - delete test file
  info('\nStep 6/6: Cleaning up test file...');
  try {
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([testFilePath]);

    if (deleteError) {
      warn(`Failed to delete test file: ${deleteError.message}`);
      info(`Manual cleanup: Delete ${testFilePath} from Supabase dashboard`);
    } else {
      success('Test file deleted successfully');
    }
  } catch (err) {
    warn(`Cleanup error: ${err.message}`);
  }

  // Final summary
  console.log('\n' + '='.repeat(60));
  log('🎉 All Tests Passed!', 'green');
  console.log('='.repeat(60));
  
  success('Supabase Storage is ready for migration');
  info('\nNext steps:');
  info('  1. Verify folder structure (will be created on first upload)');
  info('  2. Run migration script: node scripts/migrate-images-to-supabase.js');
  info('  3. Proceed with Phase 2');
  
  console.log('');
  process.exit(0);
}

// Run test
main().catch(err => {
  console.error('\n');
  error('FATAL ERROR:');
  console.error(err);
  console.error('');
  process.exit(1);
});
