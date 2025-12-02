// server/routes/commentRoutes.js

import express from 'express';
import { createComment, getCommentsByPostId } from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🚀 FIX: Updated to use '/posts/:postId' to match the fixed frontend path and resolve the 404 error.
// Full Backend Route: GET /api/comments/posts/:postId
router.get('/posts/:postId', getCommentsByPostId);

// 🚀 FIX: Updated to use '/posts/:postId' for creating a comment, ensuring the post ID is in the URL.
// Full Backend Route: POST /api/comments/posts/:postId
router.post('/posts/:postId', authMiddleware, createComment);

export default router;