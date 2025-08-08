import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFaculty: 0,
    activeUsers: 0
  });
  const [users, setUsers] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [error, setError] = useState('');

  // Custom logout handler
  const handleLogout = () => {
    logout();
    navigate('/login', { 
      state: { from: location },
      replace: true 
    });
  };

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'Admin') {
      navigate('/');
      return;
    }
    
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load stats and data
      const [usersResponse, facultyResponse] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/faculty')
      ]);
      
      const usersData = usersResponse.data;
      const facultyData = facultyResponse.data;
      
      setUsers(usersData);
      setFaculty(facultyData);
      
      // Calculate stats
      setStats({
        totalUsers: usersData.length,
        totalFaculty: facultyData.length,
        activeUsers: usersData.filter(u => u.is_active).length
      });
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await axios.post('/api/admin/users', userData);
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user');
    }
  };

  const handleResetPassword = async (userId) => {
    if (window.confirm('Are you sure you want to reset this user\'s password?')) {
      try {
        await axios.post(`/api/admin/users/${userId}/reset-password`);
        alert('Password reset successfully');
      } catch (error) {
        console.error('Error resetting password:', error);
        setError('Failed to reset password');
      }
    }
  };

  const TabButton = ({ tabKey, label, icon }) => (
    <button
      className={`tab-button ${activeTab === tabKey ? 'active' : ''}`}
      onClick={() => setActiveTab(tabKey)}
    >
      <i className={icon}></i>
      <span>{label}</span>
    </button>
  );

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title">
            <h1>
              <i className="fas fa-cogs"></i>
              Admin Dashboard
            </h1>
            <p>National Institute of Technology Goa</p>
          </div>
          <div className="admin-user-info">
            <span>Welcome, {user?.name || user?.username}</span>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="admin-content">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <TabButton 
              tabKey="overview" 
              label="Overview" 
              icon="fas fa-chart-line" 
            />
            <TabButton 
              tabKey="users" 
              label="Users" 
              icon="fas fa-users" 
            />
            <TabButton 
              tabKey="faculty" 
              label="Faculty" 
              icon="fas fa-user-tie" 
            />
            <TabButton 
              tabKey="settings" 
              label="Settings" 
              icon="fas fa-cog" 
            />
          </nav>
        </div>

        <div className="admin-main">
          {activeTab === 'overview' && (
            <OverviewTab stats={stats} />
          )}
          
          {activeTab === 'users' && (
            <UsersTab 
              users={users} 
              onCreateUser={handleCreateUser}
              onResetPassword={handleResetPassword}
            />
          )}
          
          {activeTab === 'faculty' && (
            <FacultyTab faculty={faculty} />
          )}
          
          {activeTab === 'settings' && (
            <SettingsTab />
          )}
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ stats }) => (
  <div className="overview-tab">
    <h2>Dashboard Overview</h2>
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">
          <i className="fas fa-users"></i>
        </div>
        <div className="stat-content">
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <i className="fas fa-user-tie"></i>
        </div>
        <div className="stat-content">
          <h3>{stats.totalFaculty}</h3>
          <p>Faculty Members</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <i className="fas fa-user-check"></i>
        </div>
        <div className="stat-content">
          <h3>{stats.activeUsers}</h3>
          <p>Active Users</p>
        </div>
      </div>
    </div>
    
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      <p>Activity tracking coming soon...</p>
    </div>
  </div>
);

// Users Tab Component
const UsersTab = ({ users, onCreateUser, onResetPassword }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'user',
    password: ''
  });

  const handleSubmitUser = (e) => {
    e.preventDefault();
    onCreateUser(newUser);
    setNewUser({ username: '', email: '', role: 'user', password: '' });
    setShowCreateForm(false);
  };

  return (
    <div className="users-tab">
      <div className="tab-header">
        <h2>User Management</h2>
        <button 
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <i className="fas fa-plus"></i>
          Create User
        </button>
      </div>

      {showCreateForm && (
        <div className="create-user-form">
          <h3>Create New User</h3>
          <form onSubmit={handleSubmitUser}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
              />
            </div>
            <div className="form-row">
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="faculty">Faculty</option>
              </select>
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit">Create User</button>
              <button type="button" onClick={() => setShowCreateForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="action-btn"
                    onClick={() => onResetPassword(user.id)}
                  >
                    Reset Password
                  </button>
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
const FacultyTab = ({ faculty }) => (
  <div className="faculty-tab">
    <h2>Faculty Management</h2>
    <div className="faculty-grid">
      {faculty.map(member => (
        <div key={member.id} className="faculty-card">
          <div className="faculty-info">
            <h3>{member.full_name}</h3>
            <p><strong>Department:</strong> {member.department}</p>
            <p><strong>Designation:</strong> {member.designation}</p>
            <p><strong>Employee ID:</strong> {member.employee_id}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Settings Tab Component
const SettingsTab = () => (
  <div className="settings-tab">
    <h2>Settings</h2>
    <div className="settings-section">
      <h3>System Configuration</h3>
      <p>Settings panel coming soon...</p>
    </div>
  </div>
);

export default AdminDashboard;
