// server/routes/commentRoutes.js

const express = require('express'); 
// Ensure these names match what is exported in commentController.js
const { createComment, getCommentsByPostId } = require('../controllers/commentController'); 

// 🎯 FIX: Updated to import { protect } instead of authMiddleware
const { protect } = require('../middleware/authMiddleware'); 

const router = express.Router();

// Route to fetch comments for a post (Public access)
router.get('/:postId', getCommentsByPostId);

// Route to create a new comment (Private access, requires login)
// 🎯 FIX: Changed 'authMiddleware' to 'protect'
router.post('/', protect, createComment);

// ⬅️ CRITICAL FIX: Use CommonJS export
module.exports = router;