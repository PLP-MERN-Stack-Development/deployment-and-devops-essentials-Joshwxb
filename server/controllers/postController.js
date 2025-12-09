// server/controllers/postController.js

const Post = require('../models/Post');
const cloudinary = require('cloudinary').v2;

// --- Helper function for deleting old image from Cloudinary ---
const deleteOldCloudImage = async (imageUrl) => {
    // 1. Check if the URL is from Cloudinary (optional but safe)
    if (imageUrl && imageUrl.includes('cloudinary.com')) {
        try {
            // 2. Extract the Public ID from the Cloudinary URL
            const urlParts = imageUrl.split('/');
            const publicIdWithExt = urlParts[urlParts.length - 1]; 
            const publicId = publicIdWithExt.split('.')[0]; 
            const folder = urlParts[urlParts.length - 2]; 

            const fullPublicId = `${folder}/${publicId}`;

            // 3. Delete the resource using the full Public ID
            const result = await cloudinary.uploader.destroy(fullPublicId);
            console.log(`Successfully deleted Cloudinary image: ${fullPublicId}`, result);
        } catch (error) {
            console.error('Error deleting Cloudinary image:', error);
            // Non-fatal error, we proceed with the database operation
        }
    }
};

// --- Get All Posts Controller (Placeholder/Assumed Exists) ---
const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({})
            .populate('user', 'username')
            .populate('category', 'name')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        next(error);
    }
};

// --- Get Single Post Controller (Placeholder/Assumed Exists) ---
const getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('user', 'username')
            .populate('category', 'name');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        next(error);
    }
};


// --- Create Post Controller (No change needed here) ---
const createPost = async (req, res, next) => {
    try {
        // 1. Get data from body and file
        const { title, content, category } = req.body;
        
        // 🎯 Correct: req.file.path holds the permanent Cloudinary URL
        const imageUrl = req.file ? req.file.path : null; 
        
        // 2. Create the new Post document
        const newPost = new Post({
            title,
            content,
            category,
            imageUrl: imageUrl, // Save the Cloudinary URL
            user: req.user._id, 
        });

        const savedPost = await newPost.save();
        
        // 3. Populate and send response
        await savedPost.populate('category', 'name');
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};

// --- Update Post Controller (No change needed here) ---
const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Find the post by ID
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // 2. AUTHORIZATION CHECK
        if (post.user.toString() !== req.user._id.toString()) {
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
            // a) Delete the old image file from Cloudinary (if one existed)
            if (post.imageUrl) {
                 await deleteOldCloudImage(post.imageUrl);
            }
            
            // b) Set the new image URL for the database update
            updateData.imageUrl = req.file.path; // Use the new Cloudinary URL
        }
        
        // 4. Update the post
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            updateData, 
            { new: true, runValidators: true }
        ).populate('category', 'name');
        
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};

// --- Delete Post Controller (No change needed here) ---
const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }
        
        // 🌟 Delete the associated image file from Cloudinary
        if (post.imageUrl) {
            await deleteOldCloudImage(post.imageUrl);
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


// ⬅️ CRITICAL FIX: Ensure ALL controller functions used in postRoutes.js are exported here
module.exports = { 
    getPosts, // <-- LIKELY MISSING
    getPostById, // <-- LIKELY MISSING
    createPost, 
    updatePost, 
    deletePost, 
};