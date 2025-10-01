const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'updated_nitgoa',
  port: 3306
};

async function runMigration() {
  try {
    // Read the SQL migration file
    const migrationPath = path.join(__dirname, '../migrations/create_pending_approvals_table.sql');
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');
    
    // Connect to database
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database');
    
    // Execute the migration
    await connection.execute(migrationSQL);
    console.log('✅ pending_approvals table created successfully');
    
    // Close connection
    await connection.end();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
runMigration();