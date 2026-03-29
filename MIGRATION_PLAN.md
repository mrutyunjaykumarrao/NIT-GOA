# MySQL → Supabase (PostgreSQL) Migration Plan

## Executive Summary

**Objective**: Migrate NIT Goa website backend from MySQL to Supabase (PostgreSQL) with zero breaking changes to API contracts or user-facing behavior.

**Current State**:
- MySQL database with 18 tables (updated_nitgoa schema)
- Node.js/Express backend using `mysql2/promise` package
- ~21 route files with direct database queries
- DB_TYPE toggle exists in .env but not implemented in code
- Supabase schema already recreated — **code migration only**

**Target State**:
- Supabase (PostgreSQL) as primary database
- All MySQL-specific syntax converted to PostgreSQL
- All API behavior preserved exactly
- Clean rollback strategy if issues arise

---

## Migration Strategy

### Approach: Phased, Gate-Controlled Migration
Each phase must be **completed and confirmed** before proceeding to the next.

### Key Principles
1. **No shortcuts** — every MySQL-specific pattern must be identified and converted
2. **Preserve all behavior** — no API contract changes, no response shape changes
3. **Document everything** — every change explained with before/after code
4. **Test continuously** — verify after each file migration
5. **Gate-controlled** — explicit confirmation required between phases

---

## Critical MySQL vs PostgreSQL Differences

### 1. Query Placeholder Syntax
- **MySQL**: `?` placeholders (positional, order-dependent)
  ```sql
  SELECT * FROM users WHERE email = ? AND status = ?
  ```
- **PostgreSQL**: `$1, $2, $3` placeholders (numbered, explicit)
  ```sql
  SELECT * FROM users WHERE email = $1 AND status = $2
  ```
- **Impact**: Every single query with parameters must be converted
- **Risk**: High — incorrect parameter order breaks queries silently

### 2. Auto-Increment Primary Keys
- **MySQL**: `AUTO_INCREMENT` + `insertId` from result
  ```javascript
  const [result] = await pool.query('INSERT INTO users...');
  const id = result.insertId;
  ```
- **PostgreSQL**: `SERIAL` + `RETURNING id` clause
  ```javascript
  const result = await pool.query('INSERT INTO users... RETURNING id');
  const id = result.rows[0].id;
  ```
- **Impact**: All INSERT operations that need the new ID
- **Risk**: High — breaks subsequent operations if ID not retrieved

### 3. Identifier Quoting
- **MySQL**: Backticks `` `table_name` ``
- **PostgreSQL**: Double quotes `"table_name"` (or unquoted if lowercase)
- **Impact**: Queries with backticks will fail
- **Risk**: Medium — easy to spot and fix

### 4. Boolean Type Handling
- **MySQL**: `TINYINT(1)` (0/1 integers)
- **PostgreSQL**: Native `BOOLEAN` type (true/false)
- **Impact**: Boolean comparisons and assignments
- **Risk**: Low — mostly automatic conversion

### 5. NULL-Safe Functions
- **MySQL**: `IFNULL(column, default)`
- **PostgreSQL**: `COALESCE(column, default)`
- **Impact**: Any query using IFNULL
- **Risk**: Low — direct replacement

### 6. String Aggregation
- **MySQL**: `GROUP_CONCAT(column SEPARATOR ', ')`
- **PostgreSQL**: `STRING_AGG(column, ', ')`
- **Impact**: Any grouped/aggregated string columns
- **Risk**: Medium — syntax different but semantics same

### 7. JSON Column Handling
- **MySQL**: JSON type with `JSON_EXTRACT()`, `JSON_OBJECT()`
- **PostgreSQL**: JSONB type with `->`, `->>` operators
- **Impact**: JSON queries need operator conversion
- **Risk**: Medium — requires careful operator mapping

### 8. Date/Time Functions
- **MySQL**: `NOW()`, `CURDATE()`, `DATE_FORMAT()`
- **PostgreSQL**: `NOW()`, `CURRENT_DATE`, `TO_CHAR()`
- **Impact**: Date formatting and comparison queries
- **Risk**: Low-Medium — most common functions compatible

### 9. LIMIT with Offset
- **MySQL**: `LIMIT offset, count`
- **PostgreSQL**: `LIMIT count OFFSET offset` (order reversed!)
- **Impact**: Pagination queries
- **Risk**: Medium — wrong order returns wrong results

### 10. Transaction Syntax
- **MySQL**: `START TRANSACTION`, `COMMIT`, `ROLLBACK`
- **PostgreSQL**: `BEGIN`, `COMMIT`, `ROLLBACK`
- **Impact**: All transactional operations
- **Risk**: Low — both syntaxes usually work, but BEGIN preferred

### 11. Connection Pool Result Structure
- **MySQL (`mysql2`)**: Returns `[rows, fields]`
  ```javascript
  const [rows, fields] = await connection.query(sql, params);
  ```
- **PostgreSQL (`pg`)**: Returns `result` object with `.rows` property
  ```javascript
  const result = await connection.query(sql, params);
  const rows = result.rows;
  ```
- **Impact**: **EVERY query result access pattern changes**
- **Risk**: CRITICAL — affects all database interactions

### 12. ENUM Type Differences
- **MySQL**: Native ENUM type
- **PostgreSQL**: Must create ENUM type explicitly or use CHECK constraint
- **Impact**: Any ENUM columns
- **Risk**: Low if schema already migrated

---

## Rollback Strategy

### Pre-Migration Safeguards
1. **Keep MySQL running** — do not drop MySQL database
2. **Maintain `.env` toggle** — `DB_TYPE=mysql` can revert
3. **Git branching**:
   - Keep `main` branch stable (MySQL version)
   - Work on `supabase-migration` branch
   - Merge only after full validation

### Rollback Triggers (When to Roll Back)
- Any API endpoint returns incorrect data
- Response times degrade >50%
- Any existing feature stops working
- Data integrity issues detected
- Client-side errors increase >10%

### Rollback Procedure
1. **Immediate**: Change `.env` → `DB_TYPE=mysql`
2. **Restart server**: `pm2 restart` or equivalent
3. **Verify**: Test critical endpoints
4. **Investigate**: Analyze logs to find root cause
5. **Fix forward**: Correct issues in Supabase version
6. **Retry**: Switch back to Supabase when fixed

### Data Consistency During Migration
- **No dual writes** — either MySQL OR Supabase, never both
- **Read-only MySQL** — after cutover, MySQL becomes backup only
- **No data sync needed** — data already copied during schema migration

---

## Definition of "Done" for Each Phase

### Phase 0: Documentation ✅
- [ ] MIGRATION_PLAN.md created (this document)
- [ ] AFFECTED_FILES.md created (inventory of all DB files)
- [ ] MIGRATION_PRIORITY.md created (file migration order)
- [ ] Project structure understood and documented
- [ ] All MySQL vs PostgreSQL differences documented

### Phase 1: Connection Test
- [ ] `test-supabase-connection.js` created
- [ ] Successfully connects to Supabase
- [ ] `SELECT NOW()` returns current timestamp
- [ ] All 18 tables listed from `information_schema.tables`
- [ ] Connection closes cleanly without errors

### Phase 2: Core Connection Layer
- [ ] `src/config/database.js` converted to PostgreSQL
- [ ] DB_TYPE toggle implemented (mysql/supabase switch)
- [ ] Pool configuration updated for `pg` package
- [ ] `executeQuery()` helper updated for PostgreSQL result structure
- [ ] `withTransaction()` helper updated for PostgreSQL
- [ ] All helper functions tested and verified
- [ ] Connection test passes on Supabase

### Phase 3: Data Safety Check
- [ ] Row count verification script created
- [ ] All 18 tables have matching row counts
- [ ] Sample data spot-checked for accuracy
- [ ] Foreign key relationships verified
- [ ] Character encoding verified (UTF-8)
- [ ] NULL handling verified across sample columns

### Phase 4: File-by-File Code Migration
For each file in MIGRATION_PRIORITY.md:
- [ ] Original MySQL code documented
- [ ] PostgreSQL conversion completed
- [ ] All changes explained
- [ ] Query parameter syntax converted (`?` → `$1`)
- [ ] INSERT...RETURNING logic updated where needed
- [ ] Result structure access updated (`.rows[0]` pattern)
- [ ] File tested in isolation (if possible)
- [ ] No residual MySQL syntax remains

### Phase 5: Validation & Regression
- [ ] Global search confirms zero `mysql2` imports
- [ ] Global search confirms zero `?` placeholders in queries
- [ ] Server boots without errors
- [ ] All authentication endpoints tested
- [ ] All faculty CRUD endpoints tested
- [ ] All admin endpoints tested
- [ ] All staff endpoints tested
- [ ] Edge cases tested (NULLs, empty results, large payloads)
- [ ] Error handling verified
- [ ] Performance baseline established

### Phase 6: Rollout Strategy
- [ ] Deployment sequence documented
- [ ] Monitoring alerts configured
- [ ] Health check endpoints verified
- [ ] Rollback procedure tested
- [ ] Team trained on rollback triggers
- [ ] Production cutover scheduled

---

## Risk Assessment

### High-Risk Areas
1. **Query parameter conversion** (`?` → `$1, $2`)
   - Mitigation: Automated regex search + manual review
2. **INSERT ID retrieval** (`.insertId` → `RETURNING id`)
   - Mitigation: Test all create operations thoroughly
3. **Result structure access** (`[rows, fields]` → `result.rows`)
   - Mitigation: Update `executeQuery()` helper to maintain consistent interface

### Medium-Risk Areas
1. **String aggregation** (`GROUP_CONCAT` → `STRING_AGG`)
   - Mitigation: Search for all occurrences, test output
2. **Date/time formatting** queries
   - Mitigation: Test all date-related endpoints
3. **LIMIT/OFFSET** pagination
   - Mitigation: Test paginated endpoints

### Low-Risk Areas
1. **NULL handling** (IFNULL → COALESCE)
2. **Boolean conversions** (TINYINT → BOOLEAN)
3. **Transaction syntax** (START TRANSACTION → BEGIN)

---

## Success Criteria

### Technical Success
- ✅ All 21 route files migrated
- ✅ Zero MySQL imports remain
- ✅ All tests pass
- ✅ Server boots without errors
- ✅ All API endpoints return correct responses
- ✅ No performance degradation

### Business Success
- ✅ Zero user-facing errors
- ✅ Zero data loss or corruption
- ✅ No API contract changes
- ✅ Rollback capability maintained for 30 days
- ✅ Team trained on new database

---

## Timeline & Milestones

**Phase 0**: Documentation (current) — DONE when all 3 docs created
**Phase 1**: Connection test — DONE when connection verified
**Phase 2**: Core layer — DONE when `database.js` tested
**Phase 3**: Data check — DONE when counts verified
**Phase 4**: File migration — DONE when all 21 files converted
**Phase 5**: Validation — DONE when all tests pass
**Phase 6**: Rollout — DONE when production stable

---

## Next Steps

1. ✅ Complete MIGRATION_PLAN.md (this document)
2. ⏳ Create AFFECTED_FILES.md (inventory)
3. ⏳ Create MIGRATION_PRIORITY.md (priority queue)
4. ⏳ Wait for confirmation before Phase 1

---

**Last Updated**: 2026-03-29  
**Migration Status**: Phase 0 — Planning & Documentation  
**Completion**: 0% (0/6 phases)
