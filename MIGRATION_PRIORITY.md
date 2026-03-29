# MySQL → Supabase Migration: Priority Queue

## Migration Order Strategy

Files are organized into **6 tiers** based on dependencies and risk level. Each tier must be completed before moving to the next.

**Core Principle**: Dependencies first, high-risk areas early, systematic progression.

---

## TIER 1: Foundation - Core Connection Layer
**Status**: 🔴 Not Started  
**Goal**: Establish PostgreSQL connection, update core utilities  
**Blocking**: All other tiers depend on this  

### Files to Migrate (3 files, ~1,271 LOC)

| Order | File | Queries | Priority | Reason |
|-------|------|---------|----------|--------|
| 1.1 | `server/src/config/database.js` | 7 | **CRITICAL** | Main DB connection - blocks everything |
| 1.2 | `server/src/utils/apiHelpers.js` | 31 | **CRITICAL** | Used by all routes |
| 1.3 | `server/server.js` | 0 | **CRITICAL** | Entry point, calls testConnection() |

### Migration Steps for Tier 1

#### Step 1.1: `database.js` Conversion
**Objective**: Replace MySQL connection with PostgreSQL, maintain same export interface

**Required Changes**:
1. Replace `mysql2/promise` with `pg` package
   ```javascript
   // Before
   const mysql = require('mysql2/promise');
   const pool = mysql.createPool({ ... });
   
   // After
   const { Pool } = require('pg');
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: { rejectUnauthorized: false }
   });
   ```

2. Implement DB_TYPE toggle
   ```javascript
   if (process.env.DB_TYPE === 'mysql') {
     // Use mysql2 pool
   } else if (process.env.DB_TYPE === 'supabase') {
     // Use pg pool
   }
   ```

3. Update `executeQuery()` function
   ```javascript
   // MySQL version
   const executeQuery = async (query, params = []) => {
     const [rows, fields] = await pool.query(query, params);
     return [rows, fields];
   };
   
   // PostgreSQL version
   const executeQuery = async (query, params = []) => {
     const result = await pool.query(query, params);
     return [result.rows, result.fields]; // Maintain same interface!
   };
   ```

4. Update `withTransaction()` for PostgreSQL
   ```javascript
   const withTransaction = async (callback) => {
     const client = await pool.connect();
     try {
       await client.query('BEGIN');
       const result = await callback(client);
       await client.query('COMMIT');
       return result;
     } catch (error) {
       await client.query('ROLLBACK');
       throw error;
     } finally {
       client.release();
     }
   };
   ```

