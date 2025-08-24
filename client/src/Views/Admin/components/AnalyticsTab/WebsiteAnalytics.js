import React from 'react';
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
  Cell
} from 'recharts';
import './AnalyticsTab.css';

const WebsiteAnalytics = ({ 
  analyticsData, 
  chartData, 
  loading, 
  chartLoading,
  error, 
  selectedPeriod, 
  setSelectedPeriod,
  customDate 
}) => {

  // Helper function to get the second card title and subtitle
  const getSecondCardInfo = () => {
    const targetData = analyticsData?.targetDate;
    
    if (selectedPeriod === 'custom' && customDate) {
      const date = new Date(customDate);
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      });
      return {
        title: `Visitors on ${formattedDate}`,
        subtitle: `Data for ${formattedDate}`,
        value: targetData?.todays_visitors || 0
      };
    } else if (selectedPeriod === 'week') {
      return {
        title: "This Week's Visitors",
        subtitle: "Last 7 days",
        value: targetData?.todays_visitors || 0
      };
    } else if (selectedPeriod === 'month') {
      return {
        title: "This Month's Visitors",
        subtitle: "Last 30 days",
        value: targetData?.todays_visitors || 0
      };
    } else if (selectedPeriod === 'year') {
      return {
        title: "This Year's Visitors",
        subtitle: "Last 365 days",
        value: targetData?.todays_visitors || 0
      };
    } else {
      return {
        title: "Today's Visitors",
        subtitle: "New today",
        value: targetData?.todays_visitors || 0
      };
    }
  };

  // Helper function to get device traffic subtitle
  const getDeviceSubtitle = () => {
    if (selectedPeriod === 'custom' && customDate) {
      const date = new Date(customDate);
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      });
      return `On ${formattedDate}`;
    } else if (selectedPeriod === 'week') {
      return "This week";
    } else if (selectedPeriod === 'month') {
      return "This month";
    } else if (selectedPeriod === 'year') {
      return "This year";
    } else {
      return "Today";
    }
  };

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

  // Format date for display in card titles
  const formatDateForTitle = (dateString) => {
    if (!dateString) return 'Today';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Format date for charts
  const formatChartDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return dateString; // fallback to original string
    }
  };

  // Format chart data safely
  const getChartData = () => {
    console.log('getChartData called with:', { 
      chartData, 
      hasVisitors: chartData?.visitors,
      visitorsArray: chartData?.visitors,
      isArray: Array.isArray(chartData?.visitors)
    });
    
    if (!chartData || !chartData.visitors || !Array.isArray(chartData.visitors)) {
      console.log('getChartData returning empty array - no valid data');
      return [];
    }
    
    const formattedData = chartData.visitors.map(item => ({
      ...item,
      date: formatChartDate(item.date),
      visitors: parseInt(item.visitors) || 0
    }));
    
    console.log('getChartData returning formatted data:', formattedData);
    return formattedData;
  };

  // Get dynamic chart title based on selected period
  const getChartTitle = () => {
    if (selectedPeriod === 'today') {
      return "Daily Visitors (Last 30 Days)";
    } else if (selectedPeriod === 'week') {
      return "Daily Visitors (Last 7 Days)";
    } else if (selectedPeriod === 'month') {
      return "Daily Visitors (Last 30 Days)";
    } else if (selectedPeriod === 'year') {
      return "Daily Visitors (This Year)";
    } else if (selectedPeriod === 'custom' && customDate) {
      return "Daily Visitors (Last 30 Days)";
    } else {
      return "Daily Visitors (Last 30 Days)";
    }
  };

  // Determine card titles and data based on period selection
  const getCardData = () => {
    const targetData = analyticsData?.targetDate;
    const secondCardInfo = getSecondCardInfo();
    const deviceSubtitle = getDeviceSubtitle();
    
    return {
      totalVisitors: analyticsData?.allTime?.total_visitors || 0,
      secondCardTitle: secondCardInfo.title,
      secondCardSubtitle: secondCardInfo.subtitle,
      dailyVisitors: secondCardInfo.value,
      desktopTraffic: targetData?.desktop_visits || 0,
      mobileTraffic: targetData?.mobile_visits || 0,
      deviceSubtitle: deviceSubtitle
    };
  };

  const cardData = getCardData();

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

  // Debug logging
  console.log('WebsiteAnalytics render state:', {
    loading,
    chartLoading, 
    chartData,
    hasChartData: !!chartData,
    chartDataType: typeof chartData,
    analyticsData
  });

  if (loading) {
    return (
      <div className="analytics-tab-loading">
        <div className="analytics-tab-spinner"></div>
        <p>Loading website analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-tab-error">
        <h3>Website Analytics Unavailable</h3>
        <p>{error}</p>
        <p>Website visitor tracking data cannot be loaded at the moment.</p>
      </div>
    );
  }

  return (
    <>
      {/* Website Analytics Stats */}
      <div className="analytics-tab-stats-grid">
        <StatCard
          title="Total Visitors"
          value={formatNumber(cardData.totalVisitors)}
          subtitle="All time"
          icon="fas fa-globe"
          color="blue"
        />
        <StatCard
          title={cardData.secondCardTitle}
          value={formatNumber(cardData.dailyVisitors)}
          subtitle={cardData.secondCardSubtitle}
          icon="fas fa-calendar-day"
          color="green"
        />
        <StatCard
          title="Desktop Traffic"
          value={formatNumber(cardData.desktopTraffic)}
          subtitle={cardData.deviceSubtitle}
          icon="fas fa-desktop"
          color="purple"
        />
        <StatCard
          title="Mobile Traffic"
          value={formatNumber(cardData.mobileTraffic)}
          subtitle={cardData.deviceSubtitle}
          icon="fas fa-mobile-alt"
          color="orange"
        />
      </div>      {/* Website Analytics Charts */}
      {chartLoading ? (
        <div className="analytics-tab-charts-grid analytics-tab-charts-grid--redesigned">
          <div className="analytics-tab-chart-column analytics-tab-chart-column--left">
            <ChartCard title={getChartTitle()}>
              <div className="analytics-tab-loading" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading chart data...</p>
              </div>
            </ChartCard>
          </div>
          <div className="analytics-tab-chart-column analytics-tab-chart-column--right">
            <ChartCard title="Traffic Distribution by Device">
              <div className="analytics-tab-loading" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading chart data...</p>
              </div>
            </ChartCard>
          </div>
        </div>
      ) : !chartLoading && chartData && chartData.visitors && chartData.visitors.length > 0 ? (
        <div className="analytics-tab-charts-grid analytics-tab-charts-grid--redesigned">
          {/* Left Column - Visitor Trends Chart */}
          <div className="analytics-tab-chart-column analytics-tab-chart-column--left">
            <ChartCard title={getChartTitle()}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getChartData()}>
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
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Right Column - Traffic Distribution */}
          <div className="analytics-tab-chart-column analytics-tab-chart-column--right">
            <ChartCard title="Traffic Distribution by Device">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { 
                        name: 'Desktop', 
                        value: cardData.desktopTraffic,
                        color: COLORS.primary
                      },
                      { 
                        name: 'Mobile', 
                        value: cardData.mobileTraffic,
                        color: COLORS.secondary
                      }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent, value }) => 
                      value > 0 ? `${name}\n${(percent * 100).toFixed(1)}%` : ''
                    }
                    outerRadius={100}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {[
                      { name: 'Desktop', value: cardData.desktopTraffic, color: COLORS.primary },
                      { name: 'Mobile', value: cardData.mobileTraffic, color: COLORS.secondary }
                    ].map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke={entry.color}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [
                      `${formatNumber(value)} visitors`, 
                      `${name} Traffic`
                    ]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    formatter={(value, entry) => 
                      `${value}: ${formatNumber(entry.payload.value)} visitors`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      ) : (
        <div className="analytics-tab-no-chart">
          <p>No chart data available</p>
        </div>
      )}
    </>
  );
};

export default WebsiteAnalytics;
