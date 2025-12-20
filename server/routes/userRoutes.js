// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getProfile, 
    updateProfile, 
    getPublicProfile // 🎯 NEW: Added this controller function
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware'); 
const upload = require('../middleware/upload'); 

// @route   GET /api/users/public-profile/:userId
// @desc    Get any user's public info (bio, name, pic) by ID
// @access  Public (No protect middleware needed)
router.get('/public-profile/:userId', getPublicProfile);

// @route   GET /api/users/profile
// @desc    Get current logged-in user's profile
// @access  Private
router.get('/profile', protect, getProfile);

// @route   PUT /api/users/profile
// @desc    Update current user's profile
// @access  Private
router.put('/profile', protect, upload.single('profilePicture'), updateProfile);

module.exports = router;