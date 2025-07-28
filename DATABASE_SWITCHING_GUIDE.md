# Database Switching Guide

This guide explains how to switch between the original `nitgoa_db` and the enhanced `updated_nitgoa` databases.

## Quick Switch

Use the database switcher utility:

```bash
# Check current database
node switch-database.js status

# Switch to original database (nitgoa_db)
node switch-database.js original

# Switch to enhanced database (updated_nitgoa)  
node switch-database.js updated
```

## Database Comparison

| Feature | Original (nitgoa_db) | Enhanced (updated_nitgoa) |
|---------|---------------------|---------------------------|
| **Tables** | 17 tables | 18 tables |
| **Schema** | Basic structure | Advanced with relationships |
| **Security** | Basic | Enhanced with audit logs |
| **File Attachments** | No | Yes |
| **User Management** | Basic | Advanced with account locking |
| **Research Areas** | Limited | Hierarchical structure |
| **Data Integrity** | Basic | Advanced constraints |

## Manual Configuration

You can also manually edit the `.env` file:

```bash
# For original database
DB_NAME=nitgoa_db

# For enhanced database  
DB_NAME=updated_nitgoa
```

## Database Schemas

- **Original Database**: Located in previous migrations
- **Enhanced Database**: Located in `database/schemas/updated_nitgoa_schema.sql`

## Important Notes

1. **Data Compatibility**: The databases have different schemas, so data may not be directly compatible
2. **Server Restart**: Always restart the server after switching databases
3. **Backup**: Consider backing up your data before switching
4. **Testing**: Use `node test-db.js` to verify database connectivity after switching

## Getting Started

1. Ensure both databases exist in your MySQL server
2. Use the switcher utility to change databases
3. Restart your server
4. Test the connection with `node test-db.js`

## Troubleshooting

- If database doesn't exist, create it first in MySQL
- Check database credentials in `.env` file
- Verify MySQL server is running
- Check server logs for any connection errors
