// middleware/upload.js

const multer = require('multer'); // CRITICAL FIX: Use require()
const path = require('path'); // CRITICAL FIX: Use require()
const fs = require('fs'); // CRITICAL FIX: Use require()

// --- Configuration ---

// 1. Ensure the 'uploads' directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    // Synchronously create the directory if it doesn't exist
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// 2. Define the storage strategy for Multer
const storage = multer.diskStorage({
    // Set the destination folder for uploads
    destination: (req, file, cb) => {
        // null means no error, and the path to the directory
        cb(null, 'uploads/'); 
    },
    
    // Define the file name to avoid collisions
    filename: (req, file, cb) => {
        // Create a unique name: timestamp + original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); 
    }
});

// 3. Define a file filter (optional, but good for security and validation)
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
    storage: storage,
    limits: { 
        fileSize: 1024 * 1024 * 5 // Max file size 5 MB
    },
    fileFilter: fileFilter
});

// Export the middleware configured to handle a single file named 'image'
const uploadImage = upload.single('image');

// ⬅️ CRITICAL FIX: Use CommonJS export
module.exports = { uploadImage };