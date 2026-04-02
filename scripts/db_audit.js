const { pool } = require('../server/src/config/database');

async function auditDatabase() {
  try {
    // Get all tables
    console.log('=== ALL TABLES IN DATABASE ===\n');
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const tables = result.rows;
    console.log('Total tables:', tables.length);
    tables.forEach((row, i) => {
      console.log(`${i + 1}. ${row.table_name}`);
    });
    
    console.log('\n=== DETAILED SCHEMA FOR EACH TABLE ===\n');
    
    for (const table of tables) {
      const tableName = table.table_name;
      
      // Get column information
      const columns = await pool.query(`
        SELECT 
          column_name, 
          data_type, 
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `, [tableName]);
      
      console.log(`\n📋 TABLE: ${tableName}`);
      console.log('─'.repeat(100));
      console.log('Column Name'.padEnd(35), 'Data Type'.padEnd(20), 'Nullable'.padEnd(10), 'Default');
      console.log('─'.repeat(100));
      
      columns.rows.forEach(col => {
        const colName = col.column_name.padEnd(35);
        const dataType = (col.data_type + (col.character_maximum_length ? `(${col.character_maximum_length})` : '')).padEnd(20);
        const nullable = col.is_nullable.padEnd(10);
        const defaultVal = (col.column_default || 'NULL').substring(0, 40);
        console.log(colName, dataType, nullable, defaultVal);
      });
    }
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

auditDatabase();
