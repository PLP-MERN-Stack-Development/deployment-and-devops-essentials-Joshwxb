import Post from '../models/Post.js'; 
// Assuming you have a file system utility like 'fs' or 'fs-extra' for potential file deletion
import fs from 'fs/promises'; 
import path from 'path';

// Helper function to resolve the full path to the uploads directory
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// --- Helper function for deleting old file (Optional but highly recommended) ---
const deleteOldImage = async (imagePath) => {
    if (imagePath && imagePath.startsWith('/uploads/')) {
        // Resolve the full path on the server filesystem
        const filename = path.basename(imagePath);
        const fullPath = path.join(UPLOADS_DIR, filename);
        
        try {
            // Check if the file exists before attempting to delete
            await fs.access(fullPath);
            await fs.unlink(fullPath);
            console.log(`Successfully deleted old image: ${fullPath}`);
        } catch (error) {
            // Log error if file not found, but don't fail the request
            if (error.code !== 'ENOENT') {
                console.error(`Error deleting old image: ${fullPath}`, error);
            }
        }
    }
};

// --- Create Post Controller ---
export const createPost = async (req, res, next) => {
    // NOTE: req.body and req.file are available thanks to Multer middleware
    try {
        // 1. Get data from body and file
        const { title, content, category } = req.body;
        
        // The path stored in the database is the URL path (e.g., /uploads/12345.jpg)
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        
        // 2. Create the new Post document
        const newPost = new Post({
            title,
            content,
            category,
            imageUrl: imageUrl, // 🌟 Save the image path
            user: req.user._id, // User ID is attached by authMiddleware
        });

        const savedPost = await newPost.save();
        
        // 3. Populate and send response
        await savedPost.populate('category', 'name');
        res.status(201).json(savedPost);
    } catch (error) {
        // If save fails after file upload, you should delete the file to prevent orphans
        if (req.file) {
            await deleteOldImage(req.file.path);
        }
        next(error);
    }
};

// --- Update Post Controller ---
export const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Find the post by ID
        const post = await Post.findById(id);

        if (!post) {
            // If post not found, and a file was uploaded, delete the uploaded file
            if (req.file) {
                await deleteOldImage(req.file.path);
            }
            return res.status(404).json({ message: 'Post not found' });
        }

        // 2. AUTHORIZATION CHECK: Ensure the post belongs to the authenticated user
        if (post.user.toString() !== req.user._id.toString()) {
             // If not authorized, and a file was uploaded, delete the uploaded file
            if (req.file) {
                await deleteOldImage(req.file.path);
            }
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }
        
        // 3. Prepare the update data
        const updateData = {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
        };

        // 🌟 Handle image update logic
        if (req.file) {
            // A new file was uploaded:
            // a) Delete the old image file from the server's disk
            await deleteOldImage(post.imageUrl);
            
            // b) Set the new image path for the database update
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }
        
        // 4. Update the post
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            updateData, // Use the updateData object which now includes imageUrl if a file was uploaded
            { new: true, runValidators: true }
        ).populate('category', 'name');
        
        res.status(200).json(updatedPost);
    } catch (error) {
        // If update fails after file upload (e.g., validation error), delete the uploaded file
        if (req.file) {
            await deleteOldImage(req.file.path);
        }
        next(error);
    }
};

// --- Delete Post Controller (Add logic to delete image on deletion) ---
export const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }
        
        // 🌟 NEW: Delete the associated image file
        if (post.imageUrl) {
            await deleteOldImage(post.imageUrl);
        }
        
        await Post.findByIdAndDelete(id);
        
        res.status(204).send();
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Post ID format' });
        }
        next(error);
    }
};

// NOTE: You must also export the controllers you use in your routes.
// Assuming your other controllers like fetchPosts, fetchPostById, etc. are already defined and exported.
// For completeness, here are the exports used in the routes file:
// export { createPost, updatePost, deletePost, fetchPosts, fetchPostById, ... };