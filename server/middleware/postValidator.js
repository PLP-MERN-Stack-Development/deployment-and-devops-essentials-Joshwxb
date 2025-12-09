// middleware/postValidator.js

const { body, validationResult } = require('express-validator'); // CRITICAL FIX: Use require()

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return 400 Bad Request with detailed errors
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation rules for creating a new post
const createPostValidation = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),

    body('content')
        .notEmpty().withMessage('Content is required')
        .isLength({ min: 10 }).withMessage('Content must be at least 10 characters long'),

    body('category')
        .notEmpty().withMessage('Category ID is required')
        .isMongoId().withMessage('Invalid Category ID format'),
    
    // Run the error handler after the validation checks
    handleValidationErrors
];

// Reuses the creation rules, but makes them optional for updates (PATCH/PUT)
const updatePostValidation = [
    body('title')
        .optional()
        .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),

    body('content')
        .optional()
        .isLength({ min: 10 }).withMessage('Content must be at least 10 characters long'),

    body('category')
        .optional()
        .isMongoId().withMessage('Invalid Category ID format'),

    handleValidationErrors
];

// ⬅️ CRITICAL FIX: Use CommonJS export to export the required functions
module.exports = { 
    createPostValidation, 
    updatePostValidation 
};