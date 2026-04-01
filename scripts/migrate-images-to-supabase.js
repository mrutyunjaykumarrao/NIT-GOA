#!/usr/bin/env node

/**
 * Supabase Storage Migration Script
 * 
 * Purpose: One-time migration of profile images from local storage to Supabase Storage
 * Migrates: Faculty (69) + Staff (42) = 111 profile images
 * Updates: Database image_url columns with new Supabase URLs
 * 
 * Features:
 * - Idempotent (safe to re-run)
 * - Continues on errors (doesn't abort)
 * - Detailed logging
 * - Summary report
 */

require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') });
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
const BUCKET_NAME = 'nitgoa-images';
const DRY_RUN = process.argv.includes('--dry-run');

// Initialize clients
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});
const pool = new Pool({ connectionString: DATABASE_URL });

// Colors
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

// Track migration results
const results = {
  total: 0,
  succeeded: [],
  failed: [],
  skipped: [],
  alreadyMigrated: []
};

/**
 * Determine destination path in Supabase Storage
 */
function getDestinationPath(imageUrl, role) {
  // imageUrl format: "images/Faculty/CSE/name.jpg" or "images/Administrative Staff/name.jpg"
  const parts = imageUrl.split('/');
  
  if (role === 'Faculty') {
    // Faculty: images/Faculty/DEPT/name.jpg → faculty/DEPT/name.jpg
    if (parts.length >= 4) {
      const dept = parts[2]; // CSE, ECE, etc.
      const filename = parts.slice(3).join('/');
      return `faculty/${dept}/${filename}`;
    } else {
      const filename = parts[parts.length - 1];
      return `faculty/${filename}`;
    }
  } else {
    // Staff: images/Administrative Staff/name.jpg → staff/administrative/name.jpg
    //        images/Technical Staff/name.jpg → staff/technical/name.jpg
    const filename = parts[parts.length - 1];
    
    // Parse the path to determine subfolder (more reliable than role column)
    const pathCategory = parts[1]; // "Administrative Staff" or "Technical Staff"
    const subfolder = pathCategory && pathCategory.toLowerCase().includes('administrative') 
      ? 'administrative' 
      : 'technical';
    
    return `staff/${subfolder}/${filename}`;
  }
}

/**
 * Upload single image to Supabase Storage
 */
