#!/usr/bin/env node

/**
 * Database Switcher Utility
 * Easily switch between nitgoa_db and updated_nitgoa databases
 */

const fs = require('fs');
const path = require('path');

const ENV_FILE = path.join(__dirname, '.env');
const DATABASES = {
    'original': 'nitgoa_db',
    'updated': 'updated_nitgoa'
};

function switchDatabase(dbType) {
    if (!DATABASES[dbType]) {
        console.error('❌ Invalid database type. Use "original" or "updated"');
        process.exit(1);
    }

    try {
        // Read current .env file
        let envContent = fs.readFileSync(ENV_FILE, 'utf8');
        
        // Replace the DB_NAME line
        const currentDbName = DATABASES[dbType];
        envContent = envContent.replace(/^DB_NAME=.*$/m, `DB_NAME=${currentDbName}`);
        
        // Write back to .env file
        fs.writeFileSync(ENV_FILE, envContent);
        
        console.log('🔄 Database Configuration Updated!');
        console.log(`✅ Switched to: ${currentDbName}`);
        console.log('');
        console.log('📋 Database Info:');
        if (dbType === 'original') {
            console.log('   • Database: nitgoa_db (Original schema)');
            console.log('   • Tables: 17 tables with existing data');
            console.log('   • Features: Basic faculty and staff management');
        } else {
            console.log('   • Database: updated_nitgoa (Enhanced schema)');
            console.log('   • Tables: 18 tables with advanced features');
            console.log('   • Features: Enhanced security, audit logs, file attachments');
        }
        console.log('');
        console.log('🚀 Restart your server to apply changes:');
        console.log('   cd server && npm start');
        
    } catch (error) {
        console.error('❌ Error updating .env file:', error.message);
        process.exit(1);
    }
}

function showCurrentDatabase() {
    try {
        const envContent = fs.readFileSync(ENV_FILE, 'utf8');
        const dbNameMatch = envContent.match(/^DB_NAME=(.*)$/m);
        
        if (dbNameMatch) {
            const currentDb = dbNameMatch[1];
            console.log('📋 Current Database Configuration:');
            console.log(`   Database: ${currentDb}`);
            
            if (currentDb === 'nitgoa_db') {
                console.log('   Type: Original database');
            } else if (currentDb === 'updated_nitgoa') {
                console.log('   Type: Enhanced database');
            } else {
                console.log('   Type: Custom database');
            }
        } else {
            console.log('❌ Could not find DB_NAME in .env file');
        }
    } catch (error) {
        console.error('❌ Error reading .env file:', error.message);
    }
}

// Main execution
const command = process.argv[2];

console.log('🔧 NIT GOA Database Switcher');
console.log('=============================');
console.log('');

switch (command) {
    case 'original':
        switchDatabase('original');
        break;
    case 'updated':
        switchDatabase('updated');
        break;
    case 'status':
        showCurrentDatabase();
        break;
    default:
        console.log('Usage: node switch-database.js [command]');
        console.log('');
        console.log('Commands:');
        console.log('  original  - Switch to nitgoa_db (original database)');
        console.log('  updated   - Switch to updated_nitgoa (enhanced database)');
        console.log('  status    - Show current database configuration');
        console.log('');
        console.log('Examples:');
        console.log('  node switch-database.js original');
        console.log('  node switch-database.js updated');
        console.log('  node switch-database.js status');
        break;
}
