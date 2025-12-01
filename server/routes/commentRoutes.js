// server/routes/commentRoutes.js

import express from 'express';
import { createComment, getCommentsByPostId } from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// 💡 CHANGE 1: Explicitly add '/posts' to the path for fetching comments.
// Full route: GET /api/comments/posts/:postId
router.get('/posts/:postId', getCommentsByPostId);

// 💡 CHANGE 2: Explicitly add '/posts' to the path for creating comments.
// Full route: POST /api/comments/posts/:postId
// NOTE: We need the postId in the path to associate the comment.
router.post('/posts/:postId', authMiddleware, createComment);

// Change the export from CommonJS (module.exports) to ES Module (export default)
export default router;
