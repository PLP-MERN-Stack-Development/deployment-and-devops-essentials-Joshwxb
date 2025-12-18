// server/controllers/commentController.js

const Comment = require('../models/Comment'); 
const Post = require('../models/Post'); 
const Notification = require('../models/Notification'); 
const mongoose = require('mongoose'); 

// @route   POST /api/comments
// @desc    Create a new comment on a post
// @access  Private (Requires authentication)
const createComment = async (req, res) => {
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
            user: req.user._id, 
            post: postId
        });

        const comment = await newComment.save();
        
        // 3. Populate the user data to return a complete comment object
        await comment.populate('user', 'username'); 

        // 🎯 4. NOTIFICATION LOGIC: Notify the post creator
        // NOTE: We use 'postExists.user' because that is the field name in your Post model
        const postCreatorId = postExists.user;

        if (postCreatorId && postCreatorId.toString() !== req.user._id.toString()) {
            try {
                await Notification.create({
                    recipient: postCreatorId, // The owner of the blog post
                    sender: req.user._id,     // The person who commented
                    post: postId,
                    type: 'comment'
                });
                console.log('✅ Notification created successfully');
            } catch (notificationError) {
                // We log the error but don't fail the comment request
                console.error('Notification failed to create:', notificationError);
            }
        }

        res.status(201).json(comment);

    } catch (err) {
        console.error('Comment creation error:', err);
        res.status(500).json({ message: 'Server error while creating comment' });
    }
};

// @route   GET /api/comments/:postId
// @desc    Get all comments for a specific post
// @access  Public
const getCommentsByPostId = async (req, res) => { 
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
        return res.status(400).json({ message: 'Invalid Post ID' });
    }

    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('user', 'username') 
            .sort({ createdAt: 1 }); 

        res.json(comments);
    } catch (err) {
        console.error('Fetch comments error:', err);
        res.status(500).json({ message: 'Server error while fetching comments' });
    }
};

module.exports = { 
    createComment, 
    getCommentsByPostId 
};