import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import useAsyncOperation from '../../hooks/useAsyncOperation';
import AdminLayout from './AdminLayout';
import FacultyTab from './components/FacultyTab/FacultyTab';
import TechnicalStaffTab from './components/TechnicalStaffTab/TechnicalStaffTab';
import AdministrativeStaffTab from './components/AdministrativeStaffTab/AdministrativeStaffTab';
import AnalyticsTab from './components/AnalyticsTab/AnalyticsTab';
import AccountManagement from './components/AccountManagement/AccountManagement';
import PendingApprovalsTab from './components/PendingApprovalsTab/PendingApprovalsTab';
import { UserModal, FacultyModal, AdministrativeStaffModal, TechnicalStaffModal } from './components/AdminModals';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const { executeAsync } = useAsyncOperation();
  const [activeTab, setActiveTab] = useState('analytics');
  const [error, setError] = useState(null);
  
  // Data states
  const [analytics, setAnalytics] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [users, setUsers] = useState([]); // Used by fetchUsers function for API calls
  const [employees, setEmployees] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create' or 'edit'
  const [modalEntity, setModalEntity] = useState(''); // 'user', 'faculty'
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
  const fetchAnalytics = useCallback(() => {
    return executeAsync(
      async () => {
        const data = await apiCall('/admin/analytics');
        setAnalytics(data || {});
        return data;
      },
      {
        showErrorToast: true,
        errorMessage: 'Failed to load analytics data'
      }
    );
  }, [apiCall, executeAsync]);

  const fetchUsers = useCallback(() => {
    return executeAsync(
      async () => {
        const response = await apiCall('/admin/users');
        // Handle new paginated format
        const data = response?.users || response || [];
        setUsers(data);
        return data;
      },
      {
        showErrorToast: true,
        errorMessage: 'Failed to load users data'
      }
    );
  }, [apiCall, executeAsync]);

  const fetchEmployees = useCallback(() => {
    return executeAsync(
      async () => {
        const data = await apiCall('/admin/employees');
        setEmployees(data || []);
        return data;
      },
      {
        showErrorToast: true,
        errorMessage: 'Failed to load employees data'
      }
    );
  }, [apiCall, executeAsync]);

  const fetchFaculty = useCallback(() => {
    return executeAsync(
      async () => {
        const data = await apiCall('/admin/faculty');
        setFaculty(data || []);
        return data;
      },
      {
        showErrorToast: true,
        errorMessage: 'Failed to load faculty data'
      }
    );
  }, [apiCall, executeAsync]);

  const fetchStaff = useCallback(() => {
    return executeAsync(
      async () => {
        const data = await apiCall('/admin/staff');
        setStaff(data || []);
        return data;
      },
      {
        showErrorToast: true,
        errorMessage: 'Failed to load staff data'
      }
    );
  }, [apiCall, executeAsync]);

  const fetchDepartments = useCallback(() => {
    return executeAsync(
      async () => {
        const data = await apiCall('/admin/departments');
        setDepartments(data || []);
        return data;
      },
      {
        showErrorToast: true,
        errorMessage: 'Failed to load departments data'
      }
    );
  }, [apiCall, executeAsync]);

  // Load data based on active tab
  const loadTabData = useCallback(async (tab) => {
    if (!token) return;
    
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
    }
  }, [token, fetchAnalytics, fetchUsers, fetchEmployees, fetchFaculty, fetchStaff, fetchDepartments]);

  // Load initial data
  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab, loadTabData]);

  // CRUD operations
  const handleCreate = (entity, formData) => {
    return executeAsync(
      async () => {
        let endpoint;
        
        switch (entity) {
          case 'user':
            endpoint = '/admin/users';
            break;
          case 'faculty':
            endpoint = '/admin/faculty';
            break;
          default:
            throw new Error('Unknown entity type');
        }

        await apiCall(endpoint, {
          method: 'POST',
          body: JSON.stringify(formData)
        });

        setShowModal(false);
        await loadTabData(activeTab);
      },
      {
        showSuccessToast: true,
        successMessage: `${entity.charAt(0).toUpperCase() + entity.slice(1)} created successfully!`,
        showErrorToast: true,
        errorMessage: `Failed to create ${entity}`
      }
    );
  };

  const handleUpdate = (entity, id, formData) => {
    return executeAsync(
      async () => {
        let endpoint;
        
        switch (entity) {
          case 'user':
            endpoint = `/admin/users/${id}`;
            break;
          case 'faculty':
            endpoint = `/admin/faculty/${id}`;
            break;
          default:
            throw new Error('Unknown entity type');
        }

        await apiCall(endpoint, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });

        setShowModal(false);
        await loadTabData(activeTab);
      },
      {
        showSuccessToast: true,
        successMessage: `${entity.charAt(0).toUpperCase() + entity.slice(1)} updated successfully!`,
        showErrorToast: true,
        errorMessage: `Failed to update ${entity}`
      }
    );
  };

  // Enhanced staff handlers
  const handleCreateAdminStaff = (formData) => {
    return executeAsync(
      async () => {
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
        await loadTabData(activeTab);
        
        return result;
      },
      {
        showSuccessToast: true,
        successMessage: 'Administrative staff created successfully!',
        showErrorToast: true,
        errorMessage: 'Failed to create administrative staff'
      }
    );
  };

  const handleUpdateAdminStaff = (id, formData) => {
    return executeAsync(
      async () => {
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
        await loadTabData(activeTab);
        
        return result;
      },
      {
        showSuccessToast: true,
        successMessage: 'Administrative staff updated successfully!',
        showErrorToast: true,
        errorMessage: 'Failed to update administrative staff'
      }
    );
  };

  const handleCreateTechStaff = (formData) => {
    return executeAsync(
      async () => {
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
        await loadTabData(activeTab);
        
        return result;
      },
      {
        showSuccessToast: true,
        successMessage: 'Technical staff created successfully!',
        showErrorToast: true,
        errorMessage: 'Failed to create technical staff'
      }
    );
  };

  const handleUpdateTechStaff = (id, formData) => {
    return executeAsync(
      async () => {
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
        await loadTabData(activeTab);
        
        return result;
      },
      {
        showSuccessToast: true,
        successMessage: 'Technical staff updated successfully!',
        showErrorToast: true,
        errorMessage: 'Failed to update technical staff'
      }
    );
  };

  const handleDeleteAdminStaff = (id) => {
    if (!window.confirm('Are you sure you want to delete this administrative staff member?')) {
      return;
    }

    return executeAsync(
      async () => {
        const response = await fetch(`/api/admin/employees/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to delete administrative staff');
        }

        await loadTabData(activeTab);
      },
      {
        showSuccessToast: true,
        successMessage: 'Administrative staff deleted successfully!',
        showErrorToast: true,
        errorMessage: 'Failed to delete administrative staff'
      }
    );
  };

  const handleDeleteTechStaff = (id) => {
    if (!window.confirm('Are you sure you want to delete this technical staff member?')) {
      return;
    }

    return executeAsync(
      async () => {
        const response = await fetch(`/api/admin/employees/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to delete technical staff');
        }

        await loadTabData(activeTab);
      },
      {
        showSuccessToast: true,
        successMessage: 'Technical staff deleted successfully!',
        showErrorToast: true,
        errorMessage: 'Failed to delete technical staff'
      }
    );
  };

  const handleDelete = (entity, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${entity}?`)) {
      return;
    }

    return executeAsync(
      async () => {
        let endpoint;
        
        switch (entity) {
          case 'user':
            endpoint = `/admin/users/${id}`;
            break;
          case 'faculty':
            endpoint = `/admin/faculty/${id}`;
            break;
          default:
            throw new Error('Unknown entity type');
        }

        await apiCall(endpoint, {
          method: 'DELETE'
        });

        await loadTabData(activeTab);
      },
      {
        showSuccessToast: true,
        successMessage: `${entity.charAt(0).toUpperCase() + entity.slice(1)} deleted successfully!`,
        showErrorToast: true,
        errorMessage: `Failed to delete ${entity}`
      }
    );
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
        
          {activeTab === 'account-management' && (
            <AccountManagement />
          )}
          
          {activeTab === 'pending-approvals' && (
            <PendingApprovalsTab />
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
              onDeleteStaff={handleDeleteTechStaff}
            />
          )}
          
          {activeTab === 'administrative-staff' && (
            <AdministrativeStaffTab 
              staffList={staff}
              onCreateStaff={() => openCreateModal('administrative-staff')}
              onEditStaff={(staff) => openEditModal('administrative-staff', staff)}
              onDeleteStaff={handleDeleteAdminStaff}
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
