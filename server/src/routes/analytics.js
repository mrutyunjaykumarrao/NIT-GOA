const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// =================================================================
// Footer Analytics Routes
// =================================================================

/**
 * GET /api/analytics/footer-stats
 * Get basic stats for footer display (visitor count + last updated)
 */
router.get('/footer-stats', async (req, res) => {
    try {
        const connection = await pool.connect();
        
        // Get the most recent visitor count
        const visitorStats = await connection.query(`
            SELECT total_visitors, daily_visitors, date_recorded 
            FROM site_analytics 
            ORDER BY date_recorded DESC 
            LIMIT 1
        `);

        // Get the most recent update from audit_log
        const lastUpdate = await connection.query(`
            SELECT created_at as updated_at, action as update_description 
            FROM audit_log 
            WHERE action = 'UPDATE' 
            ORDER BY created_at DESC 
            LIMIT 1
        `);

        const hasRecentData = visitorStats.length > 0;
        const totalVisitors = hasRecentData ? visitorStats[0].total_visitors : 0;
        
        // Determine if the most recent data is from today for daily visitors count
        let dailyVisitors = 0;
        if (hasRecentData) {
            const recordedDate = new Date(visitorStats[0].date_recorded).toISOString().split('T')[0];
            const today = new Date().toISOString().split('T')[0];
            if (recordedDate === today) {
                dailyVisitors = visitorStats[0].daily_visitors;
            }
        }
        const lastUpdated = lastUpdate.length > 0 ? lastUpdate[0].updated_at : new Date();
        const lastUpdateDescription = lastUpdate.length > 0 ? lastUpdate[0].update_description : 'Website initialized';

        connection.release();

        res.json({
            success: true,
            data: {
                totalVisitors,
                todaysVisitors: dailyVisitors,
                lastUpdated,
                lastUpdateDescription
            }
        });
    } catch (error) {
        console.error('Error fetching footer stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch footer statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * POST /api/analytics/track-visit
 * Track a visitor (simplified - no page views)
 */
router.post('/track-visit', async (req, res) => {
    try {
        const connection = await pool.connect();
        const { device = 'desktop', userAgent = '' } = req.body;
        const today = new Date().toISOString().split('T')[0];

        // Get existing record
        const existingRecord = await connection.query(
            'SELECT * FROM site_analytics WHERE date_recorded = $1',
            [today]
        );

        if (existingRecord.length > 0) {
            // Update existing record - just increment counters
            const record = existingRecord[0];
            const updateValues = {
                total_visitors: record.total_visitors + 1,
                daily_visitors: record.daily_visitors + 1,
                desktop_visits: device === 'desktop' ? record.desktop_visits + 1 : record.desktop_visits,
                mobile_visits: device === 'mobile' ? record.mobile_visits + 1 : record.mobile_visits
            };

            await connection.query(`
                UPDATE site_analytics 
                SET total_visitors = $1, daily_visitors = $2, 
                    desktop_visits = $1, mobile_visits = $2
                WHERE date_recorded = $1
            `, [
                updateValues.total_visitors, updateValues.daily_visitors,
                updateValues.desktop_visits, updateValues.mobile_visits, today
            ]);
        } else {
            // Get previous total to make it cumulative
            const previousTotal = await connection.query(`
                SELECT MAX(total_visitors) as max_total 
                FROM site_analytics 
                WHERE date_recorded < $1
            `, [today]);
            
            const previousTotalVisitors = previousTotal.rows.length > 0 && previousTotal.rows[0].max_total 
                ? previousTotal.rows[0].max_total : 0;
            
            // Create new record for today with cumulative total
            await connection.query(`
                INSERT INTO site_analytics (
                    date_recorded, total_visitors, daily_visitors,
                    desktop_visits, mobile_visits
                ) VALUES ($1, $2, $3, $4, $5)
            `, [
                today, previousTotalVisitors + 1, 1,
                device === 'desktop' ? 1 : 0,
                device === 'mobile' ? 1 : 0
            ]);
        }

        connection.release();

        res.json({
            success: true,
            message: 'Visit tracked successfully'
        });
    } catch (error) {
        console.error('Error tracking visit:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to track visit',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * POST /api/analytics/content-update
 * Track content updates for "last updated" tracking
 */
router.post('/content-update', async (req, res) => {
    try {
        const connection = await pool.connect();
        const { updateDescription, content_type = 'general', isMajorUpdate = false, updated_by = 'system' } = req.body;

        await connection.query(`
            INSERT INTO content_updates (
                update_description, content_type, is_major_update, updated_by, updated_at
            ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        `, [updateDescription, content_type, isMajorUpdate, updated_by]);

        connection.release();

        res.json({
            success: true,
            message: 'Content update tracked successfully'
        });
    } catch (error) {
        console.error('Error tracking content update:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to track content update',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// =================================================================
// Dashboard Analytics Routes
// =================================================================

/**
 * GET /api/analytics/dashboard-stats
 * Get simplified analytics for the admin dashboard
 */
router.get('/dashboard-stats', async (req, res) => {
    try {
        const { period = 'today', date } = req.query;
        const connection = await pool.connect();
        
        let targetStats = {};
        let targetDateValue = new Date().toISOString().split('T')[0];
        
        if (period === 'custom' && date) {
            targetDateValue = date;
            const customStats = await connection.query(`
                SELECT total_visitors, daily_visitors, 
                       desktop_visits, mobile_visits
                FROM site_analytics 
                WHERE date_recorded = $1
            `, [date]);
            
            targetStats = customStats[0] || {
                total_visitors: 0,
                daily_visitors: 0,
                desktop_visits: 0,
                mobile_visits: 0
            };
        } else if (period === 'today') {
            const todayData = await connection.query(`
                SELECT total_visitors, daily_visitors, 
                       desktop_visits, mobile_visits
                FROM site_analytics 
                WHERE date_recorded = CURRENT_DATE
            `);
            
            targetStats = todayData[0] || {
                total_visitors: 0,
                daily_visitors: 0,
                desktop_visits: 0,
                mobile_visits: 0
            };
        } else if (period === 'week') {
            const weekData = await connection.query(`
                SELECT 
                    MAX(total_visitors) as total_visitors,
                    SUM(daily_visitors) as daily_visitors,
                    SUM(desktop_visits) as desktop_visits,
                    SUM(mobile_visits) as mobile_visits
                FROM site_analytics 
                WHERE date_recorded >= CURRENT_DATE - INTERVAL '6 days'
            `);
            
            targetStats = weekData[0] || {
                total_visitors: 0,
                daily_visitors: 0,
                desktop_visits: 0,
                mobile_visits: 0
            };
        } else if (period === 'month') {
            const monthData = await connection.query(`
                SELECT 
                    MAX(total_visitors) as total_visitors,
                    SUM(daily_visitors) as daily_visitors,
                    SUM(desktop_visits) as desktop_visits,
                    SUM(mobile_visits) as mobile_visits
                FROM site_analytics 
                WHERE date_recorded >= CURRENT_DATE - INTERVAL '29 days'
            `);
            
            targetStats = monthData[0] || {
                total_visitors: 0,
                daily_visitors: 0,
                desktop_visits: 0,
                mobile_visits: 0
            };
        }

        // Get total all-time visitors
        const totalStats = await connection.query(`
            SELECT MAX(total_visitors) as all_time_visitors 
            FROM site_analytics
        `);

        // Get visitor trends for charts
        const visitorTrends = await connection.query(`
            SELECT date_recorded, daily_visitors, 
                   desktop_visits, mobile_visits
            FROM site_analytics 
            WHERE date_recorded >= CURRENT_DATE - INTERVAL '30 days'
            ORDER BY date_recorded ASC
        `);

        // Get device breakdown
        const deviceStats = await connection.query(`
            SELECT 
                SUM(desktop_visits) as total_desktop,
                SUM(mobile_visits) as total_mobile
            FROM site_analytics 
            WHERE date_recorded >= CURRENT_DATE - INTERVAL '30 days'
        `);

        connection.release();

        res.json({
            success: true,
            data: {
                targetDate: {
                    date: targetDateValue,
                    period: period,
                    total_visitors: targetStats.total_visitors || 0,
                    daily_visitors: targetStats.daily_visitors || 0,
                    desktop_visits: targetStats.desktop_visits || 0,
                    mobile_visits: targetStats.mobile_visits || 0
                },
                allTime: {
                    total_visitors: totalStats[0].all_time_visitors || 0
                },
                visitorTrends: visitorTrends,
                deviceBreakdown: {
                    desktop: deviceStats[0].total_desktop || 0,
                    mobile: deviceStats[0].total_mobile || 0
                }
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * GET /api/analytics/simple-stats
 * Get simplified visitor statistics for basic analytics display
 */
router.get('/simple-stats', async (req, res) => {
    try {
        const connection = await pool.connect();
        
        // Get last 30 days visitor data for chart
        const visitorData = await connection.query(`
            SELECT 
                date_recorded,
                daily_visitors,
                desktop_visits,
                mobile_visits
            FROM site_analytics 
            WHERE date_recorded >= CURRENT_DATE - INTERVAL '30 days'
            ORDER BY date_recorded ASC
        `);

        connection.release();

        res.json({
            success: true,
            data: {
                visitors: visitorData.map(row => ({
                    date: row.date_recorded,
                    visitors: row.daily_visitors,
                    desktop: row.desktop_visits,
                    mobile: row.mobile_visits
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching simple stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch simple statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * GET /api/analytics/chart-data
 * Get chart data for admin dashboard
 */
router.get('/chart-data', async (req, res) => {
    try {
        const { period = 'month', date } = req.query;
        const connection = await pool.connect();
        
        let dayRange = 30; // Default to 30 days
        
        // Determine the range based on period
        if (period === 'today' || period === 'custom') {
            dayRange = 30; // Show last 30 days for context
        } else if (period === 'week') {
            dayRange = 7; // Show last 7 days
        } else if (period === 'month') {
            dayRange = 30; // Show last 30 days
        } else if (period === 'year') {
            dayRange = 365; // Show available data (we only have ~31 days)
        } else if (!isNaN(parseInt(period))) {
            // Support legacy numeric period parameter
            dayRange = parseInt(period);
        }
        
        // Get visitor data for charts
        const chartData = await connection.query(`
            SELECT 
                DATE(date_recorded) as date,
                daily_visitors as visitors
            FROM site_analytics 
            WHERE date_recorded >= CURRENT_DATE - ($1 || ' days')::INTERVAL
            ORDER BY date_recorded ASC
        `, [dayRange]);

        connection.release();

        res.json({
            success: true,
            data: {
                visitors: chartData.map(row => ({
                    date: row.date,
                    visitors: row.visitors || 0
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching chart data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch chart data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
