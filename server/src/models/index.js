const { executeQuery, withTransaction } = require('../config/database');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async findById(id, columns = '*') {
    const [rows] = await executeQuery(
      `SELECT ${columns} FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  async findAll(conditions = {}, options = {}) {
    const { limit = 50, offset = 0, orderBy = 'id ASC' } = options;
    
    let query = `SELECT * FROM ${this.tableName}`;
    const params = [];
    let paramIndex = 1;
    
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map(key => {
          const placeholder = `$${paramIndex}`;
          paramIndex++;
          return `${key} = ${placeholder}`;
        })
        .join(' AND ');
      query += ` WHERE ${whereClause}`;
      params.push(...Object.values(conditions));
    }
    
    query += ` ORDER BY ${orderBy} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const [rows] = await executeQuery(query, params);
    return rows;
  }

  async create(data) {
    const columns = Object.keys(data);
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
    const values = Object.values(data);
    
    const query = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id`;
    const [result] = await executeQuery(query, values);
    
    return { id: result[0].id, ...data };
  }

  async update(id, data) {
    const columns = Object.keys(data);
    const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(', ');
    const values = [...Object.values(data), id];
    
    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = $${columns.length + 1}`;
    const [result] = await executeQuery(query, values);
    
    return result.length > 0; // PostgreSQL returns affected rows in result array
  }

  async delete(id) {
    const [result] = await executeQuery(
      `DELETE FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return result.length > 0;
  }

  async softDelete(id) {
    return this.update(id, { is_active: 0, updated_at: new Date() });
  }
}

class Employee extends BaseModel {
  constructor() {
    super('employees');
  }

  async findByEmail(email) {
    const [rows] = await executeQuery(
      'SELECT * FROM employees WHERE email = $1 AND is_active = 1',
      [email]
    );
    return rows[0] || null;
  }

  async findByDepartment(departmentId) {
    const [rows] = await executeQuery(
      `SELECT e.*, d.name as department_name 
       FROM employees e 
       JOIN departments d ON e.department_id = d.id 
       WHERE e.department_id = $1 AND e.is_active = 1 
       ORDER BY e.last_name ASC`,
      [departmentId]
    );
    return rows;
  }
}

class Department extends BaseModel {
  constructor() {
    super('departments');
  }

  async findByCode(code) {
    const [rows] = await executeQuery(
      'SELECT * FROM departments WHERE code = $1 AND is_active = 1',
      [code]
    );
    return rows[0] || null;
  }

  async getWithEmployeeCount() {
    const [rows] = await executeQuery(`
      SELECT 
        d.*,
        COUNT(e.id) as employee_count
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id AND e.is_active = 1
      WHERE d.is_active = 1
      GROUP BY d.id
      ORDER BY d.display_order ASC, d.name ASC
    `);
    return rows;
  }
}

class FacultyProfile extends BaseModel {
  constructor() {
    super('faculty_profiles');
  }

  async findByEmployeeId(employeeId) {
    const [rows] = await executeQuery(
      'SELECT * FROM faculty_profiles WHERE employee_id = $1 AND is_active = 1',
      [employeeId]
    );
    return rows[0] || null;
  }

  async findWithEmployeeDetails(id) {
    const [rows] = await executeQuery(`
      SELECT 
        fp.*,
        e.first_name,
        e.last_name,
        CONCAT(e.first_name, ' ', e.last_name) as full_name,
        e.email,
        e.phone,
        e.date_of_birth,
        e.date_of_joining,
        d.name as department_name,
        d.code as department_code
      FROM faculty_profiles fp
      JOIN employees e ON fp.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
      WHERE fp.id = $1 AND fp.is_active = 1
    `, [id]);
    return rows[0] || null;
  }

  async findByDepartment(departmentCode) {
    const [rows] = await executeQuery(`
      SELECT 
        fp.*,
        e.first_name,
        e.last_name,
        CONCAT(e.first_name, ' ', e.last_name) as full_name,
        e.email,
        e.phone,
        d.name as department_name,
        d.code as department_code
      FROM faculty_profiles fp
      JOIN employees e ON fp.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
      WHERE d.code = $1 AND fp.is_active = 1 AND e.is_active = 1
      ORDER BY fp.display_order ASC, e.last_name ASC
    `, [departmentCode]);
    return rows;
  }
}

class FacultyPublication extends BaseModel {
  constructor() {
    super('faculty_publications');
  }

  async findByFacultyProfile(facultyProfileId) {
    const [rows] = await executeQuery(
      `SELECT * FROM faculty_publications 
       WHERE faculty_profile_id = $1 AND is_active = 1 
       ORDER BY publication_year DESC, title ASC`,
      [facultyProfileId]
    );
    return rows;
  }

  async findByYear(year) {
    const [rows] = await executeQuery(
      `SELECT pub.*, 
              CONCAT(e.first_name, ' ', e.last_name) as faculty_name,
              d.name as department_name
       FROM faculty_publications pub
       JOIN faculty_profiles fp ON pub.faculty_profile_id = fp.id
       JOIN employees e ON fp.employee_id = e.id
       JOIN departments d ON e.department_id = d.id
       WHERE pub.publication_year = $1 AND pub.is_active = 1
       ORDER BY pub.title ASC`,
      [year]
    );
    return rows;
  }
}

class Course extends BaseModel {
  constructor() {
    super('courses');
  }

  async findByCode(courseCode) {
    const [rows] = await executeQuery(
      'SELECT * FROM courses WHERE course_code = $1 AND is_active = 1',
      [courseCode]
    );
    return rows[0] || null;
  }

  async findByDepartment(departmentId) {
    const [rows] = await executeQuery(
      `SELECT c.*, d.name as department_name 
       FROM courses c 
       JOIN departments d ON c.department_id = d.id 
       WHERE c.department_id = $1 AND c.is_active = 1 
       ORDER BY c.semester ASC, c.course_code ASC`,
      [departmentId]
    );
    return rows;
  }

  async findByLevel(academicLevel) {
    const [rows] = await executeQuery(
      `SELECT c.*, d.name as department_name 
       FROM courses c 
       JOIN departments d ON c.department_id = d.id 
       WHERE c.academic_level = $1 AND c.is_active = 1 
       ORDER BY c.semester ASC, c.course_code ASC`,
      [academicLevel]
    );
    return rows;
  }
}

class ResearchArea extends BaseModel {
  constructor() {
    super('research_areas');
  }

  async findByParent(parentId = null) {
    const [rows] = await executeQuery(
      'SELECT * FROM research_areas WHERE parent_id = $1 AND is_active = 1 ORDER BY name ASC',
      [parentId]
    );
    return rows;
  }

  async getHierarchy() {
    const [rows] = await executeQuery(`
      SELECT 
        ra.*,
        parent.name as parent_name
      FROM research_areas ra
      LEFT JOIN research_areas parent ON ra.parent_id = parent.id
      WHERE ra.is_active = 1
      ORDER BY COALESCE(ra.parent_id, ra.id), ra.name ASC
    `);
    return rows;
  }
}

class UserAccount extends BaseModel {
  constructor() {
    super('user_accounts');
  }

  async findByUsername(username) {
    const [rows] = await executeQuery(
      'SELECT * FROM user_accounts WHERE username = $1 AND is_active = 1',
      [username]
    );
    return rows[0] || null;
  }

  async findWithEmployeeDetails(id) {
    const [rows] = await executeQuery(`
      SELECT 
        ua.*,
        e.first_name,
        e.last_name,
        e.email,
        e.phone,
        d.name as department_name
      FROM user_accounts ua
      LEFT JOIN employees e ON ua.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE ua.id = $1
    `, [id]);
    return rows[0] || null;
  }
}

class SystemSetting extends BaseModel {
  constructor() {
    super('system_settings');
  }

  async getByKey(key) {
    return this.findByKey(key);
  }

  async findByKey(key) {
    const [rows] = await executeQuery(
      'SELECT * FROM system_settings WHERE setting_key = $1',
      [key]
    );
    return rows[0] || null;
  }

  async getByCategory(category) {
    const [rows] = await executeQuery(
      'SELECT * FROM system_settings WHERE category = $1 ORDER BY setting_key ASC',
      [category]
    );
    return rows;
  }

  async updateValue(key, value) {
    const [result] = await executeQuery(
      'UPDATE system_settings SET setting_value = $1, updated_at = NOW() WHERE setting_key = $2',
      [JSON.stringify(value), key]
    );
    return result.length > 0;
  }
}

class AuditLog extends BaseModel {
  constructor() {
    super('audit_log');
  }

  async findByUser(userId, limit = 50) {
    const [rows] = await executeQuery(
      `SELECT * FROM audit_log 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [userId, limit]
    );
    return rows;
  }

  async findByEntity(entityType, entityId, limit = 50) {
    const [rows] = await executeQuery(
      `SELECT al.*, 
              CONCAT(e.first_name, ' ', e.last_name) as user_name
       FROM audit_log al
       LEFT JOIN user_accounts ua ON al.user_id = ua.id
       LEFT JOIN employees e ON ua.employee_id = e.id
       WHERE al.entity_type = $1 AND al.entity_id = $2
       ORDER BY al.created_at DESC 
       LIMIT $3`,
      [entityType, entityId, limit]
    );
    return rows;
  }

  async log(userId, action, entityType, entityId = null, details = null) {
    return this.create({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: details ? JSON.stringify(details) : null,
      created_at: new Date()
    });
  }
}

module.exports = {
  BaseModel,
  Employee,
  Department,
  FacultyProfile,
  FacultyPublication,
  Course,
  ResearchArea,
  UserAccount,
  SystemSetting,
  AuditLog
};
