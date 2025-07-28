#!/usr/bin/env node

/**
 * Data Import Script for NIT GOA Enhanced Database
 * Imports departments and courses from JSON files
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'updated_nitgoa',
    port: process.env.DB_PORT || 3306,
    charset: 'utf8mb4'
};

// File paths
const DEPARTMENTS_FILE = path.join(__dirname, '../RefrenceMaterial/collaborators/MJ 2/updated_database/departments.json');
const COURSES_FILE = path.join(__dirname, '../RefrenceMaterial/collaborators/MJ 2/updated_database/courses.json');

async function connectDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Database connected successfully!');
        console.log(`📊 Connected to database: ${dbConfig.database}`);
        return connection;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
}

async function importDepartments(connection) {
    console.log('\n🏢 Importing Departments...');
    
    try {
        // Read departments JSON file
        const departmentsData = JSON.parse(fs.readFileSync(DEPARTMENTS_FILE, 'utf8'));
        
        // Clear existing departments (optional - uncomment if needed)
        // await connection.execute('DELETE FROM departments WHERE department_id > 0');
        
        let importCount = 0;
        let updateCount = 0;
        
        for (const [departmentName, departmentCode] of Object.entries(departmentsData)) {
            // Check if department already exists
            const [existing] = await connection.execute(
                'SELECT department_id FROM departments WHERE department_code = ? OR department_name = ?',
                [departmentCode, departmentName]
            );
            
            if (existing.length > 0) {
                // Update existing department
                await connection.execute(
                    `UPDATE departments SET 
                     department_name = ?, 
                     department_code = ?, 
                     is_active = TRUE, 
                     updated_at = CURRENT_TIMESTAMP 
                     WHERE department_id = ?`,
                    [departmentName, departmentCode, existing[0].department_id]
                );
                updateCount++;
                console.log(`   ⬆️  Updated: ${departmentCode} - ${departmentName}`);
            } else {
                // Insert new department
                await connection.execute(
                    `INSERT INTO departments (department_name, department_code, description, is_active, display_order) 
                     VALUES (?, ?, ?, TRUE, ?)`,
                    [departmentName, departmentCode, `${departmentName}`, importCount + 1]
                );
                importCount++;
                console.log(`   ➕ Added: ${departmentCode} - ${departmentName}`);
            }
        }
        
        console.log(`✅ Departments import completed! Added: ${importCount}, Updated: ${updateCount}`);
        return { added: importCount, updated: updateCount };
        
    } catch (error) {
        console.error('❌ Error importing departments:', error.message);
        throw error;
    }
}

async function importCourses(connection) {
    console.log('\n📚 Importing Courses...');
    
    try {
        // Read courses JSON file
        const coursesData = JSON.parse(fs.readFileSync(COURSES_FILE, 'utf8'));
        
        // Get department mappings
        const [departments] = await connection.execute('SELECT department_id, department_code FROM departments');
        const deptMapping = {};
        departments.forEach(dept => {
            deptMapping[dept.department_code] = dept.department_id;
        });
        
        let importCount = 0;
        let updateCount = 0;
        let skippedCount = 0;
        
        // Import undergraduate courses
        if (coursesData.undergraduate_courses) {
            console.log('   📖 Processing undergraduate courses...');
            
            for (const [courseCode, courseName] of Object.entries(coursesData.undergraduate_courses)) {
                // Determine department from course code
                const deptCode = extractDepartmentCode(courseCode);
                const departmentId = deptMapping[deptCode] || null;
                
                // Check if course already exists
                const [existing] = await connection.execute(
                    'SELECT course_id FROM courses WHERE course_code = ?',
                    [courseCode]
                );
                
                if (existing.length > 0) {
                    // Update existing course
                    await connection.execute(
                        `UPDATE courses SET 
                         course_name = ?, 
                         department_id = ?, 
                         course_level = 'Undergraduate',
                         is_active = TRUE, 
                         updated_at = CURRENT_TIMESTAMP 
                         WHERE course_id = ?`,
                        [courseName, departmentId, existing[0].course_id]
                    );
                    updateCount++;
                } else {
                    // Insert new course
                    await connection.execute(
                        `INSERT INTO courses (course_code, course_name, course_level, department_id, is_active) 
                         VALUES (?, ?, 'Undergraduate', ?, TRUE)`,
                        [courseCode, courseName, departmentId]
                    );
                    importCount++;
                }
                
                if (!departmentId) {
                    console.log(`   ⚠️  No department found for course: ${courseCode} (dept: ${deptCode})`);
                    skippedCount++;
                }
            }
        }
        
        // Import postgraduate courses
        if (coursesData.postgraduate_courses) {
            console.log('   🎓 Processing postgraduate courses...');
            
            for (const [courseCode, courseName] of Object.entries(coursesData.postgraduate_courses)) {
                // Determine department from course code
                const deptCode = extractDepartmentCode(courseCode);
                const departmentId = deptMapping[deptCode] || null;
                
                // Check if course already exists
                const [existing] = await connection.execute(
                    'SELECT course_id FROM courses WHERE course_code = ?',
                    [courseCode]
                );
                
                if (existing.length > 0) {
                    // Update existing course
                    await connection.execute(
                        `UPDATE courses SET 
                         course_name = ?, 
                         department_id = ?, 
                         course_level = 'Postgraduate',
                         is_active = TRUE, 
                         updated_at = CURRENT_TIMESTAMP 
                         WHERE course_id = ?`,
                        [courseName, departmentId, existing[0].course_id]
                    );
                    updateCount++;
                } else {
                    // Insert new course
                    await connection.execute(
                        `INSERT INTO courses (course_code, course_name, course_level, department_id, is_active) 
                         VALUES (?, ?, 'Postgraduate', ?, TRUE)`,
                        [courseCode, courseName, departmentId]
                    );
                    importCount++;
                }
            }
        }
        
        console.log(`✅ Courses import completed! Added: ${importCount}, Updated: ${updateCount}, Warnings: ${skippedCount}`);
        return { added: importCount, updated: updateCount, skipped: skippedCount };
        
    } catch (error) {
        console.error('❌ Error importing courses:', error.message);
        throw error;
    }
}

function extractDepartmentCode(courseCode) {
    // Extract department code from course code
    // Examples: CS100 -> CS, EC150 -> EC, MA201 -> MA, etc.
    const match = courseCode.match(/^([A-Z]+)/);
    
    // Map common prefixes to our department codes
    const mapping = {
        'CS': 'CSE',
        'EC': 'ECE', 
        'EE': 'EEE',
        'ME': 'MCE',
        'CV': 'CVE',
        'MA': 'APS',  // Mathematics courses go to Applied Sciences
        'PH': 'APS',  // Physics courses go to Applied Sciences
        'CY': 'APS',  // Chemistry courses go to Applied Sciences
        'HU': 'HSS',  // Humanities courses
        'HS': 'HSS',  // Humanities and Social Sciences
        'IE': 'MCE',  // Industrial Engineering -> Mechanical
        'ES': 'CVE',  // Environmental Studies -> Civil
        'PE': 'HSS',  // Physical Education -> HSS
        'IKS': 'HSS', // Indian Knowledge System -> HSS
        'IKXXX': 'HSS'
    };
    
    if (match) {
        const prefix = match[1];
        return mapping[prefix] || prefix;
    }
    
    return 'CSE'; // Default fallback
}

async function displaySummary(connection) {
    console.log('\n📊 Database Summary:');
    
    try {
        // Count departments
        const [deptCount] = await connection.execute('SELECT COUNT(*) as count FROM departments WHERE is_active = TRUE');
        console.log(`   🏢 Active Departments: ${deptCount[0].count}`);
        
        // Count courses by level
        const [ugCount] = await connection.execute("SELECT COUNT(*) as count FROM courses WHERE course_level = 'Undergraduate' AND is_active = TRUE");
        const [pgCount] = await connection.execute("SELECT COUNT(*) as count FROM courses WHERE course_level = 'Postgraduate' AND is_active = TRUE");
        console.log(`   📚 Undergraduate Courses: ${ugCount[0].count}`);
        console.log(`   🎓 Postgraduate Courses: ${pgCount[0].count}`);
        
        // Show department breakdown
        const [breakdown] = await connection.execute(`
            SELECT d.department_code, d.department_name, COUNT(c.course_id) as course_count
            FROM departments d 
            LEFT JOIN courses c ON d.department_id = c.department_id AND c.is_active = TRUE
            WHERE d.is_active = TRUE
            GROUP BY d.department_id, d.department_code, d.department_name
            ORDER BY d.department_code
        `);
        
        console.log('\n   📋 Courses per Department:');
        breakdown.forEach(dept => {
            console.log(`      ${dept.department_code}: ${dept.course_count} courses`);
        });
        
    } catch (error) {
        console.error('❌ Error generating summary:', error.message);
    }
}

async function main() {
    console.log('🔧 NIT GOA Data Import Utility');
    console.log('===============================\n');
    
    let connection;
    
    try {
        // Connect to database
        connection = await connectDatabase();
        
        // Import departments
        const deptResults = await importDepartments(connection);
        
        // Import courses
        const courseResults = await importCourses(connection);
        
        // Display summary
        await displaySummary(connection);
        
        console.log('\n🎉 Data import completed successfully!');
        console.log(`\n📈 Final Results:`);
        console.log(`   Departments: ${deptResults.added} added, ${deptResults.updated} updated`);
        console.log(`   Courses: ${courseResults.added} added, ${courseResults.updated} updated, ${courseResults.skipped} warnings`);
        
    } catch (error) {
        console.error('\n❌ Import failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed.');
        }
    }
}

// Run the import
if (require.main === module) {
    main();
}
