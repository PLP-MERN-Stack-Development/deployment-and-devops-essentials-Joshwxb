// server/controllers/userController.js
const User = require('../models/User');

// --- 🎯 NEW: Get any user's public info (Read-only) ---
exports.getPublicProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // We only SELECT the fields safe for the public to see
        const user = await User.findById(userId).select('username profilePicture bio socials');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching public profile', error: error.message });
    }
};

// Get current user profile (Private - for the logged-in user)
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { bio, twitter, instagram, tiktok } = req.body;
        const userId = req.user._id || req.user.id;
        
        // Find user first to keep existing data
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Determine profile picture URL
        let profilePicture = user.profilePicture; 
        if (req.file && req.file.path) {
            profilePicture = req.file.path; 
        }

        // Build update object
        const profileData = {
            bio: bio !== undefined ? bio : user.bio,
            profilePicture: profilePicture,
            socials: {
                twitter: twitter !== undefined ? twitter : (user.socials?.twitter || ''),
                instagram: instagram !== undefined ? instagram : (user.socials?.instagram || ''),
                tiktok: tiktok !== undefined ? tiktok : (user.socials?.tiktok || '')
            }
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: profileData },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};