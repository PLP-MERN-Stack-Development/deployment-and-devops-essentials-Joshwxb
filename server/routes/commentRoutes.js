// server/routes/commentRoutes.js

const express = require('express'); 
const { createComment, getCommentsByPostId } = require('../controllers/commentController'); // CRITICAL FIX: Use require() and remove .js
const { authMiddleware } = require('../middleware/authMiddleware'); // CRITICAL FIX: Use require() and remove .js

const router = express.Router();

// Route to fetch comments for a post (Public access)
router.get('/:postId', getCommentsByPostId);

// Route to create a new comment (Private access, requires login)
router.post('/', authMiddleware, createComment);

// ⬅️ CRITICAL FIX: Use CommonJS export
module.exports = router;