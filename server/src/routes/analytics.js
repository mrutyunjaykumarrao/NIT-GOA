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
        const connection = await pool.getConnection();
        
        // Get today's visitor count
        const [visitorStats] = await connection.execute(`
            SELECT total_visitors, daily_visitors 
            FROM site_analytics 
            WHERE date_recorded = CURDATE()
        `);

        // Get the most recent major update
        const [lastUpdate] = await connection.execute(`
            SELECT updated_at, update_description 
            FROM content_updates 
            WHERE is_major_update = TRUE 
            ORDER BY updated_at DESC 
            LIMIT 1
        `);

        const totalVisitors = visitorStats.length > 0 ? visitorStats[0].total_visitors : 1248567;
        const lastUpdated = lastUpdate.length > 0 ? lastUpdate[0].updated_at : new Date();
        const lastUpdateDescription = lastUpdate.length > 0 ? lastUpdate[0].update_description : 'Website initialized';

        connection.release();

        res.json({
            success: true,
            data: {
                totalVisitors,
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
 * Track a visitor (page view, device info, etc.)
 */
router.post('/track-visit', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const { device = 'desktop', page = '/', userAgent = '' } = req.body;
        const today = new Date().toISOString().split('T')[0];

        // Get existing record
        const [existingRecord] = await connection.execute(
            'SELECT * FROM site_analytics WHERE date_recorded = ?',
            [today]
        );

        if (existingRecord.length > 0) {
            // Update existing record
            const record = existingRecord[0];
            const updateValues = {
                total_visitors: record.total_visitors + 1,
                daily_visitors: record.daily_visitors + 1,
                desktop_visits: device === 'desktop' ? record.desktop_visits + 1 : record.desktop_visits,
                mobile_visits: device === 'mobile' ? record.mobile_visits + 1 : record.mobile_visits,
                daily_page_views: record.daily_page_views + 1
            };

            await connection.execute(`
                UPDATE site_analytics 
                SET total_visitors = ?, daily_visitors = ?, 
                    desktop_visits = ?, mobile_visits = ?,
                    daily_page_views = ?
                WHERE date_recorded = ?
            `, [
                updateValues.total_visitors, updateValues.daily_visitors,
                updateValues.desktop_visits, updateValues.mobile_visits,
                updateValues.daily_page_views, today
            ]);
        } else {
            // Create new record for today
            await connection.execute(`
                INSERT INTO site_analytics (
                    date_recorded, total_visitors, daily_visitors,
                    desktop_visits, mobile_visits, daily_page_views
                ) VALUES (?, ?, ?, ?, ?, ?)
            `, [
                today, 1, 1,
                device === 'desktop' ? 1 : 0,
                device === 'mobile' ? 1 : 0,
                1
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
        const connection = await pool.getConnection();
        const { updateDescription, content_type = 'general', isMajorUpdate = false, updated_by = 'system' } = req.body;

        await connection.execute(`
            INSERT INTO content_updates (
                update_description, content_type, is_major_update, updated_by, updated_at
            ) VALUES (?, ?, ?, ?, NOW())
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
 * Get comprehensive analytics for the admin dashboard
 */
router.get('/dashboard-stats', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        // Get today's stats
        const [todayStats] = await connection.execute(`
            SELECT total_visitors, daily_visitors, 
                   desktop_visits, mobile_visits,
                   daily_page_views
            FROM site_analytics 
            WHERE date_recorded = CURDATE()
        `);

        // Get last 7 days stats  
        const [weeklyStats] = await connection.execute(`
            SELECT date_recorded, daily_visitors, 
                   desktop_visits, mobile_visits
            FROM site_analytics 
            WHERE date_recorded >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            ORDER BY date_recorded ASC
        `);

        // Get content update summary
        const [updateStats] = await connection.execute(`
            SELECT 
                COUNT(*) as total_updates,
                COUNT(CASE WHEN is_major_update = TRUE THEN 1 END) as major_updates,
                MAX(updated_at) as last_update
            FROM content_updates 
            WHERE updated_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `);

        // Get total all-time visitors
        const [totalStats] = await connection.execute(`
            SELECT SUM(total_visitors) as all_time_visitors 
            FROM site_analytics
        `);

        connection.release();

        res.json({
            success: true,
            data: {
                today: todayStats[0] || {
                    total_visitors: 0,
                    daily_visitors: 0,
                    desktop_visits: 0,
                    mobile_visits: 0,
                    daily_page_views: 0
                },
                weekly: weeklyStats,
                updates: updateStats[0] || {
                    total_updates: 0,
                    major_updates: 0,
                    last_update: new Date()
                },
                allTime: {
                    total_visitors: totalStats[0]?.all_time_visitors || 0
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
 * GET /api/analytics/chart-data
 * Get data formatted for charts (last 30 days)
 */
router.get('/chart-data', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        // Get last 30 days visitor data
        const [visitorData] = await connection.execute(`
            SELECT 
                date_recorded,
                daily_visitors,
                desktop_visits,
                mobile_visits,
                daily_page_views
            FROM site_analytics 
            WHERE date_recorded >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            ORDER BY date_recorded ASC
        `);

        // Get device breakdown for the last 30 days
        const [deviceBreakdown] = await connection.execute(`
            SELECT 
                SUM(desktop_visits) as desktop_total,
                SUM(mobile_visits) as mobile_total
            FROM site_analytics 
            WHERE date_recorded >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        `);

        // Get content updates for timeline
        const [recentUpdates] = await connection.execute(`
            SELECT 
                DATE(updated_at) as update_date,
                COUNT(*) as updates_count,
                COUNT(CASE WHEN is_major_update = TRUE THEN 1 END) as major_updates_count
            FROM content_updates 
            WHERE updated_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(updated_at)
            ORDER BY update_date ASC
        `);

        connection.release();

        res.json({
            success: true,
            data: {
                visitors: visitorData.map(row => ({
                    date: row.date_recorded,
                    visitors: row.daily_visitors,
                    desktop: row.desktop_visits,
                    mobile: row.mobile_visits,
                    pageViews: row.daily_page_views
                })),
                deviceBreakdown: [
                    { 
                        name: 'Desktop', 
                        value: deviceBreakdown[0]?.desktop_total || 0,
                        color: '#8884d8'
                    },
                    { 
                        name: 'Mobile', 
                        value: deviceBreakdown[0]?.mobile_total || 0,
                        color: '#82ca9d'
                    }
                ],
                contentUpdates: recentUpdates.map(row => ({
                    date: row.update_date,
                    updates: row.updates_count,
                    majorUpdates: row.major_updates_count
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
