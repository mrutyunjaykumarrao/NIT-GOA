# Database Issues & Proposed Fixes

## Executive Summary

After auditing all 27 tables in the database, I've identified several critical issues:

1. **CRITICAL:** `pending_approvals` table has NULLs in `requested_at` and `status` columns (causes "Invalid Date" in UI)
2. **Data type inconsistencies:** Boolean values stored as INTEGER (0/1) instead of BOOLEAN type
3. **Date handling inconsistencies:** Dates use `timestamp without timezone` but should use `timestamptz` for consistency
4. **Unused tables:** 2 backup tables that can be dropped
5. **Missing constraints:** Some columns lack NOT NULL constraints that should have them
6. **Missing indexes:** Performance could be improved with additional indexes

---

## Issue 1: CRITICAL - pending_approvals NULL values

### Problem
Recent pending_approvals records (IDs 22-27) have:
- `requested_at`: NULL (should be CURRENT_TIMESTAMP)
- `status`: NULL (should default to 'pending')

This causes "Invalid Date" to display in the Request Statuses UI.

### Root Cause
`server/src/routes/facultyEdit/profile.js` lines 265-276:
```sql
INSERT INTO pending_approvals (
  employee_code, approval_type, action_type, current_value, requested_value, temp_file_path, requested_by
) VALUES ($1, 'profile_image', $2, $3, $4, $5, $6)
```

Missing columns: `requested_at`, `status`

### Proposed Fix

**Step 1:** Add default values to table schema
```sql
ALTER TABLE pending_approvals 
  ALTER COLUMN requested_at SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN status SET DEFAULT 'pending';
```

**Step 2:** Fix NULL values in existing rows
```sql
UPDATE pending_approvals 
SET requested_at = CURRENT_TIMESTAMP 
WHERE requested_at IS NULL;

UPDATE pending_approvals 
SET status = 'pending' 
WHERE status IS NULL;
```

**Step 3:** Make columns NOT NULL (after fixing existing NULLs)
```sql
ALTER TABLE pending_approvals 
  ALTER COLUMN requested_at SET NOT NULL,
  ALTER COLUMN status SET NOT NULL;
```

**Step 4:** Update backend code to explicitly set these values (best practice)
```javascript
// In server/src/routes/facultyEdit/profile.js line 265
INSERT INTO pending_approvals (
  employee_code, approval_type, action_type, current_value, requested_value, 
  temp_file_path, requested_by, requested_at, status
) VALUES ($1, 'profile_image', $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, 'pending')
```

**Impact:** ZERO breaking changes. This only adds defaults and fixes NULL values.

**Risk:** LOW. All existing code continues to work.

---

## Issue 2: Boolean Data Type Inconsistencies

### Problem
Many tables use INTEGER (0/1) for boolean values instead of PostgreSQL BOOLEAN type:
- `employees`: `is_active`, `is_public_visible`
- `courses`: `is_active`
- `research_areas`: `is_active`
- `user_accounts`: `is_active`
- `content_updates`: `is_major_update`

### Current Behavior
Backend code sets these as `1` or `0`:
```javascript
is_active: 1  // Should be: true
```

### Proposed Fix Options

**Option A: Keep INTEGER, standardize backend code (RECOMMENDED - safest)**
- No schema changes
- Update all backend code to use 1/0 consistently
- Already done in recent fixes

**Option B: Convert to BOOLEAN (riskier, but more PostgreSQL-native)**
```sql
ALTER TABLE employees 
  ALTER COLUMN is_active TYPE BOOLEAN USING (is_active::integer::boolean),
  ALTER COLUMN is_public_visible TYPE BOOLEAN USING (is_public_visible::integer::boolean);
  
-- Repeat for all tables
```
Then update all backend code to use `true/false` instead of `1/0`.

**Recommendation:** Keep as INTEGER for now. Converting to BOOLEAN requires:
1. Schema migrations on all tables
2. Updating ALL backend INSERT/UPDATE statements
3. Testing every CRUD operation
4. Risk of breaking existing queries

**Decision needed:** Which option do you prefer?

---

## Issue 3: Timestamp Timezone Handling

