// server/routes/postRoutes.js

const express = require('express');
const Post = require('../models/Post'); 
const { authMiddleware } = require('../middleware/authMiddleware'); 
// 🎯 FIX 1: Import the Multer function DIRECTLY (Resolved the [object Undefined] error)
const uploadImage = require('../middleware/upload'); 
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
    uploadImage, // <--- Multer/Cloudinary runs here
    createPostValidation, 
    async (req, res, next) => { 
        try {
            // 🎯 FIX 2: Use the full Cloudinary URL from req.file.path
            const imageUrl = req.file ? req.file.path : null;
            
            const newPost = new Post({ 
                ...req.body, 
                user: req.user._id, 
                imageUrl: imageUrl, // Saves the Cloudinary HTTPS URL
            });
            
            const savedPost = await newPost.save();
            
            await savedPost.populate('category', 'name');

            res.status(201).json(savedPost);
        } catch (error) {
            next(error);
        }
    }
);


// PUT /api/posts/:id - Update an existing blog post (PRIVATE)
router.put(
    '/:id', 
    authMiddleware, 
    uploadImage, // <--- Multer/Cloudinary runs here
    updatePostValidation, 
    async (req, res, next) => { 
        try {
            const { id } = req.params;
            const post = await Post.findById(id);

            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // 2. AUTHORIZATION CHECK
            if (post.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this post' });
            }
            
            // 🌟 IMAGE HANDLING FOR UPDATE:
            const updateFields = { ...req.body };
            
            if (req.file) {
                // 🎯 FIX 3: Use the full Cloudinary URL from req.file.path
                updateFields.imageUrl = req.file.path;
                // Note: Cloudinary cleanup logic is often handled in the controller, but here's where the URL is set.
            } else if (req.body.deleteImage === 'true') { 
                updateFields.imageUrl = null;
                // Cloudinary cleanup for deletion would go here or in a controller
            }

            // 3. Update the post
            const updatedPost = await Post.findByIdAndUpdate(
                id,
                updateFields, // Now includes the correct Cloudinary imageUrl
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

// DELETE /api/posts/:id - Delete a blog post (PRIVATE)
router.delete('/:id', authMiddleware, async (req, res, next) => { 
    try {
        const { id } = req.params;
        
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }
        
        // Cleanup logic would be here if you implement Cloudinary deletion directly in the route.
        
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