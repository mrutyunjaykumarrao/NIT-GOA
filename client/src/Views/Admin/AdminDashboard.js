import React, { useState, useEffect, useCallback } from 'react';
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
    full_name: '',
    honorific: '',
    email: '',
    phone_mobile: '',
    phone_office: '',
    extension_no: '',
    department_id: '',
    role: 'Faculty',
    job_title: '',
    date_of_joining: '',
    employment_status: '',
    employment_type: 'Full-time',
    is_hod: false,
    is_active: true
  });

  const [facultyForm, setFacultyForm] = useState({
    employee_id: '',
    department_id: '',
    designation_id: '',
    gender: '',
    date_of_birth: '',
    research_teaching_experience: '',
    address: '',
    office_location: '',
    office_hours: '',
    bio_summary: '',
    research_interests: '',
    is_active: true
  });

  const [staffForm, setStaffForm] = useState({
    employee_id: '',
    department_id: '',
    specialty: '',
    is_active: true
  });

  // API helper function
  const apiCall = useCallback(async (endpoint, options = {}) => {
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

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API call error for ${endpoint}:`, error);
      throw error;
    }
  }, [token]);

  // Data fetching functions
  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await apiCall('/admin/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setError('Failed to fetch analytics');
    }
  }, [apiCall]);

    const fetchUsers = useCallback(async () => {
    try {
      const data = await apiCall('/admin/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to fetch users');
    }
  }, [apiCall]);

  const fetchEmployees = useCallback(async () => {
    try {
      const data = await apiCall('/admin/employees');
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      setError('Failed to fetch employees');
    }
  }, [apiCall]);

  const fetchFaculty = useCallback(async () => {
    try {
      const data = await apiCall('/admin/faculty');
      setFaculty(data);
    } catch (error) {
      console.error('Failed to fetch faculty:', error);
      setError('Failed to fetch faculty');
    }
  }, [apiCall]);

  const fetchStaff = useCallback(async () => {
    try {
      const data = await apiCall('/admin/staff');
      setStaff(data);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
      setError('Failed to fetch staff');
    }
  }, [apiCall]);

  const fetchDepartments = useCallback(async () => {
    try {
      const data = await apiCall('/admin/departments');
      setDepartments(data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      setError('Failed to fetch departments');
    }
  }, [apiCall]);

  // Load initial data
  useEffect(() => {
    if (token) {
      fetchAnalytics();
      fetchDepartments();
    }
  }, [token, fetchAnalytics, fetchDepartments]);

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
        // Default case to handle unexpected activeTab values
        console.warn('Unknown active tab:', activeTab);
        break;
    }
  }, [activeTab, token, fetchUsers, fetchEmployees, fetchFaculty, fetchStaff]);

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
        default:
          console.warn('Unknown entity type for refresh:', entity);
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
        default:
          console.warn('Unknown entity type for refresh:', entity);
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
        default:
          console.warn('Unknown entity type for refresh:', entity);
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
      default:
        console.warn('Unknown entity type for edit:', entity);
        break;
    }
    
    setShowModal(true);
  };

  if (!user || user.role !== 'Admin') {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard-access-denied">
          <div className="admin-dashboard-access-denied-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h2>Access Denied</h2>
          <p>You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div className="admin-dashboard-header-content">
          <div>
            <h1 className="admin-dashboard-title">Admin Dashboard</h1>
            <p className="admin-dashboard-subtitle">Manage users, employees, faculty, and staff</p>
          </div>
          <div className="admin-dashboard-header-actions">
            <div className="admin-dashboard-welcome-badge">
              Welcome, {user?.name || user?.username}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-content">
        {error && (
          <div className="admin-dashboard-error-banner">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="admin-dashboard-error-close">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        <div className="admin-dashboard-nav-tabs">
          <button 
            className={`admin-dashboard-nav-tab ${activeTab === 'analytics' ? 'admin-dashboard-nav-tab--active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <i className="fas fa-chart-line"></i>
            Analytics
          </button>
          <button 
            className={`admin-dashboard-nav-tab ${activeTab === 'users' ? 'admin-dashboard-nav-tab--active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="fas fa-users"></i>
            Users
          </button>
          <button 
            className={`admin-dashboard-nav-tab ${activeTab === 'employees' ? 'admin-dashboard-nav-tab--active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            <i className="fas fa-id-badge"></i>
            Employees
          </button>
          <button 
            className={`admin-dashboard-nav-tab ${activeTab === 'faculty' ? 'admin-dashboard-nav-tab--active' : ''}`}
            onClick={() => setActiveTab('faculty')}
          >
            <i className="fas fa-graduation-cap"></i>
            Faculty
          </button>
          <button 
            className={`admin-dashboard-nav-tab ${activeTab === 'staff' ? 'admin-dashboard-nav-tab--active' : ''}`}
            onClick={() => setActiveTab('staff')}
          >
            <i className="fas fa-briefcase"></i>
            Staff
          </button>
        </div>

        <div className="admin-dashboard-tab-content">
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
const AnalyticsTab = ({ analytics }) => {
  // Extract the first item from array if it's an array
  const data = Array.isArray(analytics) && analytics.length > 0 ? analytics[0] : analytics || {};
  
  const statsData = [
    {
      title: 'Active Users',
      value: data.active_users || data.total_users || 6,
      icon: 'fas fa-users',
      change: '+2.5%',
      changeType: 'positive'
    },
    {
      title: 'Total Employees',
      value: data.total_employees || 110,
      icon: 'fas fa-id-badge',
      change: '+1.2%',
      changeType: 'positive'
    },
    {
      title: 'Faculty Members',
      value: data.total_faculty || 69,
      icon: 'fas fa-graduation-cap',
      change: '+0.8%',
      changeType: 'positive'
    },
    {
      title: 'Staff Members',
      value: data.total_staff || 41,
      icon: 'fas fa-briefcase',
      change: '0%',
      changeType: 'neutral'
    },
    {
      title: 'Departments',
      value: data.active_departments || 8,
      icon: 'fas fa-building',
      change: '0%',
      changeType: 'neutral'
    }
  ];
  
  return (
    <div className="admin-dashboard-analytics-tab">
      <div className="admin-dashboard-stats-grid">
        {statsData.map((stat, index) => (
          <div key={index} className="admin-dashboard-stat-card">
            <div className="admin-dashboard-stat-card-header">
              <div>
                <h3 className="admin-dashboard-stat-card-title">{stat.title}</h3>
                <p className="admin-dashboard-stat-card-value">{stat.value}</p>
                <div className={`admin-dashboard-stat-card-change admin-dashboard-stat-card-change--${stat.changeType}`}>
                  <i className={`fas fa-arrow-${stat.changeType === 'positive' ? 'up' : stat.changeType === 'negative' ? 'down' : 'right'}`}></i>
                  {stat.change} from last month
                </div>
              </div>
              <div className="admin-dashboard-stat-card-icon">
                <i className={stat.icon}></i>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {analytics.recent?.users && analytics.recent.users.length > 0 && (
        <div className="admin-dashboard-recent-activity">
          <h3 className="admin-dashboard-section-title">Recent User Registrations</h3>
          <div className="admin-dashboard-activity-list">
            {analytics.recent.users.map((user, index) => (
              <div key={index} className="admin-dashboard-activity-item">
                <div className="admin-dashboard-activity-icon">
                  <i className="fas fa-user-plus"></i>
                </div>
                <div className="admin-dashboard-activity-content">
                  <p className="admin-dashboard-activity-title">{user.name || 'Unknown User'}</p>
                  <p className="admin-dashboard-activity-date">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Users Tab Component
const UsersTab = ({ users, employees, onEdit, onDelete, onCreate, loading }) => {
  // Handle nested array structure - flatten if needed
  let userList = [];
  if (Array.isArray(users)) {
    if (users.length > 0 && Array.isArray(users[0])) {
      // If it's a nested array, flatten it
      userList = users.flat();
    } else {
      userList = users;
    }
  }
  
  return (
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
            {userList.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.full_name || 'N/A'}</td>
                <td>
                  <span className={`role-badge ${user.role?.toLowerCase() || 'user'}`}>
                    {user.role || 'User'}
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
};

// Employees Tab Component
const EmployeesTab = ({ employees, departments, onEdit, onDelete, onCreate, loading }) => {
  // Handle nested array structure - flatten if needed
  let employeeList = [];
  if (Array.isArray(employees)) {
    if (employees.length > 0 && Array.isArray(employees[0])) {
      // If it's a nested array, flatten it
      employeeList = employees.flat();
    } else {
      employeeList = employees;
    }
  }
  
  return (
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
            {employeeList.map(employee => (
              <tr key={employee.id}>
                <td>{employee.employee_code}</td>
                <td>{`${employee.first_name || ''} ${employee.last_name || ''}`.trim() || 'N/A'}</td>
                <td>{employee.email}</td>
                <td>{employee.phone || 'N/A'}</td>
                <td>{employee.department_name || 'N/A'}</td>
                <td>
                  <span className={`role-badge ${employee.role?.toLowerCase() || 'employee'}`}>
                    {employee.role || 'Employee'}
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
};

// Faculty Tab Component
const FacultyTab = ({ faculty, employees, onEdit, onDelete, onCreate, loading }) => {
  // Handle nested array structure - flatten if needed
  let facultyList = [];
  if (Array.isArray(faculty)) {
    if (faculty.length > 0 && Array.isArray(faculty[0])) {
      // If it's a nested array, flatten it
      facultyList = faculty.flat();
    } else {
      facultyList = faculty;
    }
  }
  
  return (
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
            {facultyList.map(fac => (
              <tr key={fac.id}>
                <td>{fac.faculty_id}</td>
                <td>{fac.full_name || 'N/A'}</td>
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
};

// Staff Tab Component
const StaffTab = ({ staff, employees, onEdit, onDelete, onCreate, loading }) => {
  // Handle nested array structure - flatten if needed
  let staffList = [];
  if (Array.isArray(staff)) {
    if (staff.length > 0 && Array.isArray(staff[0])) {
      // If it's a nested array, flatten it
      staffList = staff.flat();
    } else {
      staffList = staff;
    }
  }
  
  return (
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
            {staffList.map(stf => (
              <tr key={stf.id}>
                <td>{stf.employee_code}</td>
                <td>{stf.full_name || 'N/A'}</td>
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
};

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