5. Update `testConnection()` for PostgreSQL
   - Replace `SHOW TABLES` with `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
   - Adapt result parsing

**Success Criteria**:
- [ ] Server starts without errors
- [ ] `testConnection()` passes
- [ ] Lists all 18 tables from Supabase
- [ ] Can execute simple test query
- [ ] Pool connections work correctly

---

#### Step 1.2: `apiHelpers.js` Conversion
**Objective**: Convert all helper functions to PostgreSQL syntax

**Query Patterns to Convert**:
1. **Placeholder conversion** (`?` → `$1, $2`)
   - ~31 query calls
   - Must manually count parameters and renumber

2. **INSERT...RETURNING pattern**
   ```javascript
   // Before
   const [result] = await executeQuery('INSERT INTO table (...) VALUES (?, ?)', [a, b]);
   const id = result.insertId;
   
   // After
   const [result] = await executeQuery('INSERT INTO table (...) VALUES ($1, $2) RETURNING id', [a, b]);
   const id = result[0].id;
   ```

3. **NULL handling**
   - Find: `IFNULL(`
   - Replace: `COALESCE(`

4. **String aggregation** (if exists)
   - Find: `GROUP_CONCAT(col SEPARATOR ', ')`
   - Replace: `STRING_AGG(col, ', ')`

**Success Criteria**:
- [ ] All `?` placeholders converted to `$N`
- [ ] All INSERT operations use RETURNING where needed
- [ ] No MySQL-specific functions remain
- [ ] All helper functions tested in isolation

---

#### Step 1.3: `server.js` Updates
**Objective**: Ensure startup sequence works with new database layer

**Required Changes**:
- Verify imports from `database.js` still work
- No code changes likely needed if Tier 1.1 maintains interface

**Success Criteria**:
- [ ] Server boots successfully
- [ ] Database connection logs appear
- [ ] No startup errors

---

## TIER 2: Data Access Layer - Models
**Status**: 🔴 Not Started  
**Goal**: Update centralized model functions  
**Blocking**: Tiers 3-4 (routes) depend on models  

### Files to Migrate (1 file, 397 LOC)

| Order | File | Queries | Priority | Reason |
|-------|------|---------|----------|--------|
| 2.1 | `server/src/models/index.js` | 27 | **HIGH** | Used by most route files |

### Migration Steps for Tier 2

#### Step 2.1: `models/index.js` Conversion
**Objective**: Convert all model CRUD functions

**Model Functions to Update**:
- User models: `getUserByEmail()`, `createUser()`, `updateUser()`
- Department models: `getAllDepartments()`, `getDepartmentById()`
- Faculty models: `getFacultyProfile()`, `createFacultyProfile()`
- Staff models: `getStaffProfiles()`, `updateStaffProfile()`
- Publication models: `getPublications()`, `createPublication()`

**Conversion Pattern (Example)**:
```javascript
// Before (MySQL)
async function getUserByEmail(email) {
  const [rows] = await executeQuery('SELECT * FROM user_accounts WHERE email = ?', [email]);
  return rows[0];
}

async function createUser(data) {
  const [result] = await executeQuery('INSERT INTO user_accounts (...) VALUES (?, ?, ?)', [a, b, c]);
  return result.insertId;
}

// After (PostgreSQL)
async function getUserByEmail(email) {
  const [rows] = await executeQuery('SELECT * FROM user_accounts WHERE email = $1', [email]);
  return rows[0];
}

async function createUser(data) {
  const [result] = await executeQuery('INSERT INTO user_accounts (...) VALUES ($1, $2, $3) RETURNING id', [a, b, c]);
  return result[0].id;
}
```

**Success Criteria**:
- [ ] All 27 query calls converted
- [ ] All `?` → `$N` conversions done
- [ ] All INSERT operations return IDs correctly
- [ ] Model unit tests pass (if they exist)

---

## TIER 3: Service Layer - Faculty Edit Routes
**Status**: 🔴 Not Started  
**Goal**: Update faculty profile editing endpoints  
**Blocking**: Faculty editing features  

### Files to Migrate (11 files, ~1,518 LOC)

| Order | File | Queries | Priority | Reason |
|-------|------|---------|----------|--------|
| 3.1 | `routes/facultyEdit/index.js` | 0 | **MEDIUM** | Router aggregator - no queries |
| 3.2 | `routes/facultyEdit/_middleware.js` | 5 | **MEDIUM** | Ownership validation |
| 3.3 | `routes/facultyEdit/profile.js` | 10 | **MEDIUM** | Profile updates |
| 3.4 | `routes/facultyEdit/customSections.js` | 9 | **MEDIUM** | Dynamic sections |
| 3.5 | `routes/facultyEdit/education.js` | 4 | **LOW** | Education CRUD |
| 3.6 | `routes/facultyEdit/publications.js` | 4 | **LOW** | Publication CRUD |
| 3.7 | `routes/facultyEdit/coursesTaught.js` | 4 | **LOW** | Course CRUD |
| 3.8 | `routes/facultyEdit/researchGuidance.js` | 4 | **LOW** | Guidance CRUD |
| 3.9 | `routes/facultyEdit/memberships.js` | 4 | **LOW** | Membership CRUD |
| 3.10 | `routes/facultyEdit/trainingAttended.js` | 4 | **LOW** | Training CRUD |
| 3.11 | `routes/facultyEdit/trainingConducted.js` | 4 | **LOW** | Training CRUD |
| 3.12 | `routes/facultyEdit/researchAreas.js` | 3 | **LOW** | Research areas |

### Migration Strategy for Tier 3

**Approach**: These files follow similar CRUD patterns. Convert systematically.

**Common Pattern**:
```javascript
// GET endpoint - fetch records
router.get('/', async (req, res) => {
  const [rows] = await executeQuery('SELECT * FROM table WHERE faculty_id = ?', [id]);
  // Before: ? 
  // After: $1
});

// POST endpoint - create record
router.post('/', async (req, res) => {
  const [result] = await executeQuery('INSERT INTO table (...) VALUES (?, ?)', [a, b]);
  const id = result.insertId;
  // Before: result.insertId
  // After: result[0].id with RETURNING id
});

// PUT endpoint - update record
router.put('/:id', async (req, res) => {
  await executeQuery('UPDATE table SET col = ? WHERE id = ?', [val, id]);
  // Before: ?
  // After: $1, $2
});

// DELETE endpoint - delete record
router.delete('/:id', async (req, res) => {
  await executeQuery('DELETE FROM table WHERE id = ?', [id]);
  // Before: ?
  // After: $1
});
```

**Success Criteria per File**:
- [ ] All placeholders converted
- [ ] All INSERT operations use RETURNING
- [ ] GET/POST/PUT/DELETE endpoints tested
- [ ] Response format unchanged

---

## TIER 4: API Routes - Main Endpoints
**Status**: 🔴 Not Started  
**Goal**: Update primary API routes  
**Blocking**: Core application features  

### Files to Migrate (8 files, ~2,260 LOC)

| Order | File | Queries | Priority | Reason |
|-------|------|---------|----------|--------|
| 4.1 | `routes/auth.js` | 25 | **CRITICAL** | Authentication must work perfectly |
| 4.2 | `routes/facultyData.js` | 29 | **HIGH** | Main faculty operations |
| 4.3 | `routes/admin.js` | 63 | **HIGH** | Most complex queries |
| 4.4 | `routes/analytics.js` | ~35 | **MEDIUM** | May use date functions |
| 4.5 | `routes/publicDisplay.js` | ~10 | **MEDIUM** | Homepage data |
| 4.6 | `routes/staff.js` | ~8 | **MEDIUM** | Staff management |
| 4.7 | `routes/facultyList.js` | 3 | **LOW** | Simple listing |
| 4.8 | `routes/facultyDetailsAPI.js` | ~5 | **LOW** | Profile viewing |

### Migration Steps for Tier 4

#### Step 4.1: `auth.js` - CRITICAL
**Queries to Convert**: 25
**Key Operations**:
- Login: Password verification, token generation
- Register: User creation, role assignment
- Token refresh: JWT validation

**Critical Concerns**:
- Password hashing must work identically
- Token generation must match existing format
- Session handling must be preserved

**Success Criteria**:
- [ ] Login works with existing accounts
- [ ] Registration creates valid accounts
- [ ] Token refresh works
- [ ] Error messages unchanged

---

#### Step 4.2: `facultyData.js` - HIGH
**Queries to Convert**: 29
**Key Operations**:
- Faculty profile CRUD
- Photo upload/update
- Profile status changes
- Bulk operations

**Success Criteria**:
- [ ] Profile creation works
- [ ] Profile updates reflected immediately
- [ ] Photo upload/retrieval works
- [ ] No data corruption

---

#### Step 4.3: `admin.js` - HIGH (Most Complex)
**Queries to Convert**: 63
**Key Operations**:
- Content management (hero images, announcements)
- Pending approval workflows
- User management
- System settings

**Potential Issues**:
- Complex JOIN queries
- Transaction operations
- Aggregation queries

**Success Criteria**:
- [ ] All admin operations work
- [ ] Approval workflow intact
- [ ] Content updates appear immediately

---

#### Step 4.4-4.8: Remaining Routes
**Strategy**: Convert one at a time, test thoroughly

**Common Concerns**:
- `analytics.js`: Date/time functions may need adjustment
- `publicDisplay.js`: Homepage data must load fast
- `staff.js`: Similar to faculty routes
- `facultyList.js`: Simple, low risk
- `facultyDetailsAPI.js`: Simple profile fetch

---

## TIER 5: Tests & Utilities
**Status**: 🔴 Not Started  
**Goal**: Update testing utilities  
**Blocking**: None (can be done anytime)  

### Files to Migrate (1 file, 102 LOC)

| Order | File | Queries | Priority | Reason |
|-------|------|---------|----------|--------|
| 5.1 | `utils/dbTest.js` | 2 | **LOW** | Testing utility |

### Migration Steps for Tier 5

**Simple Conversion**:
- Update connection test for PostgreSQL
- Update schema validation queries
- Verify test output matches expectations

---

## TIER 6: Middleware (No Changes)
**Status**: ✅ Complete (No Migration Needed)  
**Goal**: Verify middleware still works  
**Blocking**: None  

### Files (3 files, 208 LOC)

| File | Purpose | Changes Needed |
|------|---------|----------------|
| `middleware/auth.js` | JWT verification | None - no DB queries |
| `middleware/fileUpload.js` | Multer config | None - no DB queries |
| `middleware/validateFacultyUpdate.js` | Schema validation | None - no DB queries |

**Verification Only**:
- [ ] Auth middleware still validates tokens
- [ ] File upload still works
- [ ] Validation middleware still catches errors

---

## Detailed Migration Workflow

### Before Starting Any Tier
1. **Backup current code**:
   ```bash
   git checkout -b supabase-migration
   git add -A
   git commit -m "Pre-migration checkpoint"
   ```

2. **Ensure Supabase connection**:
   - Verify DATABASE_URL in .env
   - Test connection manually with psql

3. **Set DB_TYPE**:
   ```env
   DB_TYPE=supabase
   ```

### For Each File in a Tier
1. **Read the file completely** - understand all queries
2. **Document current behavior** - note what each query does
3. **Convert placeholder syntax** - `?` → `$1, $2, $3`
4. **Convert INSERT...RETURNING** - update ID retrieval
5. **Convert MySQL functions** - IFNULL, GROUP_CONCAT, etc.
6. **Test in isolation** - if possible, test the file alone
7. **Test integration** - verify with API calls
8. **Document changes** - note what was changed and why

### After Completing a Tier
1. **Run full integration tests**
2. **Test all endpoints in that tier**
3. **Check logs for errors**
4. **Verify response formats**
5. **Commit changes**:
   ```bash
   git add -A
   git commit -m "Tier N completed: <description>"
   ```
6. **STOP and wait for confirmation before next tier**

---

## Estimated Timeline

| Tier | Files | Queries | Est. Time | Complexity |
|------|-------|---------|-----------|------------|
| Tier 1 | 3 | 38 | 2-3 hours | HIGH |
| Tier 2 | 1 | 27 | 1 hour | MEDIUM |
| Tier 3 | 11 | 55 | 2-3 hours | MEDIUM |
| Tier 4 | 8 | 121 | 3-4 hours | HIGH |
| Tier 5 | 1 | 2 | 30 min | LOW |
| Tier 6 | 3 | 0 | 15 min | LOW |
| **TOTAL** | **27** | **~241** | **8-11 hrs** | **MEDIUM-HIGH** |

**Note**: Times include testing and verification, not just code conversion.

---

## Risk Mitigation by Tier

### Tier 1 Risks
- **Pool connection fails**: Keep DB_TYPE toggle to revert to MySQL
- **executeQuery breaks all routes**: Maintain same return interface `[rows, fields]`
- **Transaction logic fails**: Test with simple transaction first

### Tier 2 Risks
- **Model functions return wrong data**: Unit test each model function
- **ID retrieval fails**: Verify RETURNING clause on test data

### Tier 3 Risks
- **Faculty can't edit profiles**: Test with real faculty account
- **Ownership checks fail**: Verify middleware still validates correctly

### Tier 4 Risks
- **Auth breaks**: Test login immediately after converting auth.js
- **Admin ops fail**: Test with admin account
- **Analytics queries slow**: Monitor query performance

---

## Rollback Points

| Tier | Rollback Action | Recovery Time |
|------|----------------|---------------|
| Tier 1 | Set `DB_TYPE=mysql`, restart | <5 minutes |
| Tier 2 | Revert models/index.js, restart | <10 minutes |
| Tier 3 | Revert facultyEdit/, restart | <15 minutes |
| Tier 4 | Revert specific route, restart | <10 minutes |

**Full Rollback**: Checkout previous git commit, set `DB_TYPE=mysql`, restart

---

## Success Metrics

### Technical Metrics
- ✅ All 241 queries converted
- ✅ Zero MySQL imports remain
- ✅ Server boots without errors
- ✅ All API endpoints respond correctly
- ✅ Response times <10% slower than MySQL

### Business Metrics
- ✅ Zero user-reported errors
- ✅ All features work as before
- ✅ No data corruption
- ✅ Admin dashboard fully functional

---

## Checklist Progress Tracker

### Tier 1: Foundation ⏳
- [ ] 1.1 database.js converted
- [ ] 1.2 apiHelpers.js converted
- [ ] 1.3 server.js verified
- [ ] Tier 1 integration tests passed
- [ ] Tier 1 committed to git

### Tier 2: Models ⏳
- [ ] 2.1 models/index.js converted
- [ ] Tier 2 unit tests passed
- [ ] Tier 2 committed to git

### Tier 3: Faculty Edit ⏳
- [ ] 3.1 index.js verified
- [ ] 3.2 _middleware.js converted
- [ ] 3.3 profile.js converted
- [ ] 3.4 customSections.js converted
- [ ] 3.5-3.12 All CRUD routes converted
- [ ] Tier 3 integration tests passed
- [ ] Tier 3 committed to git

### Tier 4: Main Routes ⏳
- [ ] 4.1 auth.js converted
- [ ] 4.2 facultyData.js converted
- [ ] 4.3 admin.js converted
- [ ] 4.4 analytics.js converted
- [ ] 4.5-4.8 Remaining routes converted
- [ ] Tier 4 integration tests passed
- [ ] Tier 4 committed to git

### Tier 5: Utilities ⏳
- [ ] 5.1 dbTest.js converted
- [ ] Tier 5 verified

### Tier 6: Middleware ⏳
- [ ] All middleware verified working
- [ ] Tier 6 verified

### Final Validation ⏳
- [ ] Full regression test suite passed
- [ ] Performance benchmarks meet targets
- [ ] Production deployment plan ready

---

**Next Action**: Begin Phase 1 - Connection Test (create test-supabase-connection.js)

**Last Updated**: 2026-03-29  
**Document Version**: 1.0  
**Current Status**: Phase 0 Complete - Awaiting Confirmation to Proceed
