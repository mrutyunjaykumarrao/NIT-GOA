# Supabase Storage Migration Plan
**Project:** NIT Goa Website - Image Storage Migration  
**From:** Local File System (Express static + client/public/)  
**To:** Supabase Storage (nitgoa-images bucket)  
**Target:** 121 profile images (faculty + staff)  
**Out of Scope:** ~55 UI assets (logos, banners) remain local  

---

## Executive Summary

**Migration Strategy:** Phased hybrid approach
- Profile images (faculty/staff) → Supabase Storage
- UI assets (logos, banners, static images) → Remain in client/public/
- Database URLs → Switch from relative paths to full Supabase HTTPS URLs
- Zero frontend changes required (URLs are consumed directly from DB)

**Risk Level:** Medium
- **Critical Path:** Image approval workflow must work identically
- **Data Risk:** Low (no deletion until manual verification)
- **Rollback:** Simple (revert DB URLs, keep Express static middleware)

---

## Phase 0: Document Creation ✅

**Status:** COMPLETE

### Deliverables
- [x] STORAGE_MIGRATION_PLAN.md (this document)
- [x] AFFECTED_FILES.md (comprehensive file inventory)

### Pre-Flight Checklist
- [x] Supabase credentials verified in .env
- [x] Image inventory complete: 121 profile images
- [x] Current URL format documented: relative paths (e.g., `images/Faculty/CSE/name.jpg`)
- [x] Approval workflow logic understood
- [x] Frontend image rendering analyzed (ProfileImage.js handles both formats)

---

## Phase 1: Supabase Storage Setup

**Goal:** Create bucket, verify connectivity, establish folder structure

### 1.1 Bucket Creation
```bash
# Via Supabase Dashboard or CLI:
Bucket Name: nitgoa-images
Access: Public (read), Authenticated (write via SERVICE_ROLE_KEY)
File Size Limit: 5MB per file (reasonable for profile images)
Allowed MIME Types: image/jpeg, image/jpg, image/png, image/webp
```

### 1.2 Folder Structure
```
nitgoa-images/                        ← Single PUBLIC bucket
├── faculty/                          ← 74 faculty profile images
│   ├── CSE/veena_thenkanidiyoor.jpg
│   ├── ECE/john_doe.jpg
│   └── [other departments]/
├── staff/                            ← 47 staff profile images
│   ├── administrative/mike_smith.jpg
│   └── technical/sara_jones.jpg
├── pending/                          ← Temp storage awaiting admin approval
│   └── {timestamp}_{unique_id}_{filename}
└── deleted/                          ← Archived/replaced images
    └── {timestamp}_{original_path}
```

**Note:** Folders are virtual in Supabase Storage — they're part of the file path, not actual directories.

### 1.3 Access Policies
**Bucket Policy (via Supabase Dashboard → Storage → Policies):**

**Public Read Policy:**
```sql
-- Policy Name: Public Read Access
-- Target roles: public
-- Allowed operations: SELECT
-- USING expression:
true
```

**Authenticated Write Policy:**
```sql
-- Policy Name: Backend Service Write
-- Target roles: authenticated
-- Allowed operations: INSERT, UPDATE, DELETE
-- USING expression (for SELECT):
auth.role() = 'authenticated'
-- WITH CHECK expression (for INSERT/UPDATE):
auth.role() = 'authenticated'
```

