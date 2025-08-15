const { executeQuery } = require('./src/config/database');
const bcrypt = require('bcrypt');

(async () => {
  try {
    // Check admin password hash
    const adminUser = await executeQuery('SELECT username, password_hash FROM user_accounts WHERE username = "admin"');
    console.log('Admin user found:', adminUser[0]?.length > 0);
    
    if (adminUser[0]?.length > 0) {
      const admin = adminUser[0][0];
      console.log('Admin details:', { username: admin.username, hasPassword: !!admin.password_hash });
      
      // If no password, create one
      if (!admin.password_hash) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await executeQuery('UPDATE user_accounts SET password_hash = ? WHERE username = "admin"', [hashedPassword]);
        console.log('✅ Admin password set to: admin123');
      } else {
        console.log('✅ Admin already has password');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
