import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { useAuth } from '../../../../contexts/AuthContext';
import './AnalyticsTab.css';

const AnalyticsTab = ({ analytics }) => {
  const { token } = useAuth();
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  
  // Add state for user management data
  const [users, setUsers] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [staff, setStaff] = useState([]);
  const [userDataLoading, setUserDataLoading] = useState(true);

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

  // Fetch ALL data that analytics needs
  useEffect(() => {
    const fetchAllAnalyticsData = async () => {
      try {
        setLoading(true);
        setUserDataLoading(true);
        
        // Fetch website analytics data (no auth required)
        const [dashboardResponse, chartResponse] = await Promise.all([
          fetch('/api/analytics/dashboard-stats'),
          fetch(`/api/analytics/chart-data?period=${selectedPeriod}`)
        ]);
        
        // Process website analytics
        if (dashboardResponse.ok && chartResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          const chartDataResult = await chartResponse.json();
          
          if (dashboardData.success && chartDataResult.success) {
            setAnalyticsData(dashboardData.data);
            setChartData(chartDataResult.data);
          } else {
            console.error('Failed to load website analytics data');
          }
        } else {
          console.error('Website analytics service unavailable');
        }
        
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
        console.error('Error fetching analytics data:', err);
        setError('Failed to connect to analytics service');
      } finally {
        setLoading(false);
        setUserDataLoading(false);
      }
    };

    if (token) {
      fetchAllAnalyticsData();
    }
  }, [selectedPeriod, token]);

  // Calculate admin/user analytics data (existing functionality)
  const calculateAdminAnalytics = () => {
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

  const adminAnalyticsData = calculateAdminAnalytics();

  // Chart colors
  const COLORS = {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    danger: '#ef4444',
    purple: '#8b5cf6',
    pink: '#ec4899'
  };

  const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.purple];

  // Format numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Format date for charts
  const formatChartDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

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
            Comprehensive overview of system metrics, user management, and website analytics
          </p>
        </div>
        <div className="analytics-tab-controls">
          <select 
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="analytics-tab-metric-select"
          >
            <option value="overview">Overview</option>
            <option value="website">Website Analytics</option>
            <option value="users">User Management</option>
          </select>
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
          {selectedMetric === 'website' && (
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="analytics-tab-period-select"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          )}
        </div>
      </div>

      {/* Error message for website analytics */}
      {error && selectedMetric === 'website' && (
        <div className="analytics-tab-error">
          <h3>Website Analytics Unavailable</h3>
          <p>{error}</p>
          <p>Website visitor tracking data cannot be loaded at the moment.</p>
        </div>
      )}

      {/* Overview Tab - Combined Stats */}
      {selectedMetric === 'overview' && (
        <>
          {/* Website Analytics Summary (if available) */}
          {!error && analyticsData && (
            <>
              <h3 className="analytics-tab-section-title">Website Visitor Analytics</h3>
              <div className="analytics-tab-stats-grid">
                <StatCard
                  title="Total Visitors"
                  value={formatNumber(analyticsData?.allTime?.total_visitors || 0)}
                  subtitle="All time"
                  icon="fas fa-globe"
                  color="blue"
                />
                <StatCard
                  title="Today's Visitors"
                  value={formatNumber(analyticsData?.today?.daily_visitors || 0)}
                  subtitle="New today"
                  icon="fas fa-calendar-day"
                  color="green"
                />
                <StatCard
                  title="Page Views Today"
                  value={formatNumber(analyticsData?.today?.daily_page_views || 0)}
                  subtitle="Today"
                  icon="fas fa-eye"
                  color="purple"
                />
                <StatCard
                  title="Mobile Traffic"
                  value={`${analyticsData?.today?.mobile_visits && analyticsData?.today?.desktop_visits ? 
                    Math.round((analyticsData.today.mobile_visits / (analyticsData.today.mobile_visits + analyticsData.today.desktop_visits)) * 100) : 0}%`}
                  subtitle="Mobile users"
                  icon="fas fa-mobile-alt"
                  color="orange"
                />
              </div>
            </>
          )}

          {/* User Management Analytics */}
          <h3 className="analytics-tab-section-title">User Management Analytics</h3>
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
        </>
      )}

      {/* Website Analytics Tab */}
      {selectedMetric === 'website' && (
        <>
          {loading && (
            <div className="analytics-tab-loading">
              <div className="analytics-tab-spinner"></div>
              <p>Loading website analytics...</p>
            </div>
          )}

          {!loading && !error && analyticsData && (
            <>
              {/* Website Analytics Stats */}
              <div className="analytics-tab-stats-grid">
                <StatCard
                  title="Total Visitors"
                  value={formatNumber(analyticsData?.allTime?.total_visitors || 0)}
                  subtitle="All time"
                  icon="fas fa-globe"
                  color="blue"
                />
                <StatCard
                  title="Today's Visitors"
                  value={formatNumber(analyticsData?.today?.daily_visitors || 0)}
                  subtitle="New today"
                  icon="fas fa-calendar-day"
                  color="green"
                />
                <StatCard
                  title="Page Views Today"
                  value={formatNumber(analyticsData?.today?.daily_page_views || 0)}
                  subtitle="Today"
                  icon="fas fa-eye"
                  color="purple"
                />
                <StatCard
                  title="Mobile Traffic"
                  value={`${analyticsData?.today?.mobile_visits && analyticsData?.today?.desktop_visits ? 
                    Math.round((analyticsData.today.mobile_visits / (analyticsData.today.mobile_visits + analyticsData.today.desktop_visits)) * 100) : 0}%`}
                  subtitle="Mobile users"
                  icon="fas fa-mobile-alt"
                  color="orange"
                />
              </div>

              {/* Website Analytics Charts */}
              {chartData && (
                <div className="analytics-tab-charts-grid analytics-tab-charts-grid--website">
                  {/* Visitor Trends Chart */}
                  <div className="analytics-tab-chart-column analytics-tab-chart-column--full">
                    <ChartCard title="Visitor Trends">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData?.visitors?.map(item => ({
                          ...item,
                          date: formatChartDate(item.date)
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="visitors" 
                            stroke={COLORS.primary} 
                            strokeWidth={3}
                            name="Daily Visitors"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="pageViews" 
                            stroke={COLORS.secondary} 
                            strokeWidth={3}
                            name="Page Views"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartCard>
                  </div>

                  {/* Device Breakdown */}
                  <div className="analytics-tab-chart-column analytics-tab-chart-column--left">
                    <ChartCard title="Device Breakdown">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={chartData?.deviceBreakdown || []}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {(chartData?.deviceBreakdown || []).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartCard>
                  </div>

                  {/* Content Updates */}
                  <div className="analytics-tab-chart-column analytics-tab-chart-column--right">
                    <ChartCard title="Content Updates (Last 30 Days)">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData?.contentBreakdown}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="content_type" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill={COLORS.accent} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartCard>
                  </div>
                </div>
              )}

              {/* Recent Updates Table */}
              {analyticsData?.recentUpdates && (
                <ChartCard title="Recent Content Updates">
                  <div className="analytics-tab-table-container">
                    <table className="analytics-tab-table">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Type</th>
                          <th>Updated By</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.recentUpdates.map((update, index) => (
                          <tr key={index}>
                            <td>{update.update_description}</td>
                            <td>
                              <span className={`analytics-tab-content-badge ${update.content_type}`}>
                                {update.content_type}
                              </span>
                            </td>
                            <td>{update.updated_by}</td>
                            <td>{new Date(update.updated_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ChartCard>
              )}
            </>
          )}
        </>
      )}

      {/* User Management Analytics Tab */}
      {selectedMetric === 'users' && (
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
      )}
    </div>
  );
};

export default AnalyticsTab;