**Backend Authentication:**
- All backend operations use `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS)
- Never expose service key to frontend
- Frontend only reads public URLs (no auth needed for GET)

### 1.4 Connectivity Test

**Create:** `scripts/test-storage-connection.js`

**Test Objectives:**
1. Verify Supabase Storage SDK can connect using SERVICE_ROLE_KEY
2. Upload a small test image to `nitgoa-images/test/`
3. Retrieve public URL and log it
4. Download the image via public URL to confirm accessibility
5. Delete the test file cleanly
6. Handle errors gracefully with detailed logging

**Expected Output:**
```
✅ Connected to Supabase Storage
✅ Test image uploaded: nitgoa-images/test/test-image.jpg
✅ Public URL: https://prsixfgzxfyeraehtlcj.supabase.co/storage/v1/object/public/nitgoa-images/test/test-image.jpg
✅ Public URL accessible (HTTP 200)
✅ Test file deleted successfully
🎉 Supabase Storage connection verified!
```

**Exit Criteria:**
- Test script runs successfully 3 consecutive times
- Public URLs are accessible from browser without auth
- No errors in Supabase logs

**Definition of Done:**
- Bucket exists and is publicly readable
- Service role can upload/delete files
- Public URLs return images (not 403/404)
- Test script is committed to repo

---

## Phase 2: One-Time Image Migration

**Goal:** Migrate 121 existing profile images from local to Supabase Storage

### 2.1 Migration Script

**Create:** `scripts/migrate-images-to-supabase.js`

**Script Logic:**
```javascript
// Pseudocode
1. Query faculty_profiles and staff_profiles for all image_url values
2. Filter: Only process rows where image_url does NOT start with "https://"
3. For each row:
   a. Resolve local file path: client/public/{image_url}
   b. Check if file exists locally
   c. Determine destination folder: faculty/ or staff/
   d. Upload to Supabase Storage with original folder structure
   e. Get public Supabase URL
   f. Update DB row with new URL
   g. Log: employee_code, old_url, new_url, status
4. Continue on errors (don't abort)
5. Print summary: total/succeeded/failed
```

**Destination Path Mapping:**
```javascript
// Local: images/Faculty/CSE/veena.jpg
// Supabase: faculty/CSE/veena.jpg

// Local: images/Administrative Staff/mike.jpg  
// Supabase: staff/administrative/mike.jpg

// Local: images/Technical Staff/sara.jpg
// Supabase: staff/technical/sara.jpg
```

**Idempotency:**
- Check if `image_url.startsWith('https://')` before processing
- Skip rows already migrated
- Safe to re-run if interrupted

**Error Handling:**
```javascript
try {
  // Upload + Update DB
} catch (error) {
  console.error(`❌ Failed: ${employeeCode} - ${error.message}`);
  failedMigrations.push({ employeeCode, old_url, error: error.message });
  continue; // Don't abort entire migration
}
```

**Output Log Format:**
```
🚀 Starting migration...
📊 Found 121 images to migrate (74 faculty + 47 staff)

✅ FAC001: images/Faculty/CSE/veena.jpg → https://...
✅ FAC002: images/Faculty/ECE/john.jpg → https://...
⚠️  FAC003: Local file not found - skipping
✅ STAFF001: images/Administrative Staff/mike.jpg → https://...

📋 Migration Summary:
   Total: 121
   Succeeded: 118
   Failed: 3
   Already Migrated: 0

❌ Failed Migrations:
   FAC003: File not found locally
   FAC045: Upload error - network timeout
   STAFF012: Invalid file format
```

**Database Backup:**
```bash
# Before running migration:
pg_dump $DATABASE_URL --table=faculty_profiles --data-only > backup_faculty_profiles.sql
pg_dump $DATABASE_URL --table=staff_profiles --data-only > backup_staff_profiles.sql
```

**Rollback Plan:**
```bash
# If migration fails catastrophically:
psql $DATABASE_URL < backup_faculty_profiles.sql
psql $DATABASE_URL < backup_staff_profiles.sql
```

### 2.2 Migration Execution

**Pre-Migration Checklist:**
- [ ] Phase 1 test script passed
- [ ] Database backups created
- [ ] All 121 local image files exist and are accessible
- [ ] Supabase Storage bucket is empty (or only has test files)
- [ ] `.env` has correct `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

**Run Migration:**
```bash
cd /Users/mrutyunjay/nitgoa
node scripts/migrate-images-to-supabase.js
```

**Post-Migration Verification:**
```bash
# Check DB URLs
psql $DATABASE_URL -c "SELECT employee_code, image_url FROM faculty_profiles WHERE image_url LIKE 'https://%' LIMIT 5;"

# Check Supabase Storage via dashboard
# Navigate to Storage → nitgoa-images → faculty/ and staff/
# Verify file count matches: 74 in faculty/, 47 in staff/

# Test random URLs in browser
# Copy 5-10 URLs from DB and verify they load in browser
```

### 2.3 Manual Verification

**Do NOT proceed to Phase 3 until:**
- [ ] All 121 images appear in Supabase Storage dashboard
- [ ] Random sampling of 20 URLs load correctly in browser
- [ ] Database image_url columns all start with `https://prsixfgzxfyeraehtlcj.supabase.co`
- [ ] No broken images on faculty/staff pages in production (test with frontend)
- [ ] Migration log shows 0 critical errors

**Definition of Done:**
- All profile images in Supabase Storage
- All DB URLs updated to Supabase format
- Frontend displays images correctly (verify manually)
- Migration script committed to repo
- Original local images **NOT deleted yet** (keep until Phase 4 complete)

---

## Phase 3: Code Migration - Replace File System with Supabase SDK

**Goal:** Update all backend code to use Supabase Storage instead of local file system

### 3.1 Install Supabase SDK

```bash
cd server/
npm install @supabase/supabase-js
```

### 3.2 Create Supabase Storage Helper Module

**Create:** `server/src/utils/storageHelper.js`

**Functions to Implement:**

```javascript
// Initialize Supabase client
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const BUCKET_NAME = 'nitgoa-images';

/**
 * Upload file buffer to Supabase Storage
 * @param {Buffer} fileBuffer - File data
 * @param {string} destinationPath - Full path in bucket (e.g., "faculty/CSE/name.jpg")
 * @param {string} contentType - MIME type
 * @returns {Promise<string>} - Public URL
 */
async function uploadToSupabase(fileBuffer, destinationPath, contentType) {
  // Upload logic
  // Return public URL
}

/**
 * Move file within Supabase Storage (copy + delete)
 * @param {string} fromPath - Source path
 * @param {string} toPath - Destination path
 * @returns {Promise<string>} - New public URL
 */
async function moveInSupabase(fromPath, toPath) {
  // Copy file
  // Delete original
  // Return new URL
}

/**
 * Delete file from Supabase Storage
 * @param {string} filePath - Path to delete
 * @returns {Promise<void>}
 */
async function deleteFromSupabase(filePath) {
  // Delete logic
}

/**
 * Get public URL for a file path
 * @param {string} filePath - Path in bucket
 * @returns {string} - Full public URL
 */
function getPublicUrl(filePath) {
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${filePath}`;
}

