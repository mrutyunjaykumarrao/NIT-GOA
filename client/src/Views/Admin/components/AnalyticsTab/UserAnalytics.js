import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useError } from '../../../../contexts/ErrorContext';
import './AnalyticsTab.css';

const UserAnalytics = () => {
  const { token } = useAuth();
  const { addToast } = useError();
  const [users, setUsers] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API helper function with auth
  const apiCall = async (endpoint, options = {}) => {
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
  };

  // Fetch user management data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user management data (auth required)
        try {
          const usersData = await apiCall('/admin/users');
          setUsers(usersData || []);
        } catch (error) {
          console.error('Failed to load users data:', error);
        }
        
        try {
          const facultyData = await apiCall('/admin/faculty');
          setFaculty(facultyData || []);
        } catch (error) {
          console.error('Failed to load faculty data:', error);
        }
        
        try {
          const staffData = await apiCall('/admin/staff');
          setStaff(staffData || []);
        } catch (error) {
          console.error('Failed to load staff data:', error);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
        if (addToast) {
          addToast('Failed to load user data', 'error', 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token, addToast]);

  // Calculate user analytics data
  const calculateUserAnalytics = () => {
    const totalUsers = users?.length || 0;
    const totalFaculty = faculty?.length || 0;
    const totalStaff = staff?.length || 0;
    const totalEmployees = totalFaculty + totalStaff;

    // Active users count
    const activeUsers = users?.filter(user => user.is_active)?.length || 0;
    const activeFaculty = faculty?.filter(fac => fac.is_active)?.length || 0;
    const activeStaff = staff?.filter(st => st.is_active)?.length || 0;

    // Department distribution for faculty
    const departmentStats = {};
    faculty?.forEach(fac => {
      const dept = fac.department_name || 'Unknown';
      departmentStats[dept] = (departmentStats[dept] || 0) + 1;
    });

    // HOD count
    const hodCount = faculty?.filter(fac => fac.is_hod)?.length || 0;

    // User role distribution
    const roleStats = {};
    users?.forEach(user => {
      const role = user.role || 'Unknown';
      roleStats[role] = (roleStats[role] || 0) + 1;
    });

    return {
      totals: {
        users: totalUsers,
        faculty: totalFaculty,
        staff: totalStaff,
        employees: totalEmployees
      },
      active: {
        users: activeUsers,
        faculty: activeFaculty,
        staff: activeStaff,
        percentage: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0
      },
      departments: departmentStats,
      roles: roleStats,
      hods: hodCount
    };
  };

  const adminAnalyticsData = calculateUserAnalytics();

  const StatCard = ({ title, value, subtitle, icon, color = 'blue' }) => (
    <div className={`analytics-tab-stat-card analytics-tab-stat-card--${color}`}>
      <div className="analytics-tab-stat-card-icon">
        <i className={icon}></i>
      </div>
      <div className="analytics-tab-stat-card-content">
        <h3 className="analytics-tab-stat-card-title">{title}</h3>
        <p className="analytics-tab-stat-card-value">{value}</p>
        {subtitle && <span className="analytics-tab-stat-card-subtitle">{subtitle}</span>}
      </div>
    </div>
  );

  const ChartCard = ({ title, children }) => (
    <div className="analytics-tab-chart-card">
      <h4 className="analytics-tab-chart-title">{title}</h4>
      <div className="analytics-tab-chart-content">
        {children}
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, total, color = '#3B82F6' }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
      <div className="analytics-tab-progress-item">
        <div className="analytics-tab-progress-header">
          <span className="analytics-tab-progress-label">{label}</span>
          <span className="analytics-tab-progress-value">{value}</span>
        </div>
        <div className="analytics-tab-progress-bar">
          <div 
            className="analytics-tab-progress-fill"
            style={{ 
              width: `${percentage}%`, 
              backgroundColor: color 
            }}
          ></div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="analytics-tab-loading">
        <div className="analytics-tab-spinner"></div>
        <p>Loading user analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-tab-error">
        <h3>User Analytics Unavailable</h3>
        <p>{error}</p>
        <p>User management data cannot be loaded at the moment.</p>
      </div>
    );
  }

  return (
    <>
      {/* User Management Stats */}
      <div className="analytics-tab-stats-grid">
        <StatCard
          title="Total Users"
          value={adminAnalyticsData.totals.users}
          subtitle={`${adminAnalyticsData.active.users} active`}
          icon="fas fa-users"
          color="blue"
        />
        <StatCard
          title="Faculty Members"
          value={adminAnalyticsData.totals.faculty}
          subtitle={`${adminAnalyticsData.active.faculty} active`}
          icon="fas fa-chalkboard-teacher"
          color="green"
        />
        <StatCard
          title="Staff Members"
          value={adminAnalyticsData.totals.staff}
          subtitle={`${adminAnalyticsData.active.staff} active`}
          icon="fas fa-user-tie"
          color="purple"
        />
        <StatCard
          title="Department Heads"
          value={adminAnalyticsData.hods}
          subtitle="HODs appointed"
          icon="fas fa-crown"
          color="orange"
        />
      </div>

      {/* Charts Section - Existing Layout */}
      <div className="analytics-tab-charts-grid analytics-tab-charts-grid--redesigned">
        {/* Left Column - Department Distribution */}
        <div className="analytics-tab-chart-column analytics-tab-chart-column--left">
          <ChartCard title="Faculty Distribution by Department">
            <div className="analytics-tab-department-stats">
              {Object.entries(adminAnalyticsData.departments).map(([dept, count]) => (
                <ProgressBar
                  key={dept}
                  label={dept}
                  value={count}
                  total={adminAnalyticsData.totals.faculty}
                  color="#10B981"
                />
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Right Column - User Roles and Activity */}
        <div className="analytics-tab-chart-column analytics-tab-chart-column--right">
          {/* User Roles Distribution - Compact */}
          <ChartCard title="User Roles Distribution">
            <div className="analytics-tab-role-stats analytics-tab-role-stats--compact">
              {Object.entries(adminAnalyticsData.roles).map(([role, count]) => (
                <ProgressBar
                  key={role}
                  label={role}
                  value={count}
                  total={adminAnalyticsData.totals.users}
                  color="#8B5CF6"
                />
              ))}
            </div>
          </ChartCard>

          {/* System Activity Overview */}
          <ChartCard title="System Activity Overview">
            <div className="analytics-tab-activity-overview">
              <div className="analytics-tab-activity-item">
                <div className="analytics-tab-activity-metric">
                  <span className="analytics-tab-activity-label">Active Users</span>
                  <span className="analytics-tab-activity-value">
                    {adminAnalyticsData.active.percentage}%
                  </span>
                </div>
                <div className="analytics-tab-activity-bar">
                  <div 
                    className="analytics-tab-activity-fill"
                    style={{ width: `${adminAnalyticsData.active.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="analytics-tab-activity-summary">
                <p>
                  <strong>{adminAnalyticsData.active.users}</strong> out of{' '}
                  <strong>{adminAnalyticsData.totals.users}</strong> users are currently active
                </p>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </>
  );
};

export default UserAnalytics;
