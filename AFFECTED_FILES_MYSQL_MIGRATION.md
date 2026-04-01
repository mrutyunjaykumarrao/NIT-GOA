# MySQL → Supabase Migration: Affected Files Inventory

## Summary Statistics

**Total Files Affected**: 21 files  
**Total Lines of Code**: ~5,900 lines  
**Database Queries**: ~241 query calls  
**Primary Library**: `mysql2/promise` → `pg`  

---

## Complete File Inventory

| # | File Path | Role | DB Library | Queries | LOC | Priority | Notes |
|---|-----------|------|------------|---------|-----|----------|-------|
| 1 | `server/src/config/database.js` | Core DB connection pool | mysql2/promise | 7 | 231 | **TIER 1** | Main connection file - migrate first |
| 2 | `server/src/utils/apiHelpers.js` | Shared query utilities | Uses pool | 31 | 906 | **TIER 1** | Critical helper functions used everywhere |
| 3 | `server/server.js` | Main entry point | Imports db | 0 | 134 | **TIER 1** | Calls testConnection() |
| 4 | `server/src/models/index.js` | Data access layer | Uses executeQuery | 27 | 397 | **TIER 2** | Model functions for all tables |
| 5 | `server/src/routes/auth.js` | Authentication API | Uses helpers | 25 | 294 | **TIER 4** | Login, register, token refresh |
| 6 | `server/src/routes/facultyData.js` | Faculty CRUD | Uses helpers | 29 | 462 | **TIER 4** | Main faculty operations |
| 7 | `server/src/routes/facultyList.js` | Faculty listing | Uses helpers | 3 | 102 | **TIER 4** | Public faculty directory |
| 8 | `server/src/routes/facultyDetailsAPI.js` | Faculty details | Uses helpers | ~5 | 48 | **TIER 4** | Complete profile view |
| 9 | `server/src/routes/staff.js` | Staff management | Uses helpers | ~8 | 115 | **TIER 4** | Technical/admin staff |
| 10 | `server/src/routes/publicDisplay.js` | Public data | Uses helpers | ~10 | 135 | **TIER 4** | Homepage data, stats |
| 11 | `server/src/routes/analytics.js` | Analytics API | Uses helpers | ~35 | 413 | **TIER 4** | Visitor tracking, stats |
| 12 | `server/src/routes/admin.js` | Admin operations | Uses helpers | 63 | 691 | **TIER 4** | Content management |
| 13 | `server/src/routes/facultyEdit/profile.js` | Profile editing | Uses helpers | 10 | 307 | **TIER 3** | Faculty profile updates |
| 14 | `server/src/routes/facultyEdit/education.js` | Education section | Uses helpers | 4 | 93 | **TIER 3** | Education CRUD |
| 15 | `server/src/routes/facultyEdit/publications.js` | Publications | Uses helpers | 4 | 125 | **TIER 3** | Publication CRUD |
| 16 | `server/src/routes/facultyEdit/customSections.js` | Custom sections | Uses helpers | 9 | 308 | **TIER 3** | Dynamic section management |
| 17 | `server/src/routes/facultyEdit/coursesTaught.js` | Courses taught | Uses helpers | 4 | 134 | **TIER 3** | Course CRUD |
| 18 | `server/src/routes/facultyEdit/researchAreas.js` | Research areas | Uses helpers | 3 | 60 | **TIER 3** | Research area CRUD |
| 19 | `server/src/routes/facultyEdit/researchGuidance.js` | Research guidance | Uses helpers | 4 | 130 | **TIER 3** | Guidance CRUD |
| 20 | `server/src/routes/facultyEdit/memberships.js` | Memberships | Uses helpers | 4 | 118 | **TIER 3** | Membership CRUD |
| 21 | `server/src/routes/facultyEdit/trainingAttended.js` | Training attended | Uses helpers | 4 | 121 | **TIER 3** | Training CRUD |
| 22 | `server/src/routes/facultyEdit/trainingConducted.js` | Training conducted | Uses helpers | 4 | 121 | **TIER 3** | Training CRUD |
| 23 | `server/src/routes/facultyEdit/_middleware.js` | Edit middleware | Uses helpers | 5 | 209 | **TIER 3** | Ownership validation |
| 24 | `server/src/routes/facultyEdit/index.js` | Edit router | No queries | 0 | 22 | **TIER 3** | Route aggregator |
| 25 | `server/src/utils/dbTest.js` | DB test utility | Direct pool | 2 | 102 | **TIER 5** | Connection testing |
| 26 | `server/src/middleware/auth.js` | Auth middleware | No direct queries | 0 | 44 | **TIER 6** | JWT validation only |
| 27 | `server/src/middleware/fileUpload.js` | File upload | No direct queries | 0 | 118 | **TIER 6** | Multer config |
| 28 | `server/src/middleware/validateFacultyUpdate.js` | Validation | No direct queries | 0 | 46 | **TIER 6** | Schema validation |