/**
 * Extract file path from Supabase URL
 * @param {string} url - Full Supabase URL
 * @returns {string} - File path within bucket
 */
function extractPathFromUrl(url) {
  // Parse URL to get path after bucket name
}

module.exports = {
  uploadToSupabase,
  moveInSupabase,
  deleteFromSupabase,
  getPublicUrl,
  extractPathFromUrl,
  BUCKET_NAME
};
```

### 3.3 Update `fileUpload.js`

**File:** `server/src/middleware/fileUpload.js`

**Changes Required:**

| Current Function | New Function | Changes |
|-----------------|-------------|---------|
| `moveImageToPublic()` | `uploadImageToSupabase()` | - Remove `fs.rename()` logic<br>- Read file buffer from multer<br>- Call `uploadToSupabase()`<br>- Return Supabase URL |
| `moveImageToDeleted()` | `archiveImageInSupabase()` | - Extract path from old URL<br>- Call `moveInSupabase(oldPath, 'deleted/{timestamp}_{filename}')`<br>- Return new URL or void |
| `archiveOldImage()` | Integrated into above | - Same as moveImageToDeleted logic |
| Multer disk storage | Multer memory storage | - Change to `storage: multer.memoryStorage()`<br>- Files in `req.file.buffer` instead of disk |

**Before (Current):**
```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/temp'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  }
});

