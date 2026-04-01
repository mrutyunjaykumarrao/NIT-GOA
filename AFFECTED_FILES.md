# Affected Files - Supabase Storage Migration

**Purpose:** Complete inventory of every file that touches image upload, storage, retrieval, or URL rendering.  
**Last Updated:** 2026-03-31  
**Migration Status:** Phase 0 - Documentation Complete

---

## Priority Classification

- 🔴 **CRITICAL** - Core image handling logic, must be updated in Phase 3
- 🟡 **HIGH** - Admin/faculty workflows, must be tested thoroughly
- 🟢 **MEDIUM** - Display logic, likely no changes needed but verify
- 🔵 **LOW** - Tangential, verify behavior but minimal risk

---

## Summary Statistics

| Priority | Count | Total Estimated Changes |
|----------|-------|-------------------------|
| 🔴 CRITICAL | 4 files | ~630 lines (3 new files + 1 rewrite) |
| 🟡 HIGH | 6 files | ~170 lines modified |
| 🟢 MEDIUM | 11 files | ~30 lines (mostly verification) |
| 🔵 LOW | 6 files | ~5 lines (comments/docs) |
| **TOTAL** | **27 files** | **~835 lines changed** |

---

## Backend Files (Server) - 11 Files

### 🔴 CRITICAL - Core Image Handling (2 files)

#### 1. `server/src/middleware/fileUpload.js` (119 lines)
**Priority:** 🔴 CRITICAL | **Changes:** Complete rewrite (~95 lines)

**Current:** Multer disk storage + file system operations  
**Changes:**
- Switch to memory storage (req.file.buffer)
- Replace moveImageToPublic() with uploadImageToSupabase()
- Replace moveImageToDeleted() with archiveImageInSupabase()
- Remove all fs operations

---

#### 2. `server/src/utils/storageHelper.js` (NEW FILE)
**Priority:** 🔴 CRITICAL | **Changes:** New file (~150 lines)

**Functions:**
- uploadToSupabase(buffer, path, contentType)
- moveInSupabase(fromPath, toPath)
- deleteFromSupabase(filePath)
- getPublicUrl(filePath)
- extractPathFromUrl(url)

---

### 🟡 HIGH - Admin & Faculty Routes (2 files)

#### 3. `server/src/routes/admin.js` (1831 lines)
**Priority:** 🟡 HIGH | **Changes:** ~100 lines modified, 1 route removed

**Key Changes:**
- Lines 164-258: Approval workflow → use Supabase moveInSupabase()
- Lines 260-308: Rejection workflow → use Supabase deleteFromSupabase()
- Remove GET /temp-image/:filename route
- Update pending approvals to return new_image_path

---

#### 4. `server/src/routes/facultyEdit/profile.js` (289 lines)
**Priority:** 🟡 HIGH | **Changes:** ~50 lines modified

**Key Changes:**
- Lines 200-231: Admin direct upload → uploadImageToSupabase()
- Lines 233-280: Faculty pending → upload to pending/ folder immediately

---

### 🟢 MEDIUM - Other Routes (4 files, verify only)

#### 5-8. Routes with possible image_url references
- `auth.js` (959 lines) - Profile queries
- `analytics.js` - May aggregate faculty data
- `facultyEdit/courses.js` - May JOIN on profiles
- `facultyEdit/research.js` - May JOIN on profiles

**Priority:** 🟢 MEDIUM | **Changes:** 0 lines (verify only)

---

### 🔵 LOW - Configuration (3 files)

#### 9. `server/server.js`
**Priority:** 🔵 LOW | **Changes:** 0 lines (add comment)  
**Keep:** `app.use('/images', ...)` middleware for UI assets

#### 10. `server/.env`
**Priority:** 🔵 LOW | **Changes:** 0 lines (verify only)  
**Has:** SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

#### 11. `server/package.json`
**Priority:** �� LOW | **Changes:** 1 line  
**Add:** "@supabase/supabase-js": "^2.39.0"

---

## Frontend Files (Client) - 12 Files

### 🟢 MEDIUM - Image Display Components (3 files)

#### 12. `client/src/components/common/ProfileImage/ProfileImage.js` (174 lines)
**Priority:** 🟢 MEDIUM | **Changes:** 0 lines ✅

**No changes needed!** Already handles absolute URLs (lines 66-67).  
Supabase URLs work transparently.

---

#### 13. `client/src/components/ProfileDropdown/ProfileDropdown.js`
**Priority:** 🟢 MEDIUM | **Changes:** 0 lines (verify only)

---

#### 14. `client/src/components/FacultyEditForm/PersonalInformationSection.js`
**Priority:** 🟢 MEDIUM | **Changes:** 0 lines (verify only)  
**Local preview:** Uses URL.createObjectURL() - no change needed

