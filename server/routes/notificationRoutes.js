const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

// 🎯 NEW: GET /api/notifications/unread-count
// @desc    Get count of unread notifications for logged-in user
// @access  Private
router.get('/unread-count', protect, async (req, res) => {
    try {
        // Count documents where recipient matches and isRead is false
        const count = await Notification.countDocuments({ 
            recipient: req.user._id, 
            isRead: false 
        });
        res.json({ count });
    } catch (err) {
        console.error("Unread count error:", err);
        res.status(500).json({ message: 'Server error fetching unread count' });
    }
});

// @route   GET /api/notifications
// @desc    Get all notifications for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate('sender', 'username')
            .populate('post', 'title')
            .sort({ createdAt: -1 });
        
        res.json(notifications);
    } catch (err) {
        console.error("Fetch notifications error:", err);
        res.status(500).json({ message: 'Server error fetching notifications' });
    }
});

// @route   PUT /api/notifications/:id
// @desc    Mark notification as read
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id, 
            { isRead: true }, 
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json(notification);
    } catch (err) {
        console.error("Update notification error:", err);
        res.status(500).json({ message: 'Server error updating notification' });
    }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        if (notification.recipient.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this notification' });
        }

        await notification.deleteOne();
        res.json({ message: 'Notification deleted successfully' });
    } catch (err) {
        console.error("Delete notification error:", err);
        res.status(500).json({ message: 'Server error deleting notification' });
    }
});

module.exports = router;