async function moveImageToPublic(tempPath, fullName, role, departmentCode) {
  const filename = path.basename(tempPath);
  const categoryFolder = role === 'Faculty' ? 'Faculty' : 
                        role === 'Administrative Staff' ? 'Administrative Staff' : 
                        'Technical Staff';
  const destDir = path.join(__dirname, '../../../client/public/images', categoryFolder, departmentCode || '');
  await fs.promises.mkdir(destDir, { recursive: true });
  const destPath = path.join(destDir, filename);
  await fs.promises.rename(tempPath, destPath);
  return destPath.replace(/\\/g, '/').split('client/public/')[1];
}
```

**After (New):**
```javascript
const multer = require('multer');
const { uploadToSupabase, moveInSupabase, deleteFromSupabase, getPublicUrl } = require('../utils/storageHelper');

// Change to memory storage
const storage = multer.memoryStorage();

async function uploadImageToSupabase(fileBuffer, originalName, fullName, role, departmentCode) {
  const timestamp = Date.now();
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filename = `${timestamp}_${sanitizedName}`;
  
  // Determine folder
  const categoryFolder = role === 'Faculty' ? 'faculty' : 
                         role === 'Administrative Staff' ? 'staff/administrative' : 
                         'staff/technical';
  
  const deptPath = departmentCode ? `${departmentCode}/` : '';
  const destinationPath = `${categoryFolder}/${deptPath}${filename}`;
  
  // Upload to Supabase
  const publicUrl = await uploadToSupabase(fileBuffer, destinationPath, 'image/jpeg');
  return publicUrl;
}

async function archiveImageInSupabase(oldImageUrl) {
  if (!oldImageUrl || !oldImageUrl.startsWith('https://')) return;
  
  const filePath = extractPathFromUrl(oldImageUrl);
  const filename = path.basename(filePath);
  const deletedPath = `deleted/${Date.now()}_${filename}`;
  
  await moveInSupabase(filePath, deletedPath);
}
```

### 3.4 Update Admin Approval Routes

**File:** `server/src/routes/admin.js`

**Lines 164-258: Approve Pending Request**

**Before:**
```javascript
// Line 218-240 (excerpt)
if (pendingRecord.temp_file_path) {
  const newImageUrl = await moveImageToPublic(
    pendingRecord.temp_file_path,
    employeeFullName,
    employeeRole,
    employeeDepartment
  );
  
  if (pendingRecord.current_value) {
    await moveImageToDeleted(path.join(__dirname, '../../../client/public', pendingRecord.current_value));
  }
  
  await executeQuery(`UPDATE faculty_profiles SET image_url = $1 WHERE employee_code = $2`, [newImageUrl, employeeCode]);
}
```

**After:**
```javascript
// Pending file is already in Supabase pending/ folder (uploaded during faculty edit)
if (pendingRecord.new_image_path) {  // new_image_path = URL in pending/
  const pendingPath = extractPathFromUrl(pendingRecord.new_image_path);
  
  // Determine final destination
  const categoryFolder = employeeRole === 'Faculty' ? 'faculty' : 
                         employeeRole === 'Administrative Staff' ? 'staff/administrative' : 
                         'staff/technical';
  const deptPath = employeeDepartment ? `${employeeDepartment}/` : '';
  const filename = path.basename(pendingPath);
  const finalPath = `${categoryFolder}/${deptPath}${filename}`;
  
  // Move from pending → faculty/staff
  const newImageUrl = await moveInSupabase(pendingPath, finalPath);
  
  // Archive old image
  if (pendingRecord.old_image_path) {
    await archiveImageInSupabase(pendingRecord.old_image_path);
  }
  
  // Update DB
  const tableName = employeeRole === 'Faculty' ? 'faculty_profiles' : 'staff_profiles';
  await executeQuery(`UPDATE ${tableName} SET image_url = $1 WHERE employee_code = $2`, [newImageUrl, employeeCode]);
}
```

**Lines 260-308: Reject Pending Request**

**Before:**
```javascript
// Line 285-295 (excerpt)
if (pendingRecord.temp_file_path && fs.existsSync(pendingRecord.temp_file_path)) {
  await fs.promises.unlink(pendingRecord.temp_file_path);
}
```

**After:**
```javascript
// Delete from pending folder in Supabase
if (pendingRecord.new_image_path) {
  const pendingPath = extractPathFromUrl(pendingRecord.new_image_path);
  await deleteFromSupabase(pendingPath);
}
```

### 3.5 Update Faculty Profile Image Upload

**File:** `server/src/routes/facultyEdit/profile.js`

**Lines 170-285: Profile Image Upload Endpoint**

**Changes for Admin Direct Replace (lines 200-231):**

**Before:**
```javascript
// Line 204-219
if (oldImage) {
  const oldImagePath = path.join(__dirname, '../../../../client/public', oldImage);
  try {
    const deletedDir = path.join(__dirname, '../../../uploads/deleted');
    await fs.promises.mkdir(deletedDir, { recursive: true });
    const deletedPath = path.join(deletedDir, `admin_replace_${Date.now()}_${path.basename(oldImage)}`);
    await fs.promises.rename(oldImagePath, deletedPath);
  } catch (error) {
    console.log('Old image not found or already moved:', oldImage);
  }
}

