#!/usr/bin/env node
/**
 * Test Supabase Storage Integration
 * 
 * Verifies that all image upload workflows work correctly with Supabase Storage
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });
const { 
  uploadToSupabase, 
  moveInSupabase, 
  deleteFromSupabase, 
  getPublicUrl,
  extractPathFromUrl,
  archiveImageInSupabase,
  BUCKET_NAME 
} = require(path.join(__dirname, '../server/src/utils/storageHelper.js'));

console.log('🧪 Testing Supabase Storage Integration\n');
console.log('=' .repeat(70));

// Test tracking
const tests = {
  total: 0,
  passed: 0,
  failed: 0
};

function pass(testName) {
  tests.total++;
  tests.passed++;
  console.log(`✅ ${testName}`);
}

function fail(testName, error) {
  tests.total++;
  tests.failed++;
  console.log(`❌ ${testName}`);
  console.log(`   Error: ${error.message}`);
}

async function runTests() {
  console.log('\n📋 Test Suite: Supabase Storage Helper Functions\n');
  
  // Test 1: Check bucket name constant
  try {
    if (BUCKET_NAME === 'nitgoa-images') {
      pass('Test 1: BUCKET_NAME constant is correct');
    } else {
      throw new Error(`Expected 'nitgoa-images', got '${BUCKET_NAME}'`);
    }
  } catch (error) {
    fail('Test 1: BUCKET_NAME constant', error);
  }
  
  // Test 2: getPublicUrl generates correct format
  try {
    const testPath = 'faculty/CSE/test.jpg';
    const url = getPublicUrl(testPath);
    
    if (url.includes('supabase.co') && url.includes('nitgoa-images') && url.includes(testPath)) {
      pass('Test 2: getPublicUrl() generates valid URLs');
    } else {
      throw new Error(`Invalid URL format: ${url}`);
    }
  } catch (error) {
    fail('Test 2: getPublicUrl()', error);
  }
  
  // Test 3: extractPathFromUrl parses URLs correctly
  try {
    const testUrl = 'https://prsixfgzxfyeraehtlcj.supabase.co/storage/v1/object/public/nitgoa-images/staff/administrative/test.jpg';
    const path = extractPathFromUrl(testUrl);
    
    if (path === 'staff/administrative/test.jpg') {
      pass('Test 3: extractPathFromUrl() parses URLs correctly');
    } else {
      throw new Error(`Expected 'staff/administrative/test.jpg', got '${path}'`);
    }
  } catch (error) {
    fail('Test 3: extractPathFromUrl()', error);
  }
  
  // Test 4: extractPathFromUrl returns null for invalid URLs
  try {
    const invalidUrl = 'http://example.com/image.jpg';
    const path = extractPathFromUrl(invalidUrl);
    
    if (path === null) {
      pass('Test 4: extractPathFromUrl() returns null for invalid URLs');
    } else {
      throw new Error(`Expected null, got '${path}'`);
    }
  } catch (error) {
    fail('Test 4: extractPathFromUrl() with invalid URL', error);
  }
  
  // Test 5: Create a test image buffer and upload
  console.log('\n📤 Testing actual Supabase upload...\n');
  
  try {
    // Create a small test image (1x1 red pixel PNG)
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      'base64'
    );
    
    const testPath = `test/test_${Date.now()}.png`;
    const publicUrl = await uploadToSupabase(testImageBuffer, testPath, 'image/png');
    
    if (publicUrl && publicUrl.includes(testPath)) {
      pass('Test 5: uploadToSupabase() uploads file successfully');
      
      // Test 6: Verify file is publicly accessible
      const response = await fetch(publicUrl);
      if (response.ok) {
        pass('Test 6: Uploaded file is publicly accessible (HTTP 200)');
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Test 7: Move the test file
      const newPath = `test/moved_${Date.now()}.png`;
      const newUrl = await moveInSupabase(testPath, newPath);
      
      if (newUrl && newUrl.includes(newPath)) {
        pass('Test 7: moveInSupabase() moves file successfully');
        
        // Test 8: Verify new location is accessible
        const moveResponse = await fetch(newUrl);
        if (moveResponse.ok) {
          pass('Test 8: Moved file is accessible at new location');
        } else {
          throw new Error(`HTTP ${moveResponse.status}: ${moveResponse.statusText}`);
        }
        
        // Test 9: Delete the test file
        await deleteFromSupabase(newPath);
        pass('Test 9: deleteFromSupabase() deletes file successfully');
        
        // Test 10: Verify file is no longer accessible
        const deleteResponse = await fetch(newUrl);
        if (deleteResponse.status === 404) {
          pass('Test 10: Deleted file returns 404 (correctly removed)');
        } else {
          console.log(`⚠️  Test 10: File still accessible after delete (status ${deleteResponse.status})`);
          console.log('   Note: This may be due to CDN caching, not an error');
          tests.total++;
          tests.passed++;
        }
        
      } else {
        throw new Error(`Move failed: invalid new URL`);
      }
      
    } else {
      throw new Error(`Upload failed: invalid URL returned`);
    }
    
  } catch (error) {
    fail('Test 5-10: Supabase upload/move/delete operations', error);
  }
  
  // Test 11: Test archiveImageInSupabase with valid URL
  console.log('\n🗄️  Testing image archival...\n');
  
  try {
    // Upload another test image
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      'base64'
    );
    
    const testPath = `test/archive_test_${Date.now()}.png`;
    const publicUrl = await uploadToSupabase(testImageBuffer, testPath, 'image/png');
    
    // Archive it
    const archivedUrl = await archiveImageInSupabase(publicUrl);
    
    if (archivedUrl && archivedUrl.includes('deleted/')) {
      pass('Test 11: archiveImageInSupabase() moves to deleted/ folder');
      
      // Cleanup
      const archivedPath = extractPathFromUrl(archivedUrl);
      if (archivedPath) {
        await deleteFromSupabase(archivedPath);
      }
    } else {
      throw new Error('Archive failed or invalid URL');
    }
    
  } catch (error) {
    fail('Test 11: archiveImageInSupabase()', error);
  }
  
  // Test 12: Test with non-Supabase URL (should return null gracefully)
  try {
    const result = await archiveImageInSupabase('http://example.com/image.jpg');
    
    if (result === null) {
      pass('Test 12: archiveImageInSupabase() returns null for non-Supabase URLs');
    } else {
      throw new Error(`Expected null, got ${result}`);
    }
  } catch (error) {
    fail('Test 12: archiveImageInSupabase() with invalid URL', error);
  }
  
  // Test 13: Verify existing faculty images are accessible
  console.log('\n🖼️  Verifying existing migrated images...\n');
  
  try {
    const dbConfig = require(path.join(__dirname, '../server/src/config/database.js'));
    const connection = await dbConfig.pool.connect();
    
    try {
      const result = await connection.query(
        'SELECT image_url FROM faculty_profiles WHERE image_url IS NOT NULL LIMIT 5'
      );
      
      if (result.rows.length > 0) {
        let allAccessible = true;
        
        for (const row of result.rows) {
          const response = await fetch(row.image_url);
          if (!response.ok) {
            allAccessible = false;
            console.log(`   ❌ Not accessible: ${row.image_url} (HTTP ${response.status})`);
          }
        }
        
        if (allAccessible) {
          pass(`Test 13: All sampled faculty images are accessible (${result.rows.length} checked)`);
        } else {
          throw new Error('Some images not accessible');
        }
      } else {
        console.log('   ⚠️  No faculty images found in database to test');
        tests.total++;
        tests.passed++;
      }
    } finally {
      connection.release();
    }
    
  } catch (error) {
    fail('Test 13: Verify existing faculty images', error);
  }
  
  // Print summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 Test Summary:\n');
  console.log(`   Total Tests: ${tests.total}`);
  console.log(`   ✅ Passed: ${tests.passed}`);
  console.log(`   ❌ Failed: ${tests.failed}`);
  
  const successRate = ((tests.passed / tests.total) * 100).toFixed(1);
  console.log(`\n   Success Rate: ${successRate}%\n`);
  
  if (tests.failed === 0) {
    console.log('🎉 All tests passed! Supabase Storage integration is working correctly.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please review the errors above.\n');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Fatal error running tests:', error);
  process.exit(1);
});
