// middleware/upload.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// --- Configuration ---

// 1. Configure Cloudinary using environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Define the storage strategy
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'mern-blog-uploads', 
        allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
        transformation: [{ width: 800, crop: 'limit' }] 
    },
});

// 3. Define a file filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images (JPEG, PNG, GIF, WebP) are allowed!'), false); 
    }
};

// 4. Create the Multer instance
const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 1024 * 1024 * 5 // Max file size 5 MB
    },
    fileFilter: fileFilter
});

// 🎯 EXPORT CHANGE: Export the instance so we can specify the field name in the routes
module.exports = upload;