if (req.file && !isRemoveImage) {
  finalImageUrl = await moveImageToPublic(req.file.path, full_name, role || 'Faculty', department_code);
}
```

**After:**
```javascript
// Archive old image in Supabase
if (oldImage) {
  await archiveImageInSupabase(oldImage); // Handles Supabase URLs only
}

if (req.file && !isRemoveImage) {
  // Upload directly to final location (admin privilege)
  finalImageUrl = await uploadImageToSupabase(
    req.file.buffer, 
    req.file.originalname, 
    full_name, 
    role || 'Faculty', 
    department_code
  );
}
```

**Changes for Faculty Upload to Pending (lines 233-280):**

**Before:**
```javascript
// Line 235-236
const requestedValue = req.file && !isRemoveImage ? req.file.filename : null;
const tempFilePath = req.file && !isRemoveImage ? req.file.path : null;

// Line 252
temp_file_path = $4
```

**After:**
```javascript
// Upload to pending folder immediately
let pendingImageUrl = null;
if (req.file && !isRemoveImage) {
  const timestamp = Date.now();
  const sanitizedName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filename = `${timestamp}_${employeeCode}_${sanitizedName}`;
  const pendingPath = `pending/${filename}`;
  
  pendingImageUrl = await uploadToSupabase(req.file.buffer, pendingPath, req.file.mimetype);
}

// Store Supabase URL in pending_approvals
// ...
new_image_path = $4  // Use pendingImageUrl here
old_image_path = $3  // Use oldImage (already a Supabase URL after Phase 2)
```

### 3.6 Update Pending Approvals Display Route

**File:** `server/src/routes/admin.js` (approximate line 1100-1200)

**Current:** Admin fetches temp files via special route `/api/admin/temp-image/:filename`

**After:** Pending images are already in Supabase with public URLs
- No special route needed
- Frontend directly uses `pending_approvals.new_image_path` URL
- Remove temp-image route entirely

### 3.7 Remove Unused Code

**Files to Clean Up:**
- `server/src/middleware/fileUpload.js`: Remove all `fs` imports and disk operations
- `server/src/routes/admin.js`: Remove temp-image route
- `server/uploads/temp/`: Can be deleted after Phase 4 verification
- `server/uploads/deleted/`: Can be deleted after Phase 4 verification

**Express Static Middleware:**
```javascript
// server/server.js line 77
// KEEP this line — still needed for UI assets (logos, banners, etc.)
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));
```

### 3.8 Testing During Phase 3

**For each file changed:**
1. Save changes
2. Restart server
3. Test affected endpoint with Postman/curl
4. Verify image uploads to correct Supabase folder
5. Verify DB URL is updated correctly
6. Verify old images move to deleted/ folder
7. Check Supabase Storage dashboard to confirm file operations

**Test Cases:**
- [ ] Faculty uploads new profile image → lands in pending/
- [ ] Admin approves → moves to faculty/, old goes to deleted/
- [ ] Admin rejects → deleted from pending/
- [ ] Admin directly replaces image → uploads to faculty/staff/, old goes to deleted/
- [ ] Image removal request → no upload, DB set to NULL
- [ ] Frontend displays all images correctly

---

## Phase 4: Validation & Cleanup

**Goal:** Comprehensive end-to-end testing and cleanup

### 4.1 Automated API Testing

**Run existing test suite:**
```bash
node test_apis.js
```

**Expected:** All 26 endpoints pass (maintain 100% success rate)

### 4.2 Manual Frontend Testing

**Test Checklist:**
- [ ] Faculty page loads all 74 images correctly
- [ ] Administrative Staff page loads all 25 images correctly
- [ ] Technical Staff page loads all 22 images correctly
- [ ] Faculty edit → upload new image → pending approval works
- [ ] Admin dashboard → pending approvals tab shows preview correctly
- [ ] Admin approve → image appears on faculty page immediately
- [ ] Admin reject → image removed, old image still shows
- [ ] Admin direct replace → new image shows, old archived
- [ ] No broken images anywhere (404s, missing avatars)
- [ ] ProfileImage.js fallback avatars work if URL is null

### 4.3 Supabase Storage Audit

**Via Supabase Dashboard:**
- [ ] `faculty/` folder: 74+ files (original + any new uploads during testing)
- [ ] `staff/` folder: 47+ files
- [ ] `pending/` folder: 0-2 files (only active pending requests)
- [ ] `deleted/` folder: 12+ files (original deleted + any replaced during testing)

**Check for orphaned files:**
```bash
# List all files in bucket
# Compare against DB image_url values
# Identify files not referenced in DB (orphans)
```

### 4.4 Database URL Verification

**SQL Audit:**
```sql
-- Check all image URLs are Supabase format
SELECT COUNT(*) FROM faculty_profiles 
WHERE image_url IS NOT NULL AND image_url NOT LIKE 'https://prsixfgzxfyeraehtlcj.supabase.co%';
-- Expected: 0

