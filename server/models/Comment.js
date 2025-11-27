// server/models/Comment.js

import mongoose from 'mongoose'; // FIX: Use import instead of require

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500 // Limit comment length
    },
    // Links the comment to the User who wrote it
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Links the comment to the Post it belongs to
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment; // FIX: Use export default for the Mongoose model