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
import WebsiteAnalytics from './WebsiteAnalytics';
import UserAnalytics from './UserAnalytics';
import './AnalyticsTab.css';

const AnalyticsTab = ({ analytics }) => {
  const { token } = useAuth();
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [customDate, setCustomDate] = useState('');

  // Handle period change and clear custom date if needed
  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    if (newPeriod !== 'custom') {
      setCustomDate(''); // Clear custom date when switching away from custom
    } else if (newPeriod === 'custom' && !customDate) {
      // Set today's date as default when switching to custom
      const today = new Date().toISOString().split('T')[0];
      setCustomDate(today);
    }
  };

  // Navigate custom date by one day
  const navigateDate = (direction) => {
    if (!customDate) return;
    
    const currentDate = new Date(customDate);
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (direction === 'next') {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Don't go beyond today
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0];
    const newDateString = currentDate.toISOString().split('T')[0];
    
    // Allow dates up to and including today
    if (newDateString <= todayDateString) {
      setCustomDate(newDateString);
    }
  };
  
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

  // Helper function to convert period to API format
  const getPeriodForAPI = () => {
    switch(selectedPeriod) {
      case 'today': return '1';
      case 'week': return '7';
      case 'month': return '30';
      case 'year': return '365';
      case 'custom': return customDate ? '30' : '30'; // For now, default to 30 for custom
      default: return '30';
    }
  };

  // Fetch ALL data that analytics needs
  useEffect(() => {
    const fetchAllAnalyticsData = async () => {
      try {
        setLoading(true);
        setChartLoading(true);
        setUserDataLoading(true);
        
        const apiPeriod = getPeriodForAPI();
        
        // Fetch website analytics data using the analytics endpoints
        try {
          const dashboardParams = new URLSearchParams();
          dashboardParams.append('period', selectedPeriod);
          if (selectedPeriod === 'custom' && customDate) {
            dashboardParams.append('date', customDate);
          }
          
          const chartParams = new URLSearchParams();
          chartParams.append('period', selectedPeriod);
          if (selectedPeriod === 'custom' && customDate) {
            chartParams.append('date', customDate);
          }
          
          const [dashboardResponse, chartResponse] = await Promise.all([
            fetch(`/api/analytics/dashboard-stats?${dashboardParams}`),
            fetch(`/api/analytics/chart-data?${chartParams}`)
          ]);
          
          if (dashboardResponse.ok && chartResponse.ok) {
            const dashboardData = await dashboardResponse.json();
            const chartDataResult = await chartResponse.json();
            
            if (dashboardData.success && chartDataResult.success) {
              setAnalyticsData(dashboardData.data);
              setChartData(chartDataResult.data);
              console.log('Analytics data loaded:', dashboardData.data);
              console.log('Chart data loaded:', chartDataResult.data);
              setError(null);
            } else {
              console.error('Failed to load website analytics data');
              setError('Failed to load analytics data');
              setAnalyticsData(null);
              setChartData(null);
            }
          } else {
            console.error('Website analytics service unavailable');
            setError('Analytics service unavailable');
            setAnalyticsData(null);
            setChartData(null);
          }
        } catch (error) {
          console.error('Failed to load website analytics:', error);
          setError('Failed to load website analytics');
          setAnalyticsData(null);
          setChartData(null);
        }
        
        // Fetch user management data (auth required)
        try {
          const response = await apiCall('/admin/users');
          // Handle new paginated format
          setUsers(response?.users || response || []);
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
        setChartLoading(false);
        setUserDataLoading(false);
      }
    };

    if (token) {
      fetchAllAnalyticsData();
    }
  }, [selectedPeriod, customDate, token]);

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
          
          {/* Only show time filter for Website Analytics */}
          {selectedMetric === 'website' && (
            <select 
              value={selectedPeriod} 
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="analytics-tab-period-select"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Date</option>
            </select>
          )}
          
          {/* Custom date picker for Website Analytics */}
          {selectedMetric === 'website' && selectedPeriod === 'custom' && (
            <div className="analytics-tab-date-navigator">
              <button 
                onClick={() => navigateDate('prev')}
                className="analytics-tab-date-nav-btn"
                type="button"
                title="Previous day"
              >
                ←
              </button>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="analytics-tab-date-picker"
                max={new Date().toISOString().split('T')[0]}
              />
              <button 
                onClick={() => navigateDate('next')}
                className="analytics-tab-date-nav-btn"
                type="button"
                title="Next day"
                disabled={customDate === new Date().toISOString().split('T')[0]}
              >
                →
              </button>
            </div>
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
        <WebsiteAnalytics 
          analyticsData={analyticsData}
          chartData={chartData}
          loading={loading}
          chartLoading={chartLoading}
          error={error}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          customDate={customDate}
        />
      )}

      {/* User Management Analytics Tab */}
      {selectedMetric === 'users' && (
        <UserAnalytics />
      )}
    </div>
  );
};

export default AnalyticsTab;