SELECT COUNT(*) FROM staff_profiles 
WHERE image_url IS NOT NULL AND image_url NOT LIKE 'https://prsixfgzxfyeraehtlcj.supabase.co%';
-- Expected: 0

-- Check pending approvals
SELECT new_image_path, old_image_path FROM pending_approvals WHERE status = 'pending';
-- Verify: All paths are Supabase URLs
```

### 4.5 Performance Testing

**Image Load Times:**
- Sample 20 random image URLs
- Measure time to first byte (TTFB)
- Compare: Local serving vs Supabase CDN
- Expected: Supabase should be comparable or faster (CDN advantage)

**Tools:**
```bash
# Test URL speed
curl -w "@curl-format.txt" -o /dev/null -s https://prsixfgzxfyeraehtlcj.supabase.co/storage/v1/object/public/nitgoa-images/faculty/CSE/veena.jpg

# curl-format.txt:
# time_namelookup: %{time_namelookup}\n
# time_connect: %{time_connect}\n
# time_starttransfer: %{time_starttransfer}\n
# time_total: %{time_total}\n
```

### 4.6 Rollback Test (Dry Run)

**Simulate rollback without actually executing:**

1. Database rollback:
   ```bash
   # Restore from backup (DON'T RUN, just verify backups exist)
   ls -lh backup_faculty_profiles.sql backup_staff_profiles.sql
   ```

2. Code rollback:
   ```bash
   # Revert commits (DON'T RUN, just verify git history)
   git log --oneline | head -5
   ```

3. Supabase Storage:
   ```
   # Files remain in Supabase (no deletion)
   # Can always re-migrate if needed
   ```

### 4.7 Local File Cleanup

**ONLY after all tests pass:**

```bash
# Remove temporary upload folders (now unused)
rm -rf server/uploads/temp/
rm -rf server/uploads/deleted/

