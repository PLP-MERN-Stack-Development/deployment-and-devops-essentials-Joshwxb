// server/routes/commentRoutes.js

import express from 'express';
import { createComment, getCommentsByPostId } from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// 💡 FIX 1: Add '/posts/' to the GET route.
// Full Backend Route: GET /api/comments/posts/:postId
router.get('/posts/:postId', getCommentsByPostId);

// 💡 FIX 2: Add '/posts/' to the POST route and ensure the :postId parameter is captured.
// Full Backend Route: POST /api/comments/posts/:postId
router.post('/posts/:postId', authMiddleware, createComment);

export default router;