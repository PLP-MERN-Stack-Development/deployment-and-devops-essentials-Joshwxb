import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Post title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Post content is required'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Links to the 'Category' model
        required: [true, 'Category is required for the post']
    },
    // CRITICAL FIX: The user who created the post.
    // Replaced 'author' (String) with 'user' (ObjectId) linked to the User model.
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This links it to the 'User' model
        required: [true, 'Post creator is required'] // A post must have a creator
    },
    // Retaining featuredImage field (for completeness, even if unused in current auth flow)
    featuredImage: {
        type: String,
        default: 'placeholder.jpg'
    }
}, {
    // Adds `createdAt` and `updatedAt` fields automatically
    timestamps: true 
});

const Post = mongoose.model('Post', postSchema);

export default Post;