# Profile images in client/public/images/Faculty/ and staff folders
# KEEP for now — remove only after 30 days of stable operation
# OR: Move to archive folder outside repo
mkdir -p archive_local_images/
mv client/public/images/Faculty/ archive_local_images/
mv client/public/images/Administrative\ Staff/ archive_local_images/
mv client/public/images/Technical\ Staff/ archive_local_images/
```

### 4.8 Documentation Updates

**Update README.md:**
- [ ] Add Supabase Storage setup instructions
- [ ] Document image upload workflow
- [ ] Update environment variable requirements
- [ ] Add troubleshooting section for image issues

**Create STORAGE_MIGRATION_COMPLETE.md:**
- [ ] Summary of what was migrated
- [ ] Before/after architecture diagrams
- [ ] Migration statistics (files, time, issues)
- [ ] Lessons learned
- [ ] Known issues / future improvements

---

## Risk Analysis & Mitigation

### Risk 1: Migration Script Partial Failure
**Impact:** Some images not migrated, broken links on frontend  
**Probability:** Medium  
**Mitigation:**
- Script continues on errors (doesn't abort)
- Detailed logging of all failures
- Database backups before migration
- Manual verification of failed images
- Re-run script (idempotent design)

### Risk 2: Supabase Storage API Errors During Production Use
**Impact:** Image uploads fail, approval workflow breaks  
**Probability:** Low (Supabase 99.9% uptime)  
**Mitigation:**
- Wrap all Supabase calls in try-catch
- Return user-friendly error messages
- Log errors to monitoring system
- Implement retry logic (3 attempts with exponential backoff)
- Fallback: Temporarily disable image uploads, show notice to users

### Risk 3: Supabase Storage Quota Exceeded
**Impact:** New uploads fail  
**Probability:** Low (Supabase free tier: 1GB, we have ~121 images @ ~100KB each = ~12MB)  
**Mitigation:**
- Monitor storage usage via Supabase dashboard
- Set up alerts at 80% quota
- Implement image compression before upload (resize to max 800x800)
- Clean up deleted/ folder periodically (30-day retention)

### Risk 4: Public URLs Accidentally Revoked
**Impact:** All images break site-wide  
**Probability:** Very Low (requires manual policy change)  
**Mitigation:**
- Document bucket policies clearly
- Restrict access to Supabase dashboard (only admin)
- Regular checks of bucket policy (monthly)
- If occurs: Re-enable public access immediately (5-minute fix)

### Risk 5: Database URL Update Fails Mid-Migration
**Impact:** Some DB rows have old paths, some have new URLs  
**Probability:** Low  
**Mitigation:**
- Database backups before migration
- Transaction-based updates where possible
- Migration script logs exact row updates
- Easy to re-run specific employee codes if needed

### Risk 6: Frontend Breaks Due to URL Format Change
**Impact:** Images don't display  
**Probability:** Very Low (ProfileImage.js already handles absolute URLs)  
**Mitigation:**
- ProfileImage.js already checks for `http://` and `https://` (lines 66-67)
- No code changes needed in frontend
- Verify with test URLs before full migration

### Risk 7: Approval Workflow Race Condition
**Impact:** Admin approves while faculty uploads new version  
**Probability:** Very Low (rare edge case)  
**Mitigation:**
- Same as current system (no change in race condition risk)
- pending_approvals table has timestamp - latest wins
- If issue occurs: Admin can manually reconcile

---

## Rollback Strategy

### Scenario A: Phase 1 Fails (Bucket Setup)
**Action:** Nothing to rollback — no code or data changed  
**Time:** 0 minutes

### Scenario B: Phase 2 Fails (Migration Script)
**Action:**
```bash
# Restore database from backup
psql $DATABASE_URL < backup_faculty_profiles.sql
psql $DATABASE_URL < backup_staff_profiles.sql

# Delete any partially migrated files in Supabase (via dashboard or script)
```
**Time:** 5-10 minutes  
**Impact:** None — system still using local files

### Scenario C: Phase 3 Deployed, Issues Found
**Action:**
```bash
# 1. Revert code changes
git revert <commit_hash>  # Revert storage helper commits
git push origin main

# 2. Restart server
pm2 restart nitgoa-backend

# 3. Database URLs remain Supabase format (frontend still works)
# 4. New uploads will fail until code is fixed
# Temporary workaround: Disable image uploads in frontend
```
**Time:** 10-15 minutes  
**Impact:** Medium — existing images work, new uploads disabled temporarily

### Scenario D: Complete Rollback to Local Storage
**Action:**
```bash
# 1. Restore database
psql $DATABASE_URL < backup_faculty_profiles.sql
psql $DATABASE_URL < backup_staff_profiles.sql

# 2. Restore code
git checkout <pre-migration-commit>
git push -f origin main

# 3. Restore local image files (if deleted)
mv archive_local_images/* client/public/images/

# 4. Restart server
pm2 restart nitgoa-backend
```
**Time:** 20-30 minutes  
**Impact:** High — system fully reverted, no new data captured during migration period

---

## Definition of "Done" - Per Phase

### Phase 0: ✅
- [x] STORAGE_MIGRATION_PLAN.md created
- [x] AFFECTED_FILES.md created
- [x] All stakeholders reviewed and approved plan

### Phase 1:
- [ ] Supabase bucket `nitgoa-images` created and public
- [ ] test-storage-connection.js passes 3 consecutive times
- [ ] Public URLs accessible from browser
- [ ] No errors in Supabase logs

### Phase 2:
- [ ] Migration script runs successfully
- [ ] All 121 images uploaded to Supabase Storage
- [ ] All DB image_url columns updated
- [ ] Frontend displays images correctly (manual spot check)
- [ ] Migration log shows 0 critical errors
- [ ] Database backups created and verified

### Phase 3:
- [ ] fileUpload.js refactored to use Supabase SDK
- [ ] Admin approval routes updated
- [ ] Faculty upload routes updated
- [ ] All file system code removed
- [ ] Approval workflow tested end-to-end
- [ ] No `fs` operations remain for image handling

### Phase 4:
- [ ] All API tests pass (26/26 endpoints)
- [ ] Manual frontend testing complete (all checkboxes checked)
- [ ] Supabase Storage audit shows correct file counts
- [ ] Database URL verification passes (0 non-Supabase URLs)
- [ ] Performance testing shows acceptable load times
- [ ] Documentation updated
- [ ] Local file cleanup complete (after 30-day safety period)

---

## Success Metrics

**Immediate (Post-Migration):**
- ✅ 100% of profile images served from Supabase Storage
- ✅ 0 broken image links on frontend
- ✅ Image upload approval workflow identical to before
- ✅ Page load times comparable or better

**Long-Term (30 Days):**
- ✅ 99.9% uptime for image serving
- ✅ 0 image-related bug reports
- ✅ Storage costs within budget (<$5/month)
- ✅ Deleted folder cleanup working (30-day retention)

---

## Timeline Estimate

| Phase | Estimated Time | Dependencies |
|-------|---------------|--------------|
| Phase 0 | 1 hour | None |
| Phase 1 | 2 hours | Supabase account access |
| Phase 2 | 3 hours | Phase 1 complete |
| Phase 3 | 8 hours | Phase 2 verified |
| Phase 4 | 4 hours | Phase 3 complete |
| **Total** | **18 hours** | - |

**Note:** These are development hours, not calendar time. Testing and verification adds buffer.

---

## Future Enhancements (Out of Scope)

These are NOT part of this migration but can be added later:

1. **30-Day Auto-Cleanup for Deleted Folder:**
   - Supabase Edge Function runs daily
   - Deletes files in `deleted/` older than 30 days
   - Saves storage costs

2. **Image Compression on Upload:**
   - Resize images to max 800x800 before upload
   - Convert to WebP for better compression
   - Implement using Sharp library

3. **Multiple Image Sizes (Thumbnails):**
   - Generate small/medium/large versions
   - Store in `faculty/thumbnails/` folder
   - Frontend uses smaller version for lists

4. **Image Upload Progress Indicator:**
   - WebSocket or polling for upload status
   - Show % complete to user

5. **CDN Optimization:**
   - Use Supabase CDN caching headers
   - Implement lazy loading in frontend

6. **Admin Image Moderation Tools:**
   - Crop/rotate before approval
   - Reject with reason (store in pending_approvals)

---

## Contact & Support

**Migration Lead:** Claude (AI Assistant)  
**Stakeholder:** Mrutyunjay (Project Owner)  
**Supabase Support:** https://supabase.com/dashboard/support  
**Emergency Rollback Authority:** Project Owner

---

**Document Version:** 1.0  
**Last Updated:** 2026-03-31  
**Status:** Phase 0 Complete, Ready for Phase 1
