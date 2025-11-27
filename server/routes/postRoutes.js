import express from 'express';
import Post from '../models/Post.js'; 
// FIX: Change 'protect' import to the new 'authMiddleware' name
import { authMiddleware } from '../middleware/authMiddleware.js'; 
import { createPostValidation, updatePostValidation } from '../middleware/postValidator.js'; 
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


// POST /api/posts - Create a new blog post (PRIVATE - REQUIRES authMiddleware)
// FIX: Replace 'protect' with 'authMiddleware'
router.post('/', authMiddleware, createPostValidation, async (req, res, next) => { 
    try {
        // CORRECTED: Ensure the 'user' field is set to the logged-in user's ID
        const newPost = new Post({ ...req.body, user: req.user._id });
        const savedPost = await newPost.save();
        
        // Populate category before sending response
        await savedPost.populate('category', 'name');

        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
});


// PUT /api/posts/:id - Update an existing blog post (PRIVATE - REQUIRES authMiddleware & AUTHORIZATION)
// FIX: Replace 'protect' with 'authMiddleware'
router.put('/:id', authMiddleware, updatePostValidation, async (req, res, next) => { 
    try {
        const { id } = req.params;

        // 1. Find the post by ID
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // 2. AUTHORIZATION CHECK: Ensure the post belongs to the authenticated user
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }
        
        // 3. Update the post
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).populate('category', 'name');
        
        res.status(200).json(updatedPost);
    } catch (error) {
        if (error.kind === 'ObjectId') {
             return res.status(400).json({ message: 'Invalid Post ID format' });
        }
        next(error);
    }
});

// DELETE /api/posts/:id - Delete a blog post (PRIVATE - REQUIRES authMiddleware & AUTHORIZATION)
// FIX: Replace 'protect' with 'authMiddleware'
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

export default router;