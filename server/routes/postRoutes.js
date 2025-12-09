// postRoutes.js

const express = require('express');
const Post = require('../models/Post'); 
const { authMiddleware } = require('../middleware/authMiddleware'); 
// 🌟 NEW: Import the Multer upload middleware
const { uploadImage } = require('../middleware/upload'); 
const { createPostValidation, updatePostValidation } = require('../middleware/postValidator'); 
const router = express.Router();

// GET /api/posts - Get all blog posts (PUBLIC)
router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.find({})
            .sort({ createdAt: -1 }) 
            .populate('category', 'name'); 
        
        res.status(200).json(posts);
    } catch (error) {
        next(error); 
    }
});

// GET /api/posts/:id - Get a specific blog post (PUBLIC)
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        
      const post = await Post.findById(id).populate('category', 'name').populate('user', '_id');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.status(200).json(post);
    } catch (error) {
        if (error.kind === 'ObjectId') {
             return res.status(400).json({ message: 'Invalid Post ID format' });
        }
        next(error); 
    }
});


// POST /api/posts - Create a new blog post (PRIVATE)
router.post(
    '/', 
    authMiddleware, 
    uploadImage, // <--- MULTER MIDDLEWARE RUNS HERE
    createPostValidation, 
    async (req, res, next) => { 
        try {
            // 🌟 IMAGE HANDLING: Check if a file was uploaded by Multer
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
            
            // CORRECTED: Ensure the 'user' field is set to the logged-in user's ID
            const newPost = new Post({ 
                ...req.body, 
                user: req.user._id, 
                // 🌟 ADD: Store the image URL if one exists
                imageUrl: imageUrl, 
            });
            
            const savedPost = await newPost.save();
            
            // Populate category before sending response
            await savedPost.populate('category', 'name');

            res.status(201).json(savedPost);
        } catch (error) {
            // NOTE: If an error occurs, the file may have been saved by Multer. 
            // In a production app, you would add logic here to delete the saved file if the database operation fails.
            next(error);
        }
    }
);


// PUT /api/posts/:id - Update an existing blog post (PRIVATE)
// 🌟 FIX: Insert the uploadImage middleware here.
router.put(
    '/:id', 
    authMiddleware, 
    uploadImage, // <--- MULTER MIDDLEWARE RUNS HERE
    updatePostValidation, 
    async (req, res, next) => { 
        try {
            const { id } = req.params;
            const post = await Post.findById(id);

            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // 2. AUTHORIZATION CHECK: Ensure the post belongs to the authenticated user
            if (post.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this post' });
            }
            
            // 🌟 IMAGE HANDLING FOR UPDATE:
            const updateFields = { ...req.body };
            
            if (req.file) {
                // New file uploaded: Set new URL, and delete the old file (optional, but recommended for cleanup)
                updateFields.imageUrl = `/uploads/${req.file.filename}`;
                // In a full implementation, you would delete the old file on the server here
                // (e.g., using fs.unlinkSync(path.join(process.cwd(), post.imageUrl)))
            } else if (req.body.deleteImage === 'true') { 
                // Handle a separate field from the frontend to explicitly clear the image
                updateFields.imageUrl = null;
                // In a full implementation, you would delete the old file on the server here
            }

            // 3. Update the post
            const updatedPost = await Post.findByIdAndUpdate(
                id,
                updateFields, // Now includes imageUrl if a file was uploaded
                { new: true, runValidators: true }
            ).populate('category', 'name');
            
            res.status(200).json(updatedPost);
        } catch (error) {
            if (error.kind === 'ObjectId') {
                return res.status(400).json({ message: 'Invalid Post ID format' });
            }
            next(error);
        }
    }
);

// DELETE /api/posts/:id - Delete a blog post (PRIVATE - REQUIRES authMiddleware & AUTHORIZATION)
router.delete('/:id', authMiddleware, async (req, res, next) => { 
    try {
        const { id } = req.params;
        
        // 1. Find the post by ID
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // 2. AUTHORIZATION CHECK: Ensure the post belongs to the authenticated user
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }
        
        // 🌟 CLEANUP: Delete the associated image file before deleting the post
        // If you were using a separate controller file, this logic would go there.
        /*
        if (post.imageUrl) {
            // Example: fs.unlinkSync(path.join(process.cwd(), post.imageUrl))
        }
        */
        
        // 3. Delete the post
        await Post.findByIdAndDelete(id);
        
        res.status(204).send();
    } catch (error) {
        if (error.kind === 'ObjectId') {
             return res.status(400).json({ message: 'Invalid Post ID format' });
        }
        next(error);
    }
});

module.exports = router;