#!/usr/bin/env node

/**
 * Fix Script: Move Administrative Staff images to correct folder
 * 
 * Issue: All staff images were uploaded to staff/technical/
 * Fix: Move administrative staff to staff/administrative/
 */

require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') });
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const BUCKET_NAME = 'nitgoa-images';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function main() {
  console.log('\n' + '='.repeat(60));
  log('🔧 Fixing Staff Image Folders', 'cyan');
  console.log('='.repeat(60) + '\n');
  
  // Get all administrative staff with wrong paths
  const result = await pool.query(`
    SELECT sp.employee_code, sp.image_url, e.role
    FROM staff_profiles sp
    JOIN employees e ON e.employee_code = sp.employee_code
    WHERE sp.image_url LIKE '%staff/technical%'
      AND e.role = 'Administrative'
    ORDER BY sp.employee_code
  `);
  
  log(`Found ${result.rows.length} administrative staff in wrong folder\n`, 'yellow');
  
  let fixed = 0, failed = 0;
  
  for (const row of result.rows) {
    const oldUrl = row.image_url;
    const oldPath = oldUrl.split('/nitgoa-images/')[1];
    const filename = oldPath.split('/').pop();
    const newPath = `staff/administrative/${filename}`;
    const newUrl = oldUrl.replace('staff/technical/', 'staff/administrative/');
    
    log(`📁 ${row.employee_code}: ${filename}`, 'cyan');
    log(`   From: ${oldPath}`, 'gray');
    log(`   To:   ${newPath}`, 'gray');
    
    try {
      // Download the file from current location
      const { data: fileData, error: downloadError } = await supabase.storage
        .from(BUCKET_NAME)
        .download(oldPath);
      
      if (downloadError) throw downloadError;
      
      // Upload to new location
      const fileBuffer = await fileData.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(newPath, fileBuffer, {
          contentType: 'image/jpeg',
          cacheControl: '31536000',
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      // Delete from old location
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([oldPath]);
      
      if (deleteError) throw deleteError;
      
      // Update database
      await pool.query(
        'UPDATE staff_profiles SET image_url = $1 WHERE employee_code = $2',
        [newUrl, row.employee_code]
      );
      
      log(`   ✅ Moved successfully\n`, 'green');
      fixed++;
      
    } catch (error) {
      log(`   ❌ Error: ${error.message}\n`, 'red');
      failed++;
    }
  }
  
  console.log('='.repeat(60));
  log(`\n✅ Fixed: ${fixed}`, 'green');
  if (failed > 0) log(`❌ Failed: ${failed}`, 'red');
  console.log('='.repeat(60) + '\n');
  
  await pool.end();
}

main().catch(err => {
  console.error('\n❌ FATAL ERROR:', err);
  pool.end();
  process.exit(1);
});