async function uploadImage(employeeCode, imageUrl, role, tableName) {
  results.total++;
  
  // Check if already migrated (URL starts with https://)
  if (imageUrl.startsWith('https://')) {
    log(`  ⏭️  ${employeeCode}: Already migrated`, 'gray');
    results.alreadyMigrated.push({ employeeCode, url: imageUrl });
    return null;
  }
  
  // Read local file
  const localPath = path.join(__dirname, '../client/public', imageUrl);
  
  if (!fs.existsSync(localPath)) {
    log(`  ⚠️  ${employeeCode}: File not found - ${imageUrl}`, 'yellow');
    results.skipped.push({ employeeCode, reason: 'File not found', path: imageUrl });
    return null;
  }
  
  try {
    const fileBuffer = fs.readFileSync(localPath);
    const destinationPath = getDestinationPath(imageUrl, role);
    
    log(`  📤 ${employeeCode}: ${imageUrl} → ${destinationPath}`, 'cyan');
    
    if (DRY_RUN) {
      log(`     [DRY RUN] Would upload ${fileBuffer.length} bytes`, 'gray');
      results.succeeded.push({ employeeCode, oldUrl: imageUrl, newUrl: '[dry-run]', size: fileBuffer.length });
      return null;
    }
    
    // Upload to Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(destinationPath, fileBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '31536000', // 1 year
        upsert: true // Overwrite if exists (safe for re-runs)
      });
    
    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(destinationPath);
    
    const newUrl = urlData.publicUrl;
    
    // Update database
    await pool.query(
      `UPDATE ${tableName} SET image_url = $1 WHERE employee_code = $2`,
      [newUrl, employeeCode]
    );
    
    log(`  ✅ ${employeeCode}: Uploaded & DB updated`, 'green');
    log(`     ${newUrl}`, 'gray');
    
    results.succeeded.push({
      employeeCode,
      oldUrl: imageUrl,
      newUrl,
      size: fileBuffer.length
    });
    
    return newUrl;
    
  } catch (error) {
    log(`  ❌ ${employeeCode}: ${error.message}`, 'red');
    results.failed.push({
      employeeCode,
      oldUrl: imageUrl,
      error: error.message
    });
    return null;
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('\n' + '='.repeat(70));
  log('🚀 Supabase Storage Migration', 'cyan');
  if (DRY_RUN) {
    log('   [DRY RUN MODE - No changes will be made]', 'yellow');
  }
  console.log('='.repeat(70) + '\n');
  
  // Step 1: Verify Supabase connection
  log('Step 1/4: Verifying Supabase connection...', 'cyan');
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  
  if (bucketError) {
    log(`❌ Cannot connect to Supabase: ${bucketError.message}`, 'red');
    process.exit(1);
  }
  
  const bucket = buckets.find(b => b.name === BUCKET_NAME);
  if (!bucket) {
    log(`❌ Bucket "${BUCKET_NAME}" not found!`, 'red');
    process.exit(1);
  }
  
  log(`✅ Connected to bucket: ${BUCKET_NAME}`, 'green');
  
  // Step 2: Get faculty profiles
  log('\nStep 2/4: Migrating faculty images...', 'cyan');
  const facultyResult = await pool.query(`
    SELECT fp.employee_code, fp.image_url, e.role
    FROM faculty_profiles fp
    JOIN employees e ON e.employee_code = fp.employee_code
    WHERE fp.image_url IS NOT NULL AND fp.image_url != ''
    ORDER BY fp.employee_code
  `);
  
  log(`Found ${facultyResult.rows.length} faculty with images\n`);
  
  for (const row of facultyResult.rows) {
    await uploadImage(row.employee_code, row.image_url, 'Faculty', 'faculty_profiles');
  }
  
  // Step 3: Get staff profiles
  log('\nStep 3/4: Migrating staff images...', 'cyan');
  const staffResult = await pool.query(`
    SELECT sp.employee_code, sp.image_url, e.role
    FROM staff_profiles sp
    JOIN employees e ON e.employee_code = sp.employee_code
    WHERE sp.image_url IS NOT NULL AND sp.image_url != ''
    ORDER BY sp.employee_code
  `);
  
  log(`Found ${staffResult.rows.length} staff with images\n`);
  
  for (const row of staffResult.rows) {
    await uploadImage(row.employee_code, row.image_url, row.role, 'staff_profiles');
  }
  
  // Step 4: Generate report
  log('\nStep 4/4: Generating migration report...', 'cyan');
  
  console.log('\n' + '='.repeat(70));
  log('📊 Migration Summary', 'cyan');
  console.log('='.repeat(70));
  
  console.log(`\n✅ Succeeded: ${results.succeeded.length}`);
  console.log(`⏭️  Already Migrated: ${results.alreadyMigrated.length}`);
  console.log(`⚠️  Skipped: ${results.skipped.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`📊 Total Processed: ${results.total}`);
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed Migrations:');
    results.failed.forEach(item => {
      console.log(`  - ${item.employeeCode}: ${item.error}`);
      console.log(`    ${item.oldUrl}`);
    });
  }
  
  if (results.skipped.length > 0) {
    console.log('\n⚠️  Skipped Items:');
    results.skipped.forEach(item => {
      console.log(`  - ${item.employeeCode}: ${item.reason}`);
    });
  }
  
  // Calculate total size
  const totalSize = results.succeeded.reduce((sum, item) => sum + item.size, 0);
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  
  console.log(`\n📦 Total Size Migrated: ${totalSizeMB} MB`);
  
  // Save detailed log
  const logFile = `database/backups/migration_log_${Date.now()}.json`;
  fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed log saved: ${logFile}`);
  
  console.log('\n' + '='.repeat(70));
  
  if (results.failed.length === 0) {
    log('🎉 Migration Complete - All images migrated successfully!', 'green');
  } else {
    log('⚠️  Migration Complete - Some errors occurred', 'yellow');
    log('   Review failed items above and re-run to retry', 'yellow');
  }
  
  console.log('='.repeat(70) + '\n');
  
  if (DRY_RUN) {
    log('ℹ️  This was a DRY RUN - no changes were made', 'cyan');
    log('   Run without --dry-run to perform actual migration\n', 'cyan');
  }
}

// Run migration
migrate()
  .then(() => {
    pool.end();
    process.exit(results.failed.length > 0 ? 1 : 0);
  })
  .catch(err => {
    console.error('\n❌ FATAL ERROR:', err);
    pool.end();
    process.exit(1);
  });
