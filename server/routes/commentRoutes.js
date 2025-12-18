// server/routes/commentRoutes.js

const express = require('express'); 
// 🎯 Added updateComment and deleteComment to the imports
const { 
    createComment, 
    getCommentsByPostId, 
    updateComment, 
    deleteComment 
} = require('../controllers/commentController'); 

const { protect } = require('../middleware/authMiddleware'); 

const router = express.Router();

/**
 * @route   GET /api/comments/:postId
 * @desc    Fetch all comments for a specific post
 * @access  Public
 */
router.get('/:postId', getCommentsByPostId);

/**
 * @route   POST /api/comments
 * @desc    Create a new comment
 * @access  Private
 */
router.post('/', protect, createComment);

/**
 * @route   PUT /api/comments/:id
 * @desc    Update an existing comment (Only by the author)
 * @access  Private
 */
router.put('/:id', protect, updateComment);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment (Only by the author)
 * @access  Private
 */
router.delete('/:id', protect, deleteComment);

// ⬅️ Exporting the router using CommonJS
module.exports = router;