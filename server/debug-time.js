const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkTimes() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Mrutyu@2026',
      database: 'updated_nitgoa',
      timezone: '+00:00'
    });

    const [results] = await connection.execute(`
      SELECT 
        username,
        lockout_timestamp,
        lockout_duration_minutes,
        NOW() as mysql_now,
        UTC_TIMESTAMP() as mysql_utc
      FROM user_accounts 
      WHERE username = ?
    `, ['admin']);
    
    console.log('📊 Database times:', results[0]);
    
    // Test our timezone functions
    const { parseFromStorage, formatForDisplay, getUTCNow, getMinutesDifference, addMinutes } = require('./src/utils/timezone');
    
    if (results[0].lockout_timestamp) {
      const lockoutStart = parseFromStorage(results[0].lockout_timestamp);
      const now = getUTCNow();
      const lockoutEnd = addMinutes(lockoutStart, results[0].lockout_duration_minutes);
      const remainingTime = getMinutesDifference(lockoutEnd, now);
      
      console.log('🔧 Our calculations:');
      console.log('  lockout_timestamp from DB:', results[0].lockout_timestamp);
      console.log('  parsed lockoutStart (UTC):', lockoutStart.toISOString());
      console.log('  current time (UTC):', now.toISOString());
      console.log('  lockoutEnd (UTC):', lockoutEnd.toISOString());
      console.log('  remainingTime (minutes):', remainingTime);
      console.log('  formatForDisplay lockoutStart:', formatForDisplay(lockoutStart));
      console.log('  formatForDisplay lockoutEnd:', formatForDisplay(lockoutEnd));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

checkTimes();
