import User from '../models/User.js'; // Changed require, added .js extension
import jwt from 'jsonwebtoken'; // Changed require
import { validationResult } from 'express-validator'; // Changed require

// Function to generate a JWT
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d' // Token expires in 1 day
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => { // CHANGED to export const
    // 1. Check for validation errors (from router middleware)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // We structure the error for better client handling
        return res.status(400).json({ 
            message: 'Validation failed', 
            errors: errors.array() 
        });
    }

    const { username, email, password } = req.body;

    try {
        // 2. Check if user already exists (by email or username)
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        // 3. Create the new user (password hashing is handled by the User model middleware)
        user = await User.create({ username, email, password });

        // 4. Generate JWT and send response
        const token = createToken(user._id);

        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => { // CHANGED to export const
    const { email, password } = req.body;

    try {
        // 1. Check if user exists by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials (User not found)' });
        }

        // 2. Compare passwords using the method defined in the User model
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials (Password incorrect)' });
        }

        // 3. Generate JWT and send response
        const token = createToken(user._id);

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
        });

    } catch (error) {
        next(error);
    }
};