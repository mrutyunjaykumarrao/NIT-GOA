# Timezone Implementation Guide

## **CLEAR CUT SOLUTION: Store UTC, Display IST**

### **Overview**
This document outlines the complete solution for fixing timezone issues in the NIT Goa project.

### **Strategy**
1. **Database**: Store all timestamps in UTC
2. **Server**: Work with UTC timestamps, convert to IST only for display
3. **Client**: Receive UTC from server, display in IST using browser timezone APIs

---

## **Implementation Steps**

### **Step 1: Backup and Migrate Database**
```sql
-- Run the migration script
source database/migrations/004_fix_timezone_handling.sql;

-- Verify timezone is set to UTC
SET GLOBAL time_zone = '+00:00';
SET SESSION time_zone = '+00:00';

-- Check a few records to ensure conversion worked
SELECT user_id, username, created_at, last_login, lockout_timestamp 
FROM user_accounts 
LIMIT 5;
```

### **Step 2: Update Server Code**

#### **Replace all imports of old datetime utility:**
```javascript
// OLD (remove this)
const { getISTNow, parseFromDatabase, addMinutes, getMinutesDifference, formatForDatabase } = require('../utils/datetime');

// NEW (use this)
const { 
  getUTCNow, 
  parseFromStorage, 
  addMinutes, 
  getMinutesDifference, 
  formatForStorage,
  formatForDisplay,
  isPast
} = require('../utils/timezone');
```

#### **Update all time-related function calls:**
- `getISTNow()` → `getUTCNow()`
- `parseFromDatabase()` → `parseFromStorage()`
- `formatForDatabase()` → `formatForStorage()`
- Use `formatForDisplay()` for user-facing timestamps

### **Step 3: Update Frontend Code**

#### **Import the timezone utility:**
```javascript
import { formatDateTimeIST, formatDateIST, getRelativeTime } from '../../../utils/timezone';
```

#### **Update all date formatting:**
```javascript
// OLD
const formatDate = (dateString) => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleString();
};

// NEW
const formatDate = (dateString) => {
  return formatDateTimeIST(dateString);
};
```

### **Step 4: Testing**

#### **Test Cases:**
1. **Login lockout timing** - Verify lockouts work correctly
2. **Password reset expiry** - Ensure tokens expire at the right time
3. **Admin timestamps** - Check all displayed times are in IST
4. **Cross-timezone compatibility** - Test from different locations

#### **Test Script:**
```bash
# 1. Test login lockout
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"wrong"}' # Repeat 4 times

# 2. Check timestamp consistency
mysql -u root -p -e "SELECT NOW() as db_time, UTC_TIMESTAMP() as utc_time;"

# 3. Verify frontend displays IST
# Open browser, check admin panel timestamps
```

---

## **Rules for Developers**

### **DO:**
✅ Always store timestamps in UTC
✅ Use `getUTCNow()` for current time
✅ Use `formatForStorage()` when saving to database
✅ Use `formatForDisplay()` for user-facing times
✅ Let MySQL `CURRENT_TIMESTAMP` handle automatic fields (it's now UTC)

### **DON'T:**
❌ Never manually add/subtract timezone offsets
❌ Don't use `getISTNow()` or similar functions
❌ Don't store IST times in the database
❌ Don't use `toLocaleString()` without specifying timezone

---

## **File Structure**

```
server/src/utils/
├── timezone.js          # NEW - Centralized timezone handling
└── datetime.js          # OLD - Remove after migration

client/src/utils/
└── timezone.js          # NEW - Frontend timezone utilities

database/migrations/
└── 004_fix_timezone_handling.sql  # Migration script
```

---

## **Verification Checklist**

### **Backend:**
- [ ] All `getISTNow()` calls replaced with `getUTCNow()`
- [ ] All `parseFromDatabase()` calls replaced with `parseFromStorage()`
- [ ] All `formatForDatabase()` calls replaced with `formatForStorage()`
- [ ] Database timezone set to UTC
- [ ] Migration script executed successfully

### **Frontend:**
- [ ] All date formatting uses timezone utilities
- [ ] Times display correctly in IST
- [ ] No hardcoded timezone conversions

### **Testing:**
- [ ] Login lockouts work correctly
- [ ] Password reset tokens expire properly
- [ ] Admin panel shows correct timestamps
- [ ] Works across different client timezones

---

## **Benefits**

1. **Consistency**: All times stored in one timezone (UTC)
2. **Accuracy**: No more double-conversion issues
3. **Scalability**: Easy to support multiple timezones later
4. **Maintenance**: Centralized timezone handling
5. **Debugging**: Clear separation between storage and display

---

## **Migration Rollback Plan**

If something goes wrong, you can rollback:

```sql
-- Restore from backup
DROP TABLE user_accounts;
RENAME TABLE user_accounts_timezone_backup TO user_accounts;

-- Revert database timezone
SET GLOBAL time_zone = 'SYSTEM';
```

---

## **Next Steps**

1. **Execute Migration**: Run the database migration script
2. **Update Code**: Replace all timezone-related function calls
3. **Test Thoroughly**: Verify all functionality works correctly
4. **Deploy**: Push changes to production
5. **Monitor**: Watch for any timezone-related issues
