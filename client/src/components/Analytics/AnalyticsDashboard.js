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
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats
        const dashboardResponse = await fetch('/api/analytics/dashboard-stats');
        const chartResponse = await fetch(`/api/analytics/chart-data?period=${selectedPeriod}`);
        
        if (dashboardResponse.ok && chartResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          const chartData = await chartResponse.json();
          
          if (dashboardData.success && chartData.success) {
            setAnalyticsData(dashboardData.data);
            setChartData(chartData.data);
          } else {
            setError('Failed to load analytics data');
          }
        } else {
          setError('Analytics service unavailable');
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to connect to analytics service');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedPeriod]);

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

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <div className="analytics-loading">
          <div className="analytics-spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-dashboard">
        <div className="analytics-error">
          <h3>Analytics Unavailable</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>Website Analytics</h2>
        <div className="analytics-period-selector">
          <label>Period:</label>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="analytics-summary">
        <div className="summary-card">
          <div className="summary-icon visitors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="summary-content">
            <h3>Total Visitors</h3>
            <p className="summary-number">{formatNumber(analyticsData?.summary?.totalVisitors || 0)}</p>
            <span className="summary-label">All time</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon today">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className="summary-content">
            <h3>Today's Visitors</h3>
            <p className="summary-number">{formatNumber(analyticsData?.summary?.visitorsToday || 0)}</p>
            <span className="summary-label">New today</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon pageviews">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          <div className="summary-content">
            <h3>Page Views Today</h3>
            <p className="summary-number">{formatNumber(analyticsData?.summary?.pageViewsToday || 0)}</p>
            <span className="summary-label">Today</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon mobile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
              <line x1="12" y1="18" x2="12.01" y2="18"></line>
            </svg>
          </div>
          <div className="summary-content">
            <h3>Mobile Traffic</h3>
            <p className="summary-number">{analyticsData?.summary?.mobilePercentage || 0}%</p>
            <span className="summary-label">Mobile users</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts">
        {/* Visitor Trends Chart */}
        <div className="chart-container">
          <h3>Visitor Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData?.visitorTrends?.map(item => ({
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
        </div>

        {/* Device Breakdown */}
        <div className="chart-container">
          <h3>Device Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Desktop', value: chartData?.deviceBreakdown?.desktop || 0 },
                  { name: 'Mobile', value: chartData?.deviceBreakdown?.mobile || 0 }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[0, 1].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Content Updates */}
        <div className="chart-container">
          <h3>Content Updates (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData?.contentBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="content_type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS.accent} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Updates Table */}
      <div className="analytics-table">
        <h3>Recent Content Updates</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Type</th>
                <th>Updated By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData?.recentUpdates?.map((update, index) => (
                <tr key={index}>
                  <td>{update.update_description}</td>
                  <td>
                    <span className={`content-type-badge ${update.content_type}`}>
                      {update.content_type}
                    </span>
                  </td>
                  <td>{update.updated_by}</td>
                  <td>{new Date(update.updated_at).toLocaleDateString()}</td>
                </tr>
              )) || <tr><td colSpan="4">No recent updates</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
