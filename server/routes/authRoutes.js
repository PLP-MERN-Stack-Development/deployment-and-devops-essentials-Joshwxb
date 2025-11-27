import express from 'express'; // Changed from require
import { body } from 'express-validator'; // Changed from require
import { registerUser, loginUser } from '../controllers/authController.js'; // Changed from require, added .js extension
const router = express.Router();

// Validation middleware for registration
const registerValidation = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
    body('email')
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Validation middleware for login (simpler, only checks existence)
const loginValidation = [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
];

// @route   POST /api/auth/register
// @desc    Register user and return JWT
router.post('/register', registerValidation, registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user and return JWT
router.post('/login', loginValidation, loginUser);

export default router; // This ES Module export is correct now