---

### 🟡 HIGH - Admin Panel Components (2 files)

#### 15. `client/src/Views/Admin/components/PendingApprovalsTab/PendingApprovalsTab.js`
**Priority:** 🟡 HIGH | **Changes:** 1-2 lines

**Change:** Line 295  
**Before:** `src={/api/admin/temp-image/${...}}`  
**After:** `src={selectedApproval.new_image_path}`

---

#### 16. `client/src/Views/Admin/components/AdminModals/PendingApprovalsModal.js`
**Priority:** 🟡 HIGH | **Changes:** 0-2 lines (verify carefully)

---

### 🟢 MEDIUM - Other Admin Modals (2 files, verify only)

#### 17-18. Staff Modals
- AdministrativeStaffModal.js
- TechnicalStaffModal.js

**Priority:** 🟢 MEDIUM | **Changes:** 0 lines (verify only)

---

### 🟢 MEDIUM - Public Facing Pages (3 files, verify only)

#### 19-21. Public Pages
- FacultyEdit.js - Form submission
- TrainingPlacement.js - Director image
- Hostels.js - Facility images (OUT OF SCOPE - stay local)

**Priority:** 🟢 MEDIUM | **Changes:** 0 lines

---

### 🔵 LOW - Other UI Components (2 files, not listed - verify if needed)

---

## Database & Schema Files - 1 File

### 🟡 HIGH - Database Schema

#### 22. `database/schemas/supabase_database_schema.sql`
**Priority:** 🟡 HIGH | **Changes:** 0-5 lines (optional)

**Optional:** Rename columns for clarity
- temp_file_path → new_image_path
- current_value → old_image_path

**Verify:** No CHECK constraints on image_url format

---

## Testing & Migration Scripts - 3 Files

### 🟡 HIGH - Test Suite

#### 23. `test_apis.js` (469 lines)
**Priority:** 🟡 HIGH | **Changes:** 10-20 lines

**Update assertions:**
```javascript
// Before: image_url matches /^images\//
// After: image_url matches /^https:\/\/.*supabase.*/ or IS NULL
```

---

### 🔴 CRITICAL - Migration Scripts (2 NEW FILES)

#### 24. `scripts/test-storage-connection.js` (NEW)
**Priority:** 🔴 CRITICAL | **Changes:** New file (~100 lines)

**Purpose:** Verify Supabase Storage connectivity before migration

---

#### 25. `scripts/migrate-images-to-supabase.js` (NEW)
**Priority:** 🔴 CRITICAL | **Changes:** New file (~300 lines)

**Purpose:** One-time migration of 121 profile images

---

## Documentation Files - 2 Files

### 🟢 MEDIUM - Project Docs

#### 26. `README.md`
**Priority:** 🟢 MEDIUM | **Changes:** 20-30 lines

**Add:** Supabase Storage setup section

---

#### 27. `STORAGE_MIGRATION_PLAN.md` (THIS DOCUMENT'S SIBLING)
**Priority:** 🔵 LOW | **Changes:** Status updates only

---

## Phase 3 Implementation Order

**Execute in this sequence to minimize risk:**

1. ✅ Create storageHelper.js
2. ✅ Update package.json + npm install
3. ✅ Test storageHelper independently
4. ✅ Update fileUpload.js
5. ✅ Update facultyEdit/profile.js
6. ✅ Update admin.js approval routes
7. ✅ Remove temp-image route
8. ✅ Update PendingApprovalsTab.js frontend
9. ✅ Test approval workflow end-to-end
10. ✅ Verify other routes
11. ✅ Update test_apis.js
12. ✅ Run full test suite
13. ✅ Update README.md

---

## Files NOT Affected (Out of Scope)

**UI Assets (remain local):**
- `client/public/images/Home/` - Logos, banners
- `client/public/images/Hostels/` - Facility images
- `client/public/images/[other folders]/` - Static assets (~55 files)

**Reason:** Only profile images migrate. UI assets served via Express static.

---

## Risk Flags ⚠️

**High Risk:**
1. fileUpload.js complete rewrite
2. Admin approval workflow complexity
3. Pending approvals frontend display

**Testing Priorities:**
1. Upload → approve → display (end-to-end)
2. Edge cases: concurrent requests, errors
3. Supabase API error handling

**Rollback Triggers:**
- Consistent 500 errors
- Images not displaying
- Approval workflow broken
- Data corruption

---

**Document Version:** 1.0  
**Created:** 2026-03-31  
**Status:** Phase 0 Complete  
**Next Phase:** Phase 1 - Supabase Storage Setup
