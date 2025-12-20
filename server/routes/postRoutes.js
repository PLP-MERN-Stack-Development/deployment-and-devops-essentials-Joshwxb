// server/routes/postRoutes.js

const express = require('express');
const Post = require('../models/Post'); 
const { protect } = require('../middleware/authMiddleware'); 
const uploadImage = require('../middleware/upload'); // 🎯 This is now the Multer instance
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
        const post = await Post.findById(id)
            .populate('category', 'name')
            .populate('user', 'username'); 

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
    protect, 
    uploadImage.single('image'), // 🎯 FIX: Added .single('image')
    createPostValidation, 
    async (req, res, next) => { 
        try {
            const imageUrl = req.file ? req.file.path : null;
            
            const newPost = new Post({ 
                ...req.body, 
                user: req.user._id, 
                imageUrl: imageUrl, 
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
    protect, 
    uploadImage.single('image'), // 🎯 FIX: Added .single('image')
    updatePostValidation, 
    async (req, res, next) => { 
        try {
            const { id } = req.params;
            const post = await Post.findById(id);

            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            if (post.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this post' });
            }
            
            const updateFields = { ...req.body };
            
            if (req.file) {
                updateFields.imageUrl = req.file.path;
            } else if (req.body.deleteImage === 'true') { 
                updateFields.imageUrl = null;
            }

            const updatedPost = await Post.findByIdAndUpdate(
                id,
                updateFields,
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
router.delete('/:id', protect, async (req, res, next) => { 
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }
        
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