---

## Detailed Analysis by Tier

### TIER 1: Core Infrastructure (3 files, ~1,271 LOC)
**Critical Path**: Must be migrated first. All other files depend on these.

#### 1. `server/src/config/database.js` (231 lines)
**Current Implementation**:
```javascript
const mysql = require('mysql2/promise');
const pool = mysql.createPool({ ... });
```

**Database Interactions**:
- Creates MySQL connection pool
- Exports: `pool`, `executeQuery()`, `withTransaction()`, `testConnection()`
- Helper functions for JSON handling, schema validation

**Migration Impact**: HIGH
- Change library: `mysql2` → `pg` (or `pg-promise`)
- Update pool configuration
- Update `executeQuery()` result structure: `[rows, fields]` → `result.rows`
- Update `withTransaction()` for PostgreSQL syntax
- Implement DB_TYPE toggle (mysql vs supabase)

**Specific Concerns**:
- Line 18: `mysql.createPool()` → `new Pool()` from pg
- Line 39-40: `pool.on('connection')` → different in pg
- Line 55: `SHOW TABLES` → `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
- Line 64: `SELECT 1 as test` → works in both
- Line 93-113: `executeQuery()` must handle pg result structure
- Line 116-129: `withTransaction()` must use pg connection.query() syntax

---

#### 2. `server/src/utils/apiHelpers.js` (906 lines, ~31 queries)
**Role**: Shared utility functions used by all route files

**Database Interactions**:
- Imports `pool`, `executeQuery`, `withTransaction` from database.js
- Complex queries for faculty profiles, publications, education, etc.
- Transaction handling for multi-step operations

**Migration Impact**: HIGH
- All queries use `?` placeholders → convert to `$1, $2, $3`
- INSERT operations need `RETURNING id` clause
- Result destructuring: `const [rows] = await executeQuery()` must adapt to pg structure

**Specific Query Patterns** (examples):
- `SELECT * FROM faculty_profiles WHERE employee_id = ?` → `$1`
- `INSERT INTO faculty_education (...) VALUES (?, ?, ?)` → `VALUES ($1, $2, $3) RETURNING id`
- `GROUP_CONCAT()` → `STRING_AGG()`
- `IFNULL()` → `COALESCE()`

---

#### 3. `server/server.js` (134 lines)
**Role**: Main application entry point

**Database Interactions**:
- Line 9: Imports `testConnection`, `validateSchema`, `initializeDatabase` from database.js
- Line 130-131: Calls `testConnection()` on startup

**Migration Impact**: LOW
- No code changes needed if database.js exports maintain same interface
- Just ensure testConnection() works with Supabase

---

### TIER 2: Data Access Layer (1 file, 397 LOC)

#### 4. `server/src/models/index.js` (397 lines, ~27 queries)
**Role**: Centralized model functions for all database tables

**Database Interactions**:
- Imports `executeQuery` from database.js
- Model functions for: users, departments, faculty, staff, publications, etc.
- Common CRUD patterns: `getAll()`, `getById()`, `create()`, `update()`, `delete()`

**Migration Impact**: MEDIUM
- All queries use `?` placeholders → convert to `$1, $2, $3`
- All INSERT operations need `RETURNING id`
- Result handling: `const [rows] = await executeQuery()` → adapt for pg

**Example Functions**:
- `getUserByEmail(email)` - uses `WHERE email = ?`
- `createFacultyProfile(data)` - needs RETURNING id
- `updateDepartment(id, data)` - uses `WHERE id = ?`

---

### TIER 3: Service Layer - Faculty Edit Routes (10 files, ~1,496 LOC)

These files handle faculty profile editing with ownership validation.

| File | Queries | Notes |
|------|---------|-------|
| `profile.js` | 10 | Profile info, photo, bio updates |
| `customSections.js` | 9 | Dynamic custom sections |
| `_middleware.js` | 5 | Ownership & permission checks |
| `education.js` | 4 | Education CRUD |
| `publications.js` | 4 | Publication CRUD |
| `coursesTaught.js` | 4 | Course CRUD |
| `researchGuidance.js` | 4 | Guidance CRUD |
| `memberships.js` | 4 | Membership CRUD |
| `trainingAttended.js` | 4 | Training attended CRUD |
| `trainingConducted.js` | 4 | Training conducted CRUD |
| `researchAreas.js` | 3 | Research areas |

**Common Patterns**:
- All use `executeQuery()` helper
- All have GET, POST, PUT, DELETE endpoints
- All check ownership via middleware
- Most INSERT operations need RETURNING id

**Migration Impact**: MEDIUM
- Repetitive CRUD patterns make conversion systematic
- Must verify ownership checks still work
- Test each CRUD operation

---

### TIER 4: API Routes - Main Endpoints (8 files, ~2,260 LOC)

| File | Queries | Purpose |
|------|---------|---------|
| `admin.js` | 63 | Content management, approvals |
| `analytics.js` | ~35 | Visitor tracking, statistics |
| `facultyData.js` | 29 | Main faculty CRUD |
| `auth.js` | 25 | Authentication (login, register) |
| `publicDisplay.js` | ~10 | Homepage data |
| `staff.js` | ~8 | Staff management |
| `facultyDetailsAPI.js` | ~5 | Full profile view |
| `facultyList.js` | 3 | Faculty directory |

**Migration Impact**: MEDIUM
- High traffic endpoints - must work perfectly
- Complex queries with JOINs
- Some analytics queries may use aggregation functions

**Critical Files**:
- **`auth.js`**: Must work flawlessly (authentication)
- **`admin.js`**: Largest file, most complex queries
- **`analytics.js`**: May use MySQL-specific date functions

---

### TIER 5: Test & Utilities (1 file, 102 LOC)

#### `server/src/utils/dbTest.js` (102 lines, 2 queries)
**Role**: Database connection and schema testing

**Migration Impact**: LOW
- Update for PostgreSQL connection test
- May need different schema validation queries

---

### TIER 6: Middleware (3 files, 208 LOC)

These files have **no direct database queries** but are listed for completeness.

| File | Purpose |
|------|---------|
| `auth.js` | JWT token verification |
| `fileUpload.js` | Multer file upload config |
| `validateFacultyUpdate.js` | Request validation schemas |

**Migration Impact**: NONE
- No code changes needed
- Just verify they still work with updated routes

---

## Files NOT Affected (No Migration Needed)

### Backend Files (No DB Access)
- `server/src/utils/emailService.js` - Email sending (nodemailer)
- `server/src/utils/timezone.js` - Timezone utilities
- All files in `server/uploads/` - Static file storage

### Frontend Files (Entire Client Directory)
- **No changes needed** - frontend uses REST API only
- API contracts remain identical
- Response shapes unchanged

### Configuration Files
- `server/.env` - Already has Supabase credentials
- `server/package.json` - Will add `pg` dependency
- `firebase.json` - Hosting config (no changes)

---

## Environment Variables to Update

### Current `.env` (MySQL focused)
```env
DB_TYPE=supabase          # ✅ Already set
DB_HOST=localhost         # MySQL only
DB_USER=root              # MySQL only
DB_PASSWORD=...           # MySQL only
DB_NAME=updated_nitgoa    # MySQL only
DB_PORT=3306              # MySQL only

