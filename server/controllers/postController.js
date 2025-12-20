const Post = require('../models/Post');
const cloudinary = require('cloudinary').v2;

// --- Helper function for deleting old image from Cloudinary ---
const deleteOldCloudImage = async (imageUrl) => {
    if (imageUrl && imageUrl.includes('cloudinary.com')) {
        try {
            const urlParts = imageUrl.split('/');
            const publicIdWithExt = urlParts[urlParts.length - 1]; 
            const publicId = publicIdWithExt.split('.')[0]; 
            const folder = urlParts[urlParts.length - 2]; 

            const fullPublicId = `${folder}/${publicId}`;

            const result = await cloudinary.uploader.destroy(fullPublicId);
            console.log(`Successfully deleted Cloudinary image: ${fullPublicId}`, result);
        } catch (error) {
            console.error('Error deleting Cloudinary image:', error);
        }
    }
};

// --- Get All Posts Controller ---
const getPosts = async (req, res, next) => {
    try {
        // 🎯 FORCED POPULATION: Using the most explicit Mongoose syntax
        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                model: 'User', // Explicitly naming the model helps if there's a conflict
                select: 'username profilePicture bio socials' 
            })
            .populate({
                path: 'category',
                model: 'Category',
                select: 'name'
            })
            .lean() 
            .exec();

        // 🔍 BACKEND DEBUG: 
        // If this prints "string", population failed. If it prints "object", it's working.
        if (posts.length > 0) {
            console.log("--- DATA TYPE CHECK ---");
            console.log("User Type:", typeof posts[0].user); 
            console.log("User Data:", posts[0].user);
        }

        res.json(posts);
    } catch (error) {
        next(error);
    }
};

// --- Get Single Post Controller ---
const getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('user', 'username profilePicture bio socials')
            .populate('category', 'name')
            .lean()
            .exec();

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        next(error);
    }
};

// --- Create Post Controller ---
const createPost = async (req, res, next) => {
    try {
        const { title, content, category } = req.body;
        const imageUrl = req.file ? req.file.path : null; 
        
        const newPost = new Post({
            title,
            content,
            category,
            imageUrl: imageUrl, 
            user: req.user._id, 
        });

        let savedPost = await newPost.save();
        
        // Populate immediately after saving
        savedPost = await Post.findById(savedPost._id)
            .populate('user', 'username profilePicture')
            .populate('category', 'name')
            .exec();
        
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};

// --- Update Post Controller ---
const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        const updateData = {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
        };

        if (req.file) {
            if (post.imageUrl) await deleteOldCloudImage(post.imageUrl);
            updateData.imageUrl = req.file.path;
        }
        
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            updateData, 
            { new: true, runValidators: true }
        )
        .populate('user', 'username profilePicture')
        .populate('category', 'name')
        .exec();
        
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};

// --- Delete Post Controller ---
const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        if (post.imageUrl) await deleteOldCloudImage(post.imageUrl);
        
        await Post.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    getPosts, 
    getPostById, 
    createPost, 
    updatePost, 
    deletePost, 
};