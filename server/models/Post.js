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
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This links it to the 'User' model
        required: [true, 'Post creator is required'] // A post must have a creator
    },
    // 🌟 CHANGE: Renamed to imageUrl to match controller/frontend logic
    // This field stores the path to the image saved by Multer (e.g., '/uploads/12345.jpg')
    imageUrl: {
        type: String,
        default: null // Set default to null, as not all posts might have an image
    }
}, {
    // Adds `createdAt` and `updatedAt` fields automatically
    timestamps: true 
});

const Post = mongoose.model('Post', postSchema);

export default Post;