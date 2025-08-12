import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import FacultyTab from './components/FacultyTab/FacultyTab';
import StaffTab from './components/StaffTab/StaffTab';
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
      setAnalytics(data.analytics || {});
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setError('Failed to load analytics data');
    }
  }, [apiCall]);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await apiCall('/admin/users');
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to load users data');
    }
  }, [apiCall]);

  const fetchEmployees = useCallback(async () => {
    try {
      const data = await apiCall('/admin/employees');
      setEmployees(data.employees || []);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      setError('Failed to load employees data');
    }
  }, [apiCall]);

  const fetchFaculty = useCallback(async () => {
    try {
      const data = await apiCall('/admin/faculty');
      setFaculty(data.faculty || []);
    } catch (error) {
      console.error('Failed to fetch faculty:', error);
      setError('Failed to load faculty data');
    }
  }, [apiCall]);

  const fetchStaff = useCallback(async () => {
    try {
      const data = await apiCall('/admin/staff');
      setStaff(data.staff || []);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
      setError('Failed to load staff data');
    }
  }, [apiCall]);

  const fetchDepartments = useCallback(async () => {
    try {
      const data = await apiCall('/admin/departments');
      setDepartments(data.departments || []);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      setError('Failed to load departments data');
    }
  }, [apiCall]);

  // Load data based on active tab
  const loadTabData = useCallback(async (tab) => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      switch (tab) {
        case 'analytics':
          await fetchAnalytics();
          break;
        case 'users':
          await Promise.all([fetchUsers(), fetchEmployees()]);
          break;
        case 'faculty':
          await Promise.all([fetchFaculty(), fetchEmployees(), fetchDepartments()]);
          break;
        case 'staff':
          await Promise.all([fetchStaff(), fetchEmployees(), fetchDepartments()]);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Failed to load ${tab} data:`, error);
      setError(`Failed to load ${tab} data`);
    } finally {
      setLoading(false);
    }
  }, [token, fetchAnalytics, fetchUsers, fetchEmployees, fetchFaculty, fetchStaff, fetchDepartments]);

  // Load initial data
  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab, loadTabData]);

  // CRUD operations
  const handleCreate = async (entity) => {
    setLoading(true);
    try {
      let formData, endpoint;
      
      switch (entity) {
        case 'user':
          formData = userForm;
          endpoint = '/admin/users';
          break;
        case 'employee':
          formData = employeeForm;
          endpoint = '/admin/employees';
          break;
        case 'faculty':
          formData = facultyForm;
          endpoint = '/admin/faculty';
          break;
        case 'staff':
          formData = staffForm;
          endpoint = '/admin/staff';
          break;
        default:
          throw new Error('Unknown entity type');
      }

      await apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      setShowModal(false);
      loadTabData(activeTab);
      
    } catch (error) {
      console.error(`Failed to create ${entity}:`, error);
      setError(`Failed to create ${entity}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (entity, id) => {
    setLoading(true);
    try {
      let formData, endpoint;
      
      switch (entity) {
        case 'user':
          formData = userForm;
          endpoint = `/admin/users/${id}`;
          break;
        case 'employee':
          formData = employeeForm;
          endpoint = `/admin/employees/${id}`;
          break;
        case 'faculty':
          formData = facultyForm;
          endpoint = `/admin/faculty/${id}`;
          break;
        case 'staff':
          formData = staffForm;
          endpoint = `/admin/staff/${id}`;
          break;
        default:
          throw new Error('Unknown entity type');
      }

      await apiCall(endpoint, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });

      setShowModal(false);
      loadTabData(activeTab);
      
    } catch (error) {
      console.error(`Failed to update ${entity}:`, error);
      setError(`Failed to update ${entity}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entity, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${entity}?`)) {
      return;
    }

    setLoading(true);
    try {
      let endpoint;
      
      switch (entity) {
        case 'user':
          endpoint = `/admin/users/${id}`;
          break;
        case 'employee':
          endpoint = `/admin/employees/${id}`;
          break;
        case 'faculty':
          endpoint = `/admin/faculty/${id}`;
          break;
        case 'staff':
          endpoint = `/admin/staff/${id}`;
          break;
        default:
          throw new Error('Unknown entity type');
      }

      await apiCall(endpoint, {
        method: 'DELETE'
      });

      loadTabData(activeTab);
      
    } catch (error) {
      console.error(`Failed to delete ${entity}:`, error);
      setError(`Failed to delete ${entity}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const openCreateModal = (entity) => {
    setModalType('create');
    setModalEntity(entity);
    setSelectedItem(null);
    
    // Reset forms
    switch (entity) {
      case 'user':
        setUserForm({
          username: '',
          password: '',
          role: 'Faculty',
          employee_id: '',
          is_active: true
        });
        break;
      case 'employee':
        setEmployeeForm({
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
        break;
      case 'faculty':
        setFacultyForm({
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
        break;
      case 'staff':
        setStaffForm({
          employee_id: '',
          department_id: '',
          specialty: '',
          is_active: true
        });
        break;
      default:
        break;
    }
    
    setShowModal(true);
  };

  const openEditModal = (entity, item) => {
    setModalType('edit');
    setModalEntity(entity);
    setSelectedItem(item);
    
    // Populate forms with existing data
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
            <p className="admin-dashboard-subtitle">Manage users, faculty, and staff</p>
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
            <div className="admin-dashboard-analytics">
              <h3>Analytics Overview</h3>
              <p>Analytics functionality will be implemented here.</p>
            </div>
          )}
        
          {activeTab === 'users' && (
            <div className="admin-dashboard-users">
              <h3>Users Management</h3>
              <p>Users management functionality will be implemented here.</p>
            </div>
          )}
          
          {activeTab === 'faculty' && (
            <FacultyTab 
              facultyList={faculty}
            />
          )}
          
          {activeTab === 'staff' && (
            <StaffTab 
              staffList={staff}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