SUPABASE_URL=...          # ✅ Already set
SUPABASE_SERVICE_ROLE_KEY=... # ✅ Already set
DATABASE_URL=postgresql://... # ✅ Already set
```

### Required Changes
- `database.js` must read `DB_TYPE` and switch connection logic
- When `DB_TYPE=supabase`, use `DATABASE_URL` for connection
- When `DB_TYPE=mysql`, use `DB_HOST`, `DB_USER`, etc.

---

## Query Pattern Summary

### Most Common Patterns (Needs Conversion)

1. **Simple SELECT with params** (~80 occurrences)
   ```javascript
   // MySQL
   const [rows] = await executeQuery('SELECT * FROM table WHERE id = ?', [id]);
   
   // PostgreSQL
   const [rows] = await executeQuery('SELECT * FROM table WHERE id = $1', [id]);
   ```

2. **INSERT with ID retrieval** (~40 occurrences)
   ```javascript
   // MySQL
   const [result] = await executeQuery('INSERT INTO table (...) VALUES (?, ?)', [a, b]);
   const id = result.insertId;
   
   // PostgreSQL
   const [result] = await executeQuery('INSERT INTO table (...) VALUES ($1, $2) RETURNING id', [a, b]);
   const id = result[0].id; // Note: result is now array of rows
   ```

3. **UPDATE with params** (~30 occurrences)
   ```javascript
   // MySQL
   await executeQuery('UPDATE table SET col = ? WHERE id = ?', [val, id]);
   
   // PostgreSQL
   await executeQuery('UPDATE table SET col = $1 WHERE id = $2', [val, id]);
   ```

4. **DELETE with params** (~15 occurrences)
   ```javascript
   // MySQL
   await executeQuery('DELETE FROM table WHERE id = ?', [id]);
   
   // PostgreSQL
   await executeQuery('DELETE FROM table WHERE id = $1', [id]);
   ```

---

## Automation Opportunities

### Regex-Based Conversions (Must Verify Manually)

1. **Simple placeholder replacement**:
   - Find: `\?` in SQL strings
   - Replace: `$1, $2, $3` (must count position)
   - **Risk**: Cannot be fully automated - parameter order critical

2. **IFNULL → COALESCE**:
   - Find: `IFNULL\(`
   - Replace: `COALESCE(`
   - **Risk**: Low - direct replacement

3. **GROUP_CONCAT → STRING_AGG**:
   - Find: `GROUP_CONCAT\((.*?) SEPARATOR '(.*?)'\)`
   - Replace: `STRING_AGG($1, '$2')`
   - **Risk**: Low - syntax similar

4. **Backtick removal**:
   - Find: `` `([a-zA-Z_]+)` ``
   - Replace: `$1` or `"$1"` if needed
   - **Risk**: Low - PostgreSQL prefers unquoted lowercase

---

## Testing Strategy

### Unit Testing Priorities
1. **Tier 1 files first** - Core connection and helpers
2. **Model layer** - Verify CRUD operations
3. **Auth routes** - Critical path
4. **Faculty edit routes** - High complexity
5. **Analytics routes** - Complex queries

### Integration Testing
- Test each API endpoint with Postman/curl
- Verify response shapes match MySQL version exactly
- Check edge cases: NULLs, empty arrays, large datasets

### Performance Testing
- Baseline MySQL query times
- Compare Supabase query times
- Flag any >50% slower queries for optimization

---

## Next Steps

1. ✅ MIGRATION_PLAN.md created
2. ✅ AFFECTED_FILES.md created (this document)
3. ⏳ Create MIGRATION_PRIORITY.md (file migration order)
4. ⏳ Wait for user confirmation before Phase 1

---

**Total Affected Files**: 21  
**Total Queries to Convert**: ~241  
**Estimated Effort**: 6-8 hours (phased migration)  
**Risk Level**: Medium (systematic approach reduces risk)

**Last Updated**: 2026-03-29  
**Document Version**: 1.0
