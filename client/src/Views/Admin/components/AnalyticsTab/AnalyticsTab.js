import React, { useState, useEffect } from 'react';
import './AnalyticsTab.css';

const AnalyticsTab = ({ analytics, users, faculty, staff }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Calculate analytics data
  const calculateAnalytics = () => {
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

  const analyticsData = calculateAnalytics();

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

  return (
    <div className="analytics-tab-container">
      {/* Header */}
      <div className="analytics-tab-header">
        <div className="analytics-tab-title-section">
          <h2 className="analytics-tab-title">Analytics Dashboard</h2>
          <p className="analytics-tab-subtitle">
            Comprehensive overview of system metrics and performance
          </p>
        </div>
        <div className="analytics-tab-controls">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="analytics-tab-time-select"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="analytics-tab-stats-grid">
        <StatCard
          title="Total Users"
          value={analyticsData.totals.users}
          subtitle={`${analyticsData.active.users} active`}
          icon="fas fa-users"
          color="blue"
        />
        <StatCard
          title="Faculty Members"
          value={analyticsData.totals.faculty}
          subtitle={`${analyticsData.active.faculty} active`}
          icon="fas fa-chalkboard-teacher"
          color="green"
        />
        <StatCard
          title="Staff Members"
          value={analyticsData.totals.staff}
          subtitle={`${analyticsData.active.staff} active`}
          icon="fas fa-user-tie"
          color="purple"
        />
        <StatCard
          title="Department Heads"
          value={analyticsData.hods}
          subtitle="HODs appointed"
          icon="fas fa-crown"
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="analytics-tab-charts-grid">
        {/* Department Distribution */}
        <ChartCard title="Faculty Distribution by Department">
          <div className="analytics-tab-department-stats">
            {Object.entries(analyticsData.departments).map(([dept, count]) => (
              <ProgressBar
                key={dept}
                label={dept}
                value={count}
                total={analyticsData.totals.faculty}
                color="#10B981"
              />
            ))}
          </div>
        </ChartCard>

        {/* User Roles Distribution */}
        <ChartCard title="User Roles Distribution">
          <div className="analytics-tab-role-stats">
            {Object.entries(analyticsData.roles).map(([role, count]) => (
              <ProgressBar
                key={role}
                label={role}
                value={count}
                total={analyticsData.totals.users}
                color="#8B5CF6"
              />
            ))}
          </div>
        </ChartCard>

        {/* Activity Overview */}
        <ChartCard title="System Activity Overview">
          <div className="analytics-tab-activity-overview">
            <div className="analytics-tab-activity-item">
              <div className="analytics-tab-activity-metric">
                <span className="analytics-tab-activity-label">Active Users</span>
                <span className="analytics-tab-activity-value">
                  {analyticsData.active.percentage}%
                </span>
              </div>
              <div className="analytics-tab-activity-bar">
                <div 
                  className="analytics-tab-activity-fill"
                  style={{ width: `${analyticsData.active.percentage}%` }}
                ></div>
              </div>
            </div>
            <div className="analytics-tab-activity-summary">
              <p>
                <strong>{analyticsData.active.users}</strong> out of{' '}
                <strong>{analyticsData.totals.users}</strong> users are currently active
              </p>
            </div>
          </div>
        </ChartCard>

        {/* Quick Stats */}
        <ChartCard title="Quick Statistics">
          <div className="analytics-tab-quick-stats">
            <div className="analytics-tab-quick-stat">
              <span className="analytics-tab-quick-stat-label">Total Employees</span>
              <span className="analytics-tab-quick-stat-value">{analyticsData.totals.employees}</span>
            </div>
            <div className="analytics-tab-quick-stat">
              <span className="analytics-tab-quick-stat-label">Departments</span>
              <span className="analytics-tab-quick-stat-value">{Object.keys(analyticsData.departments).length}</span>
            </div>
            <div className="analytics-tab-quick-stat">
              <span className="analytics-tab-quick-stat-label">User Roles</span>
              <span className="analytics-tab-quick-stat-value">{Object.keys(analyticsData.roles).length}</span>
            </div>
            <div className="analytics-tab-quick-stat">
              <span className="analytics-tab-quick-stat-label">Active Rate</span>
              <span className="analytics-tab-quick-stat-value">{analyticsData.active.percentage}%</span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Detailed Metrics */}
      <div className="analytics-tab-detailed-section">
        <div className="analytics-tab-section-header">
          <h3 className="analytics-tab-section-title">Detailed Metrics</h3>
          <div className="analytics-tab-metric-tabs">
            <button
              className={`analytics-tab-metric-tab ${selectedMetric === 'overview' ? 'analytics-tab-metric-tab--active' : ''}`}
              onClick={() => setSelectedMetric('overview')}
            >
              Overview
            </button>
            <button
              className={`analytics-tab-metric-tab ${selectedMetric === 'departments' ? 'analytics-tab-metric-tab--active' : ''}`}
              onClick={() => setSelectedMetric('departments')}
            >
              Departments
            </button>
            <button
              className={`analytics-tab-metric-tab ${selectedMetric === 'activity' ? 'analytics-tab-metric-tab--active' : ''}`}
              onClick={() => setSelectedMetric('activity')}
            >
              Activity
            </button>
          </div>
        </div>

        <div className="analytics-tab-metric-content">
          {selectedMetric === 'overview' && (
            <div className="analytics-tab-overview-grid">
              <div className="analytics-tab-overview-card">
                <h4>System Health</h4>
                <div className="analytics-tab-health-indicator analytics-tab-health-indicator--good">
                  <i className="fas fa-check-circle"></i>
                  <span>All systems operational</span>
                </div>
              </div>
              <div className="analytics-tab-overview-card">
                <h4>Data Integrity</h4>
                <div className="analytics-tab-health-indicator analytics-tab-health-indicator--good">
                  <i className="fas fa-database"></i>
                  <span>Data consistent</span>
                </div>
              </div>
            </div>
          )}

          {selectedMetric === 'departments' && (
            <div className="analytics-tab-departments-detail">
              <div className="analytics-tab-departments-table">
                <table className="analytics-tab-table">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Faculty Count</th>
                      <th>HOD Assigned</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(analyticsData.departments).map(([dept, count]) => {
                      const hasHod = faculty?.some(fac => fac.department_name === dept && fac.is_hod);
                      return (
                        <tr key={dept}>
                          <td>{dept}</td>
                          <td>{count}</td>
                          <td>
                            <span className={`analytics-tab-status-badge ${hasHod ? 'analytics-tab-status-badge--success' : 'analytics-tab-status-badge--warning'}`}>
                              {hasHod ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td>
                            <span className="analytics-tab-status-badge analytics-tab-status-badge--success">
                              Active
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedMetric === 'activity' && (
            <div className="analytics-tab-activity-detail">
              <div className="analytics-tab-activity-cards">
                <div className="analytics-tab-activity-card">
                  <h4>Recent Activity</h4>
                  <p>Activity tracking will be implemented based on system logs and user interactions.</p>
                </div>
                <div className="analytics-tab-activity-card">
                  <h4>Performance Metrics</h4>
                  <p>Performance monitoring and metrics collection will be added in future updates.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
