import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data states
  const [analytics, setAnalytics] = useState({});
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create' or 'edit'
  const [modalEntity, setModalEntity] = useState(''); // 'user', 'employee', 'faculty', 'staff'
  const [selectedItem, setSelectedItem] = useState(null);

  // Form data states
  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    role: 'Faculty',
    employee_id: '',
    is_active: true
  });

  const [employeeForm, setEmployeeForm] = useState({
    employee_code: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department_id: '',
    role: 'Faculty',
    position: '',
    joining_date: '',
    is_active: true
  });

  const [facultyForm, setFacultyForm] = useState({
    faculty_id: '',
    employee_id: '',
    designation: '',
    specialization: '',
    qualification: '',
    experience_years: '',
    research_interests: '',
    is_hod: false,
    is_active: true
  });

  const [staffForm, setStaffForm] = useState({
    employee_id: '',
    position: '',
    department: '',
    qualifications: '',
    skills: '',
    is_active: true
  });

  // API helper function
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`/api${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  // Data fetching functions
  const fetchAnalytics = async () => {
    try {
      const data = await apiCall('/admin/analytics');
      setAnalytics(data);
    } catch (error) {
      setError('Failed to fetch analytics');
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await apiCall('/admin/users');
      setUsers(data);
    } catch (error) {
      setError('Failed to fetch users');
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await apiCall('/admin/employees');
      setEmployees(data);
    } catch (error) {
      setError('Failed to fetch employees');
    }
  };

  const fetchFaculty = async () => {
    try {
      const data = await apiCall('/admin/faculty');
      setFaculty(data);
    } catch (error) {
      setError('Failed to fetch faculty');
    }
  };

  const fetchStaff = async () => {
    try {
      const data = await apiCall('/admin/staff');
      setStaff(data);
    } catch (error) {
      setError('Failed to fetch staff');
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await apiCall('/admin/departments');
      setDepartments(data);
    } catch (error) {
      setError('Failed to fetch departments');
    }
  };

  // Load initial data
  useEffect(() => {
    if (token) {
      fetchAnalytics();
      fetchDepartments();
    }
  }, [token]);

  // Load tab-specific data
  useEffect(() => {
    if (!token) return;
    
    switch (activeTab) {
      case 'users':
        fetchUsers();
        break;
      case 'employees':
        fetchEmployees();
        break;
      case 'faculty':
        fetchFaculty();
        break;
      case 'staff':
        fetchStaff();
        break;
      default:
        break;
    }
  }, [activeTab, token]);

  // CRUD operations
  const handleCreate = async (entity) => {
    setLoading(true);
    try {
      let formData;
      switch (entity) {
        case 'user':
          formData = userForm;
          break;
        case 'employee':
          formData = employeeForm;
          break;
        case 'faculty':
          formData = facultyForm;
          break;
        case 'staff':
          formData = staffForm;
          break;
        default:
          throw new Error('Invalid entity type');
      }

      await apiCall(`/admin/${entity === 'user' ? 'users' : entity}`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      // Refresh data
      switch (entity) {
        case 'user':
          fetchUsers();
          break;
        case 'employee':
          fetchEmployees();
          break;
        case 'faculty':
          fetchFaculty();
          break;
        case 'staff':
          fetchStaff();
          break;
      }

      setShowModal(false);
      resetForms();
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (entity, id) => {
    setLoading(true);
    try {
      let formData;
      switch (entity) {
        case 'user':
          formData = userForm;
          break;
        case 'employee':
          formData = employeeForm;
          break;
        case 'faculty':
          formData = facultyForm;
          break;
        case 'staff':
          formData = staffForm;
          break;
        default:
          throw new Error('Invalid entity type');
      }

      await apiCall(`/admin/${entity === 'user' ? 'users' : entity}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });

      // Refresh data
      switch (entity) {
        case 'user':
          fetchUsers();
          break;
        case 'employee':
          fetchEmployees();
          break;
        case 'faculty':
          fetchFaculty();
          break;
        case 'staff':
          fetchStaff();
          break;
      }

      setShowModal(false);
      resetForms();
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entity, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setLoading(true);
    try {
      await apiCall(`/admin/${entity === 'user' ? 'users' : entity}/${id}`, {
        method: 'DELETE'
      });

      // Refresh data
      switch (entity) {
        case 'user':
          fetchUsers();
          break;
        case 'employee':
          fetchEmployees();
          break;
        case 'faculty':
          fetchFaculty();
          break;
        case 'staff':
          fetchStaff();
          break;
      }

      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Form helpers
  const resetForms = () => {
    setUserForm({
      username: '',
      password: '',
      role: 'Faculty',
      employee_id: '',
      is_active: true
    });
    setEmployeeForm({
      employee_code: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      department_id: '',
      role: 'Faculty',
      position: '',
      joining_date: '',
      is_active: true
    });
    setFacultyForm({
      faculty_id: '',
      employee_id: '',
      designation: '',
      specialization: '',
      qualification: '',
      experience_years: '',
      research_interests: '',
      is_hod: false,
      is_active: true
    });
    setStaffForm({
      employee_id: '',
      position: '',
      department: '',
      qualifications: '',
      skills: '',
      is_active: true
    });
  };

  const openCreateModal = (entity) => {
    resetForms();
    setModalType('create');
    setModalEntity(entity);
    setSelectedItem(null);
    setShowModal(true);
  };

  const openEditModal = (entity, item) => {
    setModalType('edit');
    setModalEntity(entity);
    setSelectedItem(item);
    
    // Populate form with existing data
    switch (entity) {
      case 'user':
        setUserForm({
          username: item.username || '',
          password: '', // Don't populate password for security
          role: item.role || 'Faculty',
          employee_id: item.employee_id || '',
          is_active: item.is_active !== undefined ? item.is_active : true
        });
        break;
      case 'employee':
        setEmployeeForm({
          employee_code: item.employee_code || '',
          first_name: item.first_name || '',
          last_name: item.last_name || '',
          email: item.email || '',
          phone: item.phone || '',
          department_id: item.department_id || '',
          role: item.role || 'Faculty',
          position: item.position || '',
          joining_date: item.joining_date ? item.joining_date.split('T')[0] : '',
          is_active: item.is_active !== undefined ? item.is_active : true
        });
        break;
      case 'faculty':
        setFacultyForm({
          faculty_id: item.faculty_id || '',
          employee_id: item.employee_id || '',
          designation: item.designation || '',
          specialization: item.specialization || '',
          qualification: item.qualification || '',
          experience_years: item.experience_years || '',
          research_interests: item.research_interests || '',
          is_hod: item.is_hod || false,
          is_active: item.is_active !== undefined ? item.is_active : true
        });
        break;
      case 'staff':
        setStaffForm({
          employee_id: item.employee_id || '',
          position: item.position || '',
          department: item.department || '',
          qualifications: item.qualifications || '',
          skills: item.skills || '',
          is_active: item.is_active !== undefined ? item.is_active : true
        });
        break;
    }
    
    setShowModal(true);
  };

  if (!user || user.role !== 'Admin') {
    return (
      <div className="admin-dashboard">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, employees, faculty, and staff</p>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="admin-tabs">
        <button 
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={activeTab === 'employees' ? 'active' : ''}
          onClick={() => setActiveTab('employees')}
        >
          Employees
        </button>
        <button 
          className={activeTab === 'faculty' ? 'active' : ''}
          onClick={() => setActiveTab('faculty')}
        >
          Faculty
        </button>
        <button 
          className={activeTab === 'staff' ? 'active' : ''}
          onClick={() => setActiveTab('staff')}
        >
          Staff
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'analytics' && (
          <AnalyticsTab analytics={analytics} />
        )}
        
        {activeTab === 'users' && (
          <UsersTab 
            users={users}
            employees={employees}
            onEdit={(item) => openEditModal('user', item)}
            onDelete={(id) => handleDelete('user', id)}
            onCreate={() => openCreateModal('user')}
            loading={loading}
          />
        )}
        
        {activeTab === 'employees' && (
          <EmployeesTab 
            employees={employees}
            departments={departments}
            onEdit={(item) => openEditModal('employee', item)}
            onDelete={(id) => handleDelete('employee', id)}
            onCreate={() => openCreateModal('employee')}
            loading={loading}
          />
        )}
        
        {activeTab === 'faculty' && (
          <FacultyTab 
            faculty={faculty}
            employees={employees}
            onEdit={(item) => openEditModal('faculty', item)}
            onDelete={(id) => handleDelete('faculty', id)}
            onCreate={() => openCreateModal('faculty')}
            loading={loading}
          />
        )}
        
        {activeTab === 'staff' && (
          <StaffTab 
            staff={staff}
            employees={employees}
            onEdit={(item) => openEditModal('staff', item)}
            onDelete={(id) => handleDelete('staff', id)}
            onCreate={() => openCreateModal('staff')}
            loading={loading}
          />
        )}
      </div>

      {showModal && (
        <Modal
          type={modalType}
          entity={modalEntity}
          item={selectedItem}
          userForm={userForm}
          setUserForm={setUserForm}
          employeeForm={employeeForm}
          setEmployeeForm={setEmployeeForm}
          facultyForm={facultyForm}
          setFacultyForm={setFacultyForm}
          staffForm={staffForm}
          setStaffForm={setStaffForm}
          employees={employees}
          departments={departments}
          onSave={() => {
            if (modalType === 'create') {
              handleCreate(modalEntity);
            } else {
              handleUpdate(modalEntity, selectedItem.id);
            }
          }}
          onClose={() => setShowModal(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab = ({ analytics }) => (
  <div className="analytics-tab">
    <h2>System Overview</h2>
    <div className="analytics-grid">
      <div className="analytics-card">
        <h3>Active Users</h3>
        <p className="analytics-number">{analytics.totals?.users || 0}</p>
      </div>
      <div className="analytics-card">
        <h3>Total Employees</h3>
        <p className="analytics-number">{analytics.totals?.employees || 0}</p>
      </div>
      <div className="analytics-card">
        <h3>Faculty Members</h3>
        <p className="analytics-number">{analytics.totals?.faculty || 0}</p>
      </div>
      <div className="analytics-card">
        <h3>Staff Members</h3>
        <p className="analytics-number">{analytics.totals?.staff || 0}</p>
      </div>
      <div className="analytics-card">
        <h3>Departments</h3>
        <p className="analytics-number">{analytics.totals?.departments || 0}</p>
      </div>
    </div>
    
    {analytics.recent?.users && analytics.recent.users.length > 0 && (
      <div className="recent-activity">
        <h3>Recent User Registrations</h3>
        <ul>
          {analytics.recent.users.map((user, index) => (
            <li key={index}>
              {user.name || 'Unknown'} - {new Date(user.created_at).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

// Users Tab Component
const UsersTab = ({ users, employees, onEdit, onDelete, onCreate, loading }) => (
  <div className="users-tab">
    <div className="tab-header">
      <h2>User Accounts</h2>
      <button className="create-btn" onClick={onCreate} disabled={loading}>
        + Create User
      </button>
    </div>
    
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Department</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.full_name || 'N/A'}</td>
              <td>
                <span className={`role-badge ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </td>
              <td>{user.email || 'N/A'}</td>
              <td>{user.department_name || 'N/A'}</td>
              <td>
                <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</td>
              <td>
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => onEdit(user)}>Edit</button>
                  <button className="delete-btn" onClick={() => onDelete(user.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Employees Tab Component
const EmployeesTab = ({ employees, departments, onEdit, onDelete, onCreate, loading }) => (
  <div className="employees-tab">
    <div className="tab-header">
      <h2>Employee Management</h2>
      <button className="create-btn" onClick={onCreate} disabled={loading}>
        + Create Employee
      </button>
    </div>
    
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Employee Code</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Role</th>
            <th>Position</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.employee_code}</td>
              <td>{`${employee.first_name} ${employee.last_name}`}</td>
              <td>{employee.email}</td>
              <td>{employee.phone || 'N/A'}</td>
              <td>{employee.department_name || 'N/A'}</td>
              <td>
                <span className={`role-badge ${employee.role.toLowerCase()}`}>
                  {employee.role}
                </span>
              </td>
              <td>{employee.position || 'N/A'}</td>
              <td>
                <span className={`status-badge ${employee.is_active ? 'active' : 'inactive'}`}>
                  {employee.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => onEdit(employee)}>Edit</button>
                  <button className="delete-btn" onClick={() => onDelete(employee.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Faculty Tab Component
const FacultyTab = ({ faculty, employees, onEdit, onDelete, onCreate, loading }) => (
  <div className="faculty-tab">
    <div className="tab-header">
      <h2>Faculty Management</h2>
      <button className="create-btn" onClick={onCreate} disabled={loading}>
        + Create Faculty Profile
      </button>
    </div>
    
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Faculty ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Specialization</th>
            <th>Experience</th>
            <th>HOD</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {faculty.map(fac => (
            <tr key={fac.id}>
              <td>{fac.faculty_id}</td>
              <td>{fac.full_name}</td>
              <td>{fac.email}</td>
              <td>{fac.department_name || 'N/A'}</td>
              <td>{fac.designation || 'N/A'}</td>
              <td>{fac.specialization || 'N/A'}</td>
              <td>{fac.experience_years ? `${fac.experience_years} years` : 'N/A'}</td>
              <td>{fac.is_hod ? '✓' : '✗'}</td>
              <td>
                <span className={`status-badge ${fac.is_active ? 'active' : 'inactive'}`}>
                  {fac.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => onEdit(fac)}>Edit</button>
                  <button className="delete-btn" onClick={() => onDelete(fac.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Staff Tab Component
const StaffTab = ({ staff, employees, onEdit, onDelete, onCreate, loading }) => (
  <div className="staff-tab">
    <div className="tab-header">
      <h2>Staff Management</h2>
      <button className="create-btn" onClick={onCreate} disabled={loading}>
        + Create Staff Profile
      </button>
    </div>
    
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Employee Code</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Position</th>
            <th>Role</th>
            <th>Qualifications</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map(stf => (
            <tr key={stf.id}>
              <td>{stf.employee_code}</td>
              <td>{stf.full_name}</td>
              <td>{stf.email}</td>
              <td>{stf.department_name || stf.department || 'N/A'}</td>
              <td>{stf.position || 'N/A'}</td>
              <td>
                <span className={`role-badge ${stf.employee_role?.toLowerCase() || 'staff'}`}>
                  {stf.employee_role || 'Staff'}
                </span>
              </td>
              <td>{stf.qualifications || 'N/A'}</td>
              <td>
                <span className={`status-badge ${stf.is_active ? 'active' : 'inactive'}`}>
                  {stf.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => onEdit(stf)}>Edit</button>
                  <button className="delete-btn" onClick={() => onDelete(stf.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Modal Component
const Modal = ({ 
  type, 
  entity, 
  item,
  userForm, 
  setUserForm,
  employeeForm, 
  setEmployeeForm,
  facultyForm, 
  setFacultyForm,
  staffForm, 
  setStaffForm,
  employees,
  departments,
  onSave, 
  onClose, 
  loading 
}) => {
  const title = `${type === 'create' ? 'Create' : 'Edit'} ${entity.charAt(0).toUpperCase() + entity.slice(1)}`;

  const renderForm = () => {
    switch (entity) {
      case 'user':
        return (
          <UserForm 
            form={userForm} 
            setForm={setUserForm} 
            employees={employees}
            showPassword={type === 'create'}
          />
        );
      case 'employee':
        return (
          <EmployeeForm 
            form={employeeForm} 
            setForm={setEmployeeForm} 
            departments={departments}
          />
        );
      case 'faculty':
        return (
          <FacultyForm 
            form={facultyForm} 
            setForm={setFacultyForm} 
            employees={employees}
          />
        );
      case 'staff':
        return (
          <StaffForm 
            form={staffForm} 
            setForm={setStaffForm} 
            employees={employees}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {renderForm()}
        </div>
        
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="save-btn" onClick={onSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Form Components
const UserForm = ({ form, setForm, employees, showPassword }) => (
  <div className="form-grid">
    <div className="form-group">
      <label>Username</label>
      <input
        type="text"
        value={form.username}
        onChange={(e) => setForm({...form, username: e.target.value})}
        required
      />
    </div>
    
    {showPassword && (
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({...form, password: e.target.value})}
          required
        />
      </div>
    )}
    
    <div className="form-group">
      <label>Role</label>
      <select
        value={form.role}
        onChange={(e) => setForm({...form, role: e.target.value})}
      >
        <option value="Admin">Admin</option>
        <option value="Faculty">Faculty</option>
        <option value="Staff">Staff</option>
      </select>
    </div>
    
    <div className="form-group">
      <label>Employee</label>
      <select
        value={form.employee_id}
        onChange={(e) => setForm({...form, employee_id: e.target.value})}
        required
      >
        <option value="">Select Employee</option>
        {employees.map(emp => (
          <option key={emp.id} value={emp.id}>
            {emp.employee_code} - {emp.first_name} {emp.last_name}
          </option>
        ))}
      </select>
    </div>
    
    <div className="form-group checkbox-group">
      <label>
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => setForm({...form, is_active: e.target.checked})}
        />
        Active
      </label>
    </div>
  </div>
);

const EmployeeForm = ({ form, setForm, departments }) => (
  <div className="form-grid">
    <div className="form-group">
      <label>Employee Code</label>
      <input
        type="text"
        value={form.employee_code}
        onChange={(e) => setForm({...form, employee_code: e.target.value})}
        required
      />
    </div>
    
    <div className="form-group">
      <label>First Name</label>
      <input
        type="text"
        value={form.first_name}
        onChange={(e) => setForm({...form, first_name: e.target.value})}
        required
      />
    </div>
    
    <div className="form-group">
      <label>Last Name</label>
      <input
        type="text"
        value={form.last_name}
        onChange={(e) => setForm({...form, last_name: e.target.value})}
        required
      />
    </div>
    
    <div className="form-group">
      <label>Email</label>
      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm({...form, email: e.target.value})}
        required
      />
    </div>
    
    <div className="form-group">
      <label>Phone</label>
      <input
        type="tel"
        value={form.phone}
        onChange={(e) => setForm({...form, phone: e.target.value})}
      />
    </div>
    
    <div className="form-group">
      <label>Department</label>
      <select
        value={form.department_id}
        onChange={(e) => setForm({...form, department_id: e.target.value})}
        required
      >
        <option value="">Select Department</option>
        {departments.map(dept => (
          <option key={dept.id} value={dept.id}>
            {dept.department_name}
          </option>
        ))}
      </select>
    </div>
    
    <div className="form-group">
      <label>Role</label>
      <select
        value={form.role}
        onChange={(e) => setForm({...form, role: e.target.value})}
      >
        <option value="Faculty">Faculty</option>
        <option value="Technical">Technical Staff</option>
        <option value="Administrative">Administrative Staff</option>
      </select>
    </div>
    
    <div className="form-group">
      <label>Position</label>
      <input
        type="text"
        value={form.position}
        onChange={(e) => setForm({...form, position: e.target.value})}
      />
    </div>
    
    <div className="form-group">
      <label>Joining Date</label>
      <input
        type="date"
        value={form.joining_date}
        onChange={(e) => setForm({...form, joining_date: e.target.value})}
      />
    </div>
    
    <div className="form-group checkbox-group">
      <label>
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => setForm({...form, is_active: e.target.checked})}
        />
        Active
      </label>
    </div>
  </div>
);

const FacultyForm = ({ form, setForm, employees }) => (
  <div className="form-grid">
    <div className="form-group">
      <label>Faculty ID</label>
      <input
        type="text"
        value={form.faculty_id}
        onChange={(e) => setForm({...form, faculty_id: e.target.value})}
        required
      />
    </div>
    
    <div className="form-group">
      <label>Employee</label>
      <select
        value={form.employee_id}
        onChange={(e) => setForm({...form, employee_id: e.target.value})}
        required
      >
        <option value="">Select Employee</option>
        {employees.filter(emp => emp.role === 'Faculty').map(emp => (
          <option key={emp.id} value={emp.id}>
            {emp.employee_code} - {emp.first_name} {emp.last_name}
          </option>
        ))}
      </select>
    </div>
    
    <div className="form-group">
      <label>Designation</label>
      <input
        type="text"
        value={form.designation}
        onChange={(e) => setForm({...form, designation: e.target.value})}
      />
    </div>
    
    <div className="form-group">
      <label>Specialization</label>
      <input
        type="text"
        value={form.specialization}
        onChange={(e) => setForm({...form, specialization: e.target.value})}
      />
    </div>
    
    <div className="form-group">
      <label>Qualification</label>
      <textarea
        value={form.qualification}
        onChange={(e) => setForm({...form, qualification: e.target.value})}
      />
    </div>
    
    <div className="form-group">
      <label>Experience (Years)</label>
      <input
        type="number"
        value={form.experience_years}
        onChange={(e) => setForm({...form, experience_years: e.target.value})}
        min="0"
      />
    </div>
    
    <div className="form-group full-width">
      <label>Research Interests</label>
      <textarea
        value={form.research_interests}
        onChange={(e) => setForm({...form, research_interests: e.target.value})}
      />
    </div>
    
    <div className="form-group checkbox-group">
      <label>
        <input
          type="checkbox"
          checked={form.is_hod}
          onChange={(e) => setForm({...form, is_hod: e.target.checked})}
        />
        Head of Department
      </label>
    </div>
    
    <div className="form-group checkbox-group">
      <label>
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => setForm({...form, is_active: e.target.checked})}
        />
        Active
      </label>
    </div>
  </div>
);

const StaffForm = ({ form, setForm, employees }) => (
  <div className="form-grid">
    <div className="form-group">
      <label>Employee</label>
      <select
        value={form.employee_id}
        onChange={(e) => setForm({...form, employee_id: e.target.value})}
        required
      >
        <option value="">Select Employee</option>
        {employees.filter(emp => emp.role !== 'Faculty').map(emp => (
          <option key={emp.id} value={emp.id}>
            {emp.employee_code} - {emp.first_name} {emp.last_name}
          </option>
        ))}
      </select>
    </div>
    
    <div className="form-group">
      <label>Position</label>
      <input
        type="text"
        value={form.position}
        onChange={(e) => setForm({...form, position: e.target.value})}
      />
    </div>
    
    <div className="form-group">
      <label>Department</label>
      <input
        type="text"
        value={form.department}
        onChange={(e) => setForm({...form, department: e.target.value})}
      />
    </div>
    
    <div className="form-group full-width">
      <label>Qualifications</label>
      <textarea
        value={form.qualifications}
        onChange={(e) => setForm({...form, qualifications: e.target.value})}
      />
    </div>
    
    <div className="form-group full-width">
      <label>Skills</label>
      <textarea
        value={form.skills}
        onChange={(e) => setForm({...form, skills: e.target.value})}
      />
    </div>
    
    <div className="form-group checkbox-group">
      <label>
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => setForm({...form, is_active: e.target.checked})}
        />
        Active
      </label>
    </div>
  </div>
);

export default AdminDashboard;
