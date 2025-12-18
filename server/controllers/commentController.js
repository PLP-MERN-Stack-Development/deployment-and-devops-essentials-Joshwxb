// server/controllers/commentController.js

const Comment = require('../models/Comment'); 
const Post = require('../models/Post'); 
const Notification = require('../models/Notification'); 
const mongoose = require('mongoose'); 

// @route   POST /api/comments
// @desc    Create a new comment on a post
// @access  Private
const createComment = async (req, res) => {
    const { content, postId } = req.body; 

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'Invalid Post ID' });
    }

    try {
        const postExists = await Post.findById(postId);
        if (!postExists) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = new Comment({
            content,
            user: req.user._id, 
            post: postId
        });

        const comment = await newComment.save();
        await comment.populate('user', 'username'); 

        // 🎯 NOTIFICATION LOGIC
        const postCreatorId = postExists.user;
        if (postCreatorId && postCreatorId.toString() !== req.user._id.toString()) {
            try {
                await Notification.create({
                    recipient: postCreatorId,
                    sender: req.user._id,
                    post: postId,
                    type: 'comment'
                });
            } catch (notificationError) {
                console.error('Notification failed:', notificationError);
            }
        }

        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ message: 'Server error while creating comment' });
    }
};

// @route   GET /api/comments/:postId
// @desc    Get all comments for a specific post
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
        res.status(500).json({ message: 'Server error while fetching comments' });
    }
};

// @route   PUT /api/comments/:id
// @desc    Update an existing comment
// @access  Private (Author only)
const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // 🛡️ SECURITY: Verify Ownership
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to edit this comment' });
        }

        comment.content = req.body.content || comment.content;
        const updatedComment = await comment.save();
        await updatedComment.populate('user', 'username');

        res.json(updatedComment);
    } catch (err) {
        res.status(500).json({ message: 'Server error while updating comment' });
    }
};

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private (Author only)
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // 🛡️ SECURITY: Verify Ownership
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this comment' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error while deleting comment' });
    }
};

module.exports = { 
    createComment, 
    getCommentsByPostId,
    updateComment,
    deleteComment
};