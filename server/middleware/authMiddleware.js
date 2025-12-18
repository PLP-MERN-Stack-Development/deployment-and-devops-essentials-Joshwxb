const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes (ensure user is logged in)
const protect = async (req, res, next) => {
    let token;

    // 1. Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (format is "Bearer TOKEN")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Attach user to request object (excluding password)
            // decoded.id holds the user ID from the JWT payload
            req.user = await User.findById(decoded.id).select('-password');

            // 4. Proceed to the next middleware/controller
            next();

        } catch (error) {
            console.error('Token verification failed:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed or expired' });
        }
    } else {
        // If no token is found
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// 🎯 Exported as 'protect' to match your routes
module.exports = { protect };