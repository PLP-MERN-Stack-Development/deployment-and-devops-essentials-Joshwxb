// server/controllers/commentController.js

import Comment from '../models/Comment.js'; // FIX: Use import with .js extension
import Post from '../models/Post.js'; // FIX: Use import with .js extension
import mongoose from 'mongoose'; // FIX: Use import

// @route   POST /api/comments
// @desc    Create a new comment on a post
// @access  Private (Requires authentication)
export const createComment = async (req, res) => { // FIX: Use export const
    // req.user.id is set by the authMiddleware
    const { content, postId } = req.body; 

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'Invalid Post ID' });
    }

    try {
        // 1. Check if the post exists
        const postExists = await Post.findById(postId);
        if (!postExists) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // 2. Create the new comment
        const newComment = new Comment({
            content,
            user: req.user._id, // NOTE: It should be req.user._id if middleware uses select('-password')
            post: postId
        });

        const comment = await newComment.save();
        
        // 3. Populate the user data to return a complete comment object
        await comment.populate('user', 'username'); 

        res.status(201).json(comment);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/comments/:postId
// @desc    Get all comments for a specific post
// @access  Public
export const getCommentsByPostId = async (req, res) => { // FIX: Use export const
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
        return res.status(400).json({ message: 'Invalid Post ID' });
    }

    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('user', 'username') // Fetch the username of the commenter
            .sort({ createdAt: 1 }); // Oldest comment first

        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};