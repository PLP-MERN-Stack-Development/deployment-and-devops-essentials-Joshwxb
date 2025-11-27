import express from 'express';
import Category from '../models/Category.js'; // Import the Category model

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', async (req, res, next) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (error) {
        // Pass error to the centralized error handler (Task 2.7)
        next(error); 
    }
});

// POST /api/categories - Create a new category
router.post('/', async (req, res, next) => {
    try {
        const { name } = req.body;
        
        // Basic check for required field (Mongoose handles schema validation, too)
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const newCategory = new Category({ name });
        const savedCategory = await newCategory.save();
        
        // Respond with 201 Created status
        res.status(201).json(savedCategory);

    } catch (error) {
        // Handle Mongoose unique error specifically (code 11000)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Category name already exists' });
        }
        // Pass other errors to the centralized error handler
        next(error); 
    }
});

export default router;