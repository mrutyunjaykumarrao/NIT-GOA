import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from './AdminLayout';
import FacultyTab from './components/FacultyTab/FacultyTab';
import TechnicalStaffTab from './components/TechnicalStaffTab/TechnicalStaffTab';
import AdministrativeStaffTab from './components/AdministrativeStaffTab/AdministrativeStaffTab';
import AnalyticsTab from './components/AnalyticsTab/AnalyticsTab';
import UsersTab from './components/UsersTab/UsersTab';
import { UserModal, EmployeeModal, FacultyModal, StaffModal, AdministrativeStaffModal, TechnicalStaffModal, PendingApprovalsModal } from './components/AdminModals';
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
        case 'technical-staff':
        case 'administrative-staff':
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

  // Enhanced staff handlers
  const handleCreateAdminStaff = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create administrative staff');
      }

      const result = await response.json();
      
      // Show success message
      if (result.imagePending) {
        alert(result.message + ' Image is pending admin approval.');
      } else {
        alert(result.message);
      }

      setShowModal(false);
      loadTabData(activeTab);
      
    } catch (error) {
      console.error('Failed to create administrative staff:', error);
      setError(`Failed to create administrative staff: ${error.message}`);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAdminStaff = async (id, formData) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update administrative staff');
      }

      const result = await response.json();
      alert(result.message);

      setShowModal(false);
      loadTabData(activeTab);
      
    } catch (error) {
      console.error('Failed to update administrative staff:', error);
      setError(`Failed to update administrative staff: ${error.message}`);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTechStaff = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create technical staff');
      }

      const result = await response.json();
      
      // Show success message
      if (result.imagePending) {
        alert(result.message + ' Image is pending admin approval.');
      } else {
        alert(result.message);
      }

      setShowModal(false);
      loadTabData(activeTab);
      
    } catch (error) {
      console.error('Failed to create technical staff:', error);
      setError(`Failed to create technical staff: ${error.message}`);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTechStaff = async (id, formData) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update technical staff');
      }

      const result = await response.json();
      alert(result.message);

      setShowModal(false);
      loadTabData(activeTab);
      
    } catch (error) {
      console.error('Failed to update technical staff:', error);
      setError(`Failed to update technical staff: ${error.message}`);
      alert('Error: ' + error.message);
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
      <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="admin-dashboard">
          <div className="admin-dashboard-access-denied">
            <div className="admin-dashboard-access-denied-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h2>Access Denied</h2>
            <p>You need administrator privileges to access this page.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="admin-dashboard">
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

        <div className="admin-dashboard-tab-content">
          {activeTab === 'analytics' && (
            <AnalyticsTab 
              analytics={analytics}
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
          
          {activeTab === 'technical-staff' && (
            <TechnicalStaffTab 
              staffList={staff}
              onCreateStaff={() => openCreateModal('technical-staff')}
              onEditStaff={(staff) => openEditModal('technical-staff', staff)}
              onDeleteStaff={(id) => handleDelete('staff', id)}
            />
          )}
          
          {activeTab === 'administrative-staff' && (
            <AdministrativeStaffTab 
              staffList={staff}
              onCreateStaff={() => openCreateModal('administrative-staff')}
              onEditStaff={(staff) => openEditModal('administrative-staff', staff)}
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

        <AdministrativeStaffModal
          show={showModal && modalEntity === 'administrative-staff'}
          onClose={() => setShowModal(false)}
          onSubmit={modalType === 'create' ? 
            (data) => handleCreateAdminStaff(data) : 
            (data) => handleUpdateAdminStaff(selectedItem?.employee_id, data)
          }
          mode={modalType}
          initialData={selectedItem}
          departments={departments}
          token={token}
        />

        <TechnicalStaffModal
          show={showModal && modalEntity === 'technical-staff'}
          onClose={() => setShowModal(false)}
          onSubmit={modalType === 'create' ? 
            (data) => handleCreateTechStaff(data) : 
            (data) => handleUpdateTechStaff(selectedItem?.employee_id, data)
          }
          mode={modalType}
          initialData={selectedItem}
          departments={departments}
          token={token}
        />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
