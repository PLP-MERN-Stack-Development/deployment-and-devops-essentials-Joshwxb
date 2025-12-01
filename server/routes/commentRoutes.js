// server/routes/commentRoutes.js

import express from 'express'; // Use import instead of require
import { createComment, getCommentsByPostId } from '../controllers/commentController.js'; // Use import, ensure .js extension
import { authMiddleware } from '../middleware/authMiddleware.js'; // Use import, ensure .js extension

const router = express.Router();

// Route to fetch comments for a post (Public access)
router.get('/:postId', getCommentsByPostId);

// Route to create a new comment (Private access, requires login)
router.post('/', authMiddleware, createComment);

// Change the export from CommonJS (module.exports) to ES Module (export default)
export default router;
