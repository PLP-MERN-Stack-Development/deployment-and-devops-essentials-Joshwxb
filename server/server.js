// server.js
// NOTE: dotenv/config must be run first
require('dotenv/config'); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const path = require('path'); // Path is no longer needed since we removed static file serving

// 🎯 FIX 1: Removed .default property access. 
// Requires that ALL route files use 'module.exports = router;'
const categoryRoutes = require('./routes/categoryRoutes'); 
const postRoutes = require('./routes/postRoutes'); 
const authRoutes = require('./routes/authRoutes'); 
const commentRoutes = require('./routes/commentRoutes'); 
const errorHandler = require('./middleware/errorHandler'); 

// --- Application Setup ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS Configuration (Updated to include Vercel URL) ---
const allowedOrigins = [
    // 🎯 CRITICAL: Your deployed Vercel frontend URL
    'https://weblogn.vercel.app', 
    'http://localhost:5173', // Local development URL
    // Including the Render backend domain itself is optional but safe:
    'https://weblog-6vnn.onrender.com' 
];

const corsOptions = {
    origin: function (origin, callback) {
        // Check if origin is undefined (server-to-server or same-origin)
        // OR if it is in the allowed list
        // OR if it is any render.com subdomain (safer to check for your client only)
        const isAllowed = !origin || 
                          allowedOrigins.includes(origin) || 
                          (origin && origin.endsWith('.onrender.com'));

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log('CORS rejected origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
};

// --- Middleware ---
app.use(cors(corsOptions)); 
app.use(express.json()); 

// 🎯 FIX 2: REMOVED the static file middleware for local storage, as we are now using Cloudinary.
// ❌ REMOVED: app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// --- API Routes ---
app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes); 
app.use('/api/auth', authRoutes); 
app.use('/api/comments', commentRoutes); 

// --- MongoDB Connection ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log('✅ MongoDB connected successfully!');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

// --- Define Test Route ---
app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'MERN Blog API is running!' });
});

// --- Error Handling Middleware (MUST BE LAST) ---
app.use(errorHandler); 

// --- Start Server ---
const startServer = async () => {
    if (!process.env.MONGO_URI) {
        console.error("❌ Fatal Error: MONGO_URI environment variable is missing.");
        process.exit(1);
    }
    
    await connectDB();

    const HOST = '0.0.0.0'; 
    app.listen(PORT, HOST, () => {
        console.log(`📡 Server listening on http://${HOST}:${PORT}`);
        console.log(`Node Environment: ${process.env.NODE_ENV}`);
    });
};

startServer();