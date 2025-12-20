const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 🛠️ FIX: Try both decoded.id AND decoded._id 
            // Also, ensure we await the result
            const userId = decoded.id || decoded._id;
            
            req.user = await User.findById(userId).select('-password');

            // 🎯 CRITICAL SAFETY CHECK:
            // If the user was deleted but the token is still valid, req.user will be null.
            if (!req.user) {
                return res.status(401).json({ message: 'User no longer exists' });
            }

            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };