const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');

// Get all notifications for a user
router.get('/notifications/:userId', async (req, res) => {
    try {
        const notifications = await NotificationController.displayAllNotificationsForAdmin(req.params.userId);
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve notifications', error: error.message });
    }
});
// Endpoint to trigger notifyClientOnInitialMeetingScheduled
router.get('/notifications/client/:userId', async (req, res) => {
    try {
        const notifications = await NotificationController.displayAllNotificationsForClient(req.params.userId);
        console.log("client notifications", notifications)
        return res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error('Error notifying client and billers:', error);
        return res.status(500).json({ success: false, message: 'Failed to notify client and billers', error: error.message });
    }
});
router.get('/notifications/biller/:userId', async (req, res) => {
    try {
        const notifications = await NotificationController.displayAllNotificationsForBiller(req.params.userId);
        console.log("biller notifications", notifications)
        return res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error('Error notifying client and billers:', error);
        return res.status(500).json({ success: false, message: 'Failed to notify client and billers', error: error.message });
    }
});
// Mark a notification as read
router.patch('/notifications/:notificationId/read', async (req, res) => {
    try {
        const notification = await NotificationController.markNotificationAsRead(req.params.notificationId);
        res.status(200).json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to mark notification as read', error: error.message });
    }
});
// Get unread notifications count for a user
router.get('/notifications/:userId/unread-count', async (req, res) => {
    try {
        const count = await NotificationController.getUnreadNotificationsCount(req.params.userId);
        res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch unread notifications count', error: error.message });
    }
});

module.exports = router;