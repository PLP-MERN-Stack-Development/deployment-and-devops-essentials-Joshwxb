// middleware/upload.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// --- Configuration ---

// 1. Configure Cloudinary using environment variables
// Ensure these variables are set in your .env file
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Define the storage strategy for Multer using Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'mern-blog-uploads', // Specify a folder in your Cloudinary account
        allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
        // Optional: Image processing transformations (e.g., resizing)
        transformation: [{ width: 800, crop: 'limit' }] 
    },
});

// 3. Define a file filter
const fileFilter = (req, file, cb) => {
    // Check for common image mimetypes
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept the file
    } else {
        // Reject file and set an error message
        cb(new Error('Only images (JPEG, PNG, GIF, WebP) are allowed!'), false); 
    }
};


// 4. Create the Multer instance
const upload = multer({
    storage: storage, // Use the Cloudinary storage engine
    limits: { 
        fileSize: 1024 * 1024 * 5 // Max file size 5 MB
    },
    fileFilter: fileFilter
});

// Export the middleware configured to handle a single file named 'image'
// 🎯 FIX: Export the Multer middleware function directly, not inside an object.
module.exports = upload.single('image');