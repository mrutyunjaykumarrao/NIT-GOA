import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import FacultyTab from './components/FacultyTab/FacultyTab';
import StaffTab from './components/StaffTab/StaffTab';
import AnalyticsTab from './components/AnalyticsTab/AnalyticsTab';
import UsersTab from './components/UsersTab/UsersTab';
import { UserModal, EmployeeModal, FacultyModal, StaffModal } from './components/AdminModals';
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
      setAnalytics(data || {});
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setError('Failed to load analytics data');
    }
  }, [apiCall]);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await apiCall('/admin/users');
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to load users data');
    }
  }, [apiCall]);

  const fetchEmployees = useCallback(async () => {
    try {
      const data = await apiCall('/admin/employees');
      setEmployees(data || []);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      setError('Failed to load employees data');
    }
  }, [apiCall]);

  const fetchFaculty = useCallback(async () => {
    try {
      const data = await apiCall('/admin/faculty');
      setFaculty(data || []);
    } catch (error) {
      console.error('Failed to fetch faculty:', error);
      setError('Failed to load faculty data');
    }
  }, [apiCall]);

  const fetchStaff = useCallback(async () => {
    try {
      const data = await apiCall('/admin/staff');
      setStaff(data || []);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
      setError('Failed to load staff data');
    }
  }, [apiCall]);

  const fetchDepartments = useCallback(async () => {
    try {
      const data = await apiCall('/admin/departments');
      setDepartments(data || []);
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
  const handleCreate = async (entity, formData) => {
    setLoading(true);
    try {
      let endpoint;
      
      switch (entity) {
        case 'user':
          endpoint = '/admin/users';
          break;
        case 'employee':
          endpoint = '/admin/employees';
          break;
        case 'faculty':
          endpoint = '/admin/faculty';
          break;
        case 'staff':
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

  const handleUpdate = async (entity, id, formData) => {
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
    setShowModal(true);
  };

  const openEditModal = (entity, item) => {
    setModalType('edit');
    setModalEntity(entity);
    setSelectedItem(item);
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
            <AnalyticsTab 
              analytics={analytics}
              users={users}
              faculty={faculty}
              staff={staff}
            />
          )}
        
          {activeTab === 'users' && (
            <UsersTab 
              usersList={users}
              onCreateUser={() => openCreateModal('user')}
              onEditUser={(user) => openEditModal('user', user)}
              onDeleteUser={(id) => handleDelete('user', id)}
            />
          )}
          
          {activeTab === 'faculty' && (
            <FacultyTab 
              facultyList={faculty}
              onCreateFaculty={() => openCreateModal('faculty')}
              onEditFaculty={(faculty) => openEditModal('faculty', faculty)}
              onDeleteFaculty={(id) => handleDelete('faculty', id)}
            />
          )}
          
          {activeTab === 'staff' && (
            <StaffTab 
              staffList={staff}
              onCreateStaff={() => openCreateModal('staff')}
              onEditStaff={(staff) => openEditModal('staff', staff)}
              onDeleteStaff={(id) => handleDelete('staff', id)}
            />
          )}
        </div>

        {/* Modals */}
        <UserModal
          show={showModal && modalEntity === 'user'}
          onClose={() => setShowModal(false)}
          onSubmit={modalType === 'create' ? 
            (data) => handleCreate('user', data) : 
            (data) => handleUpdate('user', selectedItem?.user_id || selectedItem?.id, data)
          }
          mode={modalType}
          initialData={selectedItem}
          employees={employees}
        />

        <EmployeeModal
          show={showModal && modalEntity === 'employee'}
          onClose={() => setShowModal(false)}
          onSubmit={modalType === 'create' ? 
            (data) => handleCreate('employee', data) : 
            (data) => handleUpdate('employee', selectedItem?.employee_id, data)
          }
          mode={modalType}
          initialData={selectedItem}
          departments={departments}
        />

        <FacultyModal
          show={showModal && modalEntity === 'faculty'}
          onClose={() => setShowModal(false)}
          onSubmit={modalType === 'create' ? 
            (data) => handleCreate('faculty', data) : 
            (data) => handleUpdate('faculty', selectedItem?.faculty_id, data)
          }
          mode={modalType}
          initialData={selectedItem}
          employees={employees}
          departments={departments}
        />

        <StaffModal
          show={showModal && modalEntity === 'staff'}
          onClose={() => setShowModal(false)}
          onSubmit={modalType === 'create' ? 
            (data) => handleCreate('staff', data) : 
            (data) => handleUpdate('staff', selectedItem?.staff_id, data)
          }
          mode={modalType}
          initialData={selectedItem}
          employees={employees}
          departments={departments}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