### Problem
All timestamp columns use `timestamp without time zone`:
- `created_at`, `updated_at`, `requested_at`, `reviewed_at`, etc.

This can cause issues when users are in different timezones.

### Proposed Fix
Convert to `timestamptz` (timestamp with timezone):
```sql
ALTER TABLE employees ALTER COLUMN created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC';
ALTER TABLE employees ALTER COLUMN updated_at TYPE timestamptz USING updated_at AT TIME ZONE 'UTC';
-- Repeat for all timestamp columns across all tables
```

**Impact:** Backend code should use `new Date()` which already includes timezone info.

**Risk:** MEDIUM. Requires testing all date displays in frontend.

**Recommendation:** Do this after other critical fixes, in a separate phase.

**Decision needed:** Should we do this now or defer?

---

## Issue 4: Unused Backup Tables

### Problem
2 backup tables are cluttering the database:
- `research_areas_backup_20251003_180205`
- `research_areas_backup_20251003_180300`

These appear to be from a migration on October 3, 2025.

### Proposed Fix
```sql
DROP TABLE research_areas_backup_20251003_180205;
DROP TABLE research_areas_backup_20251003_180300;
```

**Risk:** LOW if the original migration was successful.

**Decision needed:** Can we safely drop these? Should I verify data first?

---

## Issue 5: Missing NOT NULL Constraints

### Problem
Critical columns that should never be NULL are allowing NULL values:

**pending_approvals:**
- `employee_code` (should be NOT NULL)
- `approval_type` (should be NOT NULL)
- `requested_by` (should be NOT NULL)

**employees:**
- `employee_code` (should be NOT NULL + UNIQUE)
- `full_name` (should be NOT NULL)
- `email` (should be NOT NULL + UNIQUE)

**user_accounts:**
- `username` (should be NOT NULL + UNIQUE)
- `password_hash` (should be NOT NULL)

### Proposed Fix
First, check for any existing NULL values:
```sql
SELECT COUNT(*) FROM pending_approvals WHERE employee_code IS NULL;
SELECT COUNT(*) FROM employees WHERE employee_code IS NULL OR full_name IS NULL OR email IS NULL;
SELECT COUNT(*) FROM user_accounts WHERE username IS NULL OR password_hash IS NULL;
```

If no NULLs exist, add constraints:
```sql
ALTER TABLE pending_approvals 
  ALTER COLUMN employee_code SET NOT NULL,
  ALTER COLUMN approval_type SET NOT NULL,
  ALTER COLUMN requested_by SET NOT NULL;

ALTER TABLE employees
  ALTER COLUMN employee_code SET NOT NULL,
  ALTER COLUMN full_name SET NOT NULL,
  ALTER COLUMN email SET NOT NULL,
  ADD CONSTRAINT employees_employee_code_unique UNIQUE (employee_code),
  ADD CONSTRAINT employees_email_unique UNIQUE (email);

ALTER TABLE user_accounts
  ALTER COLUMN username SET NOT NULL,
  ALTER COLUMN password_hash SET NOT NULL,
  ADD CONSTRAINT user_accounts_username_unique UNIQUE (username);
```

**Impact:** Prevents data integrity issues.

**Risk:** LOW if we verify no NULLs exist first.

**Decision needed:** Should we add these constraints?

---

## Issue 6: Missing Indexes for Performance

### Problem
Common query patterns are not indexed, causing slow queries:

**Frequently queried but not indexed:**
- `pending_approvals.employee_code`
- `pending_approvals.status`
- `faculty_profiles.department_id`
- `staff_profiles.department_id`
- `employees.employee_code` (should be PRIMARY KEY or UNIQUE INDEX)
- `user_accounts.username`

### Proposed Fix
```sql
CREATE INDEX idx_pending_approvals_employee_code ON pending_approvals(employee_code);
CREATE INDEX idx_pending_approvals_status ON pending_approvals(status);
CREATE INDEX idx_faculty_profiles_department_id ON faculty_profiles(department_id);
CREATE INDEX idx_staff_profiles_department_id ON staff_profiles(department_id);
CREATE INDEX idx_employees_employee_code ON employees(employee_code);
CREATE INDEX idx_user_accounts_username ON user_accounts(username);
```

**Impact:** Faster queries, especially for admin dashboard.

**Risk:** ZERO. Indexes don't affect existing functionality.

**Decision needed:** Should we add these indexes?

---

## Recommended Execution Plan

### Phase 1: CRITICAL FIXES (Do Now)
1. Fix `pending_approvals` NULL values and defaults ✅ **MUST DO**
2. Update backend INSERT statement for pending_approvals
3. Verify all recent pending approvals display correctly

**Estimated time:** 10 minutes
**Risk:** LOW
**Breaking changes:** ZERO

### Phase 2: Data Integrity (After Phase 1)
1. Check for NULL values in critical columns
2. Add NOT NULL constraints where appropriate
3. Add UNIQUE constraints for employee_code, email, username

**Estimated time:** 20 minutes
**Risk:** LOW (if we verify no NULLs first)
**Breaking changes:** ZERO (if no NULLs exist)

### Phase 3: Performance (Optional, Later)
1. Add missing indexes
2. Test query performance improvements

**Estimated time:** 10 minutes
**Risk:** ZERO
**Breaking changes:** ZERO

### Phase 4: Type Cleanup (Optional, Deferred)
1. Decide on INTEGER vs BOOLEAN for flags
2. Decide on timestamp vs timestamptz
3. Plan migration if desired

**Estimated time:** Several hours (requires extensive testing)
**Risk:** MEDIUM to HIGH
**Breaking changes:** Possible

---

## Summary of All 27 Tables

### Core Data Tables (11)
1. **employees** - 7 columns, INTEGER booleans, timestamp without TZ
2. **faculty_profiles** - 20+ columns, uses INTEGER for is_hod
3. **staff_profiles** - 10+ columns
4. **user_accounts** - 10+ columns, INTEGER for is_active
5. **departments** - 6 columns
6. **faculty_designations** - 4 columns
7. **courses** - 8 columns, INTEGER for is_active
8. **research_areas** - 5 columns, INTEGER for is_active

### Faculty-Specific Tables (9)
9. **faculty_education** - Education credentials
10. **faculty_publications** - Publications list
11. **faculty_professional_memberships** - Memberships
12. **faculty_research_guidance** - Students guided
13. **faculty_training_attended** - Training records
14. **faculty_training_conducted** - Training conducted
15. **faculty_courses_taught** - Course teaching records
16. **faculty_custom_sections** - Dynamic sections
17. **faculty_custom_section_fields** - Field definitions
18. **faculty_custom_section_entries** - Field values

### System Tables (5)
19. **pending_approvals** - ⚠️ **HAS ISSUES** - NULL requested_at and status
20. **audit_log** - Activity logging
21. **content_updates** - Content version tracking
22. **system_settings** - Application config
23. **site_analytics** - Analytics data

### Request Tables (2)
24. **course_requests** - Faculty course requests
25. **file_attachments** - File storage metadata

### Backup Tables (2) - CAN BE DROPPED
26. **research_areas_backup_20251003_180205** ❌ DELETE
27. **research_areas_backup_20251003_180300** ❌ DELETE

---

## Questions for You

1. **CRITICAL:** Should I proceed with Phase 1 (fixing pending_approvals NULLs)?  
   **Recommendation:** YES - this fixes the "Invalid Date" issue immediately.

2. **Data Integrity:** Should we add NOT NULL constraints to critical columns?  
   **Recommendation:** YES - after verifying no NULLs exist.

3. **Performance:** Should we add the suggested indexes?  
   **Recommendation:** YES - zero risk, only benefits.

4. **Cleanup:** Can I drop the 2 backup tables?  
   **Recommendation:** YES - if October 2025 migration was successful (verify first).

5. **Type System:** Keep INTEGER for booleans or convert to BOOLEAN?  
   **Recommendation:** Keep INTEGER for now (already working, lower risk).

6. **Timezones:** Convert timestamp → timestamptz?  
   **Recommendation:** DEFER - do this in a future phase after other fixes.

---

## Next Steps

**Please review and let me know:**
1. Which phases should I execute?
2. Any concerns or questions about the proposed fixes?
3. Should I proceed phase by phase with your approval at each step?

**I will NOT make any changes until you